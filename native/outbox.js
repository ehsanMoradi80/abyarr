// React Native & Cross-Platform Outbox Queue with Conflict Resolution
import AsyncStorage from '@react-native-async-storage/async-storage';

const OUTBOX_STORAGE_KEY = 'abyar_offline_outbox_native';
const MAX_RETRIES = 10;

class NativeOfflineOutbox {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.loadQueue();
  }

  async loadQueue() {
    try {
      const raw = await AsyncStorage.getItem(OUTBOX_STORAGE_KEY);
      if (raw) {
        this.queue = JSON.parse(raw);
      }
    } catch {
      this.queue = [];
    }
  }

  async saveQueue() {
    try {
      await AsyncStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(this.queue));
    } catch {}
  }

  async enqueue(type, payload) {
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    // Deduplicate
    if (type === 'ADD_LOG' && payload?.id) {
      const exists = this.queue.some((q) => q.type === 'ADD_LOG' && q.payload?.id === payload.id);
      if (exists) return item;
    }

    this.queue.push(item);
    await this.saveQueue();

    // Trigger flush attempt
    this.flush();
    return item;
  }

  async flush() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const remaining = [];
    for (const item of this.queue) {
      try {
        let endpoint = '/api/sync';
        let body = { clientUpdatedAt: item.createdAt, state: item.payload };

        if (item.type === 'PARTNER_SYNC') {
          endpoint = '/api/partner/live-sync';
          body = item.payload;
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          item.retryCount += 1;
          if (item.retryCount < MAX_RETRIES) remaining.push(item);
        }
      } catch (err) {
        item.retryCount += 1;
        if (item.retryCount < MAX_RETRIES) remaining.push(item);
      }
    }

    this.queue = remaining;
    await this.saveQueue();
    this.isProcessing = false;
  }

  // Conflict resolution helper for water logs
  static mergeLogs(localLogs = [], remoteLogs = []) {
    const map = new Map();
    for (const log of remoteLogs) {
      if (log && log.id) map.set(log.id, log);
    }
    for (const log of localLogs) {
      if (log && log.id) {
        const existing = map.get(log.id);
        if (!existing) {
          map.set(log.id, log);
        } else {
          const lTime = new Date(log.loggedAt || 0).getTime();
          const rTime = new Date(existing.loggedAt || 0).getTime();
          if (lTime >= rTime) map.set(log.id, { ...existing, ...log });
        }
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );
  }
}

export const nativeOutbox = new NativeOfflineOutbox();
