import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client with service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper to verify user authentication
async function verifyUser(authToken: string): Promise<{ userId: string; userEmail: string }> {
  const anonSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!)
  const { data: userData, error: userError } = await anonSupabase.auth.getUser(authToken)
  
  if (userError || !userData.user) {
    throw new Error('Invalid authentication token')
  }

  return {
    userId: userData.user.id,
    userEmail: userData.user.email || ''
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Activate 30-day trial for user
    if ((path === '/activate' || path.endsWith('/activate')) && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization header required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      const { userId, userEmail } = await verifyUser(token)

      // Check if user already has premium status
      const { data: existingStatus } = await supabase
        .from('user_premium_status')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (existingStatus) {
        return new Response(
          JSON.stringify({ 
            error: 'User already has premium status',
            current: existingStatus
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Grant 30-day trial
      const now = new Date()
      const expiresAt = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days from now

      const { error: statusError } = await supabase
        .from('user_premium_status')
        .insert({
          user_id: userId,
          is_premium: true,
          premium_type: '30day_trial',
          activated_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          activated_code: 'FREE_TRIAL_30',
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        })

      if (statusError) {
        console.error('Error creating trial status:', statusError)
        throw statusError
      }

      // Ensure user has a profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name: userEmail.split('@')[0],
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        // Don't fail for profile errors
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: '30-day trial activated',
          expiresAt: expiresAt.toISOString(),
          trialDays: 30
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Check if user needs trial activation
    if ((path === '/check' || path.endsWith('/check')) && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization header required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      const { userId } = await verifyUser(token)

      // Check if user has premium status
      const { data: existingStatus } = await supabase
        .from('user_premium_status')
        .select('*')
        .eq('user_id', userId)
        .single()

      return new Response(
        JSON.stringify({ 
          hasPremium: !!existingStatus,
          needsTrial: !existingStatus,
          status: existingStatus
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error) {
    console.error('30-day trial function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}) 