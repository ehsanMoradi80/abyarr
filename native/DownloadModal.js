import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import {
  Download,
  Smartphone,
  X,
  CheckCircle2,
  Share2,
  Sparkles,
  QrCode,
  Github,
  Globe,
  Check,
  Copy,
} from 'lucide-react-native';
import { copyTextToClipboard } from './clipboard';

export function DownloadModal({ visible, onClose, inviteCode = '' }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!visible) return null;

  const appDownloadUrl = typeof window !== 'undefined' ? window.location.origin : 'https://abyar.app';
  const shareMessage = `سلام! برنامه یادآور آب «آب‌یار» رو دانلود کن تا با هم همراه سلامت باشیم و به صورت زنده حواسمون به آب خوردن همدیگه باشه!\nلینک برنامه: ${appDownloadUrl}\nکد همراه من: ${inviteCode || 'AB-1000'}`;

  const handleShareApp = async () => {
    try {
      await Share.share({
        title: 'دانلود اپلیکیشن آب‌یار',
        message: shareMessage,
      });
    } catch (e) {
      Alert.alert('لینک برنامه', appDownloadUrl);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyTextToClipboard(shareMessage);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    if (success) {
      Alert.alert('کپی شد!', 'لینک دعوت و دانلود در کلیپ‌بورد کپی شد.');
    } else {
      Alert.alert('کد دعوت', `کد همراه شما: ${inviteCode || 'AB-1000'}\nلینک برنامه: ${appDownloadUrl}`);
    }
  };

  const handleTriggerDownload = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 3000);

    // If web browser/PWA environment, trigger install prompt or download
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (window.deferredPWA && typeof window.deferredPWA.prompt === 'function') {
        window.deferredPWA.prompt();
      }
      try {
        const blob = new Blob([
          JSON.stringify(
            {
              name: 'آب‌یار (Abyar)',
              version: '1.0.0',
              type: 'Android APK / PWA Package',
              buildDate: new Date().toISOString(),
              inviteCode,
              status: 'Production Ready',
            },
            null,
            2
          ),
        ], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'abyar-android-info.json';
        a.click();
      } catch (e) {
        // Fallback for native runtime
      }
    }

    Alert.alert(
      'آماده‌سازی نصب',
      'برای نصب اپلیکیشن روی گوشی اندروید:\n۱. در منوی مرورگر گوشی، گزینه «افزودن به صفحه اصلی» (Add to Home screen) یا «نصب برنامه» را انتخاب کنید.\n۲. فایل خروجی APK در گیت‌هاب اکشنز نیز به طور خودکار بیلد و ایجاد می‌شود.'
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>دانلود و نصب اپلیکیشن</Text>
              <View style={styles.badgeBox}>
                <Smartphone size={16} color="#0284C7" />
              </View>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Main Action Banner */}
            <View style={styles.heroCard}>
              <View style={styles.heroIconBox}>
                <Download size={32} color="#FFFFFF" strokeWidth={2.4} />
              </View>
              <Text style={styles.heroTitle}>نصب فوری نسخه اندروید</Text>
              <Text style={styles.heroSubtitle}>
                برنامه آب‌یار به صورت مستقیم و بدون نیاز به نصب از مارکت‌های متفرقه روی گوشی شما نصب می‌شود و تمام قابلیت‌های آفلاین و نوتیفیکیشن را دارد.
              </Text>

              <TouchableOpacity
                style={styles.primaryDownloadBtn}
                onPress={handleTriggerDownload}
                activeOpacity={0.85}
              >
                <Download size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.primaryDownloadBtnText}>
                  {downloadStarted ? 'در حال دریافت اطلاعات...' : 'نصب و افزودن به صفحه اصلی گوشی'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Invite Partner Step */}
            <View style={styles.stepSection}>
              <Text style={styles.sectionHeading}>ارسال برای همراه سلامت</Text>
              <Text style={styles.sectionDesc}>
                لینک دانلود را همراه با کد دعوتت بفرست تا هر دو روی برنامه باشید و به صورت ریل‌تایم مصرف آب همدیگه رو ببینید:
              </Text>

              {inviteCode ? (
                <View style={styles.codeRow}>
                  <TouchableOpacity
                    style={styles.copySmallBtn}
                    onPress={handleCopyLink}
                    activeOpacity={0.7}
                  >
                    {copiedLink ? (
                      <Check size={16} color="#10B981" />
                    ) : (
                      <Copy size={16} color="#0284C7" />
                    )}
                    <Text style={[styles.copySmallBtnText, copiedLink && { color: '#10B981' }]}>
                      {copiedLink ? 'کپی شد' : 'کپی لینک و کد'}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.codePill}>
                    <Text style={styles.codeLabel}>کد دعوت شما:</Text>
                    <Text style={styles.codeText}>{inviteCode}</Text>
                  </View>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.shareBtn}
                onPress={handleShareApp}
                activeOpacity={0.8}
              >
                <Share2 size={18} color="#0284C7" strokeWidth={2.2} />
                <Text style={styles.shareBtnText}>ارسال لینک و کد به همراه سلامت</Text>
              </TouchableOpacity>
            </View>

            {/* Installation Instructions */}
            <View style={styles.guideCard}>
              <View style={styles.guideHeader}>
                <Sparkles size={16} color="#F59E0B" />
                <Text style={styles.guideTitle}>روش‌های استفاده و نصب</Text>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumBox}>
                  <Text style={styles.guideNum}>۱</Text>
                </View>
                <View style={styles.guideTextBox}>
                  <Text style={styles.guideItemTitle}>نصب سریع PWA (پیشنهادی):</Text>
                  <Text style={styles.guideItemDesc}>
                    در کروم یا سامسونگ اینترنت گوشی، روی علامت سه نقطه (⋮) بزنید و گزینه «نصب برنامه» یا «افزودن به صفحه اصلی» را لمس کنید.
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumBox}>
                  <Text style={styles.guideNum}>۲</Text>
                </View>
                <View style={styles.guideTextBox}>
                  <Text style={styles.guideItemTitle}>بیلد مستقل APK با گیت‌هاب اکشنز:</Text>
                  <Text style={styles.guideItemDesc}>
                    کانفیگ گیت‌هاب اکشنز پروژه با Expo EAS تنظیم شده و پس از اجرای ورک‌فلو، فایل مستقیم `.apk` به عنوان Artifact در بخش Actions قابل دانلود است.
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumBox}>
                  <Text style={styles.guideNum}>۳</Text>
                </View>
                <View style={styles.guideTextBox}>
                  <Text style={styles.guideItemTitle}>همگام‌سازی ابری و آفلاین:</Text>
                  <Text style={styles.guideItemDesc}>
                    داده‌های شما هم در حافظه داخلی گوشی و هم روی سرور Supabase به صورت ریل‌تایم ذخیره می‌شوند.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  headerTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgeBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: '#0284C7',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#E0F2FE',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  primaryDownloadBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0369A1',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryDownloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 12,
  },
  codeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  codePill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  codeLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  codeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0284C7',
    letterSpacing: 1,
  },
  copySmallBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
  },
  copySmallBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  shareBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 14,
    paddingVertical: 12,
  },
  shareBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guideHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  guideItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  guideNumBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  guideNum: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0284C7',
  },
  guideTextBox: {
    flex: 1,
  },
  guideItemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
    marginBottom: 2,
  },
  guideItemDesc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
    lineHeight: 17,
  },
});
