export type AnalyticsValue = string | number | boolean | null | undefined;

export type AnalyticsParams = Record<string, AnalyticsValue>;

export interface AnalyticsScreenViewOptions {
  screenName?: string;
  screenClass?: string;
  title?: string;
  path?: string;
  url?: string;
}

export function normalizeAnalyticsParams(params: AnalyticsParams = {}): Record<string, string | number | boolean> {
  const normalized: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      normalized[key] = value;
    }
  });

  return normalized;
}
