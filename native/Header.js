import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Trophy, Users, Cloud, Smartphone, Settings } from 'lucide-react-native';
import { AppLogo } from './AppLogo';

export function Header({
  title = 'سلام!',
  subtitle = 'نوشیدن آب، یادآوری عشق به خودت',
  onOpenRewards,
  onOpenPartner,
  onOpenCloud,
  onOpenWidgets,
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
          <Text style={styles.titleText}>{title}</Text>
          {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        {onOpenWidgets && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenWidgets}
            activeOpacity={0.7}
          >
            <Smartphone size={17} color="#2D9CFF" strokeWidth={2.2} />
          </TouchableOpacity>
        )}

        {onOpenRewards && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenRewards}
            activeOpacity={0.7}
          >
            <Trophy size={17} color="#F59E0B" strokeWidth={2.2} />
          </TouchableOpacity>
        )}

        {onOpenPartner && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenPartner}
            activeOpacity={0.7}
          >
            <Users size={17} color="#10B981" strokeWidth={2.2} />
          </TouchableOpacity>
        )}

        {onOpenCloud && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenCloud}
            activeOpacity={0.7}
          >
            <Cloud size={17} color="#0284C7" strokeWidth={2.2} />
          </TouchableOpacity>
        )}

        {onOpenSettings && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenSettings}
            activeOpacity={0.7}
          >
            <Settings size={17} color="#64748B" strokeWidth={2.2} />
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
    paddingBottom: 12,
    backgroundColor: '#F2F6FA',
  },
  brandSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    flex: 1,
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
    justifyContent: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  subtitleText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
});
