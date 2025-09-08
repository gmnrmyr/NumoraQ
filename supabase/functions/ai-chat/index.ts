import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function corsHeaders(origin?: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  } as Record<string, string>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req.headers.get("origin") || undefined) });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(req.headers.get("origin") || undefined) },
      });
    }

    const { messages, max_tokens = 300, temperature = 0.7, presence_penalty = 0.1, frequency_penalty = 0.1, model = "gpt-4o-mini" } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(req.headers.get("origin") || undefined) },
      });
    }

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens, temperature, presence_penalty, frequency_penalty }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
      return new Response(JSON.stringify({ error: err.error?.message || `OpenAI error ${response.status}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json", ...corsHeaders(req.headers.get("origin") || undefined) },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders(req.headers.get("origin") || undefined) },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message || "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(req.headers.get("origin") || undefined) },
    });
  }
});


