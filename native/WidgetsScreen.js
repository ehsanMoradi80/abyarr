import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Smartphone,
  ChevronRight,
  Droplet,
  Flame,
  Plus,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Layers,
} from 'lucide-react-native';

export function WidgetsScreen({
  onBack,
  todayGlasses = 4,
  goalGlasses = 8,
  streakDays = 5,
  onQuickAdd,
}) {
  const [activeCategory, setActiveCategory] = useState('water');
  const [simulatedGlasses, setSimulatedGlasses] = useState(todayGlasses);

  const handleSimulatedAdd = () => {
    const next = Math.min(simulatedGlasses + 1, goalGlasses);
    setSimulatedGlasses(next);
    if (onQuickAdd) onQuickAdd();
    Alert.alert('ویجت تعاملی', '۱ لیوان آب با موفقیت از طریق ویجت ثبت شد!');
  };

  const progressPercent = Math.min(
    Math.round((simulatedGlasses / goalGlasses) * 100),
    100
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ChevronRight size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>ویجت‌های اندروید</Text>
          <Text style={styles.headerSubtitle}>دسترسی سریع و ثبت آب در صفحه اصلی گوشی</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Smartphone size={18} color="#2D9CFF" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeCategory === 'water' && styles.tabBtnActive,
            ]}
            onPress={() => setActiveCategory('water')}
            activeOpacity={0.7}
          >
            <Droplet
              size={15}
              color={activeCategory === 'water' ? '#2D9CFF' : '#64748B'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeCategory === 'water' && styles.tabBtnTextActive,
              ]}
            >
              ویجت‌های آب
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeCategory === 'streak' && styles.tabBtnActive,
            ]}
            onPress={() => setActiveCategory('streak')}
            activeOpacity={0.7}
          >
            <Flame
              size={15}
              color={activeCategory === 'streak' ? '#EA580C' : '#64748B'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeCategory === 'streak' && styles.tabBtnTextActive,
              ]}
            >
              ویجت‌های استریک آتش
            </Text>
          </TouchableOpacity>
        </View>

        {activeCategory === 'water' ? (
          <>
            {/* Widget 4x1 Card */}
            <View style={styles.widgetShowcaseCard}>
              <View style={styles.widgetMetaRow}>
                <Text style={styles.widgetSizeBadge}>ابعاد: ۴ × ۱ (کامل)</Text>
                <Text style={styles.widgetName}>ویجت پیشرفته با دکمه ثبت سریع</Text>
              </View>

              {/* Rendered Live 4x1 Widget */}
              <View style={styles.widgetFrame}>
                <View style={styles.widget4x1Inner}>
                  {/* Left Action Button */}
                  <TouchableOpacity
                    style={styles.widgetAddBtn}
                    onPress={handleSimulatedAdd}
                    activeOpacity={0.8}
                  >
                    <Plus size={18} color="#FFFFFF" strokeWidth={3} />
                  </TouchableOpacity>

                  {/* Center Info */}
                  <View style={styles.widgetInfoCol}>
                    <View style={styles.widgetProgressHeader}>
                      <Text style={styles.widgetGlassText}>
                        {simulatedGlasses} از {goalGlasses} لیوان
                      </Text>
                      <Text style={styles.widgetPercentText}>{progressPercent}٪</Text>
                    </View>
                    <View style={styles.widgetProgressBar}>
                      <View
                        style={[
                          styles.widgetProgressFill,
                          { width: `${progressPercent}%` },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Right Logo Icon */}
                  <View style={styles.widgetDropletIcon}>
                    <Droplet size={22} color="#2D9CFF" />
                  </View>
                </View>
              </View>
              <Text style={styles.widgetHint}>
                با لمس دکمه + در صفحه اصلی گوشی، مستقیماً یک لیوان آب ثبت می‌شود.
              </Text>
            </View>

            {/* Widget 2x1 Card */}
            <View style={styles.widgetShowcaseCard}>
              <View style={styles.widgetMetaRow}>
                <Text style={styles.widgetSizeBadge}>ابعاد: ۲ × ۱ (جمع‌وجور)</Text>
                <Text style={styles.widgetName}>ویجت مینیمال قطره و شمارنده</Text>
              </View>

              {/* Rendered Live 2x1 Widget */}
              <View style={styles.widgetFrame}>
                <View style={styles.widget2x1Inner}>
                  <View style={styles.widgetDropletIconSmall}>
                    <Droplet size={18} color="#2D9CFF" />
                  </View>
                  <View style={styles.widget2x1TextWrap}>
                    <Text style={styles.widget2x1Title}>امروز: {simulatedGlasses} لیوان</Text>
                    <Text style={styles.widget2x1Sub}>{progressPercent}٪ از هدف روزانه</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.widgetAddBtnMini}
                    onPress={handleSimulatedAdd}
                    activeOpacity={0.8}
                  >
                    <Plus size={14} color="#FFFFFF" strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Widget 2x2 Streak Card */}
            <View style={styles.widgetShowcaseCard}>
              <View style={styles.widgetMetaRow}>
                <Text style={styles.widgetSizeBadge}>ابعاد: ۲ × ۲ (مربعی)</Text>
                <Text style={styles.widgetName}>ویجت نشانگر زنجیره آتش</Text>
              </View>

              {/* Rendered Live 2x2 Streak Widget */}
              <View style={styles.widgetFrame}>
                <View style={styles.widget2x2Inner}>
                  <View style={styles.flameCircle}>
                    <Flame size={32} color="#EA580C" />
                  </View>
                  <Text style={styles.streakCountText}>{streakDays} روز متوالی</Text>
                  <Text style={styles.streakDescText}>زنجیره سلامتی روشن است</Text>
                  <View style={styles.weekDaysRow}>
                    {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.dayDot,
                          idx < streakDays && styles.dayDotActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayDotText,
                            idx < streakDays && styles.dayDotTextActive,
                          ]}
                        >
                          {day}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* How to add widget guide */}
        <View style={styles.guideCard}>
          <View style={styles.guideHeaderRow}>
            <HelpCircle size={18} color="#2D9CFF" />
            <Text style={styles.guideHeaderTitle}>
              چگونه ویجت را به صفحه گوشی اضافه کنیم؟
            </Text>
          </View>

          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>۱</Text>
              </View>
              <Text style={styles.stepText}>
                یک فضای خالی در صفحه اصلی گوشی خود را لمس کرده و چند ثانیه نگه دارید.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>۲</Text>
              </View>
              <Text style={styles.stepText}>
                از گزینه‌های ظاهر شده، روی گزینه «ویجت‌ها» (Widgets) ضربه بزنید.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>۳</Text>
              </View>
              <Text style={styles.stepText}>
                برنامه «نوش» (آب‌یار) را پیدا کرده و ویجت دلخواه را کشیده و روی صفحه قرار دهید.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  topHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrap: {
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  headerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  tabBar: {
    flexDirection: 'row-reverse',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#F1F5F9',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#1E293B',
  },
  widgetShowcaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  widgetMetaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  widgetSizeBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D9CFF',
    backgroundColor: '#E6F4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  widgetFrame: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 10,
  },
  widget4x1Inner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  widgetDropletIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetInfoCol: {
    flex: 1,
    marginHorizontal: 10,
    gap: 6,
  },
  widgetProgressHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  widgetGlassText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  widgetPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D9CFF',
  },
  widgetProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  widgetProgressFill: {
    height: '100%',
    backgroundColor: '#2D9CFF',
    borderRadius: 4,
  },
  widgetAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2D9CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetHint: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
  },
  widget2x1Inner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  widgetDropletIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  widget2x1TextWrap: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'flex-end',
  },
  widget2x1Title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  widget2x1Sub: {
    fontSize: 10,
    color: '#64748B',
  },
  widgetAddBtnMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D9CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  widget2x2Inner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  flameCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakCountText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#C2410C',
  },
  streakDescText: {
    fontSize: 11,
    color: '#64748B',
  },
  weekDaysRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    marginTop: 4,
  },
  dayDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotActive: {
    backgroundColor: '#EA580C',
  },
  dayDotText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  dayDotTextActive: {
    color: '#FFFFFF',
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  guideHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  guideHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2D9CFF',
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    textAlign: 'right',
  },
});
