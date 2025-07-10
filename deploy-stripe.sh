#!/bin/bash

# Enhanced Stripe Payment Integration Deployment Script
# This script helps deploy the Stripe payment integration to Supabase
# Supports both degen plans and donation tiers

echo "🚀 Deploying Enhanced Stripe Payment Integration..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in the project directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Checking environment variables..."

# Check for required environment variables
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "⚠️  STRIPE_SECRET_KEY not found in environment"
    echo "Please set it: export STRIPE_SECRET_KEY=sk_test_..."
fi

if [ -z "$STRIPE_WEBHOOK_SECRET" ]; then
    echo "⚠️  STRIPE_WEBHOOK_SECRET not found in environment"
    echo "Please set it: export STRIPE_WEBHOOK_SECRET=whsec_..."
fi

if [ -z "$SUPABASE_URL" ]; then
    echo "⚠️  SUPABASE_URL not found in environment"
    echo "Please set it: export SUPABASE_URL=https://..."
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not found in environment"
    echo "Please set it: export SUPABASE_SERVICE_ROLE_KEY=..."
fi

echo "🔧 Deploying Edge Functions..."

# Deploy the enhanced stripe-payment function
supabase functions deploy stripe-payment

if [ $? -eq 0 ]; then
    echo "✅ Enhanced Stripe payment function deployed successfully!"
    echo "   - Supports both degen plans and donation tiers"
    echo "   - Automatic premium activation for degen plans"
    echo "   - Points system for donation tiers"
else
    echo "❌ Failed to deploy stripe-payment function"
    exit 1
fi

echo "🔧 Deploying fetch-live-prices function..."

# Deploy the existing fetch-live-prices function
supabase functions deploy fetch-live-prices

if [ $? -eq 0 ]; then
    echo "✅ Fetch live prices function deployed successfully!"
else
    echo "❌ Failed to deploy fetch-live-prices function"
    exit 1
fi

echo "📊 Running database migrations..."

# Run database migrations
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Database migrations applied successfully!"
    echo "   - payment_sessions table configured"
    echo "   - user_premium_status table updated"
    echo "   - user_points table for donation tiers"
else
    echo "❌ Failed to apply database migrations"
    exit 1
fi

echo ""
echo "🎉 Enhanced deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up Stripe webhook endpoint in your Stripe Dashboard:"
echo "   URL: https://your-project.supabase.co/functions/v1/stripe-payment/webhook"
echo "   Events: checkout.session.completed"
echo ""
echo "2. Test the payment flows:"
echo "   - Go to /payment for degen plans"
echo "   - Go to /donation for donation tiers"
echo "   - Complete test payments for both types"
echo ""
echo "3. Monitor the integration:"
echo "   - Check Supabase Edge Function logs"
echo "   - Verify webhook delivery in Stripe Dashboard"
echo "   - Test with real payments (small amounts)"
echo ""
echo "4. Verify database updates:"
echo "   - Check user_premium_status for degen activations"
echo "   - Check user_points for donation tier points"
echo "   - Check payment_sessions for transaction history"
echo ""
echo "🔧 Features Deployed:"
echo "✅ Stripe Checkout for both degen plans and donation tiers"
echo "✅ Automatic premium activation for degen plans"
echo "✅ Points system for donation tiers"
echo "✅ Webhook processing for payment confirmations"
echo "✅ Database integration with proper RLS policies"
echo "✅ Success/cancel URL handling"
echo ""
echo "📞 For support: numoraq@gmail.com" 