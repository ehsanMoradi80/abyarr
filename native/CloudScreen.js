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
import {
  Cloud,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Database,
  Lock,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react-native';

export function CloudScreen({ onBack, logsCount = 42 }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [inputPhone, setInputPhone] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState('چند لحظه پیش');

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('همین الان');
      Alert.alert(
        'همگام‌سازی انجام شد',
        'تمام گزارش‌های مصرف آب و نشان‌های شما با موفقیت در فضای ابری ذخیره شدند.'
      );
    }, 1200);
  };

  const handleLogin = () => {
    if (!inputPhone || inputPhone.trim().length < 10) {
      Alert.alert('خطا', 'لطفاً شماره موبایل معتبر وارد کنید.');
      return;
    }
    setPhoneNumber(inputPhone);
    setIsLoggedIn(true);
    setInputPhone('');
    Alert.alert('ورود موفق', 'حساب شما با سرور ابری آب‌یار متصل شد.');
  };

  const handleLogout = () => {
    Alert.alert(
      'خروج از حساب',
      'با خروج، داده‌های محلی حذف نمی‌شوند اما همگام‌سازی ابری موقتاً متوقف خواهد شد.',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: () => setIsLoggedIn(false),
        },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>همگام‌سازی ابری</Text>
          <Text style={styles.headerSubtitle}>پشتیبان‌گیری امن و بازیابی اطلاعات</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Cloud size={18} color="#0284C7" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cloud Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View style={styles.cloudIconCircle}>
              <Cloud size={30} color="#0284C7" />
            </View>
            <View style={styles.statusTextWrap}>
              <View style={styles.statusBadgeRow}>
                <Text style={styles.statusTitle}>وضعیت ابر: متصل و همگام</Text>
                <View style={styles.statusDot} />
              </View>
              <Text style={styles.lastSyncText}>آخرین همگام‌سازی: {lastSyncTime}</Text>
            </View>
          </View>

          {/* Sync Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Database size={15} color="#64748B" />
              <Text style={styles.metricVal}>{logsCount} رکورد</Text>
              <Text style={styles.metricLbl}>داده‌های ذخیره شده</Text>
            </View>
            <View style={styles.metricItem}>
              <ShieldCheck size={15} color="#10B981" />
              <Text style={styles.metricVal}>رمزنگاری ۲۵۶</Text>
              <Text style={styles.metricLbl}>امنیت اطلاعات</Text>
            </View>
          </View>

          {/* Manual Sync Button */}
          <TouchableOpacity
            style={styles.syncBtn}
            onPress={handleManualSync}
            disabled={isSyncing}
            activeOpacity={0.8}
          >
            <RefreshCw
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.syncBtnText}>
              {isSyncing ? 'در حال ارسال اطلاعات...' : 'همگام‌سازی دستی اکنون'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>حساب کاربری ابری</Text>

          {isLoggedIn ? (
            <View style={styles.accountRow}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountPhone}>{phoneNumber}</Text>
                <Text style={styles.accountType}>حساب کاربری فعال آب‌یار</Text>
              </View>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutBtnText}>خروج</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loginBox}>
              <Text style={styles.loginDesc}>
                برای ذخیره سابقه نوشیدن و امکان دسترسی در گوشی‌های دیگر، شماره
                موبایل خود را وارد کنید:
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="شماره موبایل (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={inputPhone}
                onChangeText={setInputPhone}
              />
              <TouchableOpacity
                style={styles.loginSubmitBtn}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginSubmitBtnText}>ورود و اتصال به ابر</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Sync Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>تنظیمات همگام‌سازی</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>همگام‌سازی خودکار</Text>
              <Text style={styles.settingSubtitle}>
                ثبت آنی هر لیوان در سرور ابری پس از نوشیدن
              </Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={autoSync ? '#0284C7' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <View style={styles.benefitItem}>
            <ArrowUpCircle size={18} color="#0284C7" />
            <View style={styles.benefitTextWrap}>
              <Text style={styles.benefitHeading}>پشتیبان‌گیری ابدی</Text>
              <Text style={styles.benefitDesc}>
                حتی در صورت تغییر یا ریست گوشی، هیچ‌یک از سوابق و استریک شما از بین نمی‌رود.
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Smartphone size={18} color="#10B981" />
            <View style={styles.benefitTextWrap}>
              <Text style={styles.benefitHeading}>دسترسی چنددستگاهی</Text>
              <Text style={styles.benefitDesc}>
                استفاده همزمان روی تبلت، گوشی و وب‌اپلیکیشن با همان اطلاعات.
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
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  statusHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  cloudIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextWrap: {
    alignItems: 'flex-end',
    flex: 1,
  },
  statusBadgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369A1',
  },
  lastSyncText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  metricLbl: {
    fontSize: 10,
    color: '#64748B',
  },
  syncBtn: {
    backgroundColor: '#0284C7',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  syncBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'right',
  },
  accountRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
  },
  accountInfo: {
    alignItems: 'flex-end',
  },
  accountPhone: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  accountType: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  logoutBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  loginBox: {
    gap: 10,
  },
  loginDesc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
    lineHeight: 18,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
    textAlign: 'right',
  },
  loginSubmitBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginSubmitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextWrap: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },
  benefitsCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 14,
  },
  benefitItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 10,
  },
  benefitTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  benefitHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
  benefitDesc: {
    fontSize: 11,
    color: '#0C4A6E',
    textAlign: 'right',
    lineHeight: 17,
    marginTop: 2,
  },
});
