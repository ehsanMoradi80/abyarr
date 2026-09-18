import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Droplet,
  Droplets,
  Sparkles,
  Bell,
  Trash2,
  Trophy,
  Users,
  Cloud,
  Smartphone,
  ChevronLeft,
  Zap,
  Compass,
  Sliders,
  Coffee,
  Download,
} from 'lucide-react-native';
import { CompactStreakBar } from './CompactStreakBar';
import { NooshMascotCard } from './NooshMascotCard';
import { ProgressRing } from './ProgressRing';
import { CupSelector } from './CupSelector';
import { formatNumber, formatGlasses, formatTime, relativeTimeFromNow } from './strings';

export function HomeScreen({
  todayGlasses = 0,
  goalGlasses = 8,
  todayLogs = [],
  streakDays = 1,
  lastDrinkTimestamp = 0,
  userName = '',
  onAddWater,
  onDeleteWater,
  onOpenCustomAmount,
  onOpenQuickHub,
  onOpenRewards,
  onOpenPartner,
  onOpenCloud,
  onOpenWidgets,
  onOpenThirdParty,
  onOpenTour,
  onOpenDownload,
}) {
  const percentage = goalGlasses > 0 ? Math.min(Math.round((todayGlasses / goalGlasses) * 100), 100) : 0;
  const isGoalReached = todayGlasses >= goalGlasses && goalGlasses > 0;

  // Calculate next reminder estimation (e.g. 1 hour after last drink or in 45 mins)
  const now = new Date();
  const nextReminder = new Date(now.getTime() + 60 * 60 * 1000);
  const nextReminderTime = `${String(nextReminder.getHours()).padStart(2, '0')}:${String(nextReminder.getMinutes()).padStart(2, '0')}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Compact Streak Bar */}
      <CompactStreakBar
        streakDays={streakDays}
        todayCompleted={isGoalReached}
      />

      {/* 2. Noosh Health Companion Mascot Card */}
      <NooshMascotCard
        todayGlasses={todayGlasses}
        goalGlasses={goalGlasses}
        lastDrinkTimestamp={lastDrinkTimestamp}
        userName={userName}
      />

      {/* 3. Feature Hub: Quick Access to Rewards, Partner, Widgets, Cloud */}
      <View style={styles.hubGrid}>
        <TouchableOpacity
          style={styles.hubCard}
          onPress={onOpenRewards}
          activeOpacity={0.7}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Trophy size={18} color="#D97706" />
          </View>
          <View style={styles.hubTextCol}>
            <Text style={styles.hubTitle}>جوایز و XP</Text>
            <Text style={styles.hubSubtitle}>سطح و نشان‌ها</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hubCard}
          onPress={onOpenPartner}
          activeOpacity={0.7}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: '#D1FAE5' }]}>
            <Users size={18} color="#059669" />
          </View>
          <View style={styles.hubTextCol}>
            <Text style={styles.hubTitle}>همراه سلامت</Text>
            <Text style={styles.hubSubtitle}>آب‌یار دو نفره</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hubCard}
          onPress={onOpenWidgets}
          activeOpacity={0.7}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: '#E0F2FE' }]}>
            <Smartphone size={18} color="#0284C7" />
          </View>
          <View style={styles.hubTextCol}>
            <Text style={styles.hubTitle}>ویجت‌ها</Text>
            <Text style={styles.hubSubtitle}>صفحه گوشی</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hubCard}
          onPress={onOpenCloud}
          activeOpacity={0.7}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: '#EFF6FF' }]}>
            <Cloud size={18} color="#2563EB" />
          </View>
          <View style={styles.hubTextCol}>
            <Text style={styles.hubTitle}>همگام ابر</Text>
            <Text style={styles.hubSubtitle}>پشتیبان امن</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hubCard}
          onPress={onOpenThirdParty}
          activeOpacity={0.7}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: '#CCFBF1' }]}>
            <Zap size={18} color="#0D9488" />
          </View>
          <View style={styles.hubTextCol}>
            <Text style={styles.hubTitle}>اتصالات</Text>
            <Text style={styles.hubSubtitle}>گوگل فیت و هلث</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hubCard}
          onPress={onOpenTour}
          activeOpacity={0.7}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: '#FDF2F8' }]}>
            <Compass size={18} color="#DB2777" />
          </View>
          <View style={styles.hubTextCol}>
            <Text style={styles.hubTitle}>تور راهنما</Text>
            <Text style={styles.hubSubtitle}>تعاملی و زنده</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.hubCard, { borderColor: '#BAE6FD', backgroundColor: '#F0F9FF' }]}
          onPress={onOpenDownload}
          activeOpacity={0.7}
        >
          <View style={[styles.hubIconCircle, { backgroundColor: '#E0F2FE' }]}>
            <Download size={18} color="#0284C7" />
          </View>
          <View style={styles.hubTextCol}>
            <Text style={[styles.hubTitle, { color: '#0284C7' }]}>دانلود اپلیکیشن</Text>
            <Text style={styles.hubSubtitle}>APK و PWA</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 4. Main Progress Ring Card */}
      <View style={styles.progressCard}>

        <ProgressRing
          currentGlasses={todayGlasses}
          goalGlasses={goalGlasses}
        />

        {/* Daily Goal Banner Card */}
        <View style={styles.goalBannerCard}>
          <View style={styles.goalBannerLeft}>
            <View style={styles.dropletIconBox}>
              <Droplet size={16} color="#2D9CFF" fill="#2D9CFF" strokeWidth={2} />
            </View>
            <View style={styles.goalBannerTextWrapper}>
              <Text style={styles.goalBannerTitle}>
                هدف: {formatGlasses(goalGlasses)}
              </Text>
              <Text style={styles.goalBannerSubtitle}>
                {formatNumber(goalGlasses * 250)} میلی‌لیتر در روز
              </Text>
            </View>
          </View>

          <View style={styles.goalBannerRight}>
            <Sparkles size={14} color="#0284C7" />
            <Text style={styles.goalBannerPercentage}>
              {formatNumber(percentage)}٪
            </Text>
          </View>
        </View>

        {/* Dynamic Reminder Alert Bar */}
        <View style={styles.reminderBar}>
          <View style={styles.reminderIconBox}>
            <Bell size={13} color="#2D9CFF" strokeWidth={2.4} />
          </View>
          <View style={styles.reminderTextWrapper}>
            <Text style={styles.reminderMainText}>
              یادآور بعدی: {formatNumber(nextReminderTime)}
            </Text>
            <Text style={styles.reminderSubText}>
              (تمدید خودکار با نوشیدن زودتر)
            </Text>
          </View>
        </View>
      </View>

      {/* QuickHub Bottom Sheet Launcher */}
      {onOpenQuickHub && (
        <TouchableOpacity
          style={styles.quickHubBanner}
          onPress={onOpenQuickHub}
          activeOpacity={0.8}
        >
          <View style={styles.quickHubBannerContent}>
            <View style={styles.quickHubIconBox}>
              <Sliders size={20} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <View style={styles.quickHubTextBox}>
              <View style={styles.quickHubTitleRow}>
                <Text style={styles.quickHubTitle}>هاب سریع نوشیدنی‌ها (QuickHub)</Text>
                <View style={styles.quickHubBadge}>
                  <Text style={styles.quickHubBadgeText}>جدید</Text>
                </View>
              </View>
              <Text style={styles.quickHubSubtitle}>
                چای، قهوه، دمنوش، آبمیوه + محاسبه‌گر هوشمند نیاز بدن
              </Text>
            </View>
          </View>
          <ChevronLeft size={20} color="#0284C7" strokeWidth={2.4} />
        </TouchableOpacity>
      )}

      {/* 3. Cup Selector with Quick Log & Multiplier */}
      <CupSelector
        onAddWater={onAddWater}
        onOpenCustomAmount={onOpenCustomAmount}
      />

      {/* 4. Today's Logs */}
      <View style={styles.logsSection}>
        <View style={styles.sectionHeaderRow}>
          {todayLogs.length > 0 && (
            <View style={styles.logsBadge}>
              <Text style={styles.logsBadgeText}>
                {formatNumber(todayLogs.length)} ثبت
              </Text>
            </View>
          )}
          <Text style={styles.sectionTitleText}>نوشیده‌های امروز</Text>
        </View>

        {todayLogs.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Droplets size={26} color="#94A3B8" strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyTitle}>هنوز آبی ثبت نکرده‌اید</Text>
            <Text style={styles.emptySubtitle}>
              با زدن روی یکی از اندازه‌های بالا، اولین لیوان خود را بنوشید و ثبت کنید!
            </Text>
          </View>
        ) : (
          <View style={styles.logsListCard}>
            {todayLogs.map((log) => (
              <View key={log.id} style={styles.logItemRow}>
                {/* Delete button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDeleteWater(log.id)}
                  activeOpacity={0.6}
                >
                  <Trash2 size={15} color="#EF4444" strokeWidth={2.2} />
                </TouchableOpacity>

                {/* Amount and Time */}
                <View style={styles.logDetails}>
                  <Text style={styles.logAmount}>
                    {log.beverage ? `${log.beverage} • ` : ''}{formatGlasses(log.amountGlasses || 1)} ({formatNumber(log.amountMl || 250)} میلی‌لیتر)
                  </Text>
                  <Text style={styles.logTime}>
                    {formatTime(log.loggedAt)} ({relativeTimeFromNow(log.loggedAt)})
                  </Text>
                </View>

                {/* Beverage or Droplet icon container */}
                <View style={styles.logIconBox}>
                  {log.beverage && log.beverage.includes('قهوه') ? (
                    <Coffee size={15} color="#854D0E" />
                  ) : (
                    <Droplet size={15} color="#2D9CFF" fill="#2D9CFF" />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  hubGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  hubCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  hubIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubTextCol: {
    alignItems: 'flex-end',
    flex: 1,
  },
  hubTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  hubSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  goalBannerCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginTop: 6,
    marginBottom: 8,
  },
  goalBannerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  dropletIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  goalBannerTextWrapper: {
    alignItems: 'flex-end',
  },
  goalBannerTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0369A1',
    writingDirection: 'rtl',
  },
  goalBannerSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
    writingDirection: 'rtl',
  },
  goalBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  goalBannerPercentage: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0284C7',
  },
  reminderBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reminderIconBox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderTextWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  reminderMainText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    writingDirection: 'rtl',
  },
  reminderSubText: {
    fontSize: 9.5,
    color: '#94A3B8',
    writingDirection: 'rtl',
  },
  logsSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  logsBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  logsBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
    writingDirection: 'rtl',
  },
  emptySubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    writingDirection: 'rtl',
    maxWidth: 260,
  },
  logsListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  logItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
  },
  logDetails: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  logAmount: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  logTime: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  logIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickHubBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  quickHubBannerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quickHubIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickHubTextBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  quickHubTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  quickHubTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  quickHubBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  quickHubBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  quickHubSubtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },
});
