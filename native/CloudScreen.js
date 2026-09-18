import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Share,
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
  LogOut,
  User,
  Sparkles,
} from 'lucide-react-native';
import { formatNumber } from './strings';

export function CloudScreen({
  onBack,
  appData = {},
  onUpdateUser,
  onSyncNow,
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(appData.autoSync ?? true);
  const [inputPhoneOrEmail, setInputPhoneOrEmail] = useState('');
  const [inputName, setInputName] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(appData.lastSyncDate || 'هنوز همگام نشده');

  const user = appData.user || null;
  const isLoggedIn = !!(user && (user.phone || user.email));
  const logsCount = (appData.logs || []).length;

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      if (onSyncNow) {
        await onSyncNow();
      }
      const nowStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(`امروز ساعت ${nowStr}`);
      Alert.alert(
        'همگام‌سازی موفق',
        `تعداد ${formatNumber(logsCount)} لاگ مصرف آب با موفقیت ذخیره و همگام‌سازی شد.`
      );
    } catch (err) {
      Alert.alert('خطا در همگام‌سازی', 'ارتباط با سرور برقرار نشد. داده‌ها در حافظه دستگاه ذخیره هستند.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = () => {
    const val = inputPhoneOrEmail.trim();
    if (!val || val.length < 5) {
      Alert.alert('خطا', 'لطفاً شماره تماس یا ایمیل معتبر وارد کنید.');
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      phone: val.includes('@') ? null : val,
      email: val.includes('@') ? val : null,
      name: inputName.trim() || appData.name || 'کاربر آب‌یار',
      createdAt: new Date().toISOString(),
    };

    if (onUpdateUser) {
      onUpdateUser(newUser);
    }

    setInputPhoneOrEmail('');
    setInputName('');
    Alert.alert('خوش آمدید', `حساب ابری شما به نام «${newUser.name}» با موفقیت فعال شد.`);
  };

  const handleLogout = () => {
    Alert.alert(
      'خروج از حساب ابری',
      'با خروج از حساب، اطلاعات ثبت‌شده روی دستگاه باقی می‌مانند اما همگام‌سازی ابری متوقف می‌شود.',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: () => {
            if (onUpdateUser) {
              onUpdateUser(null);
            }
            Alert.alert('خروج انجام شد', 'حساب ابری غیرفعال شد.');
          },
        },
      ]
    );
  };

  // Export local data to share or backup
  const handleExportData = async () => {
    try {
      const backupPayload = JSON.stringify(appData, null, 2);
      await Share.share({
        message: backupPayload,
        title: 'نسخه پشتیبان آب‌یار',
      });
    } catch (err) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری فایل پشتیبان وجود ندارد.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <ChevronRight size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>همگام‌سازی ابری</Text>
          <Text style={styles.headerSubtitle}>پشتیبان‌گیری امن اطلاعات و سوابق</Text>
        </View>
        <View style={styles.headerIconWrapper}>
          <Cloud size={20} color="#2D9CFF" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusTopRow}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: isLoggedIn ? '#10B981' : '#F59E0B' }]} />
              <Text style={styles.statusText}>
                {isLoggedIn ? 'متصل به حساب ابری' : 'حالت محلی (آفلاین)'}
              </Text>
            </View>
            <ShieldCheck size={20} color={isLoggedIn ? '#10B981' : '#F59E0B'} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{formatNumber(logsCount)}</Text>
              <Text style={styles.statLabel}>لاگ‌های ثبت‌شده</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{lastSyncTime.split(' ')[0] || 'امروز'}</Text>
              <Text style={styles.statLabel}>آخرین همگام‌سازی</Text>
            </View>
          </View>

          {isLoggedIn && (
            <TouchableOpacity
              style={styles.syncBtn}
              onPress={handleManualSync}
              disabled={isSyncing}
              activeOpacity={0.85}
            >
              <RefreshCw size={18} color="#FFFFFF" />
              <Text style={styles.syncBtnText}>
                {isSyncing ? 'در حال همگام‌سازی...' : 'همگام‌سازی همین الان'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Account Info or Login Form */}
        {isLoggedIn ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>مشخصات حساب شما</Text>
            <View style={styles.userRow}>
              <View style={styles.userAvatar}>
                <User size={22} color="#2D9CFF" />
              </View>
              <View style={styles.userTextCol}>
                <Text style={styles.userName}>{user.name || 'کاربر آب‌یار'}</Text>
                <Text style={styles.userContact}>{user.phone || user.email || 'ثبت‌شده'}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
              <LogOut size={16} color="#DC2626" />
              <Text style={styles.logoutBtnText}>خروج از این حساب</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ورود یا ایجاد حساب کاربری</Text>
            <Text style={styles.cardSubtitle}>
              برای ذخیره سوابق در فضای ابری و دسترسی روی دستگاه‌های دیگر، شماره موبایل یا ایمیل خود را وارد نمایید.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>نام شما (اختیاری):</Text>
              <TextInput
                style={styles.textInput}
                value={inputName}
                onChangeText={setInputName}
                placeholder="مثلاً علی یا مریم"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>شماره موبایل یا ایمیل:</Text>
              <TextInput
                style={styles.textInput}
                value={inputPhoneOrEmail}
                onChangeText={setInputPhoneOrEmail}
                placeholder="۰۹۱۲... یا email@domain.com"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
              <CheckCircle2 size={18} color="#FFFFFF" />
              <Text style={styles.loginBtnText}>ورود و اتصال حساب ابری</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Backup & Export */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>پشتیبان‌گیری محلی و خروجی داده‌ها</Text>
          <Text style={styles.cardSubtitle}>
            می‌توانید یک نسخه متنی کامل از تمام سوابق نوشیدن آب و نشان‌های خود را استخراج کنید و در جای امن نگه دارید.
          </Text>

          <TouchableOpacity style={styles.exportBtn} onPress={handleExportData} activeOpacity={0.75}>
            <ArrowDownCircle size={18} color="#0284C7" />
            <Text style={styles.exportBtnText}>دریافت فایل خروجی سوابق (Export JSON)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  headerTextCol: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  headerIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  statsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284C7',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  syncBtn: {
    backgroundColor: '#2D9CFF',
    borderRadius: 14,
    height: 46,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  syncBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369A1',
  },
  userContact: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 12,
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    textAlign: 'right',
  },
  textInput: {
    height: 46,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'right',
  },
  loginBtn: {
    backgroundColor: '#2D9CFF',
    borderRadius: 14,
    height: 46,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  loginBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  exportBtn: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 14,
    height: 46,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
});
