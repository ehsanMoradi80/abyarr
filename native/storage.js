// Local offline persistence using expo-file-system or in-memory cache
import { getTodayKey } from './strings';

const STORAGE_FILE_NAME = 'abyar_water_data.json';

const DEFAULT_STATE = {
  name: 'دوست خوبم',
  goalGlasses: 8, // 2000 ml
  defaultCupMl: 250,
  logs: [], // Array of { id, amountGlasses, amountMl, loggedAt, note }
  streakDays: 1,
  lastDrinkDate: null,
  reminderEnabled: true,
  reminderIntervalMinutes: 60,
  hasCelebratedToday: false,
};

let cachedState = { ...DEFAULT_STATE };
let isInitialized = false;

export async function loadAppData() {
  if (isInitialized) return cachedState;

  try {
    const FileSystem = await import('expo-file-system');
    if (FileSystem && FileSystem.documentDirectory) {
      const fileUri = `${FileSystem.documentDirectory}${STORAGE_FILE_NAME}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        const jsonString = await FileSystem.readAsStringAsync(fileUri);
        const parsed = JSON.parse(jsonString);
        cachedState = { ...DEFAULT_STATE, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Could not read persistent storage, using cached state:', err);
  }

  isInitialized = true;
  return cachedState;
}

export async function saveAppData(newState) {
  cachedState = { ...cachedState, ...newState };

  try {
    const FileSystem = await import('expo-file-system');
    if (FileSystem && FileSystem.documentDirectory) {
      const fileUri = `${FileSystem.documentDirectory}${STORAGE_FILE_NAME}`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(cachedState));
    }
  } catch (err) {
    console.warn('Could not write persistent storage:', err);
  }

  return cachedState;
}

export function filterTodayLogs(logs) {
  const todayKey = getTodayKey();
  return (logs || []).filter((log) => {
    const logDate = new Date(log.loggedAt);
    const y = logDate.getFullYear();
    const m = String(logDate.getMonth() + 1).padStart(2, '0');
    const d = String(logDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}` === todayKey;
  });
}

export function calculateDailyStats(logs) {
  const todayLogs = filterTodayLogs(logs);
  const totalGlasses = todayLogs.reduce((sum, item) => sum + (item.amountGlasses || 1), 0);
  const totalMl = todayLogs.reduce((sum, item) => sum + (item.amountMl || 250), 0);

  return {
    todayLogs,
    totalGlasses: Math.round(totalGlasses * 10) / 10,
    totalMl,
  };
}
