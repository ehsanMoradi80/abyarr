import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
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
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const TOUR_STEPS = [
  {
    title: 'حلقه هوشمند پیشرفت',
    desc: 'میزان مصرف آب روزانه شما در قالب یک دایره پویا نمایش داده می‌شود تا همیشه درصد دستیابی به هدف را ببینید.',
    icon: Droplets,
    color: '#2D9CFF',
    bg: '#EBF5FF',
  },
  {
    title: 'کاراکتر همراه «نوش»',
    desc: 'مسکت دوست‌داشتنی نوش بر اساس میزان هیدراتاسیون شما خوشحال، تشنه یا پرانرژی می‌شود و به شما انگیزه می‌دهد.',
    icon: Smile,
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    title: 'ثبت سریع با یک لمس (+۱)',
    desc: 'دکمه شناور در وسط نوار پایین همیشه در دسترس است تا بلافاصله پس از نوشیدن، ۱ لیوان آب ثبت کنید.',
    icon: Zap,
    color: '#10B981',
    bg: '#D1FAE5',
  },
  {
    title: 'ویجت‌های صفحه اصلی اندروید',
    desc: 'ویجت‌های ۴×۱ و استریک را روی صفحه گوشی اضافه کنید تا بدون نیاز به باز کردن اپلیکیشن، مصرف خود را مدیریت کنید.',
    icon: Smartphone,
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    title: 'زنجیره تداوم و جوایز',
    desc: 'با تداوم روزانه، آتش استریک روشن می‌ماند و مدال‌های افتخار و نشان‌های جذاب باز می‌شوند.',
    icon: Flame,
    color: '#F97316',
    bg: '#FFEDD5',
  },
  {
    title: 'اتصال به گوگل فیت و پیام‌رسان‌ها',
    desc: 'فعالیت‌های ورزشی استراوا، گام‌های گوگل فیت و ربات تلگرام را متصل کنید تا همگام‌سازی خودکار انجام شود.',
    icon: Users,
    color: '#0D9488',
    bg: '#CCFBF1',
  },
];

export function TourModal({ visible, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!visible) return null;

  const stepData = TOUR_STEPS[currentStep];
  const StepIcon = stepData.icon;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Top Bar with Close and Step counter */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.badgePill}>
              <Compass size={13} color="#2D9CFF" />
              <Text style={styles.badgeText}>
                راهنمای کاربری • {currentStep + 1} از {TOUR_STEPS.length}
              </Text>
            </View>
          </View>

          {/* Center Graphic */}
          <View style={[styles.iconBox, { backgroundColor: stepData.bg }]}>
            <StepIcon size={44} color={stepData.color} strokeWidth={2.4} />
          </View>

          {/* Title & Description */}
          <Text style={styles.stepTitle}>{stepData.title}</Text>
          <Text style={styles.stepDesc}>{stepData.desc}</Text>

          {/* Progress Indicator Dots */}
          <View style={styles.dotsRow}>
            {TOUR_STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentStep === i && styles.dotActive,
                  { backgroundColor: currentStep === i ? stepData.color : '#E2E8F0' },
                ]}
              />
            ))}
          </View>

          {/* Action Navigation Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: stepData.color }]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>
                {currentStep === TOUR_STEPS.length - 1 ? 'پایان تور' : 'گام بعدی'}
              </Text>
              {currentStep === TOUR_STEPS.length - 1 ? (
                <Check size={18} color="#FFFFFF" strokeWidth={2.4} />
              ) : (
                <ArrowLeft size={18} color="#FFFFFF" strokeWidth={2.4} />
              )}
            </TouchableOpacity>

            {currentStep > 0 && (
              <TouchableOpacity
                style={styles.prevBtn}
                onPress={handlePrev}
                activeOpacity={0.7}
              >
                <ArrowRight size={18} color="#64748B" strokeWidth={2} />
                <Text style={styles.prevBtnText}>قبلی</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 25, 44, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  badgePill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 22,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 22,
  },
  actionsRow: {
    width: '100%',
    gap: 10,
  },
  nextBtn: {
    width: '100%',
    height: 50,
    borderRadius: 18,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  prevBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  prevBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
});
