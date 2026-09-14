import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { formatNumber, formatGlasses } from './strings';

export function CelebrationModal({ visible, goalGlasses, streakDays, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.cardContainer}>
          {/* Top celebratory emojis */}
          <Text style={styles.topEmojis}>🎉 ✨ 💧 ✨ 🎊</Text>

          {/* Celebrate Mascot Image */}
          <View style={styles.mascotWrapper}>
            <Image
              source={require('../src/assets/images/noosh_mascot_celebrate_1788352221766.png')}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.celebrationTitle}>هدف امروز کامل شد!</Text>
          <Text style={styles.celebrationSubtitle}>
            تبریک! تو با موفقیت {formatGlasses(goalGlasses)} آب نوشیدی و به بدنت نشاط و زندگی هدیه دادی.
          </Text>

          {/* Streak Badge */}
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>
              زنجیره پیوستگی: {formatNumber(streakDays)} روز متوالی!
            </Text>
          </View>

          {/* Continue button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>ادامه دادن به شادابی 🌊</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },
  topEmojis: {
    fontSize: 20,
    marginBottom: 10,
    letterSpacing: 4,
  },
  mascotWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mascotImage: {
    width: 90,
    height: 90,
  },
  celebrationTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  celebrationSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    writingDirection: 'rtl',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 20,
    gap: 6,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
    writingDirection: 'rtl',
  },
  continueButton: {
    backgroundColor: '#10B981',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
