import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "*",
};

function getOpenSeaApiKey(): string | undefined {
  return Deno.env.get('OPENSEA_API_KEY')
    || Deno.env.get('VITE_OPENSEA_API_KEY')
    || Deno.env.get('NEXT_PUBLIC_OPENSEA_API_KEY')
    || Deno.env.get('OPENSEAKEY')
    || undefined;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = getOpenSeaApiKey();
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...(apiKey ? { 'X-API-KEY': apiKey } : {}),
      },
    });

    const contentType = res.headers.get('content-type') || 'application/json';
    const bodyText = await res.text();

    return new Response(bodyText, {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': contentType },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


