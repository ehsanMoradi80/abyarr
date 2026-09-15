import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Flame, Check } from 'lucide-react-native';
import { formatNumber } from './strings';

const DAYS_OF_WEEK = [
  { key: 0, label: 'ش' }, // شنبه
  { key: 1, label: 'ی' }, // یکشنبه
  { key: 2, label: 'د' }, // دوشنبه
  { key: 3, label: 'س' }, // سه‌شنبه
  { key: 4, label: 'چ' }, // چهارشنبه
  { key: 5, label: 'پ' }, // پنج‌شنبه
  { key: 6, label: 'ج' }, // جمعه
];

export function CompactStreakBar({ streakDays = 1, todayCompleted = false }) {
  // Current day index in Persian week (Sat = 0, ..., Fri = 6)
  const now = new Date();
  const jsDay = now.getDay();
  const currentPersianDayIndex = (jsDay + 1) % 7;

  return (
    <View style={styles.cardContainer}>
      {/* Right side: Flame and Streak Count */}
      <View style={styles.streakInfo}>
        <View style={styles.flameBox}>
          <Flame size={17} color="#F97316" strokeWidth={2.4} fill="#F97316" />
        </View>
        <View style={styles.streakTextWrapper}>
          <Text style={styles.streakNumberText}>
            {formatNumber(streakDays)} روز پیوسته
          </Text>
          <Text style={styles.streakSubText}>
            زنجیره پیوستگی
          </Text>
        </View>
      </View>

      {/* Left side: 7 Day Dots */}
      <View style={styles.daysRow}>
        {DAYS_OF_WEEK.map((d) => {
          const isToday = d.key === currentPersianDayIndex;
          const isPast = d.key < currentPersianDayIndex;
          // Completed if past and streak covers it, or if today and todayCompleted
          const isDone = (isToday && todayCompleted) || (isPast && streakDays > (currentPersianDayIndex - d.key));

          return (
            <View key={d.key} style={styles.dayCol}>
              <View
                style={[
                  styles.dayDot,
                  isDone && styles.dayDotDone,
                  isToday && !isDone && styles.dayDotToday,
                ]}
              >
                {isDone ? (
                  <Check size={9} color="#FFFFFF" strokeWidth={3} />
                ) : null}
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  isToday && styles.dayLabelToday,
                ]}
              >
                {d.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  streakInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  flameBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakTextWrapper: {
    alignItems: 'flex-end',
  },
  streakNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9A3412',
    writingDirection: 'rtl',
  },
  streakSubText: {
    fontSize: 10,
    color: '#64748B',
    writingDirection: 'rtl',
  },
  daysRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
    gap: 3,
  },
  dayDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dayDotToday: {
    borderColor: '#2D9CFF',
    borderWidth: 2,
    backgroundColor: '#E6F4FF',
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  dayLabelToday: {
    color: '#2D9CFF',
    fontWeight: '900',
  },
});
