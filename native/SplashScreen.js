import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { AppLogo } from './AppLogo';

const { width } = Dimensions.get('window');

export function SplashScreen({ onStart, onSkip }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const dropAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Smooth entry sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating water drop bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dropAnim, {
          toValue: 8,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(dropAnim, {
          toValue: -8,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Ambient background blur blobs */}
      <View style={styles.ambientTopGlow} />
      <View style={styles.ambientBottomGlow} />

      {/* Center Hero & Mascot Section */}
      <Animated.View
        style={[
          styles.centerSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ translateY: dropAnim }] },
          ]}
        >
          <View style={styles.logoHalo} />
          <AppLogo size={100} showHeart={true} />
        </Animated.View>

        <Text style={styles.appName}>نوش</Text>
        <Text style={styles.tagline}>نوشیدن آب، یادآوری عشق به خودت</Text>

        <View style={styles.quotePill}>
          <Sparkles size={14} color="#2D9CFF" />
          <Text style={styles.quoteText}>هر قطره، یک قدم به سلامتی و شادابی</Text>
        </View>
      </Animated.View>

      {/* Bottom Launch Button */}
      <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={onStart}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>شروع نوشیدن آب</Text>
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>

        {onSkip && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipBtnText}>ورود به برنامه</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  ambientTopGlow: {
    position: 'absolute',
    top: -80,
    width: width * 1.2,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#D0EBFF',
    opacity: 0.7,
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: -100,
    width: width * 1.2,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#8ED3FF',
    opacity: 0.4,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  logoHalo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#2D9CFF',
    opacity: 0.15,
  },
  appName: {
    fontSize: 46,
    fontWeight: '900',
    color: '#0066CC',
    letterSpacing: -1,
    marginTop: 8,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 6,
    textAlign: 'center',
  },
  quotePill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  quoteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  bottomSection: {
    width: '100%',
    gap: 10,
    marginBottom: 10,
  },
  startBtn: {
    width: '100%',
    height: 54,
    borderRadius: 20,
    backgroundColor: '#2D9CFF',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  skipBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
});
