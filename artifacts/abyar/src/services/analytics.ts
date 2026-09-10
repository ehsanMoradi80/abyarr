import { AnalyticsParams, AnalyticsScreenViewOptions, normalizeAnalyticsParams } from './analytics.shared';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

let initialized = false;
let initPromise: Promise<void> | null = null;

function ensureScript(): Promise<void> {
  if (typeof window === 'undefined' || !MEASUREMENT_ID) {
    return Promise.resolve();
  }

  if (initialized) {
    return Promise.resolve();
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = new Promise<void>((resolve) => {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtagShim(...args: any[]) {
        window.dataLayer?.push(args);
      };

    const existing = document.querySelector(`script[data-ga4="${MEASUREMENT_ID}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
      script.dataset.ga4 = MEASUREMENT_ID;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    } else {
      resolve();
    }
  }).then(() => {
    window.gtag?.('js', new Date());
    window.gtag?.('config', MEASUREMENT_ID, {
      send_page_view: false,
    });
    initialized = true;
  });

  return initPromise;
}

export async function initAnalytics(): Promise<void> {
  await ensureScript();
}

export async function setAnalyticsUserId(userId: string | null | undefined): Promise<void> {
  await ensureScript();
  if (!MEASUREMENT_ID || !userId) return;
  window.gtag?.('set', { user_id: userId });
}

export async function trackEvent(name: string, params: AnalyticsParams = {}): Promise<void> {
  await ensureScript();
  if (!MEASUREMENT_ID) return;
  window.gtag?.('event', name, normalizeAnalyticsParams(params));
}

export async function trackScreenView(options: AnalyticsScreenViewOptions): Promise<void> {
  await ensureScript();
  if (!MEASUREMENT_ID) return;

  const screenName = options.screenName || options.title || 'screen';
  const url = options.url || (typeof window !== 'undefined' ? window.location.href : undefined);
  const path = options.path || (screenName ? `/${screenName}` : undefined);

  window.gtag?.('event', 'page_view', {
    page_title: options.title || screenName,
    page_location: url,
    page_path: path,
    screen_name: screenName,
    screen_class: options.screenClass || screenName,
  });
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(MEASUREMENT_ID);
}
