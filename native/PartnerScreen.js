import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
  Switch,
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
  UserPlus,
} from 'lucide-react-native';
import { formatNumber } from './strings';
import { copyTextToClipboard } from './clipboard';

export function PartnerScreen({
  onBack,
  partnerData = null,
  myInviteCode = '',
  onConnectPartner,
  onDisconnectPartner,
  onUpdateSharing,
  userGlasses = 0,
  userGoal = 8,
  userName = 'من',
}) {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [incomingNudge, setIncomingNudge] = useState(null);
  const lastNudgeTimeRef = React.useRef('');

  // Fixed, persistent invite code passed from persistent user state
  const myCode = myInviteCode || partnerData?.myCode || 'AB-1000';

  const isConnected = !!(partnerData && partnerData.status === 'active');
  const partnerCode = partnerData?.code;

  // Real-time live synchronization and auto-discovery loop
  React.useEffect(() => {
    let isMounted = true;

    const syncAndPoll = async () => {
      try {
        // 1. Send my live state to backend
        await fetch('/api/partner/live-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: myCode,
            name: userName || 'همراه شما',
            glasses: userGlasses,
            goal: userGoal,
            pairedCode: partnerCode,
          }),
        });

        // 2. Poll partner's state OR poll for incoming connection if not yet connected
        const pollQuery = partnerCode
          ? `code=${partnerCode}&myCode=${myCode}`
          : `myCode=${myCode}`;

        const res = await fetch(`/api/partner/live-poll?${pollQuery}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            // Bi-directional connection discovery:
            // When partner enters my code, I automatically become connected and see it in real-time!
            if (!isConnected && data.connected && data.partnerCode) {
              if (onConnectPartner) {
                onConnectPartner(data.partnerCode, data.partnerName || 'همراه سلامت');
              }
              Alert.alert(
                '🎉 همراه سلامت متصل شد!',
                `${data.partnerName || 'همراه شما'} کد دعوت شما را وارد کرد و اکنون به یکدیگر متصل هستید!`
              );
            }

            if (data.connected) {
              setLiveData(data);
              if (data.nudge && data.nudge.timestamp !== lastNudgeTimeRef.current) {
                lastNudgeTimeRef.current = data.nudge.timestamp;
                setIncomingNudge(data.nudge);
                // Clear server nudge so it doesn't repeat
                fetch('/api/partner/clear-nudge', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ myCode }),
                }).catch(() => {});
                setTimeout(() => {
                  if (isMounted) setIncomingNudge(null);
                }, 6000);
              }
            }
          }
        }
      } catch (err) {
        // Silent catch for offline
      }
    };

    // Initial run
    syncAndPoll();

    // 3-second live poll for real-time hydration awareness
    const interval = setInterval(syncAndPoll, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [myCode, partnerCode, isConnected, userGlasses, userGoal, userName, onConnectPartner]);

  const partnerName = liveData?.partnerName || partnerData?.partnerName || 'همراه سلامت';
  const partnerGlasses = liveData?.partnerGlasses ?? partnerData?.progress?.totalGlasses ?? 0;
  const partnerGoal = liveData?.partnerGoal ?? partnerData?.progress?.goalGlasses ?? 8;
  const partnerPercent = partnerGoal > 0 ? Math.min(Math.round((partnerGlasses / partnerGoal) * 100), 100) : 0;
  const lastDrink = liveData?.lastDrink;

  const [shareProgress, setShareProgress] = useState(partnerData?.shareProgress ?? true);
  const [shareLastDrink, setShareLastDrink] = useState(partnerData?.shareLastDrink ?? true);

  const handleCopyCode = async () => {
    const success = await copyTextToClipboard(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (success) {
      Alert.alert(
        'کد کپی شد!',
        `کد اختصاصی شما (${myCode}) در کلیپ‌بورد کپی شد. حالا می‌توانید آن را برای همراه سلامت خود ارسال کنید.`
      );
    } else {
      Alert.alert('کد دعوت', `کد دعوت اختصاصی شما: ${myCode}`);
    }
  };

  const handleConnect = async () => {
    const clean = inputCode.trim().toUpperCase();
    if (!clean || clean.length < 4) {
      Alert.alert('کد نامعتبر', 'لطفاً کد دعوت معتبر همراه خود را وارد کنید (مثال: AB-1234)');
      return;
    }
    if (clean === myCode) {
      Alert.alert('خطا', 'نمی‌توانید کد دعوت خودتان را وارد کنید!');
      return;
    }

    try {
      const res = await fetch('/api/partner/quick-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myCode,
          partnerCode: clean,
          myName: userName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (onConnectPartner) {
          onConnectPartner(clean, data.partnerName || 'همراه سلامت');
        }
        setInputCode('');
        Alert.alert('تبریک!', `شما با موفقیت به همراه سلامت متصل شدید و هر دو کاربر همگام شدند.`);
      } else {
        if (onConnectPartner) {
          onConnectPartner(clean);
        }
        setInputCode('');
        Alert.alert('متصل شدید', `ارتباط با همراه برقرار شد.`);
      }
    } catch (e) {
      if (onConnectPartner) {
        onConnectPartner(clean);
      }
      setInputCode('');
    }
  };

  const handleNudge = async () => {
    setNudged(true);
    setTimeout(() => setNudged(false), 3000);

    if (partnerCode) {
      try {
        await fetch('/api/partner/send-nudge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetCode: partnerCode,
            fromName: userName || 'همراه شما',
            message: 'یک لیوان آب خنک بنوش و سالم بمون! 💧',
          }),
        });
      } catch (e) {
        // Silent
      }
    }

    Alert.alert(
      'یادآوری ارسال شد',
      `پیام محبت‌آمیز یادآوری نوشیدن آب برای ${partnerName} به صورت زنده ارسال شد.`
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
          onPress: async () => {
            try {
              await fetch('/api/partner/quick-disconnect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ myCode }),
              });
            } catch (e) {}
            if (onDisconnectPartner) {
              onDisconnectPartner();
            }
          },
        },
      ]
    );
  };

  const handleToggleProgress = (val) => {
    setShareProgress(val);
    if (onUpdateSharing) onUpdateSharing({ shareProgress: val, shareLastDrink });
  };

  const handleToggleLastDrink = (val) => {
    setShareLastDrink(val);
    if (onUpdateSharing) onUpdateSharing({ shareProgress, shareLastDrink: val });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <ChevronRight size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>همراه سلامت (دو نفره)</Text>
          <Text style={styles.headerSubtitle}>انگیزه و همدلی در نوشیدن آب</Text>
        </View>
        <View style={styles.headerIconWrapper}>
          <Users size={20} color="#059669" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isConnected ? (
          /* Active Partner View */
          <View style={styles.activeContainer}>
            <View style={styles.partnerHeroCard}>
              <View style={styles.partnerAvatarRow}>
                <View style={styles.partnerAvatar}>
                  <Heart size={28} color="#EF4444" fill="#EF4444" />
                </View>
                <View style={styles.partnerInfoCol}>
                  <Text style={styles.partnerNameText}>{partnerName}</Text>
                  <View style={styles.liveStatusRow}>
                    <View style={styles.livePulseDot} />
                    <Text style={styles.partnerConnectedStatus}>اتصال زنده و ریل‌تایم</Text>
                  </View>
                </View>
              </View>

              {/* Incoming Nudge Alert Banner */}
              {incomingNudge && (
                <View style={styles.nudgeAlertBanner}>
                  <Sparkles size={16} color="#0284C7" />
                  <Text style={styles.nudgeAlertText}>
                    💌 {incomingNudge.from}: «{incomingNudge.message}»
                  </Text>
                </View>
              )}

              <View style={styles.partnerProgressBox}>
                <View style={styles.progressRowHeader}>
                  <Text style={styles.progressLabel}>مصرف امروز همراه:</Text>
                  <Text style={styles.progressValue}>
                    {formatNumber(partnerGlasses)} از {formatNumber(partnerGoal)} لیوان ({formatNumber(partnerPercent)}٪)
                  </Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${partnerPercent}%` }]} />
                </View>
                {lastDrink && (
                  <View style={styles.lastDrinkRow}>
                    <Clock size={12} color="#64748B" />
                    <Text style={styles.lastDrinkText}>
                      آخرین نوشیدنی: {lastDrink.beverage || 'آب خالص'} ({formatNumber(lastDrink.amount || 1)} لیوان)
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.nudgeBtn} onPress={handleNudge} activeOpacity={0.85}>
                <Send size={18} color="#FFFFFF" />
                <Text style={styles.nudgeBtnText}>
                  {nudged ? 'یادآوری ارسال شد!' : 'ارسال انگیزه و یادآوری ریل‌تایم'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Privacy & Sharing Settings */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>تنظیمات حریم خصوصی و اشتراک‌گذاری</Text>

              <View style={styles.switchRow}>
                <Switch
                  value={shareProgress}
                  onValueChange={handleToggleProgress}
                  trackColor={{ false: '#CBD5E1', true: '#6EE7B7' }}
                  thumbColor={shareProgress ? '#059669' : '#F1F5F9'}
                />
                <View style={styles.switchLabelCol}>
                  <Text style={styles.switchTitle}>اشتراک‌گذاری درصد پیشرفت</Text>
                  <Text style={styles.switchSub}>همراه شما بتواند تعداد لیوان‌های نوشیده‌شده شما را ببیند</Text>
                </View>
              </View>

              <View style={[styles.switchRow, { marginTop: 12 }]}>
                <Switch
                  value={shareLastDrink}
                  onValueChange={handleToggleLastDrink}
                  trackColor={{ false: '#CBD5E1', true: '#6EE7B7' }}
                  thumbColor={shareLastDrink ? '#059669' : '#F1F5F9'}
                />
                <View style={styles.switchLabelCol}>
                  <Text style={styles.switchTitle}>اشتراک‌گذاری زمان آخرین نوشیدنی</Text>
                  <Text style={styles.switchSub}>نمایش زمان آخرین باری که آب ثبت کردید</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.disconnectBtn} onPress={handleDisconnect} activeOpacity={0.7}>
                <Unlink size={16} color="#DC2626" />
                <Text style={styles.disconnectBtnText}>قطع ارتباط با این همراه</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Empty / Not Connected View */
          <View style={styles.connectContainer}>
            {/* Invite Code Box */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Sparkles size={18} color="#059669" />
                <Text style={styles.cardTitle}>کد دعوت اختصاصی شما</Text>
              </View>
              <Text style={styles.cardSubtitle}>
                این کد را برای دوست، همسر یا همکارتان بفرستید تا در آب‌یار همراه یکدیگر شوید:
              </Text>

              <View style={styles.codeDisplayBox}>
                <Text style={styles.codeText}>{myCode}</Text>
              </View>

              <TouchableOpacity style={styles.shareCodeBtn} onPress={handleCopyCode} activeOpacity={0.85}>
                <Copy size={18} color="#FFFFFF" />
                <Text style={styles.shareCodeBtnText}>
                  {copied ? 'ارسال شد!' : 'اشتراک‌گذاری کد با همراه'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Enter Partner's Code */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <UserPlus size={18} color="#2D9CFF" />
                <Text style={styles.cardTitle}>کد همراه خود را وارد کنید</Text>
              </View>
              <Text style={styles.cardSubtitle}>
                اگر دوستتان برای شما کد فرستاده، آن را در کادر زیر وارد کنید:
              </Text>

              <TextInput
                style={styles.codeInput}
                value={inputCode}
                onChangeText={setInputCode}
                placeholder="مثلاً AB-4589"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />

              <TouchableOpacity style={styles.connectBtn} onPress={handleConnect} activeOpacity={0.85}>
                <Link size={18} color="#FFFFFF" />
                <Text style={styles.connectBtnText}>اتصال به همراه سلامت</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  activeContainer: {
    gap: 16,
  },
  partnerHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  partnerAvatarRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  partnerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInfoCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  partnerNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  liveStatusRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  partnerConnectedStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  nudgeAlertBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
  },
  nudgeAlertText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    flex: 1,
    textAlign: 'right',
  },
  lastDrinkRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },
  lastDrinkText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  partnerProgressBox: {
    marginTop: 18,
    padding: 14,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
  },
  progressRowHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#D1FAE5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  nudgeBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  nudgeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  connectContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 14,
  },
  codeDisplayBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#86EFAC',
    alignItems: 'center',
    marginBottom: 14,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 3,
  },
  shareCodeBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 46,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareCodeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  codeInput: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 12,
  },
  connectBtn: {
    backgroundColor: '#2D9CFF',
    borderRadius: 14,
    height: 46,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  connectBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  switchLabelCol: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  switchSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },
  disconnectBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    paddingVertical: 10,
  },
  disconnectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});
