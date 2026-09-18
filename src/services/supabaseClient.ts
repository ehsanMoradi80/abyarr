import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = (
    import.meta.env?.VITE_SUPABASE_URL ||
    (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.EXPO_PUBLIC_SUPABASE_URL || process.env?.SUPABASE_URL))
  ) as string | undefined;

  const anonKey = (
    import.meta.env?.VITE_SUPABASE_ANON_KEY ||
    (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY))
  ) as string | undefined;

  if (!url || !anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return supabaseInstance;
}

export const isSupabaseClientConfigured = (): boolean => {
  return Boolean(
    (import.meta.env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.EXPO_PUBLIC_SUPABASE_URL || process.env?.SUPABASE_URL))) &&
    (import.meta.env?.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)))
  );
};

export type RealtimeStatus = {
  ownerTodayMl: number;
  partnerTodayMl: number;
  ownerLastDrinkAt: string | null;
  partnerLastDrinkAt: string | null;
};

let partnerChannel: RealtimeChannel | null = null;

export function subscribeToPartnerRealtime(
  relationshipId: string,
  onUpdate: (status: RealtimeStatus) => void,
): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return () => {};
  }

  // Unsubscribe from any existing channel
  if (partnerChannel) {
    supabase.removeChannel(partnerChannel);
    partnerChannel = null;
  }

  // Subscribe to water_logs changes for the relationship
  partnerChannel = supabase
    .channel(`partner-${relationshipId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'water_logs',
      },
      () => {
        // Refetch the partner status when any water_log changes
        fetchPartnerStatus(relationshipId).then(onUpdate);
      },
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
      },
      () => {
        // Refetch when profile changes (goal updates)
        fetchPartnerStatus(relationshipId).then(onUpdate);
      },
    )
    .subscribe();

  // Initial fetch
  fetchPartnerStatus(relationshipId).then(onUpdate);

  // Return cleanup function
  return () => {
    if (partnerChannel) {
      supabase.removeChannel(partnerChannel);
      partnerChannel = null;
    }
  };
}

async function fetchPartnerStatus(relationshipId: string): Promise<RealtimeStatus> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ownerTodayMl: 0,
      partnerTodayMl: 0,
      ownerLastDrinkAt: null,
      partnerLastDrinkAt: null,
    };
  }

  const { data, error } = await supabase
    .from('partner_realtime_status')
    .select('*')
    .eq('relationship_id', relationshipId)
    .single();

  if (error || !data) {
    return {
      ownerTodayMl: 0,
      partnerTodayMl: 0,
      ownerLastDrinkAt: null,
      partnerLastDrinkAt: null,
    };
  }

  return {
    ownerTodayMl: data.owner_today_ml || 0,
    partnerTodayMl: data.partner_today_ml || 0,
    ownerLastDrinkAt: data.owner_last_drink_at,
    partnerLastDrinkAt: data.partner_last_drink_at,
  };
}
