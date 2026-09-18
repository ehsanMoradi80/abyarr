// Cross-platform notification & audible alarm manager
// Supports both Expo Notifications (Native Android/iOS) and Web Notifications API + Web Audio Synthesizer

/**
 * Plays a pleasant, calming water droplet / melodic chime alert
 * Uses the Web Audio API without needing external asset files
 */
export function playReminderChime() {
  try {
    const AudioContextClass = typeof window !== 'undefined'
      ? (window.AudioContext || window.webkitAudioContext)
      : null;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Harmonic two-tone water drop chime (587 Hz D5 -> 880 Hz A5 -> 1046 Hz C6)
    const tones = [
      { freq: 587.33, start: 0, duration: 0.25, gain: 0.2 },
      { freq: 880.00, start: 0.12, duration: 0.35, gain: 0.25 },
      { freq: 1046.50, start: 0.25, duration: 0.45, gain: 0.18 },
    ];

    tones.forEach(({ freq, start, duration, gain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);
      // Soft pitch bend imitating a water droplet
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + start + duration * 0.3);

      gainNode.gain.setValueAtTime(0.001, now + start);
      gainNode.gain.linearRampToValueAtTime(gain, now + start + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (e) {
    // Silent catch if audio context is blocked
  }
}

/**
 * Requests permission for notifications across Web and Native
 */
export async function requestNotificationPermission() {
  // 1. Try Native Expo Notifications
  try {
    const Notifications = await import('expo-notifications');
    if (Notifications && typeof Notifications.getPermissionsAsync === 'function') {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus === 'granted') return true;
    }
  } catch (err) {
    // Continue to web fallback
  }

  // 2. Try Standard Web Notifications API
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    }
  } catch (e) {
    // Ignore
  }

  return false;
}

/**
 * Sends an immediate notification + plays audible chime
 */
export async function sendImmediateNotification(title, body) {
  playReminderChime();

  // 1. Web Notification
  try {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
      return true;
    }
  } catch (e) {
    // Ignore
  }

  // 2. Native Notification
  try {
    const Notifications = await import('expo-notifications');
    if (Notifications && typeof Notifications.scheduleNotificationAsync === 'function') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority?.HIGH || 'high',
        },
        trigger: null, // immediate
      });
      return true;
    }
  } catch (e) {
    // Ignore
  }

  return false;
}

let activeWebTimer = null;

/**
 * Schedules water reminder at periodic intervals
 */
export async function scheduleWaterReminder(intervalMinutes = 60, userName = '') {
  const title = 'وقت نوشیدن آب!';
  const body = userName
    ? `${userName} عزیز، وقت نوشیدن یک لیوان آب خنک و تازه است.`
    : 'یک لیوان آب تازه برای سلامتی و شادابی بنوشید!';

  // Clear any existing Web interval timer
  if (activeWebTimer) {
    clearInterval(activeWebTimer);
    activeWebTimer = null;
  }

  // Setup Web Interval Timer
  if (typeof window !== 'undefined') {
    const intervalMs = Math.max(intervalMinutes * 60 * 1000, 30000);
    activeWebTimer = setInterval(() => {
      sendImmediateNotification(title, body);
    }, intervalMs);
  }

  // Try Native Expo Notifications
  try {
    const Notifications = await import('expo-notifications');
    if (Notifications && typeof Notifications.cancelAllScheduledNotificationsAsync === 'function') {
      await Notifications.cancelAllScheduledNotificationsAsync();

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
    }
  } catch (err) {
    // Silent
  }

  return true;
}

export async function cancelAllReminders() {
  if (activeWebTimer) {
    clearInterval(activeWebTimer);
    activeWebTimer = null;
  }

  try {
    const Notifications = await import('expo-notifications');
    if (Notifications && typeof Notifications.cancelAllScheduledNotificationsAsync === 'function') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    return true;
  } catch (err) {
    return false;
  }
}

