import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import { AppLogo } from './AppLogo';

const { width } = Dimensions.get('window');

export function SplashScreen({ onStart, onFinish, autoTransitionMs = 1800 }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleFinish = onFinish || onStart;

  useEffect(() => {
    // 1. Smooth Fade & Scale in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Gentle organic breathing pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 3. Auto-transition smoothly after timer (no strange landing screen with buttons)
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        if (handleFinish) handleFinish();
      });
    }, autoTransitionMs);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, [autoTransitionMs, handleFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Ambient background glow */}
      <View style={styles.ambientTopGlow} />
      <View style={styles.ambientBottomGlow} />

      {/* Center Branded Logo & Identity */}
      <Animated.View
        style={[
          styles.centerSection,
          {
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoHalo} />
          <AppLogo size={110} showHeart={true} />
        </View>

        <Text style={styles.appName}>نوش</Text>
        <Text style={styles.tagline}>نوشیدن آب، یادآوری عشق به خودت</Text>
      </Animated.View>

      {/* Minimal clean footer */}
      <View style={styles.footerSection}>
        <View style={styles.dotIndicator}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientTopGlow: {
    position: 'absolute',
    top: -100,
    width: width * 1.3,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#D0EBFF',
    opacity: 0.6,
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: -120,
    width: width * 1.3,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#8ED3FF',
    opacity: 0.35,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logoHalo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#2D9CFF',
    opacity: 0.14,
  },
  appName: {
    fontSize: 44,
    fontWeight: '900',
    color: '#0066CC',
    letterSpacing: -1,
    marginTop: 4,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 8,
    textAlign: 'center',
  },
  footerSection: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  dotIndicator: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BAE6FD',
  },
  dotActive: {
    backgroundColor: '#2D9CFF',
    width: 18,
  },
});
