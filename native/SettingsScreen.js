import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Settings, Check, RotateCcw, Save } from 'lucide-react-native';
import { AppLogo } from './AppLogo';
import { formatNumber, formatGlasses } from './strings';

const GOAL_OPTIONS = [6, 8, 10, 12];
const INTERVAL_OPTIONS = [30, 60, 90, 120];

export function SettingsScreen({
  name = '',
  goalGlasses = 8,
  reminderEnabled = true,
  reminderIntervalMinutes = 60,
  onSaveSettings,
  onResetToday,
}) {
  const [userName, setUserName] = useState(name);
  const [selectedGoal, setSelectedGoal] = useState(goalGlasses);
  const [isReminderOn, setIsReminderOn] = useState(reminderEnabled);
  const [selectedInterval, setSelectedInterval] = useState(reminderIntervalMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSaveSettings({
      name: userName.trim() || 'دوست من',
      goalGlasses: selectedGoal,
      reminderEnabled: isReminderOn,
      reminderIntervalMinutes: selectedInterval,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetPress = () => {
    Alert.alert(
      'صفر کردن مصرف امروز',
      'آیا مطمئن هستید که می‌خواهید آمار مصرف آب امروز را صفر کنید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'بله، صفر شود', style: 'destructive', onPress: onResetToday },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerTitleWrapper}>
          <Settings size={17} color="#2D9CFF" strokeWidth={2.2} />
          <Text style={styles.headerTitleText}>تنظیمات و مشخصات</Text>
        </View>
      </View>

      {/* 1. App Profile Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>مشخصات کاربر</Text>

        <Text style={styles.inputLabel}>نام شما (برای نمایش در پیام‌ها):</Text>
        <TextInput
          style={styles.textInput}
          value={userName}
          onChangeText={setUserName}
          placeholder="مثلاً: آرش، مریم..."
          placeholderTextColor="#94A3B8"
          textAlign="right"
        />
      </View>

      {/* 2. Daily Goal Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>هدف روزانه مصرف آب</Text>
        <Text style={styles.inputLabel}>چند لیوان آب در روز می‌خواهید بنوشید؟</Text>

        <View style={styles.optionsRow}>
          {GOAL_OPTIONS.map((g) => {
            const isSelected = selectedGoal === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                onPress={() => setSelectedGoal(g)}
                activeOpacity={0.75}
              >
                <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                  {formatGlasses(g)}
                </Text>
                <Text style={[styles.optionPillSub, isSelected && styles.optionPillSubSelected]}>
                  {formatNumber(g * 250)} ml
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Reminders Card */}
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Switch
            value={isReminderOn}
            onValueChange={setIsReminderOn}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={isReminderOn ? '#2D9CFF' : '#F8FAFC'}
          />
          <View style={styles.switchLabelWrapper}>
            <Text style={styles.switchTitle}>یادآور هوشمند نوشیدن آب</Text>
            <Text style={styles.switchSubtitle}>ارسال اعلان‌های دوره‌ای برای نوشیدن آب</Text>
          </View>
        </View>

        {isReminderOn && (
          <View style={styles.intervalSection}>
            <Text style={styles.inputLabel}>فاصله زمانی یادآوری:</Text>
            <View style={styles.optionsRow}>
              {INTERVAL_OPTIONS.map((m) => {
                const isSelected = selectedInterval === m;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                    onPress={() => setSelectedInterval(m)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                      هر {formatNumber(m)} دقیقه
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* 4. Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, savedSuccess && styles.saveButtonSuccess]}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          {savedSuccess ? (
            <Check size={16} color="#FFFFFF" strokeWidth={3} />
          ) : (
            <Save size={16} color="#FFFFFF" strokeWidth={2.4} />
          )}
          <Text style={styles.saveButtonText}>
            {savedSuccess ? 'با موفقیت ذخیره شد' : 'ذخیره تغییرات'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 5. Reset Today's Water Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetPress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <RotateCcw size={15} color="#DC2626" strokeWidth={2.4} />
          <Text style={styles.resetButtonText}>صفر کردن مصرف امروز</Text>
        </View>
      </TouchableOpacity>

      {/* 6. App Branding Footer */}
      <View style={styles.footerBrandCard}>
        <View style={styles.footerLogoWrapper}>
          <AppLogo size={32} showHeart={true} />
        </View>
        <Text style={styles.footerAppName}>نوش | Noosh</Text>
        <Text style={styles.footerTagline}>نوشیدن آب، یادآوری عشق به خودت</Text>
        <Text style={styles.footerVersion}>نسخه ۱.۰.۰ • React Native بومی</Text>
      </View>

      {/* Safe bottom spacer */}
      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  headerTitleWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputLabel: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'right',
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#1E293B',
    textAlign: 'right',
  },
  optionsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  optionPill: {
    flexBasis: '22%',
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  optionPillSelected: {
    backgroundColor: '#E6F4FF',
    borderColor: '#2D9CFF',
  },
  optionPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  optionPillTextSelected: {
    color: '#0066CC',
    fontWeight: '800',
  },
  optionPillSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  optionPillSubSelected: {
    color: '#0284C7',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabelWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  switchTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    writingDirection: 'rtl',
  },
  switchSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  intervalSection: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: '#2D9CFF',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  saveButtonSuccess: {
    backgroundColor: '#10B981',
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  resetButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    paddingVertical: 11,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '700',
  },
  footerBrandCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerLogoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  footerAppName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  footerTagline: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  footerVersion: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 5,
  },
});
