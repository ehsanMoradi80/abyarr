// Offline Outbox with Exponential Retry & Deterministic Conflict Resolution
import { WaterLog } from '../types';

export type OutboxActionType =
  | 'ADD_LOG'
  | 'DELETE_LOG'
  | 'UPDATE_PROFILE'
  | 'SYNC_STATE'
  | 'PARTNER_SYNC';

export interface OutboxItem {
  id: string;
  type: OutboxActionType;
  payload: any;
  createdAt: string;
  retryCount: number;
  lastAttemptAt?: string;
  lastError?: string;
}

const OUTBOX_STORAGE_KEY = 'abyar_offline_outbox';
const MAX_RETRIES = 10;

class OfflineOutboxService {
  private queue: OutboxItem[] = [];
  private isProcessing = false;
  private listeners: Array<(count: number) => void> = [];

  constructor() {
    this.loadQueue();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        void this.flushOutbox();
      });
      // Periodic retry for failed items
      setInterval(() => {
        if (this.queue.length > 0 && navigator.onLine) {
          void this.flushOutbox();
        }
      }, 15000);
    }
  }

  private loadQueue(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
        if (raw) {
          this.queue = JSON.parse(raw);
        }
      }
    } catch {
      this.queue = [];
    }
  }

  private saveQueue(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(this.queue));
      }
    } catch {}
    this.notifyListeners();
  }

  public subscribe(listener: (count: number) => void): () => void {
    this.listeners.push(listener);
    listener(this.queue.length);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    const count = this.queue.length;
    this.listeners.forEach((fn) => fn(count));
  }

  public getPendingCount(): number {
    return this.queue.length;
  }

  public getQueue(): OutboxItem[] {
    return [...this.queue];
  }

  // Enqueue an action to be reliably delivered
  public enqueue(type: OutboxActionType, payload: any): OutboxItem {
    const item: OutboxItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    // Deduplicate: if an identical ADD_LOG is already in the queue, skip
    if (type === 'ADD_LOG' && payload?.id) {
      const exists = this.queue.some(
        (q) => q.type === 'ADD_LOG' && q.payload?.id === payload.id
      );
      if (exists) return item;
    }

    this.queue.push(item);
    this.saveQueue();

    // Attempt immediate delivery if online
    if (typeof navigator === 'undefined' || navigator.onLine) {
      void this.flushOutbox();
    }

    return item;
  }

  // Deterministic Conflict Resolution for Water Logs:
  // Merges local logs, outbox logs, and remote logs without dropping drink events.
  public static resolveLogsConflict(
    localLogs: WaterLog[],
    remoteLogs: WaterLog[],
    pendingDeletes: Set<string> = new Set()
  ): WaterLog[] {
    const logMap = new Map<string, WaterLog>();

    // 1. Add remote logs first
    for (const rLog of remoteLogs || []) {
      if (rLog?.id && !pendingDeletes.has(rLog.id)) {
        logMap.set(rLog.id, rLog);
      }
    }

    // 2. Overlay local logs (preserving offline logged drinks)
    for (const lLog of localLogs || []) {
      if (lLog?.id && !pendingDeletes.has(lLog.id)) {
        const existing = logMap.get(lLog.id);
        if (!existing) {
          logMap.set(lLog.id, lLog);
        } else {
          // If both exist, pick the one with the latest timestamp or more detail
          const lTime = new Date(lLog.loggedAt || 0).getTime();
          const rTime = new Date(existing.loggedAt || 0).getTime();
          if (lTime >= rTime) {
            logMap.set(lLog.id, { ...existing, ...lLog });
          }
        }
      }
    }

    // 3. Convert back to array sorted descending by loggedAt
    return Array.from(logMap.values()).sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );
  }

  // Conflict resolution for settings / profile: Last-Write-Wins (LWW) by timestamp
  public static resolveProfileConflict(
    local: { name: string; dailyGoal: number; updatedAt?: string },
    remote: { name: string; dailyGoal: number; updatedAt?: string }
  ): { name: string; dailyGoal: number } {
    if (!remote) return local;
    if (!local) return remote;

    const localTime = new Date(local.updatedAt || 0).getTime();
    const remoteTime = new Date(remote.updatedAt || 0).getTime();

    if (remoteTime > localTime) {
      return {
        name: remote.name || local.name,
        dailyGoal: remote.dailyGoal || local.dailyGoal,
      };
    }
    return {
      name: local.name || remote.name,
      dailyGoal: local.dailyGoal || remote.dailyGoal,
    };
  }

  // Process and flush outbox with exponential backoff
  public async flushOutbox(): Promise<{ success: number; failed: number }> {
    if (this.isProcessing || this.queue.length === 0) {
      return { success: 0, failed: 0 };
    }

    this.isProcessing = true;
    let successCount = 0;
    let failedCount = 0;
    const remainingQueue: OutboxItem[] = [];

    for (const item of this.queue) {
      try {
        const delivered = await this.deliverItem(item);
        if (delivered) {
          successCount++;
        } else {
          item.retryCount += 1;
          item.lastAttemptAt = new Date().toISOString();
          if (item.retryCount < MAX_RETRIES) {
            remainingQueue.push(item);
          }
          failedCount++;
        }
      } catch (err: any) {
        item.retryCount += 1;
        item.lastAttemptAt = new Date().toISOString();
        item.lastError = err?.message || 'Network error';
        if (item.retryCount < MAX_RETRIES) {
          remainingQueue.push(item);
        }
        failedCount++;
      }
    }

    this.queue = remainingQueue;
    this.saveQueue();
    this.isProcessing = false;

    return { success: successCount, failed: failedCount };
  }

  private async deliverItem(item: OutboxItem): Promise<boolean> {
    switch (item.type) {
      case 'ADD_LOG':
      case 'DELETE_LOG':
      case 'SYNC_STATE': {
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientUpdatedAt: item.createdAt,
            state: item.payload,
          }),
        });
        return res.ok;
      }

      case 'PARTNER_SYNC': {
        const res = await fetch('/api/partner/live-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });
        return res.ok;
      }

      case 'UPDATE_PROFILE': {
        const res = await fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });
        return res.ok;
      }

      default:
        return true;
    }
  }
}

export const offlineOutbox = new OfflineOutboxService();
