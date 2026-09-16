import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  BackHandler,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  requestNotificationPermission,
  scheduleWaterReminder,
  cancelAllReminders,
} from './native/notifications';

const REMOTE_URL = 'https://ais-pre-ufdicntlroh3siayalojg7-517497980877.europe-west2.run.app';
const LOCAL_ASSET_URL = 'file:///android_asset/web/inline.html';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [useRemoteFallback, setUseRemoteFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate safe paddings for Android (Selfie camera / notch at top, Navigation buttons at bottom)
  const screenDimensions = Dimensions.get('screen');
  const windowDimensions = Dimensions.get('window');
  const statusBarHeight = StatusBar.currentHeight || 36;
  const topInset = Platform.OS === 'android' ? statusBarHeight : 0;
  
  const navBarDifference = Math.max(screenDimensions.height - windowDimensions.height, 0);
  const bottomInset = Platform.OS === 'android' ? Math.max(navBarDifference, 28) : 0;

  // Request notification permissions on launch
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  // Handle messages from the Web App (Native Bridge)
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SCHEDULE_ALARM') {
        const interval = data.payload?.intervalMinutes || 60;
        const name = data.payload?.userName || '';
        scheduleWaterReminder(interval, name);
      } else if (data.type === 'CANCEL_ALARM') {
        cancelAllReminders();
      }
    } catch (err) {
      console.warn('Native bridge message handling error:', err);
    }
  };

  // Decide current target URL
  const currentSource = useRemoteFallback
    ? { uri: REMOTE_URL }
    : Platform.OS === 'android'
    ? { uri: LOCAL_ASSET_URL }
    : { uri: REMOTE_URL };

  // Injected JS to set native safe area CSS variables & bridge indicator
  const injectedJs = `
    (function() {
      window.isNativeAndroidApp = true;
      document.documentElement.style.setProperty('--safe-top', '${topInset}px');
      document.documentElement.style.setProperty('--safe-bottom', '${bottomInset}px');
    })();
    true;
  `;

  return (
    <View style={styles.rootContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F2F6FA"
        translucent={false}
      />

      {/* Main WebView Container */}
      <View
        style={[
          styles.contentWrapper,
          {
            paddingBottom: bottomInset,
          },
        ]}
      >
        <WebView
          ref={webViewRef}
          source={currentSource}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          originWhitelist={['*']}
          scalesPageToFit={false}
          bounces={false}
          overScrollMode="never"
          textZoom={100}
          injectedJavaScriptBeforeContentLoaded={injectedJs}
          onMessage={handleMessage}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onLoadStart={() => {
            setLoadError(false);
          }}
          onLoadEnd={() => {
            setIsLoading(false);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView load error:', nativeEvent);
            if (!useRemoteFallback) {
              // If local asset failed, fallback to remote live URL
              setUseRemoteFallback(true);
            } else {
              setLoadError(true);
            }
          }}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2D9CFF" />
            <Text style={styles.loadingText}>در حال بارگذاری نوش...</Text>
          </View>
        )}

        {/* Error / Offline Retry Screen */}
        {loadError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorTitle}>عدم دسترسی به برنامه</Text>
            <Text style={styles.errorSubtitle}>
              لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setLoadError(false);
                setIsLoading(true);
                if (webViewRef.current) {
                  webViewRef.current.reload();
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>تلاش دوباره</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  webView: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#0284C7',
    fontWeight: '700',
    writingDirection: 'rtl',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    writingDirection: 'rtl',
    maxWidth: 280,
  },
  retryButton: {
    backgroundColor: '#2D9CFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
