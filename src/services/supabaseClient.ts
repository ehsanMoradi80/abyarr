// Supabase client and user-filtered Realtime subscription service
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseClient) return supabaseClient;

  const url =
    (typeof window !== 'undefined' && (window as any)?.__ENV__?.VITE_SUPABASE_URL) ||
    import.meta.env?.VITE_SUPABASE_URL ||
    (typeof process !== 'undefined' &&
      (process.env?.VITE_SUPABASE_URL ||
        process.env?.EXPO_PUBLIC_SUPABASE_URL ||
        process.env?.SUPABASE_URL));

  const anonKey =
    (typeof window !== 'undefined' && (window as any)?.__ENV__?.VITE_SUPABASE_ANON_KEY) ||
    import.meta.env?.VITE_SUPABASE_ANON_KEY ||
    (typeof process !== 'undefined' &&
      (process.env?.VITE_SUPABASE_ANON_KEY ||
        process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
        process.env?.SUPABASE_ANON_KEY));

  if (!url || !anonKey) {
    return null;
  }

  supabaseClient = createClient(url, anonKey, {
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

  return supabaseClient;
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    (import.meta.env?.VITE_SUPABASE_URL ||
      (typeof process !== 'undefined' &&
        (process.env?.VITE_SUPABASE_URL ||
          process.env?.EXPO_PUBLIC_SUPABASE_URL ||
          process.env?.SUPABASE_URL))) &&
    (import.meta.env?.VITE_SUPABASE_ANON_KEY ||
      (typeof process !== 'undefined' &&
        (process.env?.VITE_SUPABASE_ANON_KEY ||
          process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
          process.env?.SUPABASE_ANON_KEY)))
  );
};

export const isSupabaseClientConfigured = isSupabaseConfigured;

export type RealtimeStatus = {
  ownerTodayMl: number;
  partnerTodayMl: number;
  ownerLastDrinkAt: string | null;
  partnerLastDrinkAt: string | null;
};

let partnerChannel: RealtimeChannel | null = null;
let broadcastChannels = new Map<string, RealtimeChannel>();

/**
 * True Supabase Realtime user-filtered listener:
 * Subscribes only to changes for the specified user or partner relationship.
 */
export function subscribeToPartnerRealtime(
  relationshipId: string,
  onUpdate: (status: RealtimeStatus) => void,
  partnerUserId?: string
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

  const channelName = `partner-room-${relationshipId}`;
  partnerChannel = supabase.channel(channelName, {
    config: {
      broadcast: { self: false },
    },
  });

  // 1. User-filtered postgres_changes listener for water_logs
  partnerChannel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'water_logs',
      ...(partnerUserId ? { filter: `user_id=eq.${partnerUserId}` } : {}),
    },
    () => {
      fetchPartnerStatus(relationshipId).then(onUpdate);
    }
  );

  // 2. User-filtered postgres_changes listener for profile changes
  partnerChannel.on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      ...(partnerUserId ? { filter: `id=eq.${partnerUserId}` } : {}),
    },
    () => {
      fetchPartnerStatus(relationshipId).then(onUpdate);
    }
  );

  // 3. Supabase Realtime Broadcast for instant zero-latency sync & nudges
  partnerChannel.on('broadcast', { event: 'water_logged' }, (payload) => {
    if (payload.payload) {
      onUpdate(payload.payload);
    } else {
      fetchPartnerStatus(relationshipId).then(onUpdate);
    }
  });

  partnerChannel.on('broadcast', { event: 'partner_update' }, (payload) => {
    if (payload.payload) {
      onUpdate(payload.payload);
    }
  });

  partnerChannel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      fetchPartnerStatus(relationshipId).then(onUpdate);
    }
  });

  return () => {
    if (partnerChannel) {
      supabase.removeChannel(partnerChannel);
      partnerChannel = null;
    }
  };
}

/**
 * Realtime broadcast channel for direct pairing codes
 */
export function subscribeToPartnerBroadcast(
  pairingCode: string,
  onEvent: (event: string, payload: any) => void
): () => void {
  const supabase = getSupabaseClient();
  if (!supabase || !pairingCode) return () => {};

  const cleanCode = pairingCode.trim().toUpperCase();
  const channelName = `partner-broadcast-${cleanCode}`;

  let channel = broadcastChannels.get(channelName);
  if (!channel) {
    channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });
    channel
      .on('broadcast', { event: 'water_sync' }, (p) => onEvent('water_sync', p.payload))
      .on('broadcast', { event: 'nudge' }, (p) => onEvent('nudge', p.payload))
      .subscribe();
    broadcastChannels.set(channelName, channel);
  }

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
      broadcastChannels.delete(channelName);
    }
  };
}

/**
 * Broadcast an event directly to the paired partner via Supabase Realtime
 */
export async function broadcastToPartner(
  pairingCode: string,
  event: 'water_sync' | 'nudge',
  payload: any
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !pairingCode) return false;

  const cleanCode = pairingCode.trim().toUpperCase();
  const channelName = `partner-broadcast-${cleanCode}`;

  let channel = broadcastChannels.get(channelName);
  if (!channel) {
    channel = supabase.channel(channelName);
    await channel.subscribe();
    broadcastChannels.set(channelName, channel);
  }

  await channel.send({
    type: 'broadcast',
    event,
    payload,
  });

  return true;
}

export async function fetchPartnerStatus(relationshipId: string): Promise<RealtimeStatus> {
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
