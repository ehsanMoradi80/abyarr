import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { formatNumber, formatGlasses, formatDate, formatTime, formatDayOfWeek } from './strings';

export function HistoryScreen({ logs = [], goalGlasses = 8, onDeleteWater }) {
  // Group logs by day key (YYYY-MM-DD)
  const grouped = logs.reduce((acc, log) => {
    const d = new Date(log.loggedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[key]) {
      acc[key] = {
        date: d,
        items: [],
        totalGlasses: 0,
        totalMl: 0,
      };
    }
    acc[key].items.push(log);
    acc[key].totalGlasses += log.amountGlasses || 1;
    acc[key].totalMl += log.amountMl || 250;
    return acc;
  }, {});

  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerTitleRow}>
        <Text style={styles.headerCountBadge}>
          {formatNumber(logs.length)} ثبت در مجموع
        </Text>
        <Text style={styles.headerTitleText}>تاریخچه مصرف آب</Text>
      </View>

      {sortedKeys.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📜</Text>
          <Text style={styles.emptyTitle}>هنوز سابقه مصرفی ثبت نشده است</Text>
          <Text style={styles.emptySubtitle}>
            هر زمان که در صفحه اصلی آب بنوشی، ثبت‌هایت به تفکیک روز در اینجا نگهداری می‌شوند.
          </Text>
        </View>
      ) : (
        sortedKeys.map((dayKey) => {
          const dayData = grouped[dayKey];
          const pct = Math.min(Math.round((dayData.totalGlasses / goalGlasses) * 100), 100);

          return (
            <View key={dayKey} style={styles.dayCard}>
              {/* Day Header */}
              <View style={styles.dayHeader}>
                <View style={styles.dayStatsBadge}>
                  <Text style={styles.dayStatsText}>
                    {formatGlasses(Math.round(dayData.totalGlasses * 10) / 10)} ({formatNumber(dayData.totalMl)} ml)
                  </Text>
                  <Text style={styles.dayPercentText}>{formatNumber(pct)}٪</Text>
                </View>

                <View style={styles.dayDateWrapper}>
                  <Text style={styles.dayDateText}>{formatDate(dayData.date)}</Text>
                  <Text style={styles.dayNameText}>{formatDayOfWeek(dayData.date)}</Text>
                </View>
              </View>

              {/* Items for this day */}
              <View style={styles.itemsList}>
                {dayData.items.map((log) => (
                  <View key={log.id} style={styles.logRow}>
                    <TouchableOpacity
                      onPress={() => onDeleteWater(log.id)}
                      style={styles.deleteButton}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.deleteText}>🗑️</Text>
                    </TouchableOpacity>

                    <View style={styles.logDetails}>
                      <Text style={styles.logGlasses}>
                        {formatGlasses(log.amountGlasses || 1)} ({formatNumber(log.amountMl || 250)} ml)
                      </Text>
                      <Text style={styles.logTime}>{formatTime(log.loggedAt)}</Text>
                    </View>

                    <View style={styles.logIconWrapper}>
                      <Text style={styles.logIcon}>💧</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })
      )}

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
  headerTitleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  headerCountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    writingDirection: 'rtl',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    writingDirection: 'rtl',
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dayHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dayDateWrapper: {
    alignItems: 'flex-end',
  },
  dayDateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  dayNameText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    writingDirection: 'rtl',
  },
  dayStatsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayStatsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  dayPercentText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  itemsList: {
    paddingHorizontal: 12,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    fontSize: 14,
  },
  logDetails: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  logGlasses: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  logTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    writingDirection: 'rtl',
  },
  logIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logIcon: {
    fontSize: 14,
  },
});
