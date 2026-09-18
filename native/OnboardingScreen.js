import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ArrowLeft, ArrowRight, Check, Droplets, User, Activity, Bell, Sparkles } from 'lucide-react-native';
import { AppLogo } from './AppLogo';

const { width } = Dimensions.get('window');

export function OnboardingScreen({ onFinish }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('70');
  const [activityLevel, setActivityLevel] = useState('moderate'); // 'low' | 'moderate' | 'high'
  const [intervalMinutes, setIntervalMinutes] = useState(60);

  // Calculate recommended water intake in glasses
  const calculateGoalGlasses = () => {
    const w = parseFloat(weight) || 70;
    let ml = w * 35; // baseline 35ml per kg
    if (activityLevel === 'moderate') ml += 350;
    if (activityLevel === 'high') ml += 750;
    const glasses = Math.round(ml / 250);
    return Math.max(4, Math.min(20, glasses));
  };

  const calculatedGoal = calculateGoalGlasses();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onFinish({
        name: name.trim() || 'دوست خوبم',
        goalGlasses: calculatedGoal,
        reminderIntervalMinutes: intervalMinutes,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header & Progress Dots */}
      <View style={styles.topBar}>
        <View style={styles.dotsContainer}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.dot,
                step === s && styles.dotActive,
                step > s && styles.dotCompleted,
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepTitle}>گام {step} از ۳</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Name & Welcome */}
        {step === 1 && (
          <View style={styles.stepCard}>
            <View style={styles.iconCircle}>
              <User size={32} color="#2D9CFF" strokeWidth={2.4} />
            </View>
            <Text style={styles.heading}>خوش آمدید به نوش!</Text>
            <Text style={styles.subheading}>
              دوست داری در طول روز تو رو به چه اسمی صدا بزنیم؟
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="مثلاً: علی، سارا..."
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
                textAlign="right"
              />
            </View>

            <View style={styles.tipBox}>
              <Sparkles size={16} color="#0284C7" />
              <Text style={styles.tipText}>
                یادآورهای صوتی و پیام‌های انگیزشی با اسم شما پخش خواهند شد.
              </Text>
            </View>
          </View>
        )}

        {/* Step 2: Weight & Activity */}
        {step === 2 && (
          <View style={styles.stepCard}>
            <View style={styles.iconCircle}>
              <Activity size={32} color="#10B981" strokeWidth={2.4} />
            </View>
            <Text style={styles.heading}>محاسبه خودکار نیاز بدن</Text>
            <Text style={styles.subheading}>
              با وارد کردن وزن و سطح تحرک، بهترین میزان آب برای سلامت شما تعیین می‌شود:
            </Text>

            <View style={styles.weightRow}>
              <Text style={styles.weightLabel}>وزن تقریبی (کیلوگرم):</Text>
              <TextInput
                style={styles.weightInput}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                textAlign="center"
              />
            </View>

            <Text style={styles.activityTitle}>سطح فعالیت روزانه:</Text>
            <View style={styles.activityGrid}>
              {[
                { id: 'low', label: 'کم (پشت‌میزنشین)', bonus: '۰+' },
                { id: 'moderate', label: 'متوسط (پیاده‌روی)', bonus: '۱+ لیوان' },
                { id: 'high', label: 'بالا (ورزش سنگین)', bonus: '۳+ لیوان' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.activityBtn,
                    activityLevel === item.id && styles.activityBtnActive,
                  ]}
                  onPress={() => setActivityLevel(item.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.activityBtnText,
                      activityLevel === item.id && styles.activityBtnTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.activityBadge}>{item.bonus}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.calculatedResult}>
              <Droplets size={22} color="#0284C7" />
              <View style={styles.calculatedTextCol}>
                <Text style={styles.calculatedGoalNumber}>
                  {calculatedGoal} لیوان در روز ({calculatedGoal * 250} میلی‌لیتر)
                </Text>
                <Text style={styles.calculatedDesc}>
                  پیشنهاد اختصاصی هوشمند برای وزن {weight} کیلوگرم
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Reminders */}
        {step === 3 && (
          <View style={styles.stepCard}>
            <View style={styles.iconCircle}>
              <Bell size={32} color="#F59E0B" strokeWidth={2.4} />
            </View>
            <Text style={styles.heading}>تنظیم فواصل یادآوری</Text>
            <Text style={styles.subheading}>
              ترجیح می‌دهید اعلان‌های نوشیدن هر چند دقیقه برایتان ارسال شود؟
            </Text>

            <View style={styles.intervalsGrid}>
              {[
                { val: 45, label: 'هر ۴۵ دقیقه', desc: 'برای روزهای پرمشغله' },
                { val: 60, label: 'هر ۶۰ دقیقه', desc: 'پیشنهاد استاندارد' },
                { val: 90, label: 'هر ۹۰ دقیقه', desc: 'آرام و ملایم' },
                { val: 120, label: 'هر ۲ ساعت', desc: 'فواصل طولانی' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.val}
                  style={[
                    styles.intervalCard,
                    intervalMinutes === item.val && styles.intervalCardActive,
                  ]}
                  onPress={() => setIntervalMinutes(item.val)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.intervalLabel,
                      intervalMinutes === item.val && styles.intervalLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.intervalDesc}>{item.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tipBox}>
              <Check size={16} color="#10B981" />
              <Text style={styles.tipText}>
                می‌توانید بعداً ساعات سکوت شبانه را از بخش تنظیمات فعال کنید.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav Controls */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {step === 3 ? 'شروع و ورود به برنامه' : 'مرحله بعدی'}
          </Text>
          <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>

        {step > 1 && (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ArrowRight size={18} color="#64748B" strokeWidth={2} />
            <Text style={styles.secondaryBtnText}>قبلی</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FA',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#2D9CFF',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 18,
  },
  textInput: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  weightRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  weightLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  weightInput: {
    width: 70,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2D9CFF',
    fontSize: 16,
    fontWeight: '800',
    color: '#0066CC',
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    width: '100%',
    textAlign: 'right',
    marginBottom: 8,
  },
  activityGrid: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  activityBtn: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityBtnActive: {
    backgroundColor: '#EBF5FF',
    borderColor: '#2D9CFF',
  },
  activityBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activityBtnTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  activityBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  calculatedResult: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E0F2FE',
    borderRadius: 18,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  calculatedTextCol: {
    alignItems: 'flex-end',
    flex: 1,
  },
  calculatedGoalNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0369A1',
  },
  calculatedDesc: {
    fontSize: 11,
    color: '#0284C7',
    marginTop: 2,
  },
  intervalsGrid: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  intervalCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'flex-end',
  },
  intervalCardActive: {
    backgroundColor: '#EBF5FF',
    borderColor: '#2D9CFF',
  },
  intervalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  intervalLabelActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  intervalDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tipBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    width: '100%',
  },
  tipText: {
    fontSize: 11.5,
    color: '#64748B',
    flex: 1,
    lineHeight: 18,
    textAlign: 'right',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 36 : 32,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    backgroundColor: '#2D9CFF',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
});
