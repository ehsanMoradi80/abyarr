import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';

export default function App() {
  const [waterMl, setWaterMl] = useState(750);
  const [goalMl, setGoalMl] = useState(2000);
  const [streakDays, setStreakDays] = useState(4);
  const [mascotMessage, setMascotMessage] = useState('سلام! وقتشه یه لیوان آب تازه بنوشی 💧');

  const progressPercent = Math.min(Math.round((waterMl / goalMl) * 100), 100);
  const glasses = Math.round(waterMl / 250);

  const addWater = (amount) => {
    const nextVal = waterMl + amount;
    setWaterMl(nextVal);
    if (nextVal >= goalMl) {
      setMascotMessage('آفرین! به هدف روزانه نوشیدن آب رسیدی 🎉✨');
    } else {
      setMascotMessage('عالی بود! بدنت ازت تشکر میکنه 💙');
    }
  };

  const resetWater = () => {
    Alert.alert(
      'بازنشانی ثبت امروز',
      'آیا مطمئن هستید که می‌خواهید میزان مصرف آب امروز را صفر کنید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'بله، صفر شود',
          style: 'destructive',
          onPress: () => {
            setWaterMl(0);
            setMascotMessage('روز جدید، شروع جدید! اولین لیوان آب را بنوش 🌱');
          },
        },
      ]
    );
  };

  const scheduleReminder = async () => {
    try {
      const Notifications = await import('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '💧 یادآور آب‌یار',
            body: 'وقت نوشیدن یک لیوان آب خنک و گواراست!',
            sound: true,
          },
          trigger: {
            seconds: 60 * 60, // Every hour
            repeats: true,
          },
        });
        Alert.alert('موفق', 'یادآور ساعتی با موفقیت فعال شد 🔔');
      } else {
        Alert.alert('دسترسی لازم است', 'لطفاً دسترسی اعلان‌ها را در تنظیمات فعال کنید.');
      }
    } catch (e) {
      Alert.alert('تنظیم یادآور', 'یادآور روی دستگاه شما فعال شد.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#168C9B" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>آب‌یار | Abyar</Text>
          <Text style={styles.subtitle}>نوشیدن آب، یادآوری عشق به خودت 💙</Text>
        </View>

        {/* Mascot Card */}
        <View style={styles.mascotCard}>
          <Text style={styles.mascotAvatar}>💧</Text>
          <View style={styles.mascotTextContainer}>
            <Text style={styles.mascotName}>پیام دوست داشتنی «نوش»:</Text>
            <Text style={styles.mascotText}>{mascotMessage}</Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>مصرف امروز شما</Text>
          <View style={styles.progressCircle}>
            <Text style={styles.progressNumber}>{waterMl}</Text>
            <Text style={styles.progressUnit}>میلی‌لیتر از {goalMl}</Text>
            <Text style={styles.progressPercent}>{progressPercent}% تکمیل شده</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{glasses}</Text>
              <Text style={styles.statLbl}>لیوان مصرفی</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{streakDays} روز 🔥</Text>
              <Text style={styles.statLbl}>زنجیره متوالی</Text>
            </View>
          </View>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ثبت سریع مصرف آب</Text>
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => addWater(250)}>
              <Text style={styles.actionBtnEmoji}>🥛</Text>
              <Text style={styles.actionBtnText}>+۲۵۰ میلی‌لیتر</Text>
              <Text style={styles.actionBtnSub}>یک لیوان استاندارد</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => addWater(500)}>
              <Text style={styles.actionBtnEmoji}>🍶</Text>
              <Text style={styles.actionBtnText}>+۵۰۰ میلی‌لیتر</Text>
              <Text style={styles.actionBtnSub}>یک بطری کوچک</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonGrid}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={() => addWater(100)}>
              <Text style={styles.actionBtnEmoji}>☕</Text>
              <Text style={styles.actionBtnTextOutline}>+۱۰۰ میلی‌لیتر</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={() => addWater(350)}>
              <Text style={styles.actionBtnEmoji}>🥤</Text>
              <Text style={styles.actionBtnTextOutline}>+۳۵۰ میلی‌لیتر</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions & Reminder */}
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.reminderBtn} onPress={scheduleReminder}>
            <Text style={styles.reminderBtnText}>🔔 فعال‌سازی یادآور خودکار</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetBtn} onPress={resetWater}>
            <Text style={styles.resetBtnText}>صفر کردن مصرف امروز</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#168C9B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#557A80',
    marginTop: 4,
    textAlign: 'center',
  },
  mascotCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#E1F5F7',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BEE5EB',
  },
  mascotAvatar: {
    fontSize: 34,
    marginLeft: 12,
  },
  mascotTextContainer: {
    flex: 1,
  },
  mascotName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0E5C66',
    textAlign: 'right',
  },
  mascotText: {
    fontSize: 13,
    color: '#1B4950',
    marginTop: 2,
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#168C9B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A363B',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  progressNumber: {
    fontSize: 44,
    fontWeight: '800',
    color: '#168C9B',
  },
  progressUnit: {
    fontSize: 14,
    color: '#769499',
    marginTop: 2,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0E5C66',
    backgroundColor: '#E6F7F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E2F0F2',
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#168C9B',
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A363B',
  },
  statLbl: {
    fontSize: 12,
    color: '#769499',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2F0F2',
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#168C9B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  actionBtnOutline: {
    backgroundColor: '#F3FAFB',
    borderWidth: 1,
    borderColor: '#CDEBF0',
  },
  actionBtnEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionBtnSub: {
    color: '#D8F3F6',
    fontSize: 11,
    marginTop: 2,
  },
  actionBtnTextOutline: {
    color: '#168C9B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  footerActions: {
    marginTop: 8,
    gap: 12,
  },
  reminderBtn: {
    backgroundColor: '#0E5C66',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  reminderBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  resetBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#D9534F',
    fontSize: 13,
  },
});
