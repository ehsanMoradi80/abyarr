import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Trophy, Sparkles, Flame, Check } from 'lucide-react-native';
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
          {/* Top Decorative Vector Icon */}
          <View style={styles.trophyWrapper}>
            <View style={styles.trophyBackdrop}>
              <Trophy size={46} color="#EAB308" strokeWidth={2.2} fill="#FEF08A" />
            </View>
            <View style={styles.sparkleFloating}>
              <Sparkles size={16} color="#2D9CFF" />
            </View>
          </View>

          <Text style={styles.celebrationTitle}>هدف امروز کامل شد!</Text>
          <Text style={styles.celebrationSubtitle}>
            تبریک! شما با موفقیت {formatGlasses(goalGlasses)} آب نوشیدید و به بدنتان نشاط و سلامتی هدیه دادید.
          </Text>

          {/* Streak Badge */}
          <View style={styles.streakBadge}>
            <Flame size={18} color="#EA580C" strokeWidth={2.4} fill="#EA580C" />
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
            <View style={styles.continueButtonContent}>
              <Check size={16} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.continueButtonText}>ادامه دادن به شادابی</Text>
            </View>
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
  trophyWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  trophyBackdrop: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEF08A',
  },
  sparkleFloating: {
    position: 'absolute',
    top: 0,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  celebrationTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    writingDirection: 'rtl',
  },
  celebrationSubtitle: {
    fontSize: 12.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    writingDirection: 'rtl',
  },
  streakBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    marginBottom: 20,
    gap: 6,
  },
  streakText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#9A3412',
    writingDirection: 'rtl',
  },
  continueButton: {
    backgroundColor: '#10B981',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  continueButtonContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
