import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { formatNumber, formatGlasses, formatTime, relativeTimeFromNow } from './strings';
import { getMascotMessage, MASCOT_EXPRESSIONS } from './mascot';

const PRESET_CUPS = [
  { id: 'cup-200', name: 'استکان', volumeMl: 200, glasses: 0.8, icon: '☕' },
  { id: 'cup-250', name: 'لیوان استاندارد', volumeMl: 250, glasses: 1, icon: '🥛' },
  { id: 'cup-300', name: 'ماگ بزرگ', volumeMl: 300, glasses: 1.2, icon: '🍵' },
  { id: 'cup-500', name: 'بطری آب', volumeMl: 500, glasses: 2, icon: '🍶' },
];

export function HomeScreen({
  todayGlasses,
  goalGlasses,
  todayLogs,
  streakDays,
  onAddWater,
  onDeleteWater,
  onOpenCustomAmount,
}) {
  const percentage = goalGlasses > 0 ? Math.min(Math.round((todayGlasses / goalGlasses) * 100), 100) : 0;
  const isGoalReached = todayGlasses >= goalGlasses;
  const remainingGlasses = Math.max(0, Math.round((goalGlasses - todayGlasses) * 10) / 10);
  const totalMl = Math.round(todayGlasses * 250);
  const goalMl = goalGlasses * 250;

  // Calculate hours since last drink for mascot status
  let hoursSinceLastDrink = 0;
  if (todayLogs.length > 0) {
    const lastTimestamp = new Date(todayLogs[0].loggedAt).getTime();
    hoursSinceLastDrink = (Date.now() - lastTimestamp) / (1000 * 60 * 60);
  }

  const mascot = getMascotMessage(todayGlasses, goalGlasses, hoursSinceLastDrink);

  // Pick mascot illustration based on state
  let mascotImageSource = require('../src/assets/images/noosh_mascot_happy_1788352192771.png');
  if (mascot.type === MASCOT_EXPRESSIONS.CELEBRATE) {
    mascotImageSource = require('../src/assets/images/noosh_mascot_celebrate_1788352221766.png');
  } else if (mascot.type === MASCOT_EXPRESSIONS.MISS_YOU) {
    mascotImageSource = require('../src/assets/images/noosh_mascot_missyou_1788352208455.png');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Mascot Care Speech Card */}
      <View style={[styles.mascotCard, { backgroundColor: mascot.bg }]}>
        <View style={styles.mascotSpeechSection}>
          <View style={styles.mascotBadgeRow}>
            <Text style={[styles.mascotBadgeText, { color: mascot.color }]}>
              {mascot.badge}
            </Text>
          </View>
          <Text style={styles.mascotQuoteText}>{mascot.quote}</Text>
        </View>

        {/* Mascot Avatar Image */}
        <View style={styles.mascotImageWrapper}>
          <Image
            source={mascotImageSource}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* 2. Main Hydration Progress Card */}
      <View style={styles.progressCard}>
        {/* Percentage badge top row */}
        <View style={styles.cardHeaderRow}>
          <View
            style={[
              styles.percentageBadge,
              isGoalReached ? styles.percentageBadgeSuccess : styles.percentageBadgeNormal,
            ]}
          >
            <Text
              style={[
                styles.percentageText,
                isGoalReached ? styles.percentageTextSuccess : styles.percentageTextNormal,
              ]}
            >
              {formatNumber(percentage)}٪ تکمیل شده
            </Text>
          </View>

          <Text style={styles.goalLabelText}>
            هدف: {formatGlasses(goalGlasses)} ({formatNumber(goalMl)} میلی‌لیتر)
          </Text>
        </View>

        {/* Central Illustrated Water Tank / Cup Gauge */}
        <View style={styles.gaugeCenterContainer}>
          <View style={styles.gaugeOuterRing}>
            {/* Cup Vessel Silhouette */}
            <View style={styles.cupVessel}>
              <View
                style={[
                  styles.waterFill,
                  {
                    height: `${Math.min(Math.max(percentage, 8), 100)}%`,
                    backgroundColor: isGoalReached ? '#10B981' : '#2D9CFF',
                  },
                ]}
              >
                {/* Surface wave reflection line */}
                <View style={styles.waterSurfaceLine} />
              </View>

              {/* Glass shine highlight */}
              <View style={styles.glassHighlight} />
            </View>

            {/* Numbers in Gauge */}
            <View style={styles.gaugeTextOverlay}>
              <Text style={styles.gaugeMainNumber}>
                {formatNumber(todayGlasses)}
              </Text>
              <Text style={styles.gaugeUnitText}>از {formatNumber(goalGlasses)} لیوان</Text>
              <Text style={styles.gaugeMlText}>{formatNumber(totalMl)} میلی‌لیتر</Text>
            </View>
          </View>
        </View>

        {/* Remaining info or completion celebration */}
        <View style={styles.statusInfoRow}>
          {isGoalReached ? (
            <Text style={styles.completedStatusText}>
              🎉 تبریک! هدف هیدراتاسیون امروزت تکمیل شد!
            </Text>
          ) : (
            <Text style={styles.remainingStatusText}>
              💧 {formatGlasses(remainingGlasses)} دیگر تا هدف روزانه
            </Text>
          )}
        </View>

        {/* 2 Stat Highlight Pills */}
        <View style={styles.statsPillRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{formatGlasses(todayGlasses)}</Text>
            <Text style={styles.statPillLabel}>مصرف امروز</Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{formatNumber(streakDays)} روز 🔥</Text>
            <Text style={styles.statPillLabel}>زنجیره پیوستگی</Text>
          </View>
        </View>
      </View>

      {/* 3. Quick Add Water Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <TouchableOpacity onPress={onOpenCustomAmount} activeOpacity={0.7}>
            <Text style={styles.customAddButtonText}>+ مقدار دلخواه</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitleText}>ثبت سریع مصرف آب</Text>
        </View>

        {/* 4 Cups Grid */}
        <View style={styles.cupsGrid}>
          {PRESET_CUPS.map((cup) => (
            <TouchableOpacity
              key={cup.id}
              style={styles.cupCard}
              onPress={() => onAddWater(cup.glasses, cup.volumeMl)}
              activeOpacity={0.75}
            >
              <Text style={styles.cupCardIcon}>{cup.icon}</Text>
              <Text style={styles.cupCardName}>{cup.name}</Text>
              <Text style={styles.cupCardVolume}>{formatNumber(cup.volumeMl)} ml</Text>
              <View style={styles.cupCardAddTag}>
                <Text style={styles.cupCardAddTagText}>+ {formatGlasses(cup.glasses)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. Today's Logs */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          {todayLogs.length > 0 && (
            <Text style={styles.logsCountBadge}>
              {formatNumber(todayLogs.length)} ثبت
            </Text>
          )}
          <Text style={styles.sectionTitleText}>گزارش امروز</Text>
        </View>

        {todayLogs.length === 0 ? (
          <View style={styles.emptyLogsCard}>
            <Text style={styles.emptyLogsIcon}>💧</Text>
            <Text style={styles.emptyLogsTitle}>امروز هنوز آبی ثبت نکردی</Text>
            <Text style={styles.emptyLogsSubtitle}>
              با زدن روی یکی از گزینه‌های بالا، اولین لیوانت رو بنوش و ثبت کن!
            </Text>
          </View>
        ) : (
          <View style={styles.logsListCard}>
            {todayLogs.map((log) => (
              <View key={log.id} style={styles.logItemRow}>
                {/* Delete button */}
                <TouchableOpacity
                  style={styles.deleteLogButton}
                  onPress={() => onDeleteWater(log.id)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.deleteLogButtonText}>🗑️</Text>
                </TouchableOpacity>

                {/* Log details */}
                <View style={styles.logItemDetails}>
                  <Text style={styles.logItemAmount}>
                    {formatGlasses(log.amountGlasses || 1)} ({formatNumber(log.amountMl || 250)} میلی‌لیتر)
                  </Text>
                  <Text style={styles.logItemTime}>
                    {formatTime(log.loggedAt)} ({relativeTimeFromNow(log.loggedAt)})
                  </Text>
                </View>

                {/* Drop Icon */}
                <View style={styles.logItemIconBox}>
                  <Text style={styles.logItemIcon}>💧</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
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
  // Mascot speech card
  mascotCard: {
    flexDirection: 'row-reverse',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(45, 156, 255, 0.2)',
    alignItems: 'center',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  mascotSpeechSection: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'flex-end',
  },
  mascotBadgeRow: {
    marginBottom: 4,
  },
  mascotBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    writingDirection: 'rtl',
  },
  mascotQuoteText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#1E293B',
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  mascotImageWrapper: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotImage: {
    width: 64,
    height: 64,
  },

  // Main progress card
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  percentageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageBadgeNormal: {
    backgroundColor: '#E6F4FF',
  },
  percentageBadgeSuccess: {
    backgroundColor: '#ECFDF5',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '800',
  },
  percentageTextNormal: {
    color: '#0066CC',
  },
  percentageTextSuccess: {
    color: '#10B981',
  },
  goalLabelText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    writingDirection: 'rtl',
  },

  // Gauge Center Container
  gaugeCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  gaugeOuterRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#F8FAFC',
    borderWidth: 8,
    borderColor: '#E6F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cupVessel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'flex-end',
  },
  waterFill: {
    width: '100%',
    position: 'relative',
  },
  waterSurfaceLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.4,
  },
  glassHighlight: {
    position: 'absolute',
    top: 15,
    left: 20,
    bottom: 25,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.45,
  },
  gaugeTextOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  gaugeMainNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
  },
  gaugeUnitText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
    marginTop: -2,
  },
  gaugeMlText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },

  // Status Info Row
  statusInfoRow: {
    alignItems: 'center',
    marginVertical: 12,
  },
  completedStatusText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  remainingStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  // Stats Pill Row
  statsPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statPillValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  statPillLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  // Section styling
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  customAddButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D9CFF',
  },
  logsCountBadge: {
    fontSize: 11,
    color: '#64748B',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '700',
  },

  // Cups Grid
  cupsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  cupCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
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
  cupCardIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  cupCardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  cupCardVolume: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cupCardAddTag: {
    marginTop: 8,
    backgroundColor: '#E6F4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cupCardAddTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0066CC',
  },

  // Logs list
  emptyLogsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyLogsIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyLogsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    writingDirection: 'rtl',
  },
  emptyLogsSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    writingDirection: 'rtl',
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
  deleteLogButton: {
    padding: 6,
  },
  deleteLogButtonText: {
    fontSize: 14,
  },
  logItemDetails: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  logItemAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  logItemTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  logItemIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logItemIcon: {
    fontSize: 16,
  },
});
