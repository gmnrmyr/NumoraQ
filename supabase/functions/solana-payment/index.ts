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

// Solana configuration
const SOLANA_NETWORK = 'mainnet-beta' // or 'devnet' for testing
const TREASURY_WALLET = 'YourTreasuryWalletAddress' // Replace with your actual treasury wallet

interface SolanaPaymentRequest {
  userWallet: string;
  amount: number;
  tier: string;
  transactionSignature: string;
  userId: string;
}

interface PaymentTier {
  tier: string;
  solAmount: number;
  usdValue: number;
  points: number;
  type: 'degen' | 'donation';
}

// Payment tiers with SOL amounts (updated based on SOL price)
const paymentTiers: Record<string, PaymentTier> = {
  'DEGEN_LIFETIME': {
    tier: 'DEGEN_LIFETIME',
    solAmount: 3.5, // ~$299 at $85/SOL
    usdValue: 299,
    points: 0,
    type: 'degen'
  },
  'DEGEN_PRO': {
    tier: 'DEGEN_PRO',
    solAmount: 0.94, // ~$79.99 at $85/SOL
    usdValue: 79.99,
    points: 0,
    type: 'degen'
  },
  'WHALE': {
    tier: 'WHALE',
    solAmount: 588.24, // ~$50,000 at $85/SOL
    usdValue: 50000,
    points: 50000,
    type: 'donation'
  },
  'LEGEND': {
    tier: 'LEGEND',
    solAmount: 117.65, // ~$10,000 at $85/SOL
    usdValue: 10000,
    points: 10000,
    type: 'donation'
  },
  'PATRON': {
    tier: 'PATRON',
    solAmount: 58.82, // ~$5,000 at $85/SOL
    usdValue: 5000,
    points: 5000,
    type: 'donation'
  },
  'CHAMPION': {
    tier: 'CHAMPION',
    solAmount: 23.53, // ~$2,000 at $85/SOL
    usdValue: 2000,
    points: 2000,
    type: 'donation'
  },
  'SUPPORTER': {
    tier: 'SUPPORTER',
    solAmount: 11.76, // ~$1,000 at $85/SOL
    usdValue: 1000,
    points: 1000,
    type: 'donation'
  }
};

async function verifyTransaction(signature: string, expectedAmount: number, expectedReceiver: string): Promise<boolean> {
  try {
    // In a real implementation, you would:
    // 1. Connect to Solana RPC
    // 2. Get transaction details by signature
    // 3. Verify the amount and receiver
    // 4. Check transaction is confirmed
    
    // For now, we'll simulate verification (replace with actual Solana RPC calls)
    console.log(`Verifying transaction: ${signature}`);
    console.log(`Expected amount: ${expectedAmount} SOL`);
    console.log(`Expected receiver: ${expectedReceiver}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, replace this with actual verification logic
    return true;
  } catch (error) {
    console.error('Transaction verification failed:', error);
    return false;
  }
}

async function activatePremiumAccess(userId: string, tier: PaymentTier, sessionId: string) {
  const expirationDate = new Date();
  
  // Set expiration based on tier
  if (tier.tier === 'DEGEN_LIFETIME') {
    expirationDate.setFullYear(expirationDate.getFullYear() + 100); // Lifetime
  } else if (tier.tier === 'DEGEN_PRO') {
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year
  }

  // Update user premium status using service role (bypasses RLS)
  const { error: premiumError } = await supabase
    .from('user_premium_status')
    .upsert({
      user_id: userId,
      is_premium: true,
      premium_type: tier.tier.toLowerCase().replace('_', ''),
      activated_at: new Date().toISOString(),
      expires_at: expirationDate.toISOString(),
      payment_session_id: sessionId,
      updated_at: new Date().toISOString()
    });

  if (premiumError) {
    console.error('Error updating premium status:', premiumError);
    throw premiumError;
  }

  return true;
}

async function activateDonationTier(userId: string, tier: PaymentTier, sessionId: string) {
  // Add donation points to user_points table
  const { error: pointsError } = await supabase
    .from('user_points')
    .insert({
      user_id: userId,
      points: tier.points,
      activity_type: 'donation',
      activity_date: new Date().toISOString().split('T')[0],
      donation_amount: tier.usdValue,
      donation_tier: tier.tier.toLowerCase(),
      notes: `Solana donation: ${tier.tier}`
    });

  if (pointsError) {
    console.error('Error adding donation points:', pointsError);
    throw pointsError;
  }

  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    if (path === '/verify-payment' && req.method === 'POST') {
      const body: SolanaPaymentRequest = await req.json()
      const { userWallet, amount, tier, transactionSignature, userId } = body

      if (!userWallet || !amount || !tier || !transactionSignature || !userId) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      const tierInfo = paymentTiers[tier];
      if (!tierInfo) {
        return new Response(
          JSON.stringify({ error: 'Invalid payment tier' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Verify the transaction
      const isValidTransaction = await verifyTransaction(
        transactionSignature, 
        tierInfo.solAmount, 
        TREASURY_WALLET
      );

      if (!isValidTransaction) {
        return new Response(
          JSON.stringify({ error: 'Transaction verification failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Create payment session record
      const sessionId = `solana_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error: sessionError } = await supabase
        .from('payment_sessions')
        .insert({
          id: sessionId,
          user_id: userId,
          payment_method: 'solana',
          subscription_plan: tier.toLowerCase(),
          amount: tierInfo.usdValue,
          currency: 'USD',
          status: 'completed',
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          metadata: {
            solana_signature: transactionSignature,
            solana_amount: tierInfo.solAmount,
            solana_wallet: userWallet,
            payment_type: tierInfo.type
          }
        });

      if (sessionError) {
        console.error('Error creating payment session:', sessionError);
        throw sessionError;
      }

      // Activate the appropriate tier
      if (tierInfo.type === 'degen') {
        await activatePremiumAccess(userId, tierInfo, sessionId);
        console.log(`Premium access activated for user ${userId}, tier: ${tier}`);
      } else if (tierInfo.type === 'donation') {
        await activateDonationTier(userId, tierInfo, sessionId);
        console.log(`Donation tier activated for user ${userId}, tier: ${tier}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          sessionId: sessionId,
          tier: tierInfo.tier,
          type: tierInfo.type,
          transactionSignature: transactionSignature
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (path === '/tiers' && req.method === 'GET') {
      // Get current SOL price and update tiers
      // In production, you would fetch from a price API
      const solPrice = 85; // Placeholder - replace with real price API
      
      const updatedTiers = Object.entries(paymentTiers).map(([key, tier]) => ({
        ...tier,
        solAmount: Number((tier.usdValue / solPrice).toFixed(3))
      }));

      return new Response(
        JSON.stringify({ 
          tiers: updatedTiers,
          solPrice: solPrice,
          treasuryWallet: TREASURY_WALLET
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error) {
    console.error('Solana payment function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})