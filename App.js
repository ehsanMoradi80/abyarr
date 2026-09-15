import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Home, History, BarChart3, Settings, Plus } from 'lucide-react-native';

import { Header } from './native/Header';
import { HomeScreen } from './native/HomeScreen';
import { HistoryScreen } from './native/HistoryScreen';
import { StatsScreen } from './native/StatsScreen';
import { SettingsScreen } from './native/SettingsScreen';
import { CustomAmountModal } from './native/CustomAmountModal';
import { CelebrationModal } from './native/CelebrationModal';
import { BadgesModal } from './native/BadgesModal';

import {
  loadAppData,
  saveAppData,
  calculateDailyStats,
} from './native/storage';
import {
  requestNotificationPermission,
  scheduleWaterReminder,
  cancelAllReminders,
} from './native/notifications';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'history' | 'stats' | 'settings'

  // App State
  const [userName, setUserName] = useState('دوست من');
  const [goalGlasses, setGoalGlasses] = useState(8);
  const [logs, setLogs] = useState([]);
  const [streakDays, setStreakDays] = useState(1);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(60);
  const [hasCelebratedToday, setHasCelebratedToday] = useState(false);

  // Modals
  const [showCustomAmountModal, setShowCustomAmountModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  // Load persistent data on start
  useEffect(() => {
    async function init() {
      const data = await loadAppData();
      if (data) {
        if (data.name) setUserName(data.name);
        if (data.goalGlasses) setGoalGlasses(data.goalGlasses);
        if (Array.isArray(data.logs)) setLogs(data.logs);
        if (data.streakDays) setStreakDays(data.streakDays);
        if (data.reminderEnabled !== undefined) setReminderEnabled(data.reminderEnabled);
        if (data.reminderIntervalMinutes) setReminderInterval(data.reminderIntervalMinutes);
        if (data.hasCelebratedToday !== undefined) setHasCelebratedToday(data.hasCelebratedToday);

        // Schedule notifications if enabled
        if (data.reminderEnabled) {
          const permitted = await requestNotificationPermission();
          if (permitted) {
            await scheduleWaterReminder(data.reminderIntervalMinutes || 60, data.name);
          }
        }
      }
    }
    init();
  }, []);

  // Today's calculated stats
  const { todayLogs, totalGlasses } = calculateDailyStats(logs);

  // Add water action
  const handleAddWater = useCallback((glasses = 1, ml = 250) => {
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      amountGlasses: glasses,
      amountMl: ml,
      loggedAt: new Date().toISOString(),
    };

    setLogs((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs];

      // Check if user hit daily goal
      const prevStats = calculateDailyStats(prevLogs);
      const newTotal = prevStats.totalGlasses + glasses;

      if (newTotal >= goalGlasses && !hasCelebratedToday) {
        setShowCelebrationModal(true);
        setHasCelebratedToday(true);
      }

      // Persist to storage
      saveAppData({
        logs: updatedLogs,
        hasCelebratedToday: newTotal >= goalGlasses,
      });

      return updatedLogs;
    });
  }, [goalGlasses, hasCelebratedToday]);

  // Delete water log
  const handleDeleteWater = useCallback((logId) => {
    setLogs((prevLogs) => {
      const updatedLogs = prevLogs.filter((item) => item.id !== logId);
      saveAppData({ logs: updatedLogs });
      return updatedLogs;
    });
  }, []);

  // Reset today's intake
  const handleResetToday = useCallback(() => {
    const todayLogsIds = new Set(todayLogs.map((l) => l.id));
    setLogs((prevLogs) => {
      const updatedLogs = prevLogs.filter((item) => !todayLogsIds.has(item.id));
      saveAppData({ logs: updatedLogs, hasCelebratedToday: false });
      return updatedLogs;
    });
    setHasCelebratedToday(false);
  }, [todayLogs]);

  // Save settings
  const handleSaveSettings = useCallback(async (newSettings) => {
    setUserName(newSettings.name);
    setGoalGlasses(newSettings.goalGlasses);
    setReminderEnabled(newSettings.reminderEnabled);
    setReminderInterval(newSettings.reminderIntervalMinutes);

    await saveAppData({
      name: newSettings.name,
      goalGlasses: newSettings.goalGlasses,
      reminderEnabled: newSettings.reminderEnabled,
      reminderIntervalMinutes: newSettings.reminderIntervalMinutes,
    });

    if (newSettings.reminderEnabled) {
      await scheduleWaterReminder(newSettings.reminderIntervalMinutes, newSettings.name);
    } else {
      await cancelAllReminders();
    }
  }, []);

  // Safe area insets calculation for Android (Notch, selfie punch-hole, and navigation bar)
  const screenDimensions = Dimensions.get('screen');
  const windowDimensions = Dimensions.get('window');
  const androidStatusBar = StatusBar.currentHeight || 36;
  const topInset = Platform.OS === 'android' ? androidStatusBar : 0;
  const navBarDifference = Math.max(screenDimensions.height - windowDimensions.height, 0);
  // Guarantee safe distance above 3-button navbar (~48dp) or gesture bar (~28-32dp)
  const bottomInset = Platform.OS === 'android' ? Math.max(navBarDifference, 32) : 16;

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Main App Container with safe padding for status bar and selfie camera */}
      <View style={[styles.appContainer, { paddingTop: topInset }]}>
        {/* Header (with compact logo, greeting, and actions) */}
        <Header
          title={userName ? `سلام ${userName}!` : 'سلام!'}
          subtitle="نوشیدن آب، یادآوری عشق به خودت"
          onOpenBadges={() => setShowBadgesModal(true)}
          onOpenReminders={() => setActiveTab('settings')}
          onOpenSettings={() => setActiveTab('settings')}
        />

        {/* Tab Content Views */}
        <View style={styles.screenContent}>
          {activeTab === 'home' && (
            <HomeScreen
              todayGlasses={totalGlasses}
              goalGlasses={goalGlasses}
              todayLogs={todayLogs}
              streakDays={streakDays}
              userName={userName}
              onAddWater={handleAddWater}
              onDeleteWater={handleDeleteWater}
              onOpenCustomAmount={() => setShowCustomAmountModal(true)}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen
              logs={logs}
              goalGlasses={goalGlasses}
              onDeleteWater={handleDeleteWater}
            />
          )}

          {activeTab === 'stats' && (
            <StatsScreen
              logs={logs}
              goalGlasses={goalGlasses}
              streakDays={streakDays}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              name={userName}
              goalGlasses={goalGlasses}
              reminderEnabled={reminderEnabled}
              reminderIntervalMinutes={reminderInterval}
              onSaveSettings={handleSaveSettings}
              onResetToday={handleResetToday}
            />
          )}
        </View>

        {/* Bottom Navigation Bar with safe bottom padding for Android navigation bar */}
        <View style={[styles.bottomNavContainer, { paddingBottom: bottomInset + 8 }]}>
          <View style={styles.bottomNavContent}>
            {/* Tab 1: Home */}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('home')}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconBox, activeTab === 'home' && styles.navIconBoxActive]}>
                <Home
                  size={20}
                  color={activeTab === 'home' ? '#2D9CFF' : '#64748B'}
                  strokeWidth={activeTab === 'home' ? 2.5 : 2}
                />
              </View>
              <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
                خانه
              </Text>
            </TouchableOpacity>

            {/* Tab 2: History */}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('history')}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconBox, activeTab === 'history' && styles.navIconBoxActive]}>
                <History
                  size={20}
                  color={activeTab === 'history' ? '#2D9CFF' : '#64748B'}
                  strokeWidth={activeTab === 'history' ? 2.5 : 2}
                />
              </View>
              <Text style={[styles.navLabel, activeTab === 'history' && styles.navLabelActive]}>
                تاریخچه
              </Text>
            </TouchableOpacity>

            {/* Floating Central Quick Drink Button (+) */}
            <View style={styles.floatingCenterWrapper}>
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => handleAddWater(1, 250)}
                activeOpacity={0.8}
              >
                <Plus size={22} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.floatingButtonSub}>۱ لیوان</Text>
              </TouchableOpacity>
            </View>

            {/* Tab 3: Stats */}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('stats')}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconBox, activeTab === 'stats' && styles.navIconBoxActive]}>
                <BarChart3
                  size={20}
                  color={activeTab === 'stats' ? '#2D9CFF' : '#64748B'}
                  strokeWidth={activeTab === 'stats' ? 2.5 : 2}
                />
              </View>
              <Text style={[styles.navLabel, activeTab === 'stats' && styles.navLabelActive]}>
                گزارش
              </Text>
            </TouchableOpacity>

            {/* Tab 4: Settings */}
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => setActiveTab('settings')}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconBox, activeTab === 'settings' && styles.navIconBoxActive]}>
                <Settings
                  size={20}
                  color={activeTab === 'settings' ? '#2D9CFF' : '#64748B'}
                  strokeWidth={activeTab === 'settings' ? 2.5 : 2}
                />
              </View>
              <Text style={[styles.navLabel, activeTab === 'settings' && styles.navLabelActive]}>
                تنظیمات
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modals */}
      <CustomAmountModal
        visible={showCustomAmountModal}
        onClose={() => setShowCustomAmountModal(false)}
        onAddCustom={handleAddWater}
      />

      <CelebrationModal
        visible={showCelebrationModal}
        goalGlasses={goalGlasses}
        streakDays={streakDays}
        onClose={() => setShowCelebrationModal(false)}
      />

      <BadgesModal
        visible={showBadgesModal}
        logs={logs}
        todayGlasses={totalGlasses}
        goalGlasses={goalGlasses}
        streakDays={streakDays}
        onClose={() => setShowBadgesModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  screenContent: {
    flex: 1,
  },

  // Bottom Navigation Bar
  bottomNavContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 8,
    paddingTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navIconBox: {
    padding: 6,
    borderRadius: 12,
  },
  navIconBoxActive: {
    backgroundColor: '#E6F4FF',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#2D9CFF',
    fontWeight: '800',
  },

  // Floating Central Button
  floatingCenterWrapper: {
    marginTop: -22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  floatingButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2D9CFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  floatingButtonSub: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#E0F2FE',
    marginTop: -2,
  },
});
