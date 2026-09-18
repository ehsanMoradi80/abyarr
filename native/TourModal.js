import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Droplets,
  Flame,
  Smartphone,
  Zap,
  Users,
  Smile,
  Sliders,
  Sparkles,
  Layers,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// 7 Interactive Tour Steps matching the web tour structure
const INTERACTIVE_STEPS = [
  {
    id: 'header',
    targetName: 'نوار وضعیت و همگام‌سازی ابری',
    title: 'سلامت ابری و نشان‌ها',
    desc: 'از این قسمت به وضعیت اتصال ابری (Supabase)، پروفایل شخصی، و مدال‌های افتخار دسترسی داری.',
    icon: Sparkles,
    color: '#0284C7',
    bg: '#E0F2FE',
    targetY: 20,
    targetHeight: 65,
    interactiveHint: 'روی بخش بالا فوکوس شده است',
  },
  {
    id: 'streak',
    targetName: 'زنجیره تداوم روزانه (Streak)',
    title: 'آتش استریک و تداوم',
    desc: 'هر روزی که به هدف نوشیدن آب برسی، آتش استریکت روشن‌تر می‌شه و نشان‌های هفتگی و ماهانه برات باز می‌شن.',
    icon: Flame,
    color: '#F97316',
    bg: '#FFEDD5',
    targetY: 95,
    targetHeight: 50,
    interactiveHint: 'هر روز حداقل ۸ لیوان آب بنوش تا خاموش نشه!',
  },
  {
    id: 'mascot',
    targetName: 'همراه هوشمند «نوش»',
    title: 'واکنش‌های زنده کاراکتر نوش',
    desc: 'کاراکتر نوش نسبت به میزان مصرف آب واکشن نشون می‌ده؛ وقتی آب کم خوردی تشنه‌ست و وقتی هدف رو کامل کردی شاد و پرانرژی جشن می‌گیره!',
    icon: Smile,
    color: '#0D9488',
    bg: '#CCFBF1',
    targetY: 155,
    targetHeight: 120,
    interactiveHint: 'با تغییر درصد آب، چهره و دیالوگ نوش عوض می‌شه.',
  },
  {
    id: 'ring',
    targetName: 'حلقه هوشمند پیشرفت',
    title: 'درصد دقیق هیدراتاسیون',
    desc: 'میزان کل آب مصرفی امروز (میلی‌لیتر و لیوان) و درصد باقی‌مانده تا هدف روزانه رو به صورت زنده دنبال کن.',
    icon: Droplets,
    color: '#2D9CFF',
    bg: '#EBF5FF',
    targetY: 285,
    targetHeight: 180,
    interactiveHint: 'موج آب داخلی به تناسب مصرفت بالا میاد.',
  },
  {
    id: 'quickhub',
    targetName: 'هاب نوشیدنی‌ها (QuickHub)',
    title: 'محاسبه‌گر نیاز بدن و ثبت چای و قهوه',
    desc: 'با این هاب جدید می‌تونی چای، قهوه، دمنوش و آبمیوه ثبت کنی و با وزن بدنت هدف علمی دریافت کنی!',
    icon: Sliders,
    color: '#6366F1',
    bg: '#EEF2FF',
    targetY: 475,
    targetHeight: 70,
    interactiveHint: 'کشیدن به پایین باتم‌شیت رو می‌بنده.',
  },
  {
    id: 'quickadd',
    targetName: 'ثبت سریع (+۱ لیوان)',
    title: 'دکمه شناور ثبت با یک لمس',
    desc: 'هر زمان یک لیوان آب نوشیدی، سریعاً با زدن روی دکمه شناور پایین بدون نیاز به باز کردن هیچ منویی ۱ لیوان آب ثبت کن.',
    icon: Zap,
    color: '#10B981',
    bg: '#D1FAE5',
    targetY: height - 120,
    targetHeight: 60,
    interactiveHint: 'همیشه در دسترس برای راحت‌ترین ثبت ممکن.',
  },
  {
    id: 'nav',
    targetName: 'نوار ناوبری جامع',
    title: 'تاریخچه، آمار و تنظیمات یادآور',
    desc: 'مشاهده نمودارهای مقایسه‌ای هفتگی، گزارش روزهای گذشته، ویجت‌های اندروید و تنظیم فاصله یادآورهای صوتی.',
    icon: Layers,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    targetY: height - 60,
    targetHeight: 50,
    interactiveHint: 'برای دسترسی به تمام ابزارهای سلامت.',
  },
];

export function TourModal({ visible, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!visible) return null;

  const step = INTERACTIVE_STEPS[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < INTERACTIVE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setCurrentStep(0);
    onClose();
  };

  // Decide whether tooltip card sits below or above the target
  // Measure target refs at runtime for accurate callout positioning
  const measureTarget = () => {
    // Runtime measurement placeholder: in full native build, use react-native-measure or onLayout
    // For now, preserve safe dynamic positioning relative to target bounds
    return { top: step.targetY, height: step.targetHeight, left: 14, right: 14 };
  };
  const targetBounds = measureTarget();
  const calloutTop = step.targetY > height * 0.55
    ? Math.max(60, step.targetY - 260)
    : Math.max(20, step.targetY + step.targetHeight + 24);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleFinish}
    >
      <View style={styles.overlayContainer}>
        {/* Spotlight Frame highlighting the active target */}
        <View
          style={[
            styles.spotlightBox,
            {
              top: Math.max(10, step.targetY - 8),
              height: step.targetHeight + 16,
              borderColor: step.color,
            },
          ]}
        >
          <View style={[styles.spotlightLabel, { backgroundColor: step.color }]}>
            <Text style={styles.spotlightLabelText}>{step.targetName}</Text>
          </View>
        </View>

        {/* Top Control Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleFinish}
            activeOpacity={0.7}
          >
            <X size={16} color="#FFFFFF" />
            <Text style={styles.skipBtnText}>خروج از راهنما</Text>
          </TouchableOpacity>

          <View style={styles.stepBadge}>
            <Compass size={14} color="#38BDF8" />
            <Text style={styles.stepBadgeText}>
              گام {currentStep + 1} از {INTERACTIVE_STEPS.length}
            </Text>
          </View>
        </View>

        {/* Interactive Tooltip Card positioned above or below spotlight */}
        <View
          style={[
            styles.cardContainer,
            { top: calloutTop, left: targetBounds.left, right: targetBounds.right },
          ]}
        >
          {/* Top Progress Line */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${((currentStep + 1) / INTERACTIVE_STEPS.length) * 100}%`,
                  backgroundColor: step.color,
                },
              ]}
            />
          </View>

          <View style={styles.cardContent}>
            {/* Header row */}
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconCircle, { backgroundColor: step.bg }]}>
                <StepIcon size={24} color={step.color} strokeWidth={2.4} />
              </View>
              <View style={styles.cardHeaderTitles}>
                <Text style={styles.cardTitle}>{step.title}</Text>
                <Text style={styles.cardSubtitle}>{step.targetName}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.cardDesc}>{step.desc}</Text>

            {/* Interactive hint banner */}
            <View style={[styles.hintBox, { backgroundColor: step.bg }]}>
              <Sparkles size={14} color={step.color} />
              <Text style={[styles.hintText, { color: step.color }]}>
                {step.interactiveHint}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              {currentStep > 0 ? (
                <TouchableOpacity
                  style={styles.prevButton}
                  onPress={handlePrev}
                  activeOpacity={0.7}
                >
                  <ArrowRight size={16} color="#64748B" strokeWidth={2.2} />
                  <Text style={styles.prevButtonText}>قبلی</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: 70 }} />
              )}

              <View style={styles.dotsGroup}>
                {INTERACTIVE_STEPS.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.miniDot,
                      currentStep === i && [styles.miniDotActive, { backgroundColor: step.color }],
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: step.color }]}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === INTERACTIVE_STEPS.length - 1 ? 'شروع کار!' : 'بعدی'}
                </Text>
                {currentStep === INTERACTIVE_STEPS.length - 1 ? (
                  <Check size={16} color="#FFFFFF" strokeWidth={2.4} />
                ) : (
                  <ArrowLeft size={16} color="#FFFFFF" strokeWidth={2.4} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(11, 25, 44, 0.85)', // Matches Driver.js backdrop
  },
  topBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 45,
    zIndex: 10,
  },
  stepBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  skipBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  skipBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FCA5A5',
  },
  spotlightBox: {
    position: 'absolute',
    left: 14,
    right: 14,
    borderRadius: 20,
    borderWidth: 2.5,
    borderStyle: 'solid',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  spotlightLabel: {
    position: 'absolute',
    top: -12,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  spotlightLabelText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cardContainer: {
    position: 'absolute',
    left: 18,
    right: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  progressBar: {
    height: 4,
  },
  cardContent: {
    padding: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitles: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    writingDirection: 'rtl',
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  cardDesc: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 12,
  },
  hintBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  hintText: {
    fontSize: 11,
    fontWeight: '700',
    writingDirection: 'rtl',
    flex: 1,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  nextButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  nextButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  prevButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  prevButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  dotsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  miniDotActive: {
    width: 14,
    borderRadius: 4,
  },
});
