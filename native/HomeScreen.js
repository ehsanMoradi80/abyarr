import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Droplet, Droplets, Sparkles, Bell, Trash2 } from 'lucide-react-native';
import { CompactStreakBar } from './CompactStreakBar';
import { ProgressRing } from './ProgressRing';
import { CupSelector } from './CupSelector';
import { formatNumber, formatGlasses, formatTime, relativeTimeFromNow } from './strings';

export function HomeScreen({
  todayGlasses = 0,
  goalGlasses = 8,
  todayLogs = [],
  streakDays = 1,
  onAddWater,
  onDeleteWater,
  onOpenCustomAmount,
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

      {/* 2. Main Progress Ring Card */}
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
                    {formatGlasses(log.amountGlasses || 1)} ({formatNumber(log.amountMl || 250)} میلی‌لیتر)
                  </Text>
                  <Text style={styles.logTime}>
                    {formatTime(log.loggedAt)} ({relativeTimeFromNow(log.loggedAt)})
                  </Text>
                </View>

                {/* Droplet icon container */}
                <View style={styles.logIconBox}>
                  <Droplet size={15} color="#2D9CFF" fill="#2D9CFF" />
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
});
