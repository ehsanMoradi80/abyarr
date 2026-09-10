// Native Android & Notification Dispatcher Bridge
// Supports Web Notification API + Capacitor / React Native / Expo Native PostMessage Bridges

import { WaterAlarmAudioService } from './audioAlarm';
import { NOOSH_MASCOT_STATES } from '../assets/mascotAssets';

export interface NativeBridgeMessage {
  type: 'SCHEDULE_ALARM' | 'CANCEL_ALARM' | 'SPEAK_TTS' | 'PLAY_RINGTONE' | 'UPDATE_WIDGET';
  payload?: any;
}

export interface SystemNotificationOptions {
  image?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export class NativeBridgeService {
  // Check if running inside Android WebView / Expo / Capacitor container
  public static isNativeAndroid(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).ReactNativeWebView ||
      (window as any).Capacitor ||
      (window as any).AndroidBridge ||
      (window as any).webkit?.messageHandlers?.AndroidBridge
    );
  }

  // Request system notification permission
  public static async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Send Native / Web Notification with Actions
  public static showNotification(
    title: string,
    body: string,
    onAction?: () => void,
    options: SystemNotificationOptions = {},
  ): void {
    if (typeof window === 'undefined') return;

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notificationImage = options.image || NOOSH_MASCOT_STATES.miss_you.image;

        const notif = new Notification(
          title,
          {
            body,
            icon: notificationImage || '/favicon.ico',
            image: notificationImage,
            tag: options.tag || 'abyar-water-reminder',
            requireInteraction: options.requireInteraction ?? true,
            badge: '/favicon.ico',
          } as NotificationOptions & { image?: string },
        );

        notif.onclick = () => {
          window.focus();
          if (onAction) onAction();
          notif.close();
        };
      } catch (e) {
        console.warn('Notification display failed:', e);
      }
    }
  }

  // Post message to Android Native Bridge (React Native WebView / Capacitor / Kotlin)
  public static postToNative(message: NativeBridgeMessage): void {
    if (typeof window === 'undefined') return;

    // 1. React Native / Expo WebView
    if ((window as any).ReactNativeWebView?.postMessage) {
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
      return;
    }

    // 2. Android Kotlin JavascriptInterface
    if ((window as any).AndroidBridge) {
      if (message.type === 'SCHEDULE_ALARM') {
        (window as any).AndroidBridge.scheduleAlarm?.(JSON.stringify(message.payload));
      } else if (message.type === 'CANCEL_ALARM') {
        (window as any).AndroidBridge.cancelAlarm?.();
      } else if (message.type === 'SPEAK_TTS') {
        (window as any).AndroidBridge.speak?.(message.payload?.text || '');
      } else if (message.type === 'PLAY_RINGTONE') {
        (window as any).AndroidBridge.playRingtone?.();
      }
      return;
    }

    // 3. Capacitor Native Plugins
    if ((window as any).Capacitor?.isNativePlatform?.()) {
      console.log('Capacitor native bridge message dispatched:', message);
    }
  }

  // Schedule native recurring 10-minute escalating alarm
  public static schedulePersistentAlarm(name: string, intervalMinutes: number = 10): void {
    // Dispatch to native host if available
    this.postToNative({
      type: 'SCHEDULE_ALARM',
      payload: {
        intervalMinutes,
        userName: name,
        title: 'وقت نوشیدن آب!',
        speechText: name ? `لیوان آبت رو نخوردی ${name}` : 'لیوان آبت رو نخوردی!',
        sound: 'alarm_ringtone',
      },
    });

    // In web environment, play escalating sound + speech
    WaterAlarmAudioService.triggerFullAlarm(name);
  }

  // Cancel any active persistent alarm, native timers, audio & speech synthesis
  public static cancelPersistentAlarm(): void {
    // 1. Dispatch cancel to native Android / iOS bridges
    this.postToNative({
      type: 'CANCEL_ALARM',
    });

    // 2. Cancel web audio tones and Persian speech
    WaterAlarmAudioService.stopAllAlarms();
  }

  // Sync latest water progress, goal, and streak data with Android Home Screen Widgets
  public static updateWidgetData(data: {
    todayGlasses: number;
    goalGlasses: number;
    streakDays: number;
    percent: number;
    lastDrinkTime?: string;
  }): void {
    // 1. Store in localStorage for web widgets & PWA workers
    try {
      localStorage.setItem('abyar_widget_cache', JSON.stringify(data));
    } catch {}

    // 2. Dispatch to Android Native Bridge (AppWidget Provider / RemoteViews)
    this.postToNative({
      type: 'UPDATE_WIDGET',
      payload: data,
    });
  }
}
