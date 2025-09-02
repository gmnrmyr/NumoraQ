import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Stripe configuration
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || 'sk_test_51Rj4WCLiONz4H0DzdKAVwkIk6ODhKAA1AgFt27xII7E6lnWKxjFXOEbE4rH3Bm5eHovFjLNM4eOS2v7LCJ8ASP5Q00nbsIt597';
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') || 'whsec_l0NkY7tWgKlFMCqWaZvVJplVzpJ3faoe';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Rj4WCLiONz4H0DzG7kW8rB81KhHHRMOEX96bqeq26YbbCtVKDf9r8fzV8zPZzqO3X4KjcW9Xl6wsOXlRIHaISzk00Gwi9ixCY';

interface PaymentSession {
  id: string;
  user_id: string;
  payment_method: string;
  subscription_plan: string;
  amount: number;
  currency: string;
  status: string;
  expires_at: string;
  metadata: any;
}

interface SubscriptionPlan {
  plan: string;
  amount: number;
  currency: string;
  description: string;
  duration_days: number;
  type: 'degen' | 'donation';
}

interface DonationTier {
  tier: string;
  amount: number;
  currency: string;
  description: string;
  points: number;
  type: 'donation';
}

// Degen Plans (Premium Access)
const degenPlans: Record<string, SubscriptionPlan> = {
  '1month': {
    plan: '1month',
    amount: 9.99,
    currency: 'USD',
    description: 'Monthly Premium',
    duration_days: 30,
    type: 'degen'
  },
  '3months': {
    plan: '3months',
    amount: 24.99,
    currency: 'USD',
    description: '3 Month Premium',
    duration_days: 90,
    type: 'degen'
  },
  '6months': {
    plan: '6months',
    amount: 44.99,
    currency: 'USD',
    description: '6 Month Premium',
    duration_days: 180,
    type: 'degen'
  },
  '1year': {
    plan: '1year',
    amount: 79.99,
    currency: 'USD',
    description: 'Yearly Premium',
    duration_days: 365,
    type: 'degen'
  },
  'lifetime': {
    plan: 'lifetime',
    amount: 299,
    currency: 'USD',
    description: 'Lifetime Premium',
    duration_days: 36500, // ~100 years
    type: 'degen'
  }
};

// Donation Tiers (Support Badges)
const donationTiers: Record<string, DonationTier> = {
  'whale': {
    tier: 'whale',
    amount: 50000,
    currency: 'USD',
    description: 'Ultra VIP access',
    points: 50000,
    type: 'donation'
  },
  'legend': {
    tier: 'legend',
    amount: 10000,
    currency: 'USD',
    description: 'Priority support',
    points: 10000,
    type: 'donation'
  },
  'patron': {
    tier: 'patron',
    amount: 5000,
    currency: 'USD',
    description: 'Advanced features',
    points: 5000,
    type: 'donation'
  },
  'champion': {
    tier: 'champion',
    amount: 2000,
    currency: 'USD',
    description: 'Black hole animation',
    points: 2000,
    type: 'donation'
  },
  'supporter': {
    tier: 'supporter',
    amount: 1000,
    currency: 'USD',
    description: 'Degen access',
    points: 1000,
    type: 'donation'
  },
  'backer': {
    tier: 'backer',
    amount: 500,
    currency: 'USD',
    description: 'Special recognition',
    points: 500,
    type: 'donation'
  },
  'donor': {
    tier: 'donor',
    amount: 100,
    currency: 'USD',
    description: 'Thank you message',
    points: 100,
    type: 'donation'
  },
  'contributor': {
    tier: 'contributor',
    amount: 50,
    currency: 'USD',
    description: 'Contributor badge',
    points: 50,
    type: 'donation'
  },
  'helper': {
    tier: 'helper',
    amount: 25,
    currency: 'USD',
    description: 'Helper badge',
    points: 25,
    type: 'donation'
  },
  'friend': {
    tier: 'friend',
    amount: 20,
    currency: 'USD',
    description: 'Friend badge',
    points: 20,
    type: 'donation'
  },
  'supporter-basic': {
    tier: 'supporter-basic',
    amount: 10,
    currency: 'USD',
    description: 'Basic supporter badge',
    points: 10,
    type: 'donation'
  },
  'newcomer': {
    tier: 'newcomer',
    amount: 0,
    currency: 'USD',
    description: 'Welcome badge',
    points: 0,
    type: 'donation'
  }
};

async function createStripeCheckoutSession(sessionId: string, plan: SubscriptionPlan | DonationTier, userEmail: string, paymentType: 'degen' | 'donation', req: Request) {
  const stripe = await import('https://esm.sh/stripe@14.21.0?target=deno')
  
  const stripeClient = stripe.default(STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
    httpClient: stripe.Stripe.createFetchHttpClient(),
  })

  // Dynamic base URL detection from request
  const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://numoraq.online';
  let siteUrl = origin;
  
  // Handle localhost specially
  if (origin && origin.includes('localhost')) {
    siteUrl = origin;
  } else {
    siteUrl = Deno.env.get('SITE_URL') || 'https://numoraq.online';
  }
  
  console.log(`Using site URL: ${siteUrl} (from origin: ${origin})`);
  
  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: plan.description,
            description: paymentType === 'degen' 
              ? `Degen Premium Access - ${plan.description}`
              : `Donation Tier - ${plan.description}`,
          },
          unit_amount: Math.round(plan.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${siteUrl}/${paymentType === 'degen' ? 'payment' : 'donation'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${paymentType === 'degen' ? 'payment' : 'donation'}?canceled=true`,
    metadata: {
      session_id: sessionId,
      plan: 'plan' in plan ? plan.plan : plan.tier,
      user_email: userEmail,
      payment_type: paymentType,
    },
  })

  return session
}

async function activatePremiumAccess(userId: string, plan: SubscriptionPlan, sessionId: string) {
  console.log(`Starting premium activation for user ${userId} with plan ${plan.plan}`);
  
  try {
    // Get existing premium status to check for stacking - use basic query first
    let existingStatus = null;
    
    try {
      const { data, error } = await supabase
        .from('user_premium_status')
        .select('expires_at, premium_type, is_premium')
        .eq('user_id', userId)
        .single();
      
      if (!error) {
        existingStatus = data;
      }
    } catch (error) {
      console.log('Error fetching existing status, will create new:', error);
    }

    let startDate = new Date();
    let expirationDate = new Date();
    let isUpgradeFromTrial = false;

    // Determine start date based on existing status
    if (existingStatus) {
      const existingExpiry = new Date(existingStatus.expires_at);
      const now = new Date();
 
      // If user has existing premium that hasn't expired, extend from expiry date (TIME STACKING)
      if (existingStatus.is_premium && existingExpiry > now) {
        startDate = existingExpiry;
        console.log(`🎯 TIME STACKING: Extending existing premium plan from ${existingExpiry.toISOString()}`);
      } 
      // If user is on trial, start from now (convert trial to premium)
      else if (existingStatus.premium_type === '30day_trial') {
        startDate = now;
        isUpgradeFromTrial = true;
        console.log('Converting trial to premium, starting from now');
      }
      // If existing plan expired, start fresh
      else if (existingExpiry <= now) {
        startDate = now;
        console.log('Existing plan expired, starting fresh');
      }
      // Default: start from now
      else {
        startDate = now;
        console.log('Starting premium from now');
      }
    } else {
      // No existing status, start from now
      startDate = now;
      console.log('No existing status, starting premium from now');
    }

    // Calculate new expiry date from start date
    expirationDate = new Date(startDate);
    expirationDate.setDate(expirationDate.getDate() + plan.duration_days);

    console.log(`📅 Premium activation: User ${userId}, Plan: ${plan.plan}, Start: ${startDate.toISOString()}, Expires: ${expirationDate.toISOString()}`);

    // Ensure the plan type is valid for the database constraint
    let dbPremiumType: string = plan.plan;
    const validPlanTypes = ['1month', '3months', '6months', '1year', '5years', 'lifetime'];
    if (!validPlanTypes.includes(plan.plan)) {
      dbPremiumType = '1year'; // Default fallback
    }

    // Try with enhanced columns first, fall back to basic columns
    let premiumError = null;
    
    try {
      const { error: enhancedError } = await supabase
        .from('user_premium_status')
        .upsert({
          user_id: userId,
          is_premium: true,
          premium_type: dbPremiumType,
          activated_at: new Date().toISOString(),
          expires_at: expirationDate.toISOString(),
          payment_session_id: sessionId,
          activation_source: 'stripe_payment',
          source_details: JSON.stringify({
            plan: plan.plan,
            session_id: sessionId,
            amount: plan.amount,
            duration_days: plan.duration_days,
            is_upgrade_from_trial: isUpgradeFromTrial,
            previous_expiry: existingStatus?.expires_at || null,
            stacked_from: startDate.toISOString(),
            time_stacking: existingStatus?.is_premium && new Date(existingStatus.expires_at) > new Date()
          }),
          updated_at: new Date().toISOString()
        });

      if (enhancedError) {
        throw enhancedError;
      }
      
      console.log('✅ Premium access activated successfully with enhanced columns');
    } catch (enhancedError) {
      console.log('Enhanced columns not available, trying basic columns:', enhancedError);
      
      // Fall back to basic columns
      const { error: basicError } = await supabase
        .from('user_premium_status')
        .upsert({
          user_id: userId,
          is_premium: true,
          premium_type: dbPremiumType,
          activated_at: new Date().toISOString(),
          expires_at: expirationDate.toISOString(),
          updated_at: new Date().toISOString()
        });

      if (basicError) {
        console.error('❌ Error updating premium status (basic):', basicError);
        throw basicError;
      }
      
      console.log('✅ Premium access activated successfully with basic columns');
    }

    return { success: true, expiresAt: expirationDate.toISOString() };
  } catch (error) {
    console.error('❌ Error in activatePremiumAccess:', error);
    throw error;
  }
}

async function activateDonationTier(userId: string, tier: DonationTier, sessionId: string) {
  console.log(`Activating donation tier: ${tier.tier} for user ${userId}, awarding ${tier.points} points`)
  
  // Get existing points to add to them
  const { data: existingPoints } = await supabase
    .from('user_points')
    .select('points')
    .eq('user_id', userId)
    .single();

  const currentPoints = existingPoints?.points || 0;
  const newTotalPoints = currentPoints + tier.points;

  // Add donation points to user_points table using UPSERT
  const { error: pointsError } = await supabase
    .from('user_points')
    .upsert({
      user_id: userId,
      points: newTotalPoints,
      activity_type: 'donation',
      activity_date: new Date().toISOString().split('T')[0],
      points_source: 'stripe_donation',
      source_details: JSON.stringify({
        tier: tier.tier,
        session_id: sessionId,
        amount: tier.amount,
        stripe_payment: true,
        points_added: tier.points,
        previous_points: currentPoints,
        new_total: newTotalPoints
      }),
      updated_at: new Date().toISOString()
    })

  if (pointsError) {
    console.error('Error adding donation points:', pointsError)
    throw pointsError
  }

  console.log(`Successfully added ${tier.points} points for donation tier ${tier.tier}`)

  // Update payment session status using service role (bypasses RLS)
  const { error: sessionError } = await supabase
    .from('payment_sessions')
    .update({ 
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)

  if (sessionError) {
    console.error('Error updating payment session:', sessionError)
    throw sessionError
  }

  return true
}

async function processDonationPayment(userId: string, tier: DonationTier, sessionId: string) {
  console.log(`Processing donation payment for user ${userId} with tier ${tier.tier}`);
  
  try {
    // Add points to user for the donation - try with new columns first, fall back to basic columns
    let pointsError;
    
    // Get existing points to add to them
    const { data: existingPoints } = await supabase
      .from('user_points')
      .select('points')
      .eq('user_id', userId)
      .single();

    const currentPoints = existingPoints?.points || 0;
    const newTotalPoints = currentPoints + tier.points;

    // Try with new columns first using UPSERT
    const { error: newPointsError } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        points: newTotalPoints,
        activity_type: 'donation',
        activity_date: new Date().toISOString().split('T')[0],
        points_source: 'stripe_donation',
        source_details: JSON.stringify({
          tier: tier.tier,
          amount: tier.amount,
          currency: tier.currency,
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          points_added: tier.points,
          previous_points: currentPoints,
          new_total: newTotalPoints
        }),
        updated_at: new Date().toISOString()
      });

    if (newPointsError) {
      console.log('New columns not available, trying basic columns:', newPointsError);
      
      // Fall back to basic columns if new columns don't exist using UPSERT
      const { error: basicPointsError } = await supabase
        .from('user_points')
        .upsert({
          user_id: userId,
          points: newTotalPoints,
          activity_type: 'donation',
          activity_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        });

      if (basicPointsError) {
        console.error('Error adding donation points (basic):', basicPointsError);
        throw basicPointsError;
      }
      
      console.log(`Successfully added ${tier.points} points for donation tier ${tier.tier} (basic columns). Total: ${newTotalPoints}`);
    } else {
      console.log(`Successfully added ${tier.points} points for donation tier ${tier.tier} (extended columns). Total: ${newTotalPoints}`);
    }

    return { success: true, points: tier.points };
  } catch (error) {
    console.error('Error processing donation payment:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    if ((path === '/create-checkout-session' || path.endsWith('/create-checkout-session')) && req.method === 'POST') {
      const body = await req.json()
      const { sessionId, plan, userEmail, userId, paymentType } = body

      if (!sessionId || !plan || !userEmail || !userId || !paymentType) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      let planInfo: SubscriptionPlan | DonationTier | null = null;
      
      if (paymentType === 'degen') {
        planInfo = degenPlans[plan];
      } else if (paymentType === 'donation') {
        planInfo = donationTiers[plan];
      }

      if (!planInfo) {
        return new Response(
          JSON.stringify({ error: 'Invalid plan or tier' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const checkoutSession = await createStripeCheckoutSession(sessionId, planInfo, userEmail, paymentType, req)

      return new Response(
        JSON.stringify({ 
          sessionId: checkoutSession.id,
          url: checkoutSession.url 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if ((path === '/activate-payment' || path.endsWith('/activate-payment')) && req.method === 'POST') {
      const body = await req.json()
      const { stripeSessionId, userId } = body

      if (!stripeSessionId || !userId) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Get payment session from database
      const { data: sessionData, error: sessionError } = await supabase
        .from('payment_sessions')
        .select('*')
        .eq('id', stripeSessionId)
        .eq('user_id', userId)
        .single()

      if (sessionError || !sessionData) {
        console.error('Error fetching payment session:', sessionError)
        return new Response(
          JSON.stringify({ error: 'Payment session not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Check if already activated
      if (sessionData.status === 'completed') {
        return new Response(
          JSON.stringify({ success: true, message: 'Already activated', plan: sessionData.metadata?.actual_plan || sessionData.subscription_plan }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      // Determine payment type and actual plan from metadata
      const paymentType = sessionData.metadata?.payment_type || 'degen'
      const actualPlan = sessionData.metadata?.actual_plan || sessionData.subscription_plan

      try {
        if (paymentType === 'degen') {
          const planInfo = degenPlans[actualPlan]
          if (!planInfo) {
            return new Response(
              JSON.stringify({ error: 'Invalid plan' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
          }

          await activatePremiumAccess(userId, planInfo, stripeSessionId)
          console.log(`Manual premium activation for user ${userId}, plan: ${actualPlan}`)
          
          return new Response(
            JSON.stringify({ success: true, plan: actualPlan }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          )
        } else if (paymentType === 'donation') {
          const tierInfo = donationTiers[actualPlan]
          if (!tierInfo) {
            return new Response(
              JSON.stringify({ error: 'Invalid tier' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
          }

          await activateDonationTier(userId, tierInfo, stripeSessionId)
          console.log(`Manual donation activation for user ${userId}, tier: ${actualPlan}`)
          
          return new Response(
            JSON.stringify({ success: true, plan: actualPlan }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          )
        }
      } catch (error) {
        console.error('Error activating payment:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to activate payment' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    if ((path === '/webhook' || path.endsWith('/webhook')) && req.method === 'POST') {
      const signature = req.headers.get('stripe-signature')
      
      if (!signature) {
        return new Response('No signature', { status: 400 })
      }

      try {
        const body = await req.text()
        const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)

        if (event.type === 'checkout.session.completed') {
          const session = event.data.object
          const metadata = session.metadata

          if (!metadata.session_id || !metadata.user_email) {
            console.error('Missing required metadata in webhook:', metadata)
            return new Response('Missing metadata', { status: 400 })
          }

          const sessionId = metadata.session_id
          const userEmail = metadata.user_email
          const plan = metadata.plan
          const paymentType = metadata.payment_type || 'degen'

          // Get user ID from email
          const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(userEmail)
          
          if (userError || !user) {
            console.error('User not found:', userError)
            return new Response('User not found', { status: 404 })
          }

          const userId = user.id

          // Process based on payment type
          if (paymentType === 'degen') {
            // Process degen plan
            const planInfo = degenPlans[plan]
            if (planInfo) {
              await activatePremiumAccess(userId, planInfo, sessionId)
            }
          } else if (paymentType === 'donation') {
            // Process donation tier
            const tierInfo = donationTiers[plan]
            if (tierInfo) {
              await processDonationPayment(userId, tierInfo, sessionId)
            }
          }

          // Update payment session status
          const { error: sessionError } = await supabase
            .from('payment_sessions')
            .update({ 
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', sessionId)

          if (sessionError) {
            console.error('Error updating payment session:', sessionError)
          }

          console.log(`Payment processed successfully for user ${userId}`)
        }

        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        })
      } catch (error) {
        console.error('Webhook error:', error)
        return new Response(`Webhook error: ${error.message}`, { status: 400 })
      }
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )
  } catch (error) {
    console.error('Error in stripe-payment function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}) 