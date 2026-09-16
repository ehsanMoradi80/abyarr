import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Settings, Cloud } from 'lucide-react-native';
import { AppLogo } from './AppLogo';

export function Header({
  title = 'سلام!',
  subtitle = 'نوشیدن آب، یادآوری عشق به خودت',
  onOpenCloud,
  onOpenSettings,
}) {
  return (
    <View style={styles.headerContainer}>
      {/* Brand & Greeting Section */}
      <View style={styles.brandSection}>
        <View style={styles.logoWrapper}>
          <AppLogo size={32} showHeart={true} />
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleText} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>

      {/* Action Buttons - Clean and uncrowded */}
      <View style={styles.actionsSection}>
        {onOpenCloud && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenCloud}
            activeOpacity={0.7}
            accessibilityLabel="پشتیبان ابری"
          >
            <Cloud size={18} color="#0284C7" strokeWidth={2.2} />
          </TouchableOpacity>
        )}

        {onOpenSettings && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenSettings}
            activeOpacity={0.7}
            accessibilityLabel="تنظیمات"
          >
            <Settings size={18} color="#64748B" strokeWidth={2.2} />
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
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F2F6FA',
  },
  brandSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    overflow: 'hidden',
  },
  logoWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  titleWrapper: {
    alignItems: 'flex-end',
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'right',
  },
  subtitleText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
    textAlign: 'right',
  },
  actionsSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
