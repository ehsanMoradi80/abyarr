// Native Android & Expo Water Notification Service
// Type-safe bridge for Web and Native Expo / React Native environments

import { NOOSH_MASCOT_STATES } from '../assets/mascotAssets';

export class ExpoWaterAlarmManager {
  // Configure Expo Notification Handler with full screen and sound
  public static async configureNotificationHandler(): Promise<void> {
    try {
      const Notifications = await import('expo-notifications' as any).catch(() => null);
      if (!Notifications) return;

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        }),
      });

      // Create Android Notification Channel with High Importance & Alarm audio
      await Notifications.setNotificationChannelAsync('water-alarm-channel', {
        name: 'هشدار و زنگ نوشیدن آب',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 400, 200, 400, 200, 800],
        lightColor: '#168C9B',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
        sound: 'default',
      });
    } catch (err) {
      console.warn('Expo notification setup skipped in browser:', err);
    }
  }

  // Speak Persian TTS using Expo Speech: "لیوان آبت رو نخوردی {اسم}"
  public static async speakPersianReminder(userName?: string): Promise<void> {
    const text = userName && userName.trim()
      ? `لیوان آبت رو نخوردی ${userName.trim()}`
      : 'لیوان آبت رو نخوردی!';

    try {
      const Speech = await import('expo-speech' as any).catch(() => null);
      if (Speech?.speak) {
        Speech.speak(text, {
          language: 'fa',
          pitch: 1.05,
          rate: 0.9,
        });
      }
    } catch (err) {
      console.warn('Expo Speech error:', err);
    }
  }

  // Schedule escalating 10-minute repeating alarm in Android background
  public static async scheduleEscalatingReminder(
    userName?: string,
    repeatEveryMinutes: number = 10
  ): Promise<string | null> {
    try {
      const Notifications = await import('expo-notifications' as any).catch(() => null);
      if (!Notifications?.scheduleNotificationAsync) return null;

      // 1. Initial Notification
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: ' یادآور نوشیدن آب‌یار',
          body: userName ? `${userName} عزیز، وقتشه یه لیوان آب بنوشی!` : 'وقت نوشیدن یک لیوان آب تازه است!',
          channelId: 'water-alarm-channel',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          subtitle: 'Ø§Ø±Ø³Ø§Ù„ Ø¨Ù‡ ØµÙˆØ±Øª Ù‡Ø´Ø¯Ø§Ø± Ø³ÛŒØ³ØªÙ…ÛŒ',
          richContent: {
            image: NOOSH_MASCOT_STATES.miss_you.image,
          },
        },
        trigger: {
          seconds: 60, // First trigger
        },
      });

      return id;
    } catch {
      return null;
    }
  }
}
