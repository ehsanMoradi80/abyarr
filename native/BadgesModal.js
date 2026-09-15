import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Trophy, Droplet, Target, Flame, Sparkles, CheckCircle2, Lock, X } from 'lucide-react-native';
import { BADGES } from './badges';

function RenderBadgeIcon({ name, color, isUnlocked }) {
  const iconColor = isUnlocked ? color : '#94A3B8';
  switch (name) {
    case 'Droplet':
      return <Droplet size={20} color={iconColor} fill={isUnlocked ? iconColor : 'none'} strokeWidth={2} />;
    case 'Target':
      return <Target size={20} color={iconColor} strokeWidth={2.2} />;
    case 'Flame':
      return <Flame size={20} color={iconColor} fill={isUnlocked ? iconColor : 'none'} strokeWidth={2.2} />;
    case 'Sparkles':
      return <Sparkles size={20} color={iconColor} strokeWidth={2.2} />;
    case 'Trophy':
    default:
      return <Trophy size={20} color={iconColor} fill={isUnlocked ? '#FEF08A' : 'none'} strokeWidth={2.2} />;
  }
}

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
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color="#64748B" strokeWidth={2.4} />
            </TouchableOpacity>
            <View style={styles.headerTitleWrapper}>
              <Trophy size={18} color="#EAB308" strokeWidth={2.2} />
              <Text style={styles.titleText}>دستاوردها و نشان‌ها</Text>
            </View>
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
                    {isUnlocked ? (
                      <View style={styles.statusPillUnlocked}>
                        <CheckCircle2 size={12} color="#16A34A" strokeWidth={2.5} />
                        <Text style={styles.statusTextUnlocked}>کسب شده</Text>
                      </View>
                    ) : (
                      <View style={styles.statusPillLocked}>
                        <Lock size={11} color="#94A3B8" strokeWidth={2.2} />
                        <Text style={styles.statusTextLocked}>قفل</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.badgeInfo}>
                    <Text style={styles.badgeTitle}>{badge.title}</Text>
                    <Text style={styles.badgeDesc}>{badge.desc}</Text>
                  </View>

                  <View
                    style={[
                      styles.badgeIconWrapper,
                      isUnlocked && styles.badgeIconWrapperUnlocked,
                    ]}
                  >
                    <RenderBadgeIcon
                      name={badge.iconName}
                      color={badge.iconColor}
                      isUnlocked={isUnlocked}
                    />
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.doneButtonText}>بستن</Text>
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
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 16,
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
  statusPillUnlocked: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusTextUnlocked: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16A34A',
  },
  statusPillLocked: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusTextLocked: {
    fontSize: 10.5,
    fontWeight: '600',
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
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  badgeIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeIconWrapperUnlocked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BBF7D0',
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
