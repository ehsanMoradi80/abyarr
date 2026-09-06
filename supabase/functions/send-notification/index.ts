import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY') ?? '';
const FCM_PROJECT_ID = Deno.env.get('FCM_PROJECT_ID') ?? 'noosh-851a5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, title, body, data } = await req.json();

    if (!to || !title) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use FCM v1 API
    const fcmResponse = await fetch(
      `https://fcm.googleapis.com/v1/projects/${FCM_PROJECT_ID}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FCM_SERVER_KEY}`,
        },
        body: JSON.stringify({
          message: {
            token: to,
            notification: { title, body },
            data: data ?? {},
            android: {
              priority: 'high',
              notification: {
                channel_id: 'partner-alerts',
                sound: 'default',
              },
            },
          },
        }),
      }
    );

    if (!fcmResponse.ok) {
      const errorText = await fcmResponse.text();
      console.error('FCM error:', errorText);
      return new Response(JSON.stringify({ error: 'FCM send failed', details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await fcmResponse.json();
    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
