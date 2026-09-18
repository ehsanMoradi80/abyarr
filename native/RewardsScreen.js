import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Trophy,
  Flame,
  Sparkles,
  ChevronRight,
  Award,
  CheckCircle2,
  Lock,
  Zap,
  Star,
  Target,
} from 'lucide-react-native';
import { formatNumber, formatGlasses } from './strings';

const LEVELS = [
  { level: 1, name: 'نوآموز آب', minXP: 0, maxXP: 150 },
  { level: 2, name: 'جوینده رطوبت', minXP: 150, maxXP: 400 },
  { level: 3, name: 'همگام با قطره', minXP: 400, maxXP: 800 },
  { level: 4, name: 'سفیر تندرستی', minXP: 800, maxXP: 1500 },
  { level: 5, name: 'قهرمان آب', minXP: 1500, maxXP: 2500 },
  { level: 6, name: 'استاد هیدراتاسیون', minXP: 2500, maxXP: 5000 },
];

export function RewardsScreen({
  onBack,
  logs = [],
  todayGlasses = 0,
  goalGlasses = 8,
  streakDays = 1,
  partnerConnected = false,
}) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);

  // 1. Calculate lifetime volumes from actual logs
  const safeLogs = Array.isArray(logs) ? logs : [];
  const totalLifetimeGlasses = safeLogs.reduce((sum, item) => sum + (item.amountGlasses || 1), 0);
  const totalLifetimeMl = safeLogs.reduce((sum, item) => sum + (item.amountMl || 250), 0);

  // Today's logs analysis
  const todayKey = new Date().toISOString().split('T')[0];
  const todayLogs = safeLogs.filter((log) => {
    if (!log.loggedAt) return false;
    return log.loggedAt.startsWith(todayKey);
  });

  const hasMorningDrink = todayLogs.some((log) => {
    const hours = new Date(log.loggedAt).getHours();
    return hours < 12;
  });

  const hasEarlyBirdDrink = safeLogs.some((log) => {
    const hours = new Date(log.loggedAt).getHours();
    return hours < 9;
  });

  const hasNightDrink = safeLogs.some((log) => {
    const hours = new Date(log.loggedAt).getHours();
    return hours >= 20;
  });

  // 2. Real Daily Quests (Evaluated against today's actual performance)
  const dailyQuests = [
    {
      id: 'morning_water',
      title: 'نوشیدن آب صبحگاهی',
      desc: 'حداقل ۱ لیوان قبل از ساعت ۱۲ ظهر',
      xp: 40,
      completed: hasMorningDrink,
    },
    {
      id: 'half_goal',
      title: 'نیمه راه سلامتی',
      desc: `رسیدن به حداقل ۵۰٪ هدف روزانه (${formatNumber(Math.ceil(goalGlasses / 2))} لیوان)`,
      xp: 60,
      completed: todayGlasses >= Math.ceil(goalGlasses / 2) && todayGlasses > 0,
    },
    {
      id: 'full_goal',
      title: 'هدف کامل روزانه',
      desc: `تکمیل ۱۰۰٪ هدف امروز (${formatNumber(goalGlasses)} لیوان)`,
      xp: 100,
      completed: todayGlasses >= goalGlasses && goalGlasses > 0,
    },
  ];

  const completedQuestsCount = dailyQuests.filter((q) => q.completed).length;
  const questsXP = dailyQuests.reduce((sum, q) => sum + (q.completed ? q.xp : 0), 0);

  // 3. Real Badges with dynamic evaluations
  const rewardBadges = [
    {
      id: 'first_sip',
      title: 'نخستین جرعه',
      description: 'ثبت اولین لیوان آب در برنامه آب‌یار',
      category: 'milestone',
      xp: 50,
      iconColor: '#2D9CFF',
      iconBg: '#E6F4FF',
      unlocked: safeLogs.length >= 1,
      progressText: safeLogs.length >= 1 ? 'کسب شده' : 'هنوز لیوانی ثبت نشده',
    },
    {
      id: 'streak_3',
      title: 'تداوم ۳ روزه',
      description: 'نوشیدن منظم آب برای سه روز متوالی',
      category: 'streak',
      xp: 100,
      iconColor: '#F59E0B',
      iconBg: '#FEF3C7',
      unlocked: streakDays >= 3,
      progressText: `${formatNumber(streakDays)} از ۳ روز`,
    },
    {
      id: 'streak_7',
      title: 'هفته طلایی',
      description: 'یک هفته کامل تداوم و تکمیل هدف نوشیدن آب',
      category: 'streak',
      xp: 250,
      iconColor: '#EAB308',
      iconBg: '#FEF9C3',
      unlocked: streakDays >= 7,
      progressText: `${formatNumber(streakDays)} از ۷ روز`,
    },
    {
      id: 'streak_30',
      title: 'ماه پایدار',
      description: '۳۰ روز نوشیدن پایدار و تبدیل به عادت روزمره',
      category: 'streak',
      xp: 600,
      iconColor: '#8B5CF6',
      iconBg: '#EDE9FE',
      unlocked: streakDays >= 30,
      progressText: `${formatNumber(streakDays)} از ۳۰ روز`,
    },
    {
      id: 'perfect_day',
      title: 'قهرمان آب روزانه',
      description: `تکمیل ۱۰۰٪ هدف روزانه آب (${formatGlasses(goalGlasses)})`,
      category: 'volume',
      xp: 150,
      iconColor: '#10B981',
      iconBg: '#D1FAE5',
      unlocked: todayGlasses >= goalGlasses && goalGlasses > 0,
      progressText: `${formatNumber(todayGlasses)} از ${formatNumber(goalGlasses)} لیوان`,
    },
    {
      id: 'early_bird',
      title: 'سحرخیز شاداب',
      description: 'نوشیدن اولین لیوان آب قبل از ساعت ۹ صبح',
      category: 'timing',
      xp: 80,
      iconColor: '#06B6D4',
      iconBg: '#CFFAFE',
      unlocked: hasEarlyBirdDrink,
      progressText: hasEarlyBirdDrink ? 'کسب شده' : 'قبل از ۹ صبح ثبت کنید',
    },
    {
      id: 'night_owl',
      title: 'هیدراته تا شب',
      description: 'ثبت آب بعد از ساعت ۸ شب برای رطوبت‌رسانی شبانه',
      category: 'timing',
      xp: 80,
      iconColor: '#6366F1',
      iconBg: '#EEF2FF',
      unlocked: hasNightDrink,
      progressText: hasNightDrink ? 'کسب شده' : 'بعد از ۸ شب ثبت کنید',
    },
    {
      id: 'volume_10k',
      title: 'باشگاه ۱۰ لیتر',
      description: 'مجموع مصرف ۱۰,۰۰۰ میلی‌لیتر آب در طول زمان',
      category: 'volume',
      xp: 300,
      iconColor: '#3B82F6',
      iconBg: '#DBEAFE',
      unlocked: totalLifetimeMl >= 10000,
      progressText: `${formatNumber(totalLifetimeMl)} از ۱۰,۰۰۰ میلی‌لیتر`,
    },
    {
      id: 'golden_partner',
      title: 'همراه نمونه',
      description: 'اتصال فعال به همراه سلامت برای پایش مشترک',
      category: 'milestone',
      xp: 200,
      iconColor: '#EC4899',
      iconBg: '#FCE7F3',
      unlocked: Boolean(partnerConnected),
      progressText: partnerConnected ? 'متصل شد' : 'همراه سلامت را متصل کنید',
    },
  ];

  const unlockedCount = rewardBadges.filter((b) => b.unlocked).length;
  const badgesEarnedXP = rewardBadges.reduce((sum, b) => sum + (b.unlocked ? b.xp : 0), 0);

  // 4. Real Cumulative XP Calculation
  const waterLogXP = totalLifetimeGlasses * 20;
  const streakBonusXP = Math.max(0, streakDays - 1) * 30;
  const currentXP = waterLogXP + streakBonusXP + badgesEarnedXP + questsXP;

  // 5. Dynamic Real Level
  const currentLevelObj =
    LEVELS.find((lvl) => currentXP >= lvl.minXP && currentXP < lvl.maxXP) ||
    LEVELS[LEVELS.length - 1];
  const nextLevelObj =
    LEVELS.find((lvl) => lvl.level === currentLevelObj.level + 1) || currentLevelObj;

  const xpInCurrentLevel = currentXP - currentLevelObj.minXP;
  const levelRange = Math.max(1, currentLevelObj.maxXP - currentLevelObj.minXP);
  const levelProgress =
    nextLevelObj.level === currentLevelObj.level
      ? 100
      : Math.min(Math.round((xpInCurrentLevel / levelRange) * 100), 100);
  const xpToNext = Math.max(0, currentLevelObj.maxXP - currentXP);

  const filteredBadges =
    selectedFilter === 'all'
      ? rewardBadges
      : rewardBadges.filter((b) => b.category === selectedFilter);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ChevronRight size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>جوایز و افتخارات</Text>
          <Text style={styles.headerSubtitle}>تالار دستاوردها و امتیازات شما</Text>
        </View>
        <View style={styles.streakPill}>
          <Flame size={15} color="#EA580C" />
          <Text style={styles.streakText}>{formatNumber(streakDays)} روز</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Level & XP Hero Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Award size={18} color="#2D9CFF" />
              <Text style={styles.levelBadgeText}>
                سطح {formatNumber(currentLevelObj.level)}: {currentLevelObj.name}
              </Text>
            </View>
            <View style={styles.xpTextWrap}>
              <Zap size={14} color="#F59E0B" />
              <Text style={styles.xpText}>{formatNumber(currentXP)} XP</Text>
            </View>
          </View>

          <Text style={styles.levelTitle}>
            {nextLevelObj.level === currentLevelObj.level
              ? 'شما به بالاترین سطح هیدراتاسیون رسیده‌اید!'
              : `تنها ${formatNumber(xpToNext)} XP تا سطح ${formatNumber(nextLevelObj.level)} (${nextLevelObj.name})`}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${levelProgress}%` }]} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelLeft}>{formatNumber(levelProgress)}٪ در این سطح</Text>
            <Text style={styles.progressLabelRight}>
              {formatNumber(currentXP)} / {formatNumber(currentLevelObj.maxXP)} XP
            </Text>
          </View>
        </View>

        {/* Daily Quests Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Target size={18} color="#2D9CFF" />
              <Text style={styles.sectionTitle}>مأموریت‌های امروز</Text>
            </View>
            <Text style={styles.sectionMeta}>
              {formatNumber(completedQuestsCount)} از {formatNumber(dailyQuests.length)} تکمیل شده
            </Text>
          </View>

          <View style={styles.questsList}>
            {dailyQuests.map((quest) => (
              <View
                key={quest.id}
                style={[
                  styles.questCard,
                  quest.completed && styles.questCardCompleted,
                ]}
              >
                <View style={styles.questInfo}>
                  <Text style={[styles.questTitle, quest.completed && styles.questTitleDone]}>
                    {quest.title}
                  </Text>
                  <Text style={styles.questDesc}>{quest.desc}</Text>
                </View>

                <View style={styles.questRewardWrap}>
                  <View style={styles.questXpBadge}>
                    <Text style={styles.questXpText}>+{formatNumber(quest.xp)} XP</Text>
                  </View>
                  {quest.completed ? (
                    <CheckCircle2 size={20} color="#10B981" />
                  ) : (
                    <View style={styles.questPendingDot} />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Badges Filter Tabs */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Trophy size={18} color="#F59E0B" />
              <Text style={styles.sectionTitle}>نشان‌های افتخار</Text>
            </View>
            <Text style={styles.sectionMeta}>
              {formatNumber(unlockedCount)} از {formatNumber(rewardBadges.length)} باز شده
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBar}
          >
            {[
              { key: 'all', label: 'همه' },
              { key: 'streak', label: 'تداوم' },
              { key: 'milestone', label: 'رکوردی' },
              { key: 'volume', label: 'حجم مصرف' },
              { key: 'timing', label: 'زمان‌بندی' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterTab,
                  selectedFilter === tab.key && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    selectedFilter === tab.key && styles.filterTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Badges Grid */}
          <View style={styles.badgesGrid}>
            {filteredBadges.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeCard,
                  !badge.unlocked && styles.badgeCardLocked,
                ]}
                onPress={() => setSelectedBadge(badge)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.badgeIconCircle,
                    { backgroundColor: badge.unlocked ? badge.iconBg : '#F1F5F9' },
                  ]}
                >
                  {badge.unlocked ? (
                    <Award size={26} color={badge.iconColor} />
                  ) : (
                    <Lock size={22} color="#94A3B8" />
                  )}
                </View>
                <Text style={styles.badgeTitle} numberOfLines={1}>
                  {badge.title}
                </Text>
                <Text style={styles.badgeXpText}>+{formatNumber(badge.xp)} XP</Text>
                {badge.unlocked ? (
                  <View style={styles.badgeCheckPill}>
                    <CheckCircle2 size={11} color="#10B981" />
                    <Text style={styles.badgeCheckText}>کسب شده</Text>
                  </View>
                ) : (
                  <Text style={styles.badgeProgressHint} numberOfLines={1}>
                    {badge.progressText}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Badge Detail Modal */}
      <Modal
        visible={!!selectedBadge}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            {selectedBadge && (
              <>
                <View
                  style={[
                    styles.modalIconCircle,
                    {
                      backgroundColor: selectedBadge.unlocked
                        ? selectedBadge.iconBg
                        : '#F1F5F9',
                    },
                  ]}
                >
                  {selectedBadge.unlocked ? (
                    <Trophy size={38} color={selectedBadge.iconColor} />
                  ) : (
                    <Lock size={34} color="#94A3B8" />
                  )}
                </View>

                <Text style={styles.modalTitle}>{selectedBadge.title}</Text>
                <Text style={styles.modalDesc}>{selectedBadge.description}</Text>

                <View style={styles.modalMetaRow}>
                  <View style={styles.modalMetaItem}>
                    <Zap size={14} color="#F59E0B" />
                    <Text style={styles.modalMetaText}>+{formatNumber(selectedBadge.xp)} XP جایزه</Text>
                  </View>
                  <View style={styles.modalMetaItem}>
                    <Sparkles size={14} color="#2D9CFF" />
                    <Text style={styles.modalMetaText}>
                      {selectedBadge.unlocked ? 'فعال در کارنامه' : selectedBadge.progressText}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedBadge(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCloseBtnText}>متوجه شدم</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  topHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrap: {
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  streakPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6F4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  xpTextWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  levelTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'right',
    marginBottom: 10,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D9CFF',
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  progressLabelLeft: {
    fontSize: 11,
    color: '#64748B',
  },
  progressLabelRight: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
  },
  sectionWrap: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sectionTitleWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  questsList: {
    gap: 8,
  },
  questCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questCardCompleted: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  questInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  questTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  questTitleDone: {
    color: '#065F46',
  },
  questDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  questRewardWrap: {
    alignItems: 'center',
    gap: 6,
  },
  questXpBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  questXpText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  questPendingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  filterBar: {
    flexDirection: 'row-reverse',
    gap: 8,
    paddingVertical: 4,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: '#2D9CFF',
    borderColor: '#2D9CFF',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  badgesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  badgeCardLocked: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },
  badgeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeXpText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
  },
  badgeCheckPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  badgeCheckText: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: '700',
  },
  badgeProgressHint: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalMetaRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginBottom: 20,
  },
  modalMetaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  modalMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  modalCloseBtn: {
    width: '100%',
    backgroundColor: '#2D9CFF',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
