# Stripe Payment Integration Setup

## Overview
This document outlines the Stripe payment integration for Numoraq's degen plans and donation tiers.

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

### 2. Configure Products
Create products in Stripe Dashboard for each degen plan:
- Monthly Premium ($9.99)
- 3 Month Premium ($24.99)
- 6 Month Premium ($44.99)
- Yearly Premium ($79.99)
- Lifetime Premium ($299)

## Database Schema

The integration uses the existing `payment_sessions` table with the following structure:

```sql
CREATE TABLE public.payment_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'crypto')),
  subscription_plan TEXT NOT NULL CHECK (subscription_plan IN ('1month', '3months', '6months', '1year', '5years', 'lifetime')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

## Payment Flow

### 1. User Initiates Payment
- User selects a degen plan
- System creates a payment session in database
- Frontend calls Stripe Edge Function

### 2. Stripe Checkout
- Edge Function creates Stripe Checkout session
- User is redirected to Stripe's hosted checkout page
- User completes payment

### 3. Webhook Processing
- Stripe sends webhook to Edge Function
- System verifies webhook signature
- Premium access is activated automatically
- User is redirected back to success page

### 4. Success Handling
- PaymentPage detects success URL parameters
- Shows success toast and updates premium status
- Cleans up URL parameters

## Security Considerations

### ✅ Implemented
- Webhook signature verification
- Environment variable protection
- Row Level Security (RLS) on database
- CORS headers for Edge Functions
- Input validation and sanitization

### 🔒 Best Practices
- Never expose secret keys in frontend
- Use HTTPS for all webhook endpoints
- Implement proper error handling
- Log all payment events for audit
- Regular security audits

## Testing

### Test Mode
- Use Stripe test keys (already configured)
- Test webhook endpoint with Stripe CLI
- Verify payment flow end-to-end

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

### Debug Steps
1. Check Supabase Edge Function logs
2. Verify Stripe webhook delivery in dashboard
3. Check database for payment session status
4. Test with Stripe CLI webhook forwarding

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Deploy Edge Function to Supabase
- [ ] Configure Stripe webhook endpoint
- [ ] Test payment flow in development
- [ ] Update production environment variables
- [ ] Test with real payment (small amount)
- [ ] Monitor webhook delivery and errors
- [ ] Set up logging and monitoring

## Support

For payment-related issues:
- Email: numoraq@gmail.com
- Check Stripe Dashboard for transaction details
- Review Supabase Edge Function logs
- Verify database payment session status 