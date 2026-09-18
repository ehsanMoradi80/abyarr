import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  ChevronRight,
  Activity,
  Heart,
  Send,
  Calendar,
  Sparkles,
  Watch,
  CheckCircle2,
} from 'lucide-react-native';

export function ThirdPartyScreen({ onBack, integrations: propIntegrations, onUpdateIntegrations }) {
  const [integrations, setIntegrations] = useState(() => ({
    googleFit: false,
    appleHealth: false,
    strava: false,
    telegramBot: false,
    calendar: false,
    ...(propIntegrations || {}),
  }));

  const toggle = (key, name) => {
    const next = !integrations[key];
    const updated = { ...integrations, [key]: next };
    setIntegrations(updated);
    if (onUpdateIntegrations) {
      onUpdateIntegrations(updated);
    }
    Alert.alert(
      next ? 'فعال‌سازی سرویس' : 'غیرفعال‌سازی سرویس',
      next ? `سرویس ${name} برای همگام‌سازی انتخاب شد.` : `سرویس ${name} غیرفعال شد.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <ChevronRight size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>اتصال به ساعت و گوشی</Text>
          <Text style={styles.headerSubtitle}>هماهنگی ساده با برنامه‌های سلامت</Text>
        </View>
        <View style={styles.headerIconWrapper}>
          <Watch size={18} color="#2D9CFF" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Friendly Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerBadge}>
            <Sparkles size={14} color="#FFFFFF" />
            <Text style={styles.bannerBadgeText}>تنظیمات خودکار و آسان</Text>
          </View>
          <Text style={styles.bannerTitle}>هماهنگی آب مصرفی با ساعت هوشمند</Text>
          <Text style={styles.bannerDesc}>
            با فعال کردن هر گزینه، فعالیت‌های روزانه شما خوانده شده و نیاز آب بدنتان دقیق‌تر تنظیم می‌شود.
          </Text>
        </View>

        {/* 1. Google Fit */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardInfo}>
              <View style={[styles.cardIconBox, { backgroundColor: '#FFF1F2' }]}>
                <Activity size={22} color="#F43F5E" />
              </View>
              <View style={styles.cardTitles}>
                <Text style={styles.cardName}>ساعت هوشمند و گوگل فیت</Text>
                <Text style={styles.cardDesc}>ویژه گوشی‌ها و ساعت‌های اندرویدی</Text>
              </View>
            </View>
            <Switch
              value={integrations.googleFit}
              onValueChange={() => toggle('googleFit', 'گوگل فیت')}
              trackColor={{ false: '#CBD5E1', true: '#BAE6FD' }}
              thumbColor={integrations.googleFit ? '#2D9CFF' : '#F8FAFC'}
            />
          </View>
          <Text style={styles.cardHint}>
            تعداد قدم‌های شما در طول روز دریافت می‌شود تا در روزهای پرتحرک، آب بیشتری یادآوری شود.
          </Text>
        </View>

        {/* 2. Apple Health */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardInfo}>
              <View style={[styles.cardIconBox, { backgroundColor: '#FEF2F2' }]}>
                <Heart size={22} color="#EF4444" />
              </View>
              <View style={styles.cardTitles}>
                <Text style={styles.cardName}>برنامه سلامت اپل (Apple Health)</Text>
                <Text style={styles.cardDesc}>ویژه گوشی‌های آیفون و اپل‌واچ</Text>
              </View>
            </View>
            <Switch
              value={integrations.appleHealth}
              onValueChange={() => toggle('appleHealth', 'سلامت اپل')}
              trackColor={{ false: '#CBD5E1', true: '#BAE6FD' }}
              thumbColor={integrations.appleHealth ? '#2D9CFF' : '#F8FAFC'}
            />
          </View>
          <Text style={styles.cardHint}>
            هر بار که آب می‌نوشید، به صورت خودکار در حلقه سلامت روزانه آیفون شما ثبت می‌شود.
          </Text>
        </View>

        {/* 3. Strava */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardInfo}>
              <View style={[styles.cardIconBox, { backgroundColor: '#FFF7ED' }]}>
                <Activity size={22} color="#EA580C" />
              </View>
              <View style={styles.cardTitles}>
                <Text style={styles.cardName}>برنامه ورزشی و دویدن (Strava)</Text>
                <Text style={styles.cardDesc}>تشخیص ورزش و جبران کم‌آبی</Text>
              </View>
            </View>
            <Switch
              value={integrations.strava}
              onValueChange={() => toggle('strava', 'استراوا')}
              trackColor={{ false: '#CBD5E1', true: '#BAE6FD' }}
              thumbColor={integrations.strava ? '#2D9CFF' : '#F8FAFC'}
            />
          </View>
          <Text style={styles.cardHint}>
            در صورت ورزش یا دویدن، ۱ تا ۲ لیوان آب به هدف روزانه اضافه می‌شود تا بدنتان خسته نشود.
          </Text>
        </View>

        {/* 4. Telegram Bot */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardInfo}>
              <View style={[styles.cardIconBox, { backgroundColor: '#F0F9FF' }]}>
                <Send size={22} color="#0284C7" />
              </View>
              <View style={styles.cardTitles}>
                <Text style={styles.cardName}>یادآوری در پیام‌رسان تلگرام</Text>
                <Text style={styles.cardDesc}>دریافت پیام و ثبت با ۱ دکمه در چت</Text>
              </View>
            </View>
            <Switch
              value={integrations.telegramBot}
              onValueChange={() => toggle('telegramBot', 'ربات تلگرام')}
              trackColor={{ false: '#CBD5E1', true: '#BAE6FD' }}
              thumbColor={integrations.telegramBot ? '#2D9CFF' : '#F8FAFC'}
            />
          </View>
          <View style={styles.botRow}>
            <Text style={styles.botId}>@NooshWaterBot</Text>
            <Text style={styles.botDesc}>آیدی ربات رسمی تلگرام</Text>
          </View>
        </View>

        {/* 5. Phone Calendar */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.cardInfo}>
              <View style={[styles.cardIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Calendar size={22} color="#2563EB" />
              </View>
              <View style={styles.cardTitles}>
                <Text style={styles.cardName}>تقویم کاری گوشی</Text>
                <Text style={styles.cardDesc}>نمایش زمان‌های نوشیدن در تقویم</Text>
              </View>
            </View>
            <Switch
              value={integrations.calendar}
              onValueChange={() => toggle('calendar', 'تقویم گوشی')}
              trackColor={{ false: '#CBD5E1', true: '#BAE6FD' }}
              thumbColor={integrations.calendar ? '#2D9CFF' : '#F8FAFC'}
            />
          </View>
        </View>

        {/* Simple safe note */}
        <View style={styles.safeNotice}>
          <CheckCircle2 size={16} color="#10B981" />
          <Text style={styles.safeNoticeText}>
            هیچ نیازی به تنظیمات فنی نیست، همه‌چیز به سادگی و خودکار کار می‌کند.
          </Text>
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
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  headerTextCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  headerIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#2D9CFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-end',
  },
  bannerBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 12,
    color: '#F0F9FF',
    lineHeight: 18,
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitles: {
    alignItems: 'flex-end',
    flex: 1,
  },
  cardName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  cardDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cardHint: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'right',
  },
  botRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 12,
  },
  botId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    fontFamily: 'monospace',
  },
  botDesc: {
    fontSize: 11,
    color: '#475569',
  },
  safeNotice: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  safeNoticeText: {
    fontSize: 11.5,
    color: '#065F46',
    flex: 1,
    textAlign: 'right',
  },
});
