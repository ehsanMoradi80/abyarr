import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BADGES } from './badges';

export function BadgesModal({ visible, logs = [], todayGlasses = 0, goalGlasses = 8, streakDays = 1, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.cardContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.titleText}>دستاوردها و نشان‌ها 🏆</Text>
          </View>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {BADGES.map((badge) => {
              const isUnlocked = badge.unlocked(logs, todayGlasses, goalGlasses, streakDays);

              return (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeRow,
                    isUnlocked ? styles.badgeRowUnlocked : styles.badgeRowLocked,
                  ]}
                >
                  <View style={styles.badgeStatus}>
                    <Text
                      style={[
                        styles.badgeStatusText,
                        isUnlocked ? styles.badgeStatusUnlocked : styles.badgeStatusLocked,
                      ]}
                    >
                      {isUnlocked ? 'کسب شده ✅' : 'قفل 🔒'}
                    </Text>
                  </View>

                  <View style={styles.badgeInfo}>
                    <Text style={styles.badgeTitle}>{badge.title}</Text>
                    <Text style={styles.badgeDesc}>{badge.desc}</Text>
                  </View>

                  <View style={styles.badgeIconWrapper}>
                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.doneButtonText}>متوجه شدم</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  scrollList: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  badgeRowUnlocked: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  badgeRowLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.65,
  },
  badgeStatus: {
    marginRight: 8,
  },
  badgeStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeStatusUnlocked: {
    color: '#16A34A',
  },
  badgeStatusLocked: {
    color: '#94A3B8',
  },
  badgeInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  badgeDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  badgeIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeIcon: {
    fontSize: 20,
  },
  doneButton: {
    backgroundColor: '#2D9CFF',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
