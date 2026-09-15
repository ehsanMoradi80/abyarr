import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { BarChart3, Droplets, Trophy, Target, Flame, Sparkles, Droplet } from 'lucide-react-native';
import { formatNumber, formatGlasses } from './strings';

const PERSIAN_WEEK_DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']; // شنبه تا جمعه

export function StatsScreen({ logs = [], goalGlasses = 8, streakDays = 1 }) {
  // Calculate stats for the last 7 days
  const now = new Date();
  const past7DaysData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const dayLogs = logs.filter((l) => {
      const ld = new Date(l.loggedAt);
      const lk = `${ld.getFullYear()}-${String(ld.getMonth() + 1).padStart(2, '0')}-${String(ld.getDate()).padStart(2, '0')}`;
      return lk === dayKey;
    });

    const dayTotalGlasses = dayLogs.reduce((sum, item) => sum + (item.amountGlasses || 1), 0);
    const dayTotalMl = dayLogs.reduce((sum, item) => sum + (item.amountMl || 250), 0);

    const jsDay = d.getDay();
    const persianDayIndex = (jsDay + 1) % 7;

    past7DaysData.push({
      date: d,
      dayKey,
      dayLabel: PERSIAN_WEEK_DAYS[persianDayIndex],
      glasses: Math.round(dayTotalGlasses * 10) / 10,
      ml: dayTotalMl,
      percentage: Math.min(Math.round((dayTotalGlasses / (goalGlasses || 8)) * 100), 100),
    });
  }

  // Summary Metrics
  const totalAllTimeGlasses = logs.reduce((sum, item) => sum + (item.amountGlasses || 1), 0);
  const totalAllTimeMl = logs.reduce((sum, item) => sum + (item.amountMl || 250), 0);

  const uniqueDaysMap = {};
  logs.forEach((log) => {
    const d = new Date(log.loggedAt);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    uniqueDaysMap[k] = (uniqueDaysMap[k] || 0) + (log.amountGlasses || 1);
  });

  const uniqueDaysCount = Object.keys(uniqueDaysMap).length || 1;
  const averageDailyGlasses = Math.round((totalAllTimeGlasses / uniqueDaysCount) * 10) / 10;
  const bestDayGlasses = Object.values(uniqueDaysMap).reduce((max, val) => Math.max(max, val), 0);
  const daysGoalReached = Object.values(uniqueDaysMap).filter((val) => val >= goalGlasses).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerTitleWrapper}>
          <BarChart3 size={17} color="#2D9CFF" strokeWidth={2.2} />
          <Text style={styles.headerTitleText}>گزارش و تحلیل مصرف آب</Text>
        </View>
      </View>

      {/* 1. 7-Day Weekly Chart Card */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartGoalNote}>هدف: {formatGlasses(goalGlasses)} در روز</Text>
          <Text style={styles.chartTitle}>نمودار ۷ روز اخیر</Text>
        </View>

        {/* Bars Container */}
        <View style={styles.barsContainer}>
          {past7DaysData.map((day, idx) => {
            const isFull = day.glasses >= goalGlasses && goalGlasses > 0;
            const barHeightPct = Math.min(Math.max((day.glasses / (goalGlasses || 8)) * 100, 4), 100);

            return (
              <View key={idx} style={styles.barColumn}>
                {/* Value at top */}
                <Text style={styles.barValueText}>
                  {day.glasses > 0 ? formatNumber(day.glasses) : ''}
                </Text>

                {/* Track */}
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${barHeightPct}%`,
                        backgroundColor: isFull ? '#10B981' : '#2D9CFF',
                      },
                    ]}
                  />
                </View>

                {/* Day Label */}
                <Text style={styles.barDayLabel}>{day.dayLabel}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 2. Key Metrics Grid */}
      <View style={styles.metricsGrid}>
        {/* Metric 1 */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconBox}>
            <Droplets size={18} color="#2D9CFF" strokeWidth={2.2} />
          </View>
          <Text style={styles.metricValue}>{formatGlasses(averageDailyGlasses)}</Text>
          <Text style={styles.metricLabel}>میانگین مصرف روزانه</Text>
        </View>

        {/* Metric 2 */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconBox}>
            <Trophy size={18} color="#EAB308" strokeWidth={2.2} />
          </View>
          <Text style={styles.metricValue}>{formatGlasses(bestDayGlasses)}</Text>
          <Text style={styles.metricLabel}>بیشترین مصرف یک روز</Text>
        </View>

        {/* Metric 3 */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconBox}>
            <Target size={18} color="#10B981" strokeWidth={2.2} />
          </View>
          <Text style={styles.metricValue}>{formatNumber(daysGoalReached)} روز</Text>
          <Text style={styles.metricLabel}>رسیدن به هدف کامل</Text>
        </View>

        {/* Metric 4 */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconBox}>
            <Flame size={18} color="#F97316" strokeWidth={2.2} />
          </View>
          <Text style={styles.metricValue}>{formatNumber(streakDays)} روز</Text>
          <Text style={styles.metricLabel}>زنجیره پیوستگی فعال</Text>
        </View>
      </View>

      {/* 3. Total Consumption Banner */}
      <View style={styles.totalBanner}>
        <View style={styles.totalBannerContent}>
          <View style={styles.totalBannerBadge}>
            <Sparkles size={12} color="#0284C7" />
            <Text style={styles.totalBannerTitle}>کل آب نوشیده شده تا کنون</Text>
          </View>
          <Text style={styles.totalBannerValue}>
            {formatNumber(Math.round(totalAllTimeMl / 1000))} لیتر ({formatGlasses(totalAllTimeGlasses)})
          </Text>
          <Text style={styles.totalBannerSub}>
            بدنت برای این تعهد سلامتی ازت ممنونه!
          </Text>
        </View>
        <View style={styles.totalBannerIconBox}>
          <Droplet size={24} color="#2D9CFF" fill="#2D9CFF" />
        </View>
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
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  headerTitleWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  chartGoalNote: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  barsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 4,
    height: 14,
  },
  barTrack: {
    width: 22,
    height: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: 11,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 11,
  },
  barDayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricValue: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  metricLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  totalBanner: {
    flexDirection: 'row-reverse',
    backgroundColor: '#E6F4FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(45, 156, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalBannerContent: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  totalBannerBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  totalBannerTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0066CC',
    writingDirection: 'rtl',
  },
  totalBannerValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 3,
  },
  totalBannerSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  totalBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
});
