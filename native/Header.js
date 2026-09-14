import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

export function Header({ title, subtitle, onOpenBadges, onOpenReminders, streakDays = 1 }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.rightSection}>
        {/* Compact, elegant App Logo (Not oversized) */}
        <View style={styles.logoBadge}>
          <Image
            source={require('../public/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.leftSection}>
        {/* Streak counter badge */}
        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>{streakDays}</Text>
        </View>

        {/* Badges action */}
        {onOpenBadges && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onOpenBadges}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🏆</Text>
          </TouchableOpacity>
        )}

        {/* Reminders action */}
        {onOpenReminders && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onOpenReminders}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🔔</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#F2F6FA',
  },
  rightSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  // Compact, balanced logo sizing (34x34) to avoid being too large
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoImage: {
    width: 24,
    height: 24,
  },
  titleWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  subtitleText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  streakIcon: {
    fontSize: 13,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonIcon: {
    fontSize: 15,
  },
});
