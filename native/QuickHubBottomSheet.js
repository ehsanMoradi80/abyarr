import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import {
  Droplets,
  Coffee,
  CupSoda,
  Milk,
  Apple,
  Zap,
  Calculator,
  Volume2,
  VolumeX,
  Vibrate,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Sliders,
} from 'lucide-react-native';
import { formatNumber } from './strings';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.86;

export const BEVERAGE_TYPES = [
  { id: 'water', name: 'آب خالص', icon: Droplets, color: '#2D9CFF', factor: 1.0 },
  { id: 'tea', name: 'چای', icon: CupSoda, color: '#D97706', factor: 0.9 },
  { id: 'coffee', name: 'قهوه', icon: Coffee, color: '#854D0E', factor: 0.8 },
  { id: 'herbal', name: 'دمنوش', icon: Sparkles, color: '#059669', factor: 0.95 },
  { id: 'juice', name: 'آبمیوه', icon: Apple, color: '#DC2626', factor: 0.85 },
  { id: 'milk', name: 'شیر', icon: Milk, color: '#0284C7', factor: 0.9 },
  { id: 'electrolyte', name: 'الکترولیت', icon: Zap, color: '#7C3AED', factor: 1.0 },
];

export const QUICK_VOLUMES = [
  { ml: 100, label: '۱۰۰ استکان', glasses: 0.4 },
  { ml: 150, label: '۱۵۰ فنجان', glasses: 0.6 },
  { ml: 250, label: '۲۵۰ لیوان', glasses: 1.0 },
  { ml: 330, label: '۳۳۰ قوطی', glasses: 1.3 },
  { ml: 500, label: '۵۰۰ بطری', glasses: 2.0 },
  { ml: 750, label: '۷۵۰ شیکر', glasses: 3.0 },
  { ml: 1000, label: '۱۰۰۰ پارچ', glasses: 4.0 },
];

export function QuickHubBottomSheet({
  visible,
  onClose,
  onAddBeverage,
  currentGoalGlasses = 8,
  onUpdateGoal,
  onOpenCustomAmount,
  soundEnabled = true,
  onToggleSound,
}) {
  const [selectedBev, setSelectedBev] = useState(BEVERAGE_TYPES[0]);
  const [activeTab, setActiveTab] = useState('drinks'); // 'drinks' | 'calculator' | 'settings'

  // Hydration calculator state
  const [weightKg, setWeightKg] = useState('70');
  const [activityLevel, setActivityLevel] = useState('moderate'); // sedentary, moderate, active, intense
  const [calculatedGoal, setCalculatedGoal] = useState(null);

  // Drag-to-close gesture implementation
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward drags
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Drag down threshold to close (120px or rapid velocity)
        if (gestureState.dy > 120 || gestureState.vy > 0.8) {
          Animated.timing(panY, {
            toValue: SHEET_MAX_HEIGHT,
            duration: 220,
            useNativeDriver: true,
          }).start(() => {
            panY.setValue(0);
            onClose();
          });
        } else {
          // Snap back up
          Animated.spring(panY, {
            toValue: 0,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  // Handle Quick Add Drink
  const handleSelectVolume = (vol) => {
    const effectiveMl = Math.round(vol.ml * selectedBev.factor);
    const effectiveGlasses = Number((vol.glasses * selectedBev.factor).toFixed(1));

    if (onAddBeverage) {
      onAddBeverage({
        beverage: selectedBev.name,
        beverageId: selectedBev.id,
        amountMl: effectiveMl,
        rawMl: vol.ml,
        amountGlasses: effectiveGlasses,
      });
    }

    // Animate down and close
    Animated.timing(panY, {
      toValue: SHEET_MAX_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      panY.setValue(0);
      onClose();
    });
  };

  // Calculate Water Goal
  const handleCalculateGoal = () => {
    const w = parseFloat(weightKg) || 70;
    let baseMl = w * 33; // 33ml per kg
    if (activityLevel === 'moderate') baseMl += 400;
    if (activityLevel === 'active') baseMl += 800;
    if (activityLevel === 'intense') baseMl += 1200;

    const glasses = Math.round(baseMl / 250);
    setCalculatedGoal({ ml: Math.round(baseMl), glasses });
  };

  const handleApplyCalculatedGoal = () => {
    if (calculatedGoal && onUpdateGoal) {
      onUpdateGoal(calculatedGoal.glasses);
      Alert.alert(
        'هدف به‌روزرسانی شد',
        `هدف روزانه شما با موفقیت روی ${formatNumber(calculatedGoal.glasses)} لیوان (${formatNumber(calculatedGoal.ml)} میلی‌لیتر) تنظیم شد.`
      );
      onClose();
    }
  };

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => {
          Animated.timing(panY, {
            toValue: SHEET_MAX_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            panY.setValue(0);
            onClose();
          });
        }}
      />

      {/* Animated Drag-to-Close Sheet Container */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            transform: [{ translateY: panY }],
          },
        ]}
      >
        {/* Drag Handle Bar (Gesture Zone) - NO close button as requested */}
        <View {...panResponder.panHandlers} style={styles.dragZone}>
          <View style={styles.dragPill} />
          <Text style={styles.dragHint}>برای بستن به پایین بکشید</Text>
        </View>

        {/* Top Header Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'drinks' && styles.tabItemActive]}
            onPress={() => setActiveTab('drinks')}
            activeOpacity={0.7}
          >
            <Droplets size={16} color={activeTab === 'drinks' ? '#2D9CFF' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'drinks' && styles.tabTextActive]}>
              انواع نوشیدنی
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'calculator' && styles.tabItemActive]}
            onPress={() => setActiveTab('calculator')}
            activeOpacity={0.7}
          >
            <Calculator size={16} color={activeTab === 'calculator' ? '#2D9CFF' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'calculator' && styles.tabTextActive]}>
              محاسبه‌گر هیدراتاسیون
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'drinks' && (
            <View>
              {/* Beverage Type Selection Chips */}
              <Text style={styles.sectionHeader}>نوع نوشیدنی را انتخاب کنید:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bevRow}
              >
                {BEVERAGE_TYPES.map((bev) => {
                  const isSelected = selectedBev.id === bev.id;
                  const IconComponent = bev.icon;
                  return (
                    <TouchableOpacity
                      key={bev.id}
                      style={[
                        styles.bevChip,
                        isSelected && { borderColor: bev.color, backgroundColor: '#F0F9FF' },
                      ]}
                      onPress={() => setSelectedBev(bev)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.bevIconCircle, { backgroundColor: bev.color + '20' }]}>
                        <IconComponent size={18} color={bev.color} />
                      </View>
                      <Text style={[styles.bevChipName, isSelected && { color: bev.color, fontWeight: '800' }]}>
                        {bev.name}
                      </Text>
                      <Text style={styles.bevFactorBadge}>
                        {Math.round(bev.factor * 100)}٪ جذب
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Volume Pills */}
              <Text style={[styles.sectionHeader, { marginTop: 18 }]}>
                انتخاب حجم برای «{selectedBev.name}»:
              </Text>
              <View style={styles.volumeGrid}>
                {QUICK_VOLUMES.map((vol) => (
                  <TouchableOpacity
                    key={vol.ml}
                    style={styles.volumeCard}
                    onPress={() => handleSelectVolume(vol)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.volumeCardHeader}>
                      <Droplets size={16} color="#2D9CFF" />
                      <Text style={styles.volumeMlText}>{formatNumber(vol.ml)} ml</Text>
                    </View>
                    <Text style={styles.volumeLabelText}>{vol.label.split(' ')[1] || 'لیوان'}</Text>
                    <Text style={styles.volumeGlassesSub}>
                      معادل {formatNumber(vol.glasses)} لیوان
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* Custom Volume Card */}
                <TouchableOpacity
                  style={[styles.volumeCard, styles.customVolumeCard]}
                  onPress={() => {
                    onClose();
                    if (onOpenCustomAmount) onOpenCustomAmount();
                  }}
                  activeOpacity={0.8}
                >
                  <Sliders size={20} color="#0284C7" />
                  <Text style={styles.customVolumeTitle}>حجم دلخواه</Text>
                  <Text style={styles.customVolumeSubtitle}>ورود میلی‌لیتر دستی</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === 'calculator' && (
            <View style={styles.calcContainer}>
              <View style={styles.calcIntroCard}>
                <Sparkles size={20} color="#2D9CFF" />
                <Text style={styles.calcIntroText}>
                  میزان نیاز روزانه بدن به آب بر اساس وزن، متابولیسم و میزان فعالیت بدنی شما به شکل استاندارد پزشکی محاسبه می‌شود.
                </Text>
              </View>

              {/* Weight input */}
              <Text style={styles.calcInputLabel}>وزن شما (کیلوگرم):</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.calcTextInput}
                  keyboardType="numeric"
                  value={weightKg}
                  onChangeText={setWeightKg}
                  placeholder="مثلاً ۷۰"
                  placeholderTextColor="#94A3B8"
                />
                <Text style={styles.inputSuffix}>kg</Text>
              </View>

              {/* Activity Level Selector */}
              <Text style={[styles.calcInputLabel, { marginTop: 14 }]}>میزان فعالیت روزانه:</Text>
              <View style={styles.activityGrid}>
                {[
                  { id: 'sedentary', label: 'کم‌تحرک', desc: 'کار پشت‌میزی' },
                  { id: 'moderate', label: 'متوسط', desc: 'پیاده‌روی روزانه' },
                  { id: 'active', label: 'ورزشکار', desc: '۱ ساعت ورزش' },
                  { id: 'intense', label: 'پرفشار', desc: 'تمرین سنگین' },
                ].map((act) => {
                  const isActSelected = activityLevel === act.id;
                  return (
                    <TouchableOpacity
                      key={act.id}
                      style={[
                        styles.actCard,
                        isActSelected && styles.actCardActive,
                      ]}
                      onPress={() => setActivityLevel(act.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.actTitle, isActSelected && styles.actTitleActive]}>
                        {act.label}
                      </Text>
                      <Text style={styles.actDesc}>{act.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.calcButton}
                onPress={handleCalculateGoal}
                activeOpacity={0.85}
              >
                <Calculator size={18} color="#FFFFFF" />
                <Text style={styles.calcButtonText}>محاسبه نیاز آبی من</Text>
              </TouchableOpacity>

              {/* Result card */}
              {calculatedGoal && (
                <View style={styles.calcResultCard}>
                  <Text style={styles.resultTitle}>پیشنهاد آب‌یار برای شما:</Text>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultBigGlasses}>
                      {formatNumber(calculatedGoal.glasses)} لیوان
                    </Text>
                    <Text style={styles.resultBigMl}>
                      ({formatNumber(calculatedGoal.ml)} میلی‌لیتر)
                    </Text>
                  </View>
                  <Text style={styles.resultSub}>
                    هدف روزانه فعلی شما {formatNumber(currentGoalGlasses)} لیوان است.
                  </Text>

                  <TouchableOpacity
                    style={styles.applyGoalBtn}
                    onPress={handleApplyCalculatedGoal}
                    activeOpacity={0.85}
                  >
                    <CheckCircle2 size={18} color="#FFFFFF" />
                    <Text style={styles.applyGoalBtnText}>تنظیم به عنوان هدف روزانه من</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SHEET_MAX_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  dragZone: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragPill: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginBottom: 6,
  },
  dragHint: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
  },
  tabItemActive: {
    backgroundColor: '#EBF5FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  sheetScroll: {
    maxHeight: SHEET_MAX_HEIGHT - 120,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'right',
  },
  bevRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingBottom: 4,
  },
  bevChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    minWidth: 84,
  },
  bevIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  bevChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  bevFactorBadge: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  volumeGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  volumeCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customVolumeCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeCardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  volumeMlText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0369A1',
  },
  volumeLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  volumeGlassesSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  customVolumeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
    marginTop: 4,
  },
  customVolumeSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0284C7',
    marginTop: 2,
  },
  calcContainer: {
    paddingTop: 4,
  },
  calcIntroCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  calcIntroText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
    lineHeight: 18,
    textAlign: 'right',
  },
  calcInputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  calcTextInput: {
    flex: 1,
    height: 46,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'right',
  },
  inputSuffix: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activityGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  actCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'flex-end',
  },
  actCardActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#2D9CFF',
  },
  actTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  actTitleActive: {
    color: '#0284C7',
    fontWeight: '800',
  },
  actDesc: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  calcButton: {
    backgroundColor: '#2D9CFF',
    borderRadius: 16,
    height: 48,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  calcButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calcResultCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  resultRow: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 6,
  },
  resultBigGlasses: {
    fontSize: 26,
    fontWeight: '900',
    color: '#059669',
  },
  resultBigMl: {
    fontSize: 15,
    fontWeight: '700',
    color: '#047857',
  },
  resultSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
    marginTop: 4,
  },
  applyGoalBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  applyGoalBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
