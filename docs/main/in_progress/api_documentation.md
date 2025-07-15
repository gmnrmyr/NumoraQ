# NUMORAQ API Documentation 🚀
(( not sure if this is too complex for api docs...))

## Overview
This document provides comprehensive API documentation for the NUMORAQ financial management platform. The API is built on Supabase with PostgreSQL backend, providing real-time data synchronization, secure authentication, and comprehensive financial data management.

## Base Configuration

### Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
STRIPE_SECRET_KEY=sk_live_or_test_key

# External APIs
COINGECKO_API_KEY=your_coingecko_key
OPENAI_API_KEY=your_openai_key
```

### Base URLs
- **Production**: `https://numoraq.online`
- **Staging**: `https://test.numoraq.online` (planned)
- **CMS**: `https://cms.numoraq.online` (planned)
- **Supabase**: `https://your-project.supabase.co/rest/v1`

## Authentication 🔐

### Authentication Flow
All API requests require authentication via Supabase Auth. The system uses JWT tokens for secure access.

#### Login
```javascript
// Email/Password Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://numoraq.online/auth/callback'
  }
})
```

#### Registration
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: 'John Doe',
      default_currency: 'USD'
    }
  }
})
```

#### Session Management
```javascript
// Get current session
const { data: { session } } = await supabase.auth.getSession()

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User signed in
  } else if (event === 'SIGNED_OUT') {
    // User signed out
  }
})
```

## User Management 👤

### Profile Management

#### Get User Profile
```javascript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

#### Update Profile
```javascript
const { data, error } = await supabase
  .from('profiles')
  .update({
    name: 'John Doe',
    default_currency: 'EUR',
    language: 'en',
    timezone: 'America/New_York'
  })
  .eq('id', user.id)
```

#### Get Premium Status
```javascript
const { data: premiumStatus, error } = await supabase
  .from('user_premium_status')
  .select('*')
  .eq('user_id', user.id)
  .single()
```

#### Get User Points & Tier
```javascript
const { data: userPoints, error } = await supabase
  .from('user_points')
  .select('*')
  .eq('user_id', user.id)
  .single()
```

### Premium Management

#### Create Premium Code
```javascript
const { data, error } = await supabase
  .from('premium_codes')
  .insert({
    code: 'PREMIUM2024',
    type: 'time_credit', // or 'tier_upgrade'
    value: 720, // hours or points
    max_uses: 100,
    expires_at: '2024-12-31T23:59:59Z',
    created_by: admin_user_id
  })
```

#### Activate Premium Code
```javascript
const { data, error } = await supabase
  .from('premium_codes')
  .select('*')
  .eq('code', 'PREMIUM2024')
  .eq('is_active', true)
  .single()

if (data && data.current_uses < data.max_uses) {
  // Activate premium for user
  const { error: updateError } = await supabase
    .from('user_premium_status')
    .upsert({
      user_id: user.id,
      plan_type: 'code',
      is_active: true,
      premium_expires_at: new Date(Date.now() + (data.value * 60 * 60 * 1000)),
      source: 'code',
      activated_code: data.code
    })
}
```

## Financial Data Management 💰

### Assets Management

#### Get All Financial Data
```javascript
const { data: financialData, error } = await supabase
  .from('financial_data')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

#### Add Asset
```javascript
const { data, error } = await supabase
  .from('financial_data')
  .insert({
    user_id: user.id,
    category: 'assets',
    subcategory: 'crypto',
    name: 'Bitcoin',
    amount: 1.5,
    currency: 'BTC',
    date: '2024-01-15',
    description: 'Bitcoin holdings',
    wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    blockchain: 'bitcoin'
  })
```

#### Update Asset
```javascript
const { data, error } = await supabase
  .from('financial_data')
  .update({
    amount: 2.0,
    description: 'Updated Bitcoin holdings'
  })
  .eq('id', asset_id)
  .eq('user_id', user.id)
```

#### Delete Asset
```javascript
const { data, error } = await supabase
  .from('financial_data')
  .delete()
  .eq('id', asset_id)
  .eq('user_id', user.id)
```

### Income & Expenses

#### Add Income
```javascript
const { data, error } = await supabase
  .from('financial_data')
  .insert({
    user_id: user.id,
    category: 'income',
    subcategory: 'salary',
    name: 'Monthly Salary',
    amount: 5000.00,
    currency: 'USD',
    date: '2024-01-01',
    is_recurring: true,
    recurring_frequency: 'monthly'
  })
```

#### Add Expense
```javascript
const { data, error } = await supabase
  .from('financial_data')
  .insert({
    user_id: user.id,
    category: 'expenses',
    subcategory: 'housing',
    name: 'Monthly Rent',
    amount: 2000.00,
    currency: 'USD',
    date: '2024-01-01',
    is_recurring: true,
    recurring_frequency: 'monthly'
  })
```

#### Get Financial Summary
```javascript
const { data: assets, error: assetsError } = await supabase
  .from('financial_data')
  .select('amount, currency')
  .eq('user_id', user.id)
  .eq('category', 'assets')

const { data: income, error: incomeError } = await supabase
  .from('financial_data')
  .select('amount, currency')
  .eq('user_id', user.id)
  .eq('category', 'income')

const { data: expenses, error: expensesError } = await supabase
  .from('financial_data')
  .select('amount, currency')
  .eq('user_id', user.id)
  .eq('category', 'expenses')
```

## Payment Processing 💳

### Stripe Integration

#### Create Payment Session
```javascript
const { data, error } = await supabase.functions.invoke('create-payment-session', {
  body: {
    plan_type: 'monthly', // monthly, 3_month, 6_month, yearly, lifetime
    success_url: 'https://numoraq.online/payment/success',
    cancel_url: 'https://numoraq.online/payment/cancel'
  }
})
```

#### Handle Payment Success
```javascript
// This is handled via Stripe webhook
const { data, error } = await supabase
  .from('payment_sessions')
  .update({
    status: 'completed'
  })
  .eq('stripe_session_id', session.id)

// Update user premium status
const { error: premiumError } = await supabase
  .from('user_premium_status')
  .upsert({
    user_id: user.id,
    plan_type: session.metadata.plan_type,
    is_active: true,
    premium_expires_at: calculateExpiryDate(session.metadata.plan_type),
    source: 'stripe'
  })
```

### Payment Plans Configuration
```javascript
const PAYMENT_PLANS = {
  monthly: {
    price: 9.99,
    duration_hours: 720, // 30 days
    stripe_price_id: 'price_monthly_xxx'
  },
  '3_month': {
    price: 24.99,
    duration_hours: 2160, // 90 days
    stripe_price_id: 'price_3month_xxx'
  },
  '6_month': {
    price: 44.99,
    duration_hours: 4320, // 180 days
    stripe_price_id: 'price_6month_xxx'
  },
  yearly: {
    price: 79.99,
    duration_hours: 8760, // 365 days
    stripe_price_id: 'price_yearly_xxx'
  },
  lifetime: {
    price: 299,
    duration_hours: 876000, // 100 years
    stripe_price_id: 'price_lifetime_xxx'
  }
}
```

## External API Integrations 🌐

### Cryptocurrency Price Data

#### Get Live Prices
```javascript
// CoinGecko API integration
const fetchCryptoPrice = async (coinId) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  )
  return response.json()
}

// Usage
const btcPrice = await fetchCryptoPrice('bitcoin')
const ethPrice = await fetchCryptoPrice('ethereum')
```

#### Update Asset Prices
```javascript
const updateAssetPrices = async () => {
  const { data: cryptoAssets } = await supabase
    .from('financial_data')
    .select('*')
    .eq('category', 'assets')
    .eq('subcategory', 'crypto')

  for (const asset of cryptoAssets) {
    const price = await fetchCryptoPrice(asset.name.toLowerCase())
    // Update local calculations, don't modify stored amounts
  }
}
```

### AI Financial Advisor

#### Chat with AI Advisor
```javascript
const { data, error } = await supabase.functions.invoke('ai-advisor', {
  body: {
    message: 'How can I optimize my portfolio?',
    context: {
      total_assets: 50000,
      monthly_income: 5000,
      monthly_expenses: 3000,
      risk_tolerance: 'moderate'
    }
  }
})
```

## Real-time Features 🔄

### Real-time Subscriptions

#### Subscribe to Financial Data Changes
```javascript
const subscription = supabase
  .channel('financial_data_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'financial_data',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    console.log('Financial data changed:', payload)
    // Update UI accordingly
  })
  .subscribe()
```

#### Subscribe to Premium Status Changes
```javascript
const premiumSubscription = supabase
  .channel('premium_status_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'user_premium_status',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    console.log('Premium status changed:', payload)
    // Update UI premium features
  })
  .subscribe()
```

## Admin & CMS Functions 🛠️

### User Management

#### Get All Users (Admin Only)
```javascript
const { data: users, error } = await supabase
  .from('profiles')
  .select(`
    *,
    user_premium_status(*),
    user_points(*)
  `)
  .order('created_at', { ascending: false })
```

#### Update User Points
```javascript
const { data, error } = await supabase
  .from('user_points')
  .update({
    total_points: current_points + additional_points,
    current_tier: calculateTier(current_points + additional_points),
    source: 'admin'
  })
  .eq('user_id', target_user_id)
```

#### Admin Audit Log
```javascript
const { data, error } = await supabase
  .from('admin_audit_log')
  .insert({
    admin_user_id: admin.id,
    action: 'UPDATE_USER_POINTS',
    target_user_id: target_user_id,
    details: {
      points_added: additional_points,
      previous_points: current_points,
      new_tier: new_tier
    },
    ip_address: request.ip,
    user_agent: request.headers['user-agent']
  })
```

### CMS Settings

#### Get CMS Settings
```javascript
const { data: settings, error } = await supabase
  .from('cms_settings')
  .select('*')
  .order('key')
```

#### Update CMS Setting
```javascript
const { data, error } = await supabase
  .from('cms_settings')
  .upsert({
    key: 'maintenance_mode',
    value: { enabled: false, message: 'System maintenance' },
    description: 'Controls maintenance mode status'
  })
```

## Backup & Recovery 💾

### User Data Backup

#### Create Manual Backup
```javascript
const createUserBackup = async (userId) => {
  const { data: financialData } = await supabase
    .from('financial_data')
    .select('*')
    .eq('user_id', userId)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)

  const backupData = {
    profile,
    financial_data: financialData,
    backup_date: new Date().toISOString(),
    version: '1.0'
  }

  const { data, error } = await supabase
    .from('user_backups')
    .insert({
      user_id: userId,
      backup_type: 'manual',
      backup_data: backupData,
      file_size: JSON.stringify(backupData).length
    })

  return { data, error }
}
```

#### Restore from Backup
```javascript
const restoreUserBackup = async (userId, backupId) => {
  const { data: backup } = await supabase
    .from('user_backups')
    .select('*')
    .eq('id', backupId)
    .eq('user_id', userId)
    .single()

  if (backup) {
    // Restore financial data
    const { error } = await supabase
      .from('financial_data')
      .delete()
      .eq('user_id', userId)

    const { error: insertError } = await supabase
      .from('financial_data')
      .insert(backup.backup_data.financial_data)

    return { success: !insertError }
  }
}
```

## Error Handling & Status Codes 🚨

### Common Error Responses

#### Authentication Errors
```javascript
// 401 Unauthorized
{
  "error": "Authentication required",
  "code": 401,
  "details": "Valid JWT token required"
}

// 403 Forbidden
{
  "error": "Insufficient permissions",
  "code": 403,
  "details": "Premium subscription required"
}
```

#### Validation Errors
```javascript
// 400 Bad Request
{
  "error": "Invalid input data",
  "code": 400,
  "details": {
    "amount": "Must be a positive number",
    "currency": "Must be a valid currency code"
  }
}
```

#### Rate Limiting
```javascript
// 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "code": 429,
  "details": "Maximum 100 requests per minute"
}
```

## Performance Optimization 📈

### Database Optimization

#### Efficient Queries
```javascript
// Use indexes for better performance
const { data } = await supabase
  .from('financial_data')
  .select('amount, currency, date')
  .eq('user_id', user.id)
  .eq('category', 'assets')
  .order('date', { ascending: false })
  .limit(100)
```

#### Batch Operations
```javascript
// Insert multiple records efficiently
const { data, error } = await supabase
  .from('financial_data')
  .insert([
    { user_id, category: 'assets', name: 'Bitcoin', amount: 1.0 },
    { user_id, category: 'assets', name: 'Ethereum', amount: 10.0 }
  ])
```

### Caching Strategy
```javascript
// Client-side caching for frequently accessed data
const cachedUserData = {
  profile: null,
  financialData: null,
  lastFetch: null,
  ttl: 5 * 60 * 1000 // 5 minutes
}

const getUserData = async (userId) => {
  const now = Date.now()
  
  if (cachedUserData.lastFetch && (now - cachedUserData.lastFetch) < cachedUserData.ttl) {
    return cachedUserData
  }
  
  // Fetch fresh data
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  cachedUserData.profile = data
  cachedUserData.lastFetch = now
  
  return cachedUserData
}
```

## Security Best Practices 🔒

### Row Level Security (RLS)

#### Example RLS Policies
```sql
-- Users can only access their own financial data
CREATE POLICY "Users can manage own financial data" ON financial_data
  FOR ALL USING (auth.uid() = user_id);

-- Premium status visibility
CREATE POLICY "Users can view own premium status" ON user_premium_status
  FOR SELECT USING (auth.uid() = user_id);

-- Admin access to audit logs
CREATE POLICY "Admins can view audit logs" ON admin_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );
```

### Input Validation
```javascript
const validateFinancialData = (data) => {
  const errors = []
  
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    errors.push('Amount must be a positive number')
  }
  
  if (!['assets', 'liabilities', 'income', 'expenses'].includes(data.category)) {
    errors.push('Invalid category')
  }
  
  if (!data.currency || data.currency.length !== 3) {
    errors.push('Currency must be a valid 3-letter code')
  }
  
  return errors
}
```

## Testing & Development 🧪

### Testing Environment
```javascript
// Test configuration
const testConfig = {
  supabaseUrl: 'https://test-project.supabase.co',
  supabaseKey: 'test_anon_key',
  stripeKey: 'pk_test_...'
}

// Mock data for testing
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User'
}
```

### API Testing Examples
```javascript
// Test user creation
const testUserCreation = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpass123'
  })
  
  expect(error).toBeNull()
  expect(data.user).toBeDefined()
}

// Test financial data insertion
const testFinancialDataInsertion = async () => {
  const { data, error } = await supabase
    .from('financial_data')
    .insert({
      user_id: mockUser.id,
      category: 'assets',
      name: 'Test Asset',
      amount: 1000
    })
  
  expect(error).toBeNull()
  expect(data).toBeDefined()
}
```

## Monitoring & Analytics 📊

### Usage Analytics
```javascript
const trackUserAction = async (userId, action, metadata = {}) => {
  await supabase
    .from('user_analytics')
    .insert({
      user_id: userId,
      action,
      metadata,
      timestamp: new Date().toISOString()
    })
}

// Usage examples
await trackUserAction(user.id, 'ASSET_ADDED', { category: 'crypto', amount: 1000 })
await trackUserAction(user.id, 'PAYMENT_COMPLETED', { plan: 'monthly' })
```

### Performance Monitoring
```javascript
const monitorAPIPerformance = async (endpoint, operation) => {
  const startTime = Date.now()
  
  try {
    const result = await operation()
    const duration = Date.now() - startTime
    
    // Log successful operation
    console.log(`${endpoint} completed in ${duration}ms`)
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    
    // Log error
    console.error(`${endpoint} failed after ${duration}ms:`, error)
    
    throw error
  }
}
```

## Migration & Deployment 🚀

### Database Migrations
```sql
-- Example migration for new feature
-- migrations/20240115_add_nft_support.sql
ALTER TABLE financial_data 
ADD COLUMN nft_collection_address TEXT,
ADD COLUMN nft_token_id TEXT,
ADD COLUMN nft_marketplace TEXT;

-- Update RLS policies
CREATE POLICY "Users can manage own NFTs" ON financial_data
  FOR ALL USING (auth.uid() = user_id AND subcategory = 'nft');
```

### Deployment Checklist
- [ ] Database migrations applied
- [ ] Environment variables updated
- [ ] Stripe webhooks configured
- [ ] API keys rotated
- [ ] Backup systems tested
- [ ] Monitor dashboards updated
- [ ] Documentation updated

---

## Conclusion

This API documentation provides a comprehensive guide to integrating with the NUMORAQ platform. The system is designed for scalability, security, and real-time performance, with robust authentication, payment processing, and data management capabilities.

For additional support or questions, please refer to the internal documentation or contact the development team.

---

*Last Updated: July 15, 2025*  
*Version: 1.0*  
*© 2025 NumoraQ. API Documentation.*