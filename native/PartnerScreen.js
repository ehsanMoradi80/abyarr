import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  Users,
  ChevronRight,
  Copy,
  Check,
  Heart,
  ShieldCheck,
  Send,
  Droplets,
  Clock,
  Sparkles,
  Link,
  Unlink,
} from 'lucide-react-native';

export function PartnerScreen({ onBack }) {
  const [partnerConnected, setPartnerConnected] = useState(true);
  const [partnerName, setPartnerName] = useState('همراه مهربانم');
  const [partnerGlasses, setPartnerGlasses] = useState(6);
  const [partnerGoal, setPartnerGoal] = useState(8);
  const [partnerLastDrink, setPartnerLastDrink] = useState('۲۵ دقیقه پیش');
  const [myInviteCode, setMyInviteCode] = useState('NOOSH-8421');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [shareProgress, setShareProgress] = useState(true);
  const [shareTime, setShareTime] = useState(true);

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('کپی شد', 'کد دعوت اختصاصی شما در کلیپ‌بورد کپی شد.');
  };

  const handleConnect = () => {
    if (!inputCode || inputCode.trim().length < 4) {
      Alert.alert('خطا', 'لطفاً کد معتبر همراه را وارد کنید.');
      return;
    }
    setPartnerConnected(true);
    setInputCode('');
    Alert.alert('موفق', 'اتصال به همراه سلامت با موفقیت برقرار شد!');
  };

  const handleNudge = () => {
    setNudged(true);
    setTimeout(() => setNudged(false), 2500);
    Alert.alert(
      'یادآوری ارسال شد! ',
      `پیام انرژی‌بخش نوشیدن آب برای ${partnerName} ارسال شد.`
    );
  };

  const handleDisconnect = () => {
    Alert.alert(
      'قطع ارتباط',
      'آیا از قطع ارتباط با همراه سلامت اطمینان دارید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'قطع ارتباط',
          style: 'destructive',
          onPress: () => setPartnerConnected(false),
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
          <Text style={styles.headerTitle}>همراه سلامت</Text>
          <Text style={styles.headerSubtitle}>نوشیدن آب دو نفره و انگیزه روزانه</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Users size={18} color="#10B981" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {partnerConnected ? (
          /* Active Partner Card */
          <View style={styles.partnerCard}>
            <View style={styles.partnerCardHeader}>
              <View style={styles.partnerAvatarWrap}>
                <Users size={24} color="#10B981" />
              </View>
              <View style={styles.partnerInfoWrap}>
                <View style={styles.partnerNameRow}>
                  <Text style={styles.partnerName}>{partnerName}</Text>
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>آنلاین</Text>
                  </View>
                </View>
                <Text style={styles.partnerStatusSub}>همگام با حساب شما</Text>
              </View>
            </View>

            {/* Partner Hydration Progress */}
            <View style={styles.progressBox}>
              <View style={styles.progressHeaderRow}>
                <Text style={styles.progressTitle}>مصرف آب امروز همراه</Text>
                <Text style={styles.progressValue}>
                  {partnerGlasses} از {partnerGoal} لیوان
                </Text>
              </View>

              <View style={styles.track}>
                <View
                  style={[
                    styles.trackFill,
                    { width: `${(partnerGlasses / partnerGoal) * 100}%` },
                  ]}
                />
              </View>

              <View style={styles.lastDrinkRow}>
                <Clock size={13} color="#64748B" />
                <Text style={styles.lastDrinkText}>
                  آخرین لیوان: {partnerLastDrink}
                </Text>
              </View>
            </View>

            {/* Cheer & Nudge Button */}
            <TouchableOpacity
              style={[styles.nudgeBtn, nudged && styles.nudgeBtnSent]}
              onPress={handleNudge}
              activeOpacity={0.8}
            >
              <Heart size={16} color={nudged ? '#10B981' : '#FFFFFF'} />
              <Text style={[styles.nudgeBtnText, nudged && styles.nudgeBtnTextSent]}>
                {nudged ? 'یادآوری ارسال شد!' : 'ارسال انگیزه و یادآوری آب'}
              </Text>
            </TouchableOpacity>

            {/* Disconnect Link */}
            <TouchableOpacity
              style={styles.disconnectBtn}
              onPress={handleDisconnect}
              activeOpacity={0.7}
            >
              <Unlink size={14} color="#EF4444" />
              <Text style={styles.disconnectText}>قطع ارتباط با همراه</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Connect Partner Flow */
          <View style={styles.connectCard}>
            <View style={styles.connectIconWrap}>
              <Users size={32} color="#2D9CFF" />
            </View>
            <Text style={styles.connectTitle}>اتصال به همراه سلامت</Text>
            <Text style={styles.connectDesc}>
              با داشتن یک همراه، هر دو نفر پیشرفت همدیگر را می‌بینید و به نوشیدن
              منظم آب تشویق می‌شوید.
            </Text>

            {/* My Invite Code */}
            <View style={styles.myCodeBox}>
              <Text style={styles.myCodeLabel}>کد اختصاصی دعوت شما:</Text>
              <View style={styles.codeRow}>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={handleCopyCode}
                  activeOpacity={0.7}
                >
                  {copied ? (
                    <Check size={16} color="#10B981" />
                  ) : (
                    <Copy size={16} color="#2D9CFF" />
                  )}
                  <Text style={styles.copyBtnText}>{copied ? 'کپی شد' : 'کپی'}</Text>
                </TouchableOpacity>
                <Text style={styles.codeText}>{myInviteCode}</Text>
              </View>
            </View>

            {/* Input Partner Code */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>کد دعوت همراه خود را وارد کنید:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: NOOSH-1234"
                placeholderTextColor="#94A3B8"
                value={inputCode}
                onChangeText={setInputCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.connectSubmitBtn}
                onPress={handleConnect}
                activeOpacity={0.8}
              >
                <Link size={16} color="#FFFFFF" />
                <Text style={styles.connectSubmitBtnText}>برقراری اتصال</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Benefits Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeaderRow}>
            <Sparkles size={16} color="#F59E0B" />
            <Text style={styles.infoTitle}>چرا آب‌یار دو نفره؟</Text>
          </View>
          <Text style={styles.infoBody}>
            تحقیقات عادات رفتاری نشان داده افرادی که اهداف تندرستی خود را با یک
            همراه به اشتراک می‌گذارند، تا ۶۵٪ ثبات بیشتری در دستیابی به هدف خود
            دارند.
          </Text>
        </View>

        {/* Privacy Card */}
        <View style={styles.privacyCard}>
          <View style={styles.infoHeaderRow}>
            <ShieldCheck size={16} color="#10B981" />
            <Text style={styles.infoTitle}>حفظ حریم خصوصی</Text>
          </View>
          <Text style={styles.privacyDesc}>
            فقط میزان لیوان‌های امروز و زمان آخرین نوشیدن به همراه نشان داده
            می‌شود و اطلاعات شخصی شما کاملاً محرمانه است.
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
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  partnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  partnerCardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  partnerAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerInfoWrap: {
    alignItems: 'flex-end',
    flex: 1,
  },
  partnerNameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  onlineBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  partnerStatusSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  progressBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  progressHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D9CFF',
  },
  track: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  lastDrinkRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  lastDrinkText: {
    fontSize: 11,
    color: '#64748B',
  },
  nudgeBtn: {
    backgroundColor: '#2D9CFF',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  nudgeBtnSent: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  nudgeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nudgeBtnTextSent: {
    color: '#059669',
  },
  disconnectBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  disconnectText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  connectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  connectIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  connectDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
  myCodeBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  myCodeLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
  },
  codeRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2D9CFF',
    letterSpacing: 2,
  },
  copyBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D9CFF',
  },
  inputWrap: {
    width: '100%',
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'right',
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
    textAlign: 'center',
  },
  connectSubmitBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  connectSubmitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 6,
  },
  infoHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  infoBody: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 18,
    textAlign: 'right',
  },
  privacyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  privacyDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'right',
  },
});
