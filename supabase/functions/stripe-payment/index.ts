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
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

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

async function createStripeCheckoutSession(sessionId: string, plan: SubscriptionPlan | DonationTier, userEmail: string, paymentType: 'degen' | 'donation') {
  const stripe = await import('https://esm.sh/stripe@14.21.0?target=deno')
  
  const stripeClient = stripe.default(STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
    httpClient: stripe.Stripe.createFetchHttpClient(),
  })

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
    success_url: `${Deno.env.get('SITE_URL') || 'https://numoraq.online'}/${paymentType === 'degen' ? 'payment' : 'donation'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${Deno.env.get('SITE_URL') || 'https://numoraq.online'}/${paymentType === 'degen' ? 'payment' : 'donation'}?canceled=true`,
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
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + plan.duration_days)

  // Update user premium status using service role (bypasses RLS)
  const { error: premiumError } = await supabase
    .from('user_premium_status')
    .upsert({
      user_id: userId,
      is_premium: true,
      premium_type: plan.plan,
      premium_plan: plan.plan,
      activated_at: new Date().toISOString(),
      expires_at: expirationDate.toISOString(),
      premium_expires_at: expirationDate.toISOString(),
      payment_session_id: sessionId,
      updated_at: new Date().toISOString()
    })

  if (premiumError) {
    console.error('Error updating premium status:', premiumError)
    throw premiumError
  }

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

async function activateDonationTier(userId: string, tier: DonationTier, sessionId: string) {
  // Get existing user points to add to them (not replace)
  const { data: existingPoints, error: fetchError } = await supabase
    .from('user_points')
    .select('points, total_donated')
    .eq('user_id', userId)
    .maybeSingle()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user points:', fetchError)
    throw fetchError
  }

  const currentPoints = existingPoints?.points || 0
  const currentDonated = existingPoints?.total_donated || 0

  // Update user points with accumulated values using service role (bypasses RLS)
  const { error: pointsError } = await supabase
    .from('user_points')
    .upsert({
      user_id: userId,
      points: currentPoints + tier.points,
      total_donated: currentDonated + tier.amount,
      highest_tier: tier.tier.toLowerCase(),
      activity_type: 'donation',
      activity_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    })

  if (pointsError) {
    console.error('Error updating user points:', pointsError)
    throw pointsError
  }

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    if (path === '/create-checkout-session' && req.method === 'POST') {
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

      const checkoutSession = await createStripeCheckoutSession(sessionId, planInfo, userEmail, paymentType)

      return new Response(
        JSON.stringify({ 
          sessionId: checkoutSession.id,
          url: checkoutSession.url 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (path === '/webhook' && req.method === 'POST') {
      const body = await req.text()
      const signature = req.headers.get('stripe-signature')

      if (!signature) {
        return new Response(
          JSON.stringify({ error: 'Missing stripe signature' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const stripe = await import('https://esm.sh/stripe@14.21.0?target=deno')
      const stripeClient = stripe.default(STRIPE_SECRET_KEY, {
        apiVersion: '2024-12-18.acacia',
        httpClient: stripe.Stripe.createFetchHttpClient(),
      })

      let event
      try {
        event = stripeClient.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
      } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const { session_id, plan, user_email, payment_type } = session.metadata

        // Get user ID from the session
        const { data: sessionData, error: sessionError } = await supabase
          .from('payment_sessions')
          .select('user_id')
          .eq('id', session_id)
          .single()

        if (sessionError || !sessionData) {
          console.error('Error fetching payment session:', sessionError)
          return new Response(
            JSON.stringify({ error: 'Session not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        if (payment_type === 'degen') {
          const planInfo = degenPlans[plan]
          if (!planInfo) {
            console.error('Invalid degen plan:', plan)
            return new Response(
              JSON.stringify({ error: 'Invalid plan' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
          }

          await activatePremiumAccess(sessionData.user_id, planInfo, session_id)
          console.log(`Premium access activated for user ${sessionData.user_id}, plan: ${plan}`)
        } else if (payment_type === 'donation') {
          const tierInfo = donationTiers[plan]
          if (!tierInfo) {
            console.error('Invalid donation tier:', plan)
            return new Response(
              JSON.stringify({ error: 'Invalid tier' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
          }

          await activateDonationTier(sessionData.user_id, tierInfo, session_id)
          console.log(`Donation tier activated for user ${sessionData.user_id}, tier: ${plan}`)
        }
      }

      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}) 