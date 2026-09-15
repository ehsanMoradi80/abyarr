// Notification manager using expo-notifications

export async function requestNotificationPermission() {
  try {
    const Notifications = await import('expo-notifications');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (err) {
    console.warn('Notification permission error:', err);
    return false;
  }
}

export async function scheduleWaterReminder(intervalMinutes = 60, userName = '') {
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();

    const title = 'وقت نوشیدن آب!';
    const body = userName
      ? `${userName} عزیز، وقت نوشیدن یک لیوان آب خنک و تازه است.`
      : 'یک لیوان آب تازه برای سلامتی و شادابی بنوشید!';

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority?.HIGH || 'high',
      },
      trigger: {
        seconds: Math.max(intervalMinutes * 60, 60),
        repeats: true,
      },
    });
    return true;
  } catch (err) {
    console.warn('Failed to schedule notification:', err);
    return false;
  }
}

export async function cancelAllReminders() {
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (err) {
    console.warn('Failed to cancel notifications:', err);
    return false;
  }
}
