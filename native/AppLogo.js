import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Mask, G } from 'react-native-svg';

export function AppLogo({ size = 32, showHeart = true }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
      >
        <Defs>
          {/* Droplet Outline Gradient */}
          <LinearGradient id="dropletGradNative" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#56B7FF" />
            <Stop offset="45%" stopColor="#2D9CFF" />
            <Stop offset="100%" stopColor="#1E70E8" />
          </LinearGradient>

          {/* Water Fill Wave Gradient */}
          <LinearGradient id="waterWaveGradNative" x1="30" y1="60" x2="80" y2="105" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#8ED3FF" />
            <Stop offset="50%" stopColor="#56B7FF" />
            <Stop offset="100%" stopColor="#2D9CFF" />
          </LinearGradient>

          {/* Heart Gradient */}
          <LinearGradient id="heartGradNative" x1="90" y1="20" x2="115" y2="45" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#56B7FF" />
            <Stop offset="100%" stopColor="#2D9CFF" />
          </LinearGradient>

          {/* Droplet Mask */}
          <Mask id="dropletMaskNative">
            <Path
              d="M55 12 C55 12 20 52 20 78 C20 97.3 35.7 113 55 113 C74.3 113 90 97.3 90 78 C90 52 55 12 55 12 Z"
              fill="#FFFFFF"
            />
          </Mask>
        </Defs>

        {/* Droplet Outer Contour */}
        <Path
          d="M55 12 C55 12 18 52 18 78 C18 98.4 34.6 115 55 115 C75.4 115 92 98.4 92 78 C92 52 55 12 55 12 Z"
          fill="none"
          stroke="url(#dropletGradNative)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Droplet Background Glass Fill */}
        <Path
          d="M55 14 C55 14 20 53 20 78 C20 96 35 111 55 111 C75 111 90 96 90 78 C90 53 55 14 55 14 Z"
          fill="#E6F4FF"
          opacity={0.6}
        />

        {/* Water Inside with Wave */}
        <G mask="url(#dropletMaskNative)">
          <Path
            d="M15 68 C28 61 42 75 58 72 C74 69 85 61 95 65 L95 120 L15 120 Z"
            fill="url(#waterWaveGradNative)"
          />
          {/* Light Reflection Highlight */}
          <Path
            d="M27 78 C27 88 33 98 42 103"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeOpacity={0.75}
          />
        </G>

        {/* Companion Heart */}
        {showHeart && (
          <Path
            d="M103.5 24 C100 20.5 94.5 20.5 91 24 C87.5 20.5 82 20.5 78.5 24 C75 27.5 75 33 78.5 36.5 L91 49 L103.5 36.5 C107 33 107 27.5 103.5 24 Z"
            fill="url(#heartGradNative)"
            transform="scale(0.8) translate(22, 0)"
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
