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
}

const subscriptionPlans: Record<string, SubscriptionPlan> = {
  '1month': {
    plan: '1month',
    amount: 9.99,
    currency: 'USD',
    description: 'Monthly Premium',
    duration_days: 30
  },
  '3months': {
    plan: '3months',
    amount: 24.99,
    currency: 'USD',
    description: '3 Month Premium',
    duration_days: 90
  },
  '6months': {
    plan: '6months',
    amount: 44.99,
    currency: 'USD',
    description: '6 Month Premium',
    duration_days: 180
  },
  '1year': {
    plan: '1year',
    amount: 79.99,
    currency: 'USD',
    description: 'Yearly Premium',
    duration_days: 365
  },
  'lifetime': {
    plan: 'lifetime',
    amount: 299,
    currency: 'USD',
    description: 'Lifetime Premium',
    duration_days: 36500 // ~100 years
  }
};

async function createStripeCheckoutSession(sessionId: string, plan: SubscriptionPlan, userEmail: string) {
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
            description: `Degen Premium Access - ${plan.description}`,
          },
          unit_amount: Math.round(plan.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${Deno.env.get('SITE_URL') || 'https://numoraq.online'}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${Deno.env.get('SITE_URL') || 'https://numoraq.online'}/payment?canceled=true`,
    metadata: {
      session_id: sessionId,
      plan: plan.plan,
      user_email: userEmail,
    },
  })

  return session
}

async function activatePremiumAccess(userId: string, plan: SubscriptionPlan, sessionId: string) {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + plan.duration_days)

  // Update user premium status
  const { error: premiumError } = await supabase
    .from('user_premium_status')
    .upsert({
      user_id: userId,
      is_premium: true,
      premium_plan: plan.plan,
      premium_expires_at: expirationDate.toISOString(),
      payment_session_id: sessionId,
      updated_at: new Date().toISOString()
    })

  if (premiumError) {
    console.error('Error updating premium status:', premiumError)
    throw premiumError
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
      const { sessionId, plan, userEmail, userId } = body

      if (!sessionId || !plan || !userEmail || !userId) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const planInfo = subscriptionPlans[plan]
      if (!planInfo) {
        return new Response(
          JSON.stringify({ error: 'Invalid plan' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const checkoutSession = await createStripeCheckoutSession(sessionId, planInfo, userEmail)

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
        const { session_id, plan, user_email } = session.metadata

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

        const planInfo = subscriptionPlans[plan]
        if (!planInfo) {
          console.error('Invalid plan:', plan)
          return new Response(
            JSON.stringify({ error: 'Invalid plan' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        await activatePremiumAccess(sessionData.user_id, planInfo, session_id)

        console.log(`Premium access activated for user ${sessionData.user_id}, plan: ${plan}`)
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