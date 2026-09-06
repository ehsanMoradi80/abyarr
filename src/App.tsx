import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Toast } from './components/Toast';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { GamificationScreen } from './components/GamificationScreen';
import { BrandDetailScreen } from './components/BrandDetailScreen';
import { AuthScreen } from './components/AuthScreen';
import { PartnerScreen } from './components/PartnerScreen';
import { GoalCelebrationScreen } from './components/GoalCelebrationScreen';
import { CelebrationMotivationModal } from './components/CelebrationMotivationModal';
import { WidgetsScreen } from './components/WidgetsScreen';
import { NooshNotificationModal } from './components/NooshMascot/NooshNotificationModal';
import { trackEvent, trackScreenView } from './services/analytics';

const getAnalyticsScreenName = (currentScreen: string, activeTab: string): string => {
  if (currentScreen === 'main') return `tab_${activeTab}`;
  return currentScreen;
};

const getAnalyticsScreenTitle = (currentScreen: string, activeTab: string): string => {
  if (currentScreen === 'main') {
    return `Abyar ${activeTab}`;
  }

  return `Abyar ${currentScreen.replace(/-/g, ' ')}`;
};

const getAnalyticsScreenPath = (currentScreen: string, activeTab: string): string => {
  if (currentScreen === 'main') return `/${activeTab}`;
  return `/${currentScreen}`;
};

export const App: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    activeTab,
    setActiveTab,
    toastMessage,
    name,
    addWater,
    celebrationModalPayload,
    targetStreakDays,
    setTargetStreakDays,
    closeCelebrationModal,
    nooshNotificationPayload,
    triggerNooshNotification,
    closeNooshNotification,
  } = useApp();

  const [showSplashPreview, setShowSplashPreview] = useState<boolean>(false);

  useEffect(() => {
    void trackEvent('app_open');
  }, []);

  useEffect(() => {
    void trackScreenView({
      screenName: getAnalyticsScreenName(currentScreen, activeTab),
      screenClass: currentScreen,
      title: getAnalyticsScreenTitle(currentScreen, activeTab),
      path: getAnalyticsScreenPath(currentScreen, activeTab),
    });
  }, [activeTab, currentScreen]);

  // If user requested splash screen preview from settings
  if (showSplashPreview) {
    return (
      <SplashScreen
        isDismissable={true}
        onClose={() => setShowSplashPreview(false)}
        onStart={() => setShowSplashPreview(false)}
        onHaveAccount={() => {
          setShowSplashPreview(false);
          setCurrentScreen('auth');
        }}
      />
    );
  }

  // 1. Mandatory First-Time Onboarding Screen (Full Page, No Modal, No Navigation)
  if (currentScreen === 'onboarding') {
    return (
      <>
        <Toast message={toastMessage} />
        <OnboardingScreen />
      </>
    );
  }

  // 2. Full-Page Gamification & Achievements Screen (Back button, No Main Nav)
  if (currentScreen === 'gamification') {
    return (
      <>
        <Toast message={toastMessage} />
        <GamificationScreen />
      </>
    );
  }

  // 3. Full-Page Brand Detail & Milestone Screen (Back button, No Main Nav)
  if (currentScreen === 'brand-detail') {
    return (
      <>
        <Toast message={toastMessage} />
        <BrandDetailScreen />
      </>
    );
  }

  // 4. Full-Page Authentication & Sync Screen (Back button, No Main Nav)
  if (currentScreen === 'auth') {
    return (
      <>
        <Toast message={toastMessage} />
        <AuthScreen />
      </>
    );
  }

  // 5. Full-Page Partner & Sharing Screen (Back button, No Main Nav)
  if (currentScreen === 'partner') {
    return (
      <>
        <Toast message={toastMessage} />
        <PartnerScreen />
      </>
    );
  }

  // 6. Full-Page Duolingo-style Daily Goal Celebration Screen
  if (currentScreen === 'goal-celebration') {
    return (
      <>
        <Toast message={toastMessage} />
        <GoalCelebrationScreen />
      </>
    );
  }

  // 7. Full-Page Android Widgets Hub & Simulator Screen
  if (currentScreen === 'widgets') {
    return (
      <>
        <Toast message={toastMessage} />
        <WidgetsScreen />
      </>
    );
  }

  // 8. Main App Layout (Home, History, Stats, Settings + Bottom Navigation)
  return (
    <div className="min-h-screen bg-[#F2F6FA] dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between selection:bg-[#2D9CFF] selection:text-white transition-colors duration-200">
      <Toast message={toastMessage} />
      
      <CelebrationMotivationModal
        payload={celebrationModalPayload}
        targetStreakDays={targetStreakDays}
        onSetTargetStreak={setTargetStreakDays}
        onClose={closeCelebrationModal}
      />

      {/* Duolingo-style Noosh Notification Modal */}
      <NooshNotificationModal
        payload={nooshNotificationPayload}
        userName={name}
        onDrinkWater={(glasses) => addWater(glasses)}
        onClose={closeNooshNotification}
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'history' && <HistoryScreen />}
        {activeTab === 'stats' && <StatisticsScreen />}
        {activeTab === 'settings' && (
          <SettingsScreen onOpenSplash={() => setShowSplashPreview(true)} />
        )}
      </main>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickAdd={() => addWater(1)}
      />
    </div>
  );
};

