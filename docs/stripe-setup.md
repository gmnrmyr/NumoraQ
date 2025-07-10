# Enhanced Stripe Payment Integration Setup

## Overview
This document outlines the enhanced Stripe payment integration for Numoraq's degen plans and donation tiers. The system now supports both premium access (degen plans) and donation tiers with automatic activation.

## Environment Variables Required

### Frontend (.env.local)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (Public Key Only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Rj4WJQ1mqL18ilaTi6cnAHjmz2FiunvwKXGmfloi5mxLprgnLxDvKlseLVvNv6gzhTM8tSj5V86FaXGjcOJd5sg00LR7GM48y
```

### Supabase Edge Functions (.env)
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration (Secret Keys)
STRIPE_SECRET_KEY=sk_test_51Rj4WJQ1mqL18ila4Vv7ZXXOWrlxMhfklCiBE1xp4Gx5TVHelY2PQ6OL450GIGePG3MeFqtu5AkRC96327MkEOmw00hhDYbW0t
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Site Configuration
SITE_URL=https://numoraq.online
```

## Stripe Dashboard Setup

### 1. Create Webhook Endpoint
1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-project.supabase.co/functions/v1/stripe-payment/webhook`
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret and add to `STRIPE_WEBHOOK_SECRET`

### 2. Configure Products (Optional)
Create products in Stripe Dashboard for each degen plan:
- Monthly Premium ($9.99)
- 3 Month Premium ($24.99)
- 6 Month Premium ($44.99)
- Yearly Premium ($79.99)
- Lifetime Premium ($299)

Note: The Edge Function creates products dynamically, so this step is optional.

## Database Schema

The integration uses the following tables:

### payment_sessions
```sql
CREATE TABLE public.payment_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'crypto')),
  subscription_plan TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### user_premium_status
```sql
CREATE TABLE public.user_premium_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  premium_type TEXT CHECK (premium_type IN ('1month', '3months', '6months', '1year', '5years', 'lifetime')),
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_session_id TEXT REFERENCES public.payment_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### user_points
```sql
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('daily_login', 'donation', 'referral', 'manual')),
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_type, activity_date)
);
```

## Payment Flow

### 1. Degen Plans (Premium Access)
1. **User Initiates Payment**
   - User selects a degen plan on `/payment`
   - System creates a payment session in database
   - Frontend calls Stripe Edge Function

2. **Stripe Checkout**
   - Edge Function creates Stripe Checkout session
   - User is redirected to Stripe's hosted checkout page
   - User completes payment

3. **Webhook Processing**
   - Stripe sends webhook to Edge Function
   - System verifies webhook signature
   - Premium access is activated automatically
   - User is redirected back to success page

4. **Success Handling**
   - PaymentPage detects success URL parameters
   - Shows success toast and updates premium status
   - Cleans up URL parameters

### 2. Donation Tiers (Support Badges)
1. **User Initiates Donation**
   - User selects a donation tier on `/donation`
   - System creates a payment session in database
   - Frontend calls Stripe Edge Function

2. **Stripe Checkout**
   - Edge Function creates Stripe Checkout session
   - User is redirected to Stripe's hosted checkout page
   - User completes payment

3. **Webhook Processing**
   - Stripe sends webhook to Edge Function
   - System verifies webhook signature
   - Points are added to user's account
   - User is redirected back to success page

4. **Success Handling**
   - DonationPage detects success URL parameters
   - Shows success toast and updates user points
   - Cleans up URL parameters

## Supported Plans and Tiers

### Degen Plans (Premium Access)
| Plan | Price | Duration | Features |
|------|-------|----------|----------|
| Monthly | $9.99 | 30 days | Ad-free, Premium themes, Advanced analytics |
| 3 Months | $24.99 | 90 days | 17% savings + all monthly features |
| 6 Months | $44.99 | 180 days | 25% savings + all monthly features |
| Yearly | $79.99 | 365 days | 33% savings + all monthly features |
| Lifetime | $299 | Forever | All features + Founder badge + Early access |

### Donation Tiers (Support Badges)
| Tier | Price | Points | Features |
|------|-------|--------|----------|
| Whale | $50,000 | 50,000 | Ultra VIP access, Direct developer contact |
| Legend | $10,000 | 10,000 | Priority support, All degen features |
| Patron | $5,000 | 5,000 | Advanced features, Degen themes |
| Champion | $2,000 | 2,000 | Black hole animation, Degen themes |
| Supporter | $1,000 | 1,000 | Degen access, Supporter badge |
| Backer | $500 | 500 | Special recognition, Backer badge |
| Donor | $100 | 100 | Thank you message, Donor badge |
| Contributor | $50 | 50 | Contributor badge |
| Helper | $25 | 25 | Helper badge |
| Friend | $20 | 20 | Friend badge |
| Supporter Basic | $10 | 10 | Basic supporter badge |
| Newcomer | $0 | 0 | Welcome badge, 1 point daily login |

## Security Considerations

### ✅ Implemented
- Webhook signature verification
- Environment variable protection
- Row Level Security (RLS) on database
- CORS headers for Edge Functions
- Input validation and sanitization
- Payment session expiration (30 minutes)
- Automatic cleanup of expired sessions

### 🔒 Best Practices
- Never expose secret keys in frontend
- Use HTTPS for all webhook endpoints
- Implement proper error handling
- Log all payment events for audit
- Regular security audits
- Rate limiting on payment endpoints

## Testing

### Test Mode
- Use Stripe test keys (already configured)
- Test webhook endpoint with Stripe CLI
- Verify payment flow end-to-end for both degen and donation flows

### Production Mode
- Switch to live Stripe keys
- Update webhook endpoint URL
- Test with small amounts first

## Troubleshooting

### Common Issues
1. **Webhook not receiving events**: Check endpoint URL and webhook secret
2. **Payment not activating**: Verify database permissions and RLS policies
3. **CORS errors**: Check Edge Function CORS headers
4. **Environment variables**: Ensure all required vars are set
5. **Points not adding**: Check user_points table permissions

### Debug Steps
1. Check Supabase Edge Function logs
2. Verify Stripe webhook delivery in dashboard
3. Check database for payment session status
4. Test with Stripe CLI webhook forwarding
5. Verify user_premium_status and user_points tables

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Deploy Edge Function to Supabase
- [ ] Configure Stripe webhook endpoint
- [ ] Test payment flow in development
- [ ] Update production environment variables
- [ ] Test with real payment (small amount)
- [ ] Monitor webhook delivery and errors
- [ ] Set up logging and monitoring
- [ ] Test both degen and donation flows
- [ ] Verify database updates for both types

## Support

For payment-related issues:
- Email: numoraq@gmail.com
- Check Stripe Dashboard for transaction details
- Review Supabase Edge Function logs
- Verify database payment session status
- Check user_premium_status for degen activations
- Check user_points for donation tier points 