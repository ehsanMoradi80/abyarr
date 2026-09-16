import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { getMascotMessage } from './mascot';

const MASCOT_IMAGES = {
  happy: require('../src/assets/images/noosh_mascot_happy_1788352192771.png'),
  miss_you: require('../src/assets/images/noosh_mascot_missyou_1788352208455.png'),
  celebrate: require('../src/assets/images/noosh_mascot_celebrate_1788352221766.png'),
  sad: require('../src/assets/images/noosh_mascot_sad_1788352236506.png'),
};

export function NooshMascotCard({
  todayGlasses = 0,
  goalGlasses = 8,
  lastDrinkTimestamp = 0,
}) {
  // Compute dynamic mascot state based on actual hydration status
  const now = Date.now();
  const currentHour = new Date().getHours();
  const hoursSinceLastDrink = lastDrinkTimestamp > 0
    ? (now - lastDrinkTimestamp) / (1000 * 60 * 60)
    : (currentHour >= 8 ? currentHour - 8 : 0);

  const autoMessage = getMascotMessage(todayGlasses, goalGlasses, hoursSinceLastDrink);
  const currentExpression = autoMessage.type || 'happy';
  const currentImage = MASCOT_IMAGES[currentExpression] || MASCOT_IMAGES.happy;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={currentImage}
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 92,
    height: 92,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  mascotImage: {
    width: 92,
    height: 92,
    backgroundColor: 'transparent',
  },
});

