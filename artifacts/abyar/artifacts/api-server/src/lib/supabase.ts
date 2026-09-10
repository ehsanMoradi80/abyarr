import { ReplitConnectors } from "@replit/connectors-sdk";

type SupabaseRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export class SupabaseError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, details: unknown) {
    super("Supabase request failed");
    this.name = "SupabaseError";
    this.status = status;
    this.details = details;
  }
}

export async function supabaseRequest(path: string, options: SupabaseRequestOptions = {}) {
  const connectors = new ReplitConnectors();
  const response = await connectors.proxy("supabase", path, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    let details: unknown = raw;
    try {
      details = raw ? JSON.parse(raw) : null;
    } catch {
      // Keep the raw response when Supabase did not return JSON.
    }
    throw new SupabaseError(response.status, details);
  }

  return response;
}

export async function supabaseJson<T>(path: string, options: SupabaseRequestOptions = {}) {
  const response = await supabaseRequest(path, options);
  const raw = await response.text();
  return (raw ? JSON.parse(raw) : null) as T;
}

export function supabaseErrorMessage(error: unknown) {
  if (!(error instanceof SupabaseError)) return "Cloud service unavailable";
  if (error.status === 401 || error.status === 403) return "Cloud authorization is not configured";
  return "Cloud service unavailable";
}