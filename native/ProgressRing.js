import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CheckCircle2 } from 'lucide-react-native';
import { formatNumber, formatGlasses } from './strings';

export function ProgressRing({ currentGlasses = 0, goalGlasses = 8 }) {
  const percentage = goalGlasses > 0 ? Math.min(Math.round((currentGlasses / goalGlasses) * 100), 100) : 0;
  const isCompleted = currentGlasses >= goalGlasses && goalGlasses > 0;
  const remainingGlasses = Math.max(0, Math.round((goalGlasses - currentGlasses) * 10) / 10);
  const fillLevel = Math.min(Math.max(percentage / 100, 0.08), 0.94);

  // SVG circle math
  const size = 230;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={[styles.ringWrapper, { width: size, height: size }]}>
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: [{ rotate: '-90deg' }] }}
        >
          <Defs>
            <LinearGradient id="ringGradNative" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#56B7FF" />
              <Stop offset="100%" stopColor="#2D9CFF" />
            </LinearGradient>
            <LinearGradient id="ringCompleteGradNative" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#34D399" />
              <Stop offset="100%" stopColor="#10B981" />
            </LinearGradient>
          </Defs>

          {/* Background Track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E6F4FF"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress Arc */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isCompleted ? 'url(#ringCompleteGradNative)' : 'url(#ringGradNative)'}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>

        {/* Center Content Inside Ring */}
        <View style={styles.centerContent}>
          {/* Illustrated Water Glass with fill */}
          <View style={styles.glassVessel}>
            <View
              style={[
                styles.glassWaterFill,
                {
                  height: `${Math.round(fillLevel * 100)}%`,
                  backgroundColor: isCompleted ? '#10B981' : '#2D9CFF',
                },
              ]}
            >
              <View style={styles.glassWaterSurface} />
            </View>
            <View style={styles.glassHighlight} />
          </View>

          {/* Big Glasses Count */}
          <Text style={styles.currentNumberText}>
            {formatNumber(currentGlasses)}
          </Text>

          <Text style={styles.goalSubText}>
            از {formatNumber(goalGlasses)} لیوان
          </Text>
          <Text style={styles.todayLabelText}>
            امروز
          </Text>

          {/* Status Pill */}
          <View
            style={[
              styles.statusPill,
              isCompleted ? styles.statusPillCompleted : styles.statusPillPending,
            ]}
          >
            {isCompleted ? (
              <View style={styles.statusPillRow}>
                <CheckCircle2 size={12} color="#10B981" strokeWidth={2.5} />
                <Text style={styles.statusPillTextCompleted}>هدف تکمیل شد</Text>
              </View>
            ) : (
              <Text style={styles.statusPillTextPending}>
                {formatNumber(percentage)}٪ • {formatGlasses(remainingGlasses)} باقی‌مانده
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  ringWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  glassVessel: {
    width: 36,
    height: 44,
    borderWidth: 2,
    borderColor: '#2D9CFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  glassWaterFill: {
    width: '100%',
    position: 'relative',
  },
  glassWaterSurface: {
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
  glassHighlight: {
    position: 'absolute',
    top: 3,
    left: 3,
    bottom: 4,
    width: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
  currentNumberText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 44,
  },
  goalSubText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: -2,
  },
  todayLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2D9CFF',
    marginTop: 1,
  },
  statusPill: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPillPending: {
    backgroundColor: '#E6F4FF',
  },
  statusPillCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusPillRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  statusPillTextPending: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0066CC',
    writingDirection: 'rtl',
  },
  statusPillTextCompleted: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
    writingDirection: 'rtl',
  },
});
