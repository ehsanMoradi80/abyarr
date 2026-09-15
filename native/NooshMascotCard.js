import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Droplet, Heart, Sparkles } from 'lucide-react-native';
import { MASCOT_EXPRESSIONS, getMascotMessage } from './mascot';

const MASCOT_IMAGES = {
  happy: require('../src/assets/images/noosh_mascot_happy_1788352192771.png'),
  miss_you: require('../src/assets/images/noosh_mascot_missyou_1788352208455.png'),
  celebrate: require('../src/assets/images/noosh_mascot_celebrate_1788352221766.png'),
  sad: require('../src/assets/images/noosh_mascot_sad_1788352236506.png'),
};

const EXPRESSIONS_LIST = [
  { key: 'happy', label: 'شاداب' },
  { key: 'miss_you', label: 'دلتنگ' },
  { key: 'celebrate', label: 'جشن' },
  { key: 'sad', label: 'کم‌آب' },
];

export function NooshMascotCard({
  todayGlasses = 0,
  goalGlasses = 8,
  lastDrinkTimestamp = 0,
  userName = '',
}) {
  const [manualExpression, setManualExpression] = useState(null);

  // Compute dynamic mascot state based on hydration status
  const now = Date.now();
  const hoursSinceLastDrink = lastDrinkTimestamp > 0
    ? (now - lastDrinkTimestamp) / (1000 * 60 * 60)
    : (todayGlasses === 0 ? 3 : 1);

  const autoMessage = getMascotMessage(todayGlasses, goalGlasses, hoursSinceLastDrink);
  const currentExpression = manualExpression || autoMessage.type || 'happy';

  // Override message if user manually taps an expression tab
  const displayMessage = manualExpression
    ? (manualExpression === 'miss_you'
        ? {
            badge: 'دلتنگ آب',
            title: 'یک جرعه سلامتی...',
            quote: 'دلتنگتم! سلول‌های بدنتان اکنون به آب گوارا نیاز دارند.',
            color: '#0284C7',
            bg: '#E0F2FE',
          }
        : manualExpression === 'celebrate'
        ? {
            badge: 'قهرمان آب',
            title: 'فوق‌العاده‌اید!',
            quote: 'به هدف امروزتان رسیدید! بدنتان اکنون کاملاً شاداب و سرزنده‌ است.',
            color: '#10B981',
            bg: '#ECFDF5',
          }
        : manualExpression === 'sad'
        ? {
            badge: 'هشدار کم‌آبی',
            title: 'تشنه‌ام...',
            quote: 'خیلی وقته آب ننوشیدی! بدنت نیاز به انرژی و رطوبت داره.',
            color: '#EF4444',
            bg: '#FEF2F2',
          }
        : {
            badge: 'همراه شاداب شما',
            title: userName ? `سلام ${userName}!` : 'سلام دوست من!',
            quote: 'نوشیدن آب، قشنگ‌ترین یادآوری عشق به خودتان است.',
            color: '#2D9CFF',
            bg: '#E6F4FF',
          })
    : autoMessage;

  const currentImage = MASCOT_IMAGES[currentExpression] || MASCOT_IMAGES.happy;

  return (
    <View style={styles.cardContainer}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleSection}>
          <Text style={styles.cardTitle}>کاراکتر نوش</Text>
          <View style={[styles.badge, { backgroundColor: displayMessage.bg }]}>
            <Text style={[styles.badgeText, { color: displayMessage.color }]}>
              {displayMessage.badge}
            </Text>
          </View>
        </View>

        {/* State selector pills */}
        <View style={styles.tabsRow}>
          {EXPRESSIONS_LIST.map((item) => {
            const isActive = currentExpression === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setManualExpression(manualExpression === item.key ? null : item.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Main Mascot & Speech Row */}
      <View style={styles.contentRow}>
        {/* Mascot Image (Properly transparent PNG, no white box) */}
        <View style={styles.imageContainer}>
          <Image
            source={currentImage}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Mascot Speech Bubble */}
        <View style={styles.speechContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechTitle}>{displayMessage.title}</Text>
            <Text style={styles.speechQuote}>« {displayMessage.quote} »</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    writingDirection: 'rtl',
  },
  tabsRow: {
    flexDirection: 'row-reverse',
    gap: 4,
  },
  tabChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  tabChipActive: {
    backgroundColor: '#E6F4FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  tabChipText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabChipTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  contentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  imageContainer: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  mascotImage: {
    width: 72,
    height: 72,
    backgroundColor: 'transparent',
  },
  speechContainer: {
    flex: 1,
  },
  speechBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'flex-end',
  },
  speechTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
    writingDirection: 'rtl',
  },
  speechQuote: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
