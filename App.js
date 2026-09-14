import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';

// The canonical URL of the Abyar web application
const WEB_APP_URL = 'https://ais-dev-ufdicntlroh3siayalojg7-517497980877.europe-west2.run.app';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle hardware Android back button
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (webViewRef.current && canGoBack) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [canGoBack]);

  // Handle native notifications & alarms dispatched by the web app
  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (!data || !data.type) return;

      if (data.type === 'SCHEDULE_ALARM') {
        const { userName, title } = data.payload || {};
        try {
          const Notifications = await import('expo-notifications');
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === 'granted') {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: title || '💧 وقت نوشیدن آب!',
                body: userName ? `${userName} عزیز، وقت نوشیدن یک لیوان آب خنک است 💧` : 'یک لیوان آب تازه برای سلامتی و شادابیت بنوش!',
                sound: true,
              },
              trigger: {
                seconds: (data.payload?.intervalMinutes || 60) * 60,
                repeats: true,
              },
            });
          }
        } catch (err) {
          console.warn('Native notification scheduling failed:', err);
        }
      } else if (data.type === 'CANCEL_ALARM') {
        try {
          const Notifications = await import('expo-notifications');
          await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (err) {
          console.warn('Native notification cancellation failed:', err);
        }
      }
    } catch (err) {
      // Non-JSON message, safe to ignore
    }
  };

  const reloadApp = () => {
    setHasError(false);
    setIsLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F6FA" />

      <View style={styles.webContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          scalesPageToFit={true}
          mixedContentMode="always"
          originWhitelist={['*']}
          cacheEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onLoadStart={() => {
            setIsLoading(true);
            setHasError(false);
          }}
          onLoadEnd={() => {
            setIsLoading(false);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setHasError(true);
            setErrorMessage(nativeEvent.description || 'عدم دسترسی به اینترنت');
            setIsLoading(false);
          }}
          onMessage={handleMessage}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2D9CFF" />
            <Text style={styles.loadingText}>در حال بارگذاری آب‌یار...</Text>
          </View>
        )}

        {/* Offline / Connection Error Overlay */}
        {hasError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>📶</Text>
            <Text style={styles.errorTitle}>خطا در اتصال به برنامه</Text>
            <Text style={styles.errorDescription}>
              لطفاً اتصال اینترنت خود را بررسی کنید و مجدداً تلاش نمایید.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={reloadApp}>
              <Text style={styles.retryButtonText}>تلاش مجدد</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  webContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#0284C7',
    fontWeight: '600',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    zIndex: 20,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#2D9CFF',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#2D9CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
