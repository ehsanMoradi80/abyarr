// Robust multi-tier persistence using AsyncStorage, localStorage, and FileSystem
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from './strings';

const STORAGE_KEY = 'abyar_water_data_v2';
const STORAGE_FILE_NAME = 'abyar_water_data.json';

export function generatePersistentInviteCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `AB-${num}`;
}

const DEFAULT_STATE = {
  name: 'دوست خوبم',
  myInviteCode: null, // Generated once and persisted permanently
  goalGlasses: 8, // 2000 ml
  defaultCupMl: 250,
  logs: [], // Array of { id, amountGlasses, amountMl, loggedAt, note, beverage }
  streakDays: 1,
  lastDrinkDate: null,
  reminderEnabled: true,
  reminderIntervalMinutes: 60,
  hasCelebratedToday: false,
  hasCompletedOnboarding: false,
  hasSeenTour: false,
  partner: null,
  integrations: {},
};

function ensureUserInviteCode(state) {
  if (!state.myInviteCode) {
    state.myInviteCode = state.partner?.myCode || generatePersistentInviteCode();
  }
  return state;
}

let cachedState = ensureUserInviteCode({ ...DEFAULT_STATE });
let isInitialized = false;

// Synchronous initial hydration from localStorage if available (fast first render)
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      cachedState = ensureUserInviteCode({ ...DEFAULT_STATE, ...parsed });
    }
  }
} catch (e) {
  // Silent catch
}

export async function loadAppData() {
  if (isInitialized) return cachedState;

  // 1. Try AsyncStorage (primary on native React Native & Android)
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      cachedState = { ...DEFAULT_STATE, ...parsed };
      isInitialized = true;
      return cachedState;
    }
  } catch (err) {
    // Continue to next tier
  }

  // 2. Try window.localStorage (web/preview environment)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        cachedState = ensureUserInviteCode({ ...DEFAULT_STATE, ...parsed });
        isInitialized = true;
        return cachedState;
      }
    }
  } catch (err) {
    // Continue to next tier
  }

  // 3. Try Expo FileSystem if available
  try {
    const FileSystem = await import('expo-file-system');
    if (FileSystem && FileSystem.documentDirectory) {
      const fileUri = `${FileSystem.documentDirectory}${STORAGE_FILE_NAME}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        const jsonString = await FileSystem.readAsStringAsync(fileUri);
        const parsed = JSON.parse(jsonString);
        cachedState = ensureUserInviteCode({ ...DEFAULT_STATE, ...parsed });
      }
    }
  } catch (err) {
    // Ignored
  }

  isInitialized = true;
  return ensureUserInviteCode(cachedState);
}

export async function saveAppData(newState) {
  cachedState = ensureUserInviteCode({ ...cachedState, ...newState });

  // 1. Save to AsyncStorage
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cachedState));
  } catch (err) {
    // Ignored
  }

  // 2. Save to localStorage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedState));
    }
  } catch (err) {
    // Ignored
  }

  // 3. Save to Expo FileSystem if available
  try {
    const FileSystem = await import('expo-file-system');
    if (FileSystem && FileSystem.documentDirectory) {
      const fileUri = `${FileSystem.documentDirectory}${STORAGE_FILE_NAME}`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(cachedState));
    }
  } catch (err) {
    // Ignored
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
