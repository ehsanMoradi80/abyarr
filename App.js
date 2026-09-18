import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Home, Calendar, BarChart3, Settings, Plus, Trophy } from 'lucide-react-native';

import { Header } from './native/Header';
import { HomeScreen } from './native/HomeScreen';
import { HistoryScreen } from './native/HistoryScreen';
import { StatsScreen } from './native/StatsScreen';
import { SettingsScreen } from './native/SettingsScreen';
import { RewardsScreen } from './native/RewardsScreen';
import { PartnerScreen } from './native/PartnerScreen';
import { CloudScreen } from './native/CloudScreen';
import { WidgetsScreen } from './native/WidgetsScreen';
import { ThirdPartyScreen } from './native/ThirdPartyScreen';
import { SplashScreen } from './native/SplashScreen';
import { OnboardingScreen } from './native/OnboardingScreen';
import { TourModal } from './native/TourModal';
import { DownloadModal } from './native/DownloadModal';
import { BadgesModal } from './native/BadgesModal';
import { CelebrationModal } from './native/CelebrationModal';
import { CustomAmountModal } from './native/CustomAmountModal';
import { QuickHubBottomSheet } from './native/QuickHubBottomSheet';

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
import { getTodayKey } from './native/strings';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'history' | 'rewards' | 'stats' | 'settings' | 'partner' | 'cloud' | 'widgets' | 'third-party'
  const [appData, setAppData] = useState({
    name: 'دوست خوبم',
    goalGlasses: 8,
    defaultCupMl: 250,
    logs: [],
    streakDays: 1,
    lastDrinkTimestamp: 0,
    reminderEnabled: true,
    reminderIntervalMinutes: 60,
    hasCelebratedToday: false,
    hasCompletedOnboarding: false,
    hasSeenTour: false,
  });

  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tourVisible, setTourVisible] = useState(false);
  const [downloadVisible, setDownloadVisible] = useState(false);
  const [badgesVisible, setBadgesVisible] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [customAmountVisible, setCustomAmountVisible] = useState(false);
  const [quickHubVisible, setQuickHubVisible] = useState(false);

  // Dynamic safe area insets for Android & iOS with comfortable breathing room
  const screenDimensions = Dimensions.get('screen');
  const windowDimensions = Dimensions.get('window');
  const statusBarHeight = StatusBar.currentHeight || (Platform.OS === 'android' ? 28 : 44);
  const topInset = Platform.OS === 'android' ? statusBarHeight : 44;
  const navBarDifference = Math.max(screenDimensions.height - windowDimensions.height, 0);
  const bottomInset = Platform.OS === 'android' ? Math.max(navBarDifference + 8, 20) : 28;

  // Initialize data and notifications on launch
  useEffect(() => {
    async function init() {
      try {
        const data = await loadAppData();
        if (data) {
          setAppData(data);
          if (data.reminderEnabled) {
            scheduleWaterReminder(data.reminderIntervalMinutes || 60, data.name || '');
          }
        }
        await requestNotificationPermission();
      } catch (err) {
        console.warn('Initialization error:', err);
      } finally {
        setIsReady(true);
      }
    }
    init();
  }, []);

  // Calculate daily stats from logs
  const { todayLogs, totalGlasses, totalMl } = calculateDailyStats(appData.logs || []);

  // Compute last drink timestamp
  const lastDrinkTimestamp = todayLogs.length > 0
    ? new Date(todayLogs[0].loggedAt).getTime()
    : (appData.lastDrinkTimestamp || 0);

  // Add water log
  const handleAddWater = async (amountGlasses = 1, amountMl = 250, beverage = 'آب خالص', beverageId = 'water') => {
    const newLog = {
      id: String(Date.now()),
      amountGlasses,
      amountMl,
      beverage,
      beverageId,
      loggedAt: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...(appData.logs || [])];
    const newDailyStats = calculateDailyStats(updatedLogs);

    let hasCelebrated = appData.hasCelebratedToday;
    if (newDailyStats.totalGlasses >= appData.goalGlasses && !hasCelebrated && appData.goalGlasses > 0) {
      setCelebrationVisible(true);
      hasCelebrated = true;
    }

    const updatedState = {
      ...appData,
      logs: updatedLogs,
      lastDrinkTimestamp: Date.now(),
      hasCelebratedToday: hasCelebrated,
    };

    setAppData(updatedState);
    await saveAppData(updatedState);

    // Immediate Real-Time Live Sync to Partner & Cloud
    try {
      fetch('/api/partner/live-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: appData.partner?.myCode || 'AB-1000',
          name: appData.name || 'همراه شما',
          glasses: newDailyStats.totalGlasses,
          goal: appData.goalGlasses || 8,
          lastDrink: {
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            amount: amountGlasses,
            beverage,
          },
          pairedCode: appData.partner?.code,
        }),
      }).catch(() => {});
    } catch (e) {
      // Offline fallback
    }

    // Reschedule reminder from this moment
    if (appData.reminderEnabled) {
      scheduleWaterReminder(appData.reminderIntervalMinutes || 60, appData.name || '');
    }
  };

  // Update Goal
  const handleUpdateGoal = async (newGoal) => {
    const updated = {
      ...appData,
      goalGlasses: newGoal,
    };
    setAppData(updated);
    await saveAppData(updated);
  };

  // Partner Handlers (Real storage & state, no demo)
  const handleConnectPartner = async (code) => {
    const updated = {
      ...appData,
      partner: {
        code,
        status: 'active',
        partnerName: 'همراه سلامت',
        connectedAt: new Date().toISOString(),
        shareProgress: true,
        shareLastDrink: true,
        progress: {
          totalGlasses: 0,
          goalGlasses: 8,
        },
      },
    };
    setAppData(updated);
    await saveAppData(updated);
  };

  const handleDisconnectPartner = async () => {
    const updated = {
      ...appData,
      partner: null,
    };
    setAppData(updated);
    await saveAppData(updated);
  };

  const handleUpdatePartnerSharing = async (sharing) => {
    if (!appData.partner) return;
    const updated = {
      ...appData,
      partner: {
        ...appData.partner,
        ...sharing,
      },
    };
    setAppData(updated);
    await saveAppData(updated);
  };

  // Cloud Handlers (Real storage & state, no demo)
  const handleUpdateUser = async (user) => {
    const updated = {
      ...appData,
      user,
      name: user?.name || appData.name,
    };
    setAppData(updated);
    await saveAppData(updated);
  };

  const handleSyncNow = async () => {
    const updated = {
      ...appData,
      lastSyncDate: new Date().toISOString(),
    };
    setAppData(updated);
    await saveAppData(updated);
  };

  // Delete water log
  const handleDeleteWater = async (logId) => {
    const updatedLogs = (appData.logs || []).filter((l) => l.id !== logId);
    const updatedState = {
      ...appData,
      logs: updatedLogs,
    };
    setAppData(updatedState);
    await saveAppData(updatedState);
  };

  // Reset today's logs
  const handleResetToday = async () => {
    const todayKey = getTodayKey();
    const updatedLogs = (appData.logs || []).filter((l) => {
      const d = new Date(l.loggedAt);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}` !== todayKey;
    });

    const updatedState = {
      ...appData,
      logs: updatedLogs,
      hasCelebratedToday: false,
    };
    setAppData(updatedState);
    await saveAppData(updatedState);
  };

  // Save Settings
  const handleSaveSettings = async (newSettings) => {
    const updatedState = {
      ...appData,
      ...newSettings,
    };
    setAppData(updatedState);
    await saveAppData(updatedState);

    if (newSettings.reminderEnabled) {
      await scheduleWaterReminder(newSettings.reminderIntervalMinutes, newSettings.name);
    } else {
      await cancelAllReminders();
    }
  };

  // Determine whether to show main top header
  const isFullScreenSubPage = ['rewards', 'partner', 'cloud', 'widgets', 'third-party'].includes(activeTab);

  if (showSplash) {
    return (
      <View style={[styles.rootContainer, { paddingTop: topInset }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#EBF5FF"
          translucent
        />
        <SplashScreen
          onStart={async () => {
            const fresh = await loadAppData();
            setShowSplash(false);
            if (!fresh?.hasCompletedOnboarding && !appData.hasCompletedOnboarding) {
              setShowOnboarding(true);
            }
          }}
          onSkip={async () => {
            const fresh = await loadAppData();
            setShowSplash(false);
            if (!fresh?.hasCompletedOnboarding && !appData.hasCompletedOnboarding) {
              setShowOnboarding(true);
            }
          }}
        />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <View style={[styles.rootContainer, { paddingTop: topInset }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F2F6FA"
          translucent
        />
        <OnboardingScreen
          onFinish={async (onboardingData) => {
            const updated = {
              ...appData,
              ...onboardingData,
              hasCompletedOnboarding: true,
              hasSeenTour: true,
            };
            setAppData(updated);
            await saveAppData(updated);
            setShowOnboarding(false);
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.rootContainer, { paddingTop: topInset }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F2F6FA"
        translucent
      />

      {/* Top Header Bar (Shown on primary screens) */}
      {!isFullScreenSubPage && (
        <Header
          title={`سلام، ${appData.name || 'دوست خوبم'}`}
          subtitle="نوشیدن آب، یادآوری عشق به خودت"
          onOpenCloud={() => setActiveTab('cloud')}
          onOpenSettings={() => setActiveTab('settings')}
        />
      )}

      {/* Main Screen Content */}
      <View style={styles.contentArea}>
        {activeTab === 'home' && (
          <HomeScreen
            todayGlasses={totalGlasses}
            goalGlasses={appData.goalGlasses || 8}
            todayLogs={todayLogs}
            streakDays={appData.streakDays || 1}
            lastDrinkTimestamp={lastDrinkTimestamp}
            userName={appData.name || ''}
            onAddWater={handleAddWater}
            onDeleteWater={handleDeleteWater}
            onOpenCustomAmount={() => setCustomAmountVisible(true)}
            onOpenQuickHub={() => setQuickHubVisible(true)}
            onOpenRewards={() => setActiveTab('rewards')}
            onOpenPartner={() => setActiveTab('partner')}
            onOpenCloud={() => setActiveTab('cloud')}
            onOpenWidgets={() => setActiveTab('widgets')}
            onOpenThirdParty={() => setActiveTab('third-party')}
            onOpenTour={() => setTourVisible(true)}
            onOpenDownload={() => setDownloadVisible(true)}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsScreen
            logs={appData.logs || []}
            todayGlasses={totalGlasses}
            goalGlasses={appData.goalGlasses || 8}
            streakDays={appData.streakDays || 1}
            partnerConnected={appData.partner?.status === 'active'}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'partner' && (
          <PartnerScreen
            partnerData={appData.partner}
            userGlasses={totalGlasses}
            userGoal={appData.goalGlasses || 8}
            userName={appData.name || 'دوست خوبم'}
            onConnectPartner={handleConnectPartner}
            onDisconnectPartner={handleDisconnectPartner}
            onUpdateSharing={handleUpdatePartnerSharing}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'cloud' && (
          <CloudScreen
            appData={appData}
            onUpdateUser={handleUpdateUser}
            onSyncNow={handleSyncNow}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'widgets' && (
          <WidgetsScreen
            todayGlasses={totalGlasses}
            goalGlasses={appData.goalGlasses || 8}
            streakDays={appData.streakDays || 1}
            onBack={() => setActiveTab('home')}
            onQuickAdd={() => handleAddWater(1, 250)}
          />
        )}

        {activeTab === 'third-party' && (
          <ThirdPartyScreen
            integrations={appData.integrations}
            onUpdateIntegrations={async (integrations) => {
              const updated = { ...appData, integrations };
              setAppData(updated);
              await saveAppData(updated);
            }}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            logs={appData.logs || []}
            goalGlasses={appData.goalGlasses || 8}
            onDeleteWater={handleDeleteWater}
          />
        )}

        {activeTab === 'stats' && (
          <StatsScreen
            logs={appData.logs || []}
            goalGlasses={appData.goalGlasses || 8}
            streakDays={appData.streakDays || 1}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            name={appData.name || ''}
            goalGlasses={appData.goalGlasses || 8}
            reminderEnabled={appData.reminderEnabled ?? true}
            reminderIntervalMinutes={appData.reminderIntervalMinutes || 60}
            onSaveSettings={handleSaveSettings}
            onResetToday={handleResetToday}
            onShowSplash={() => setShowSplash(true)}
            onShowOnboarding={() => setShowOnboarding(true)}
            onShowTour={() => setTourVisible(true)}
            onShowThirdParty={() => setActiveTab('third-party')}
            onShowDownload={() => setDownloadVisible(true)}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.navContainer, { paddingBottom: bottomInset }]}>
        <View style={styles.navBar}>
          {/* Settings Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.7}
          >
            <Settings
              size={22}
              color={activeTab === 'settings' ? '#2D9CFF' : '#94A3B8'}
              strokeWidth={activeTab === 'settings' ? 2.4 : 1.8}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'settings' && styles.navLabelActive,
              ]}
            >
              تنظیمات
            </Text>
          </TouchableOpacity>

          {/* Rewards Tab (جوایز و ریواردز) */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('rewards')}
            activeOpacity={0.7}
          >
            <Trophy
              size={22}
              color={activeTab === 'rewards' ? '#2D9CFF' : '#94A3B8'}
              strokeWidth={activeTab === 'rewards' ? 2.4 : 1.8}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'rewards' && styles.navLabelActive,
              ]}
            >
              جوایز
            </Text>
          </TouchableOpacity>

          {/* Center Floating Quick Add Button */}
          <View style={styles.quickAddWrapper}>
            <TouchableOpacity
              style={styles.quickAddBtn}
              onPress={() => handleAddWater(1, 250)}
              activeOpacity={0.8}
            >
              <Plus size={26} color="#FFFFFF" strokeWidth={2.8} />
            </TouchableOpacity>
          </View>

          {/* History Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.7}
          >
            <Calendar
              size={22}
              color={activeTab === 'history' ? '#2D9CFF' : '#94A3B8'}
              strokeWidth={activeTab === 'history' ? 2.4 : 1.8}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'history' && styles.navLabelActive,
              ]}
            >
              تاریخچه
            </Text>
          </TouchableOpacity>

          {/* Home Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <Home
              size={22}
              color={activeTab === 'home' ? '#2D9CFF' : '#94A3B8'}
              strokeWidth={activeTab === 'home' ? 2.4 : 1.8}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'home' && styles.navLabelActive,
              ]}
            >
              خانه
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Badges & Achievements Modal */}
      <BadgesModal
        visible={badgesVisible}
        logs={appData.logs || []}
        todayGlasses={totalGlasses}
        goalGlasses={appData.goalGlasses || 8}
        streakDays={appData.streakDays || 1}
        onClose={() => setBadgesVisible(false)}
      />

      {/* Goal Celebration Modal */}
      <CelebrationModal
        visible={celebrationVisible}
        goalGlasses={appData.goalGlasses || 8}
        streakDays={appData.streakDays || 1}
        onClose={() => setCelebrationVisible(false)}
      />

      {/* Guided Tour Modal */}
      <TourModal
        visible={tourVisible}
        onClose={async () => {
          setTourVisible(false);
          const updated = { ...appData, hasSeenTour: true };
          setAppData(updated);
          await saveAppData(updated);
        }}
      />

      {/* Android & PWA Download Modal */}
      <DownloadModal
        visible={downloadVisible}
        onClose={() => setDownloadVisible(false)}
        inviteCode={appData.partner?.myCode || 'AB-1000'}
      />

      {/* Custom Amount Modal */}
      <CustomAmountModal
        visible={customAmountVisible}
        onClose={() => setCustomAmountVisible(false)}
        onAddCustom={(glasses, ml) => handleAddWater(glasses, ml)}
      />

      {/* QuickHub Drag-to-Close Bottom Sheet (No Close Button, Gesture Only) */}
      <QuickHubBottomSheet
        visible={quickHubVisible}
        onClose={() => setQuickHubVisible(false)}
        currentGoalGlasses={appData.goalGlasses || 8}
        onUpdateGoal={handleUpdateGoal}
        onAddBeverage={(item) => {
          handleAddWater(item.amountGlasses, item.amountMl, item.beverage, item.beverageId);
        }}
        onOpenCustomAmount={() => setCustomAmountVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  contentArea: {
    flex: 1,
  },
  navContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
    paddingTop: 8,
    paddingBottom: 8, // Added generous breathing room
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  navLabelActive: {
    color: '#2D9CFF',
    fontWeight: '800',
  },
  quickAddWrapper: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2D9CFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
});
