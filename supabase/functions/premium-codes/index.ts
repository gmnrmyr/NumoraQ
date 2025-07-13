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

// Helper to verify user is admin
async function verifyAdminUser(authToken: string): Promise<{ userId: string; isAdmin: boolean }> {
  // Get user from token using anon key first
  const anonSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!)
  const { data: userData, error: userError } = await anonSupabase.auth.getUser(authToken)
  
  if (userError || !userData.user) {
    throw new Error('Invalid authentication token')
  }

  // Check if user is admin using service role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('admin_role')
    .eq('id', userData.user.id)
    .single()

  if (profileError) {
    throw new Error('Failed to verify admin status')
  }

  return {
    userId: userData.user.id,
    isAdmin: profile?.admin_role === true
  }
}

// Helper to verify any authenticated user
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

    // Generate premium code (admin only)
    if ((path === '/generate' || path.endsWith('/generate')) && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization header required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      const { userId, isAdmin } = await verifyAdminUser(token)

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: 'Admin access required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        )
      }

      const body = await req.json()
      const { codeType } = body

      if (!codeType || !['1year', '5years', 'lifetime'].includes(codeType)) {
        return new Response(
          JSON.stringify({ error: 'Invalid code type' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Generate code
      const code = `DEGEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      
      let expiresAt = null
      if (codeType !== 'lifetime') {
        const expiry = new Date()
        expiry.setFullYear(expiry.getFullYear() + (codeType === '1year' ? 1 : 5))
        expiresAt = expiry.toISOString()
      }

      // Insert code using service role (bypasses RLS)
      const { error } = await supabase
        .from('premium_codes')
        .insert({
          code,
          code_type: codeType,
          expires_at: expiresAt,
          created_by: userId,
          is_active: true
        })

      if (error) {
        console.error('Error creating premium code:', error)
        throw error
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          code: code,
          codeType: codeType,
          expiresAt: expiresAt
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Activate premium code (any authenticated user)
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

      const body = await req.json()
      const { code, userEmail: providedEmail } = body

      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Code is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Check if code exists and is active using service role
      const { data: codeData, error: codeError } = await supabase
        .from('premium_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .is('used_by', null)
        .single()

      if (codeError || !codeData) {
        return new Response(
          JSON.stringify({ error: 'Code not found or already used' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Calculate expiry based on code type
      const now = new Date()
      let expiresAt: Date | null = null
      
      // Get existing premium status to check for stacking
      const { data: existingStatus, error: fetchError } = await supabase
        .from('user_premium_status')
        .select('expires_at, premium_type, is_premium')
        .eq('user_id', userId)
        .single()

      let startDate = new Date()
      
      // If user has existing active premium, extend from expiry date
      if (existingStatus && existingStatus.is_premium && existingStatus.expires_at) {
        const existingExpiry = new Date(existingStatus.expires_at)
        
        // If existing plan hasn't expired yet, extend from expiry date
        if (existingExpiry > now) {
          startDate = existingExpiry
          console.log(`Extending existing premium plan from ${existingExpiry.toISOString()}`)
        } else {
          console.log('Existing plan expired, starting fresh')
        }
      }
      
      // Calculate new expiry date from start date
      switch (codeData.code_type) {
        case '1year':
          expiresAt = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())
          break
        case '5years':
          expiresAt = new Date(startDate.getFullYear() + 5, startDate.getMonth(), startDate.getDate())
          break
        case 'lifetime':
          expiresAt = new Date(2099, 11, 31)
          break
      }

      console.log(`Premium code activation: User ${userId}, Code: ${codeData.code_type}, Start: ${startDate.toISOString()}, Expires: ${expiresAt?.toISOString()}`)
      
      // Update premium code as used using service role
      const { error: updateError } = await supabase
        .from('premium_codes')
        .update({
          used_by: userId,
          used_at: now.toISOString(),
          user_email: providedEmail || userEmail
        })
        .eq('code', code)

      if (updateError) {
        console.error('Error updating premium code:', updateError)
        throw updateError
      }

      // Update user premium status using service role
      const { error: statusError } = await supabase
        .from('user_premium_status')
        .upsert({
          user_id: userId,
          is_premium: true,
          premium_type: codeData.code_type,
          activated_at: now.toISOString(),
          expires_at: expiresAt?.toISOString(),
          activated_code: code,
          updated_at: now.toISOString()
        })

      if (statusError) {
        console.error('Error updating premium status:', statusError)
        throw statusError
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          codeType: codeData.code_type,
          expiresAt: expiresAt?.toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error) {
    console.error('Premium codes function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})