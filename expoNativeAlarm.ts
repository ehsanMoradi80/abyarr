// Native exact-alarm scheduling for Android (exact-alarm-rescheduling on boot)
// Wire into native notifications module; used when expo-notifications triggers are insufficient.
import * as Notifications from 'expo-notifications';

export async function scheduleExactAlarm(triggerMs: number, soundFile: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'نوش — یادآوری آب',
        body: 'وقت نوشیدن آب برای سلامتی شماست.',
        sound: soundFile || 'reminder.wav',
      },
      trigger: { date: new Date(triggerMs) },
    });
    return true;
  } catch (err) {
    console.error('[ExpoNativeAlarm] schedule failed:', err);
    return false;
  }
}

export async function rescheduleOnBoot(userIntervalMinutes: number) {
  // Called by MainApplication.kt or a boot receiver to re-schedule after device restart
  const nextTime = new Date(Date.now() + userIntervalMinutes * 60 * 1000);
  return scheduleExactAlarm(nextTime.getTime(), 'reminder.wav');
}
