# NUMORAQ Database Schema 📊

## Overview
The NUMORAQ project utilizes a Supabase-powered PostgreSQL database with comprehensive schema design supporting authentication, user management, financial tracking, gamification, and administrative functions.

## Database Schemas

### 1. Auth Schema 🔐
Handles user authentication, session management, and security features.

#### Core Tables

**`users`**
- Stores user authentication data
- Fields: email, password, multi-factor authentication details
- Primary authentication table

**`refresh_tokens`**
- Manages JWT refresh tokens
- Handles token rotation and expiration

**`identities`**
- Stores user identity data
- Supports social logins (Google, Discord, etc.)
- Links external providers to user accounts

**`sessions`**
- Tracks active user sessions
- Manages Authentication Assurance Level (AAL)
- Session timeout and security policies

#### Multi-Factor Authentication

**`mfa_factors`**
- Stores MFA configuration per user
- Supports TOTP, SMS, and other factor types

**`mfa_challenges`**
- Handles active MFA challenges
- Temporary challenge storage and validation

#### Single Sign-On (SSO)

**`sso_providers`**
- Configuration for SSO providers
- Enterprise authentication setup

**`sso_domains`**
- Domain-based SSO routing
- Organization-specific authentication

**`saml_providers`**
- SAML 2.0 provider configuration
- Enterprise SSO integration

**`saml_relay_states`**
- SAML authentication state management
- Secure relay state handling

#### Security Tokens

**`one_time_tokens`**
- Password reset tokens
- Email verification tokens
- Account recovery mechanisms

---

### 2. Storage Schema 📁
Manages file storage and upload functionality.

**`buckets`**
- Storage bucket configuration
- Access policies and permissions
- File organization structure

**`objects`**
- Individual file metadata
- Storage paths and access control
- File versioning support

**`s3_multipart_uploads`**
- Large file upload management
- Multipart upload session tracking

**`s3_multipart_uploads_parts`**
- Individual parts of multipart uploads
- Upload progress and part validation

---

### 3. Realtime Schema 🔄
Supports real-time functionality and live updates.

**`subscription`**
- Real-time subscription management
- Channel subscriptions and filtering

**`messages`**
- Real-time message storage
- Live notification system

---

### 4. Public Schema 🌐
Core application data and business logic.

#### User Management

**`profiles`**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  default_currency TEXT DEFAULT 'USD',
  language TEXT DEFAULT 'en',
  avatar_url TEXT,
  timezone TEXT,
  -- Additional profile fields
);
```

**`user_premium_status`**
```sql
CREATE TABLE user_premium_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  plan_type TEXT, -- monthly, 3_month, 6_month, yearly, lifetime
  is_active BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  source TEXT, -- stripe, trial, admin, code
  activated_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`user_points`**
```sql
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  total_points INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT 'NEWCOMER',
  source TEXT, -- stripe, referral, admin, daily_checkin
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Financial Data Management

**`financial_data`**
```sql
CREATE TABLE financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL, -- assets, liabilities, income, expenses
  subcategory TEXT, -- crypto, stocks, real_estate, etc.
  name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE NOT NULL,
  description TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT, -- monthly, weekly, yearly
  wallet_address TEXT, -- for crypto assets
  blockchain TEXT, -- solana, ethereum, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Administrative Functions

**`cms_settings`**
```sql
CREATE TABLE cms_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`premium_codes`**
```sql
CREATE TABLE premium_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- time_credit, tier_upgrade
  value INTEGER, -- hours for time_credit, points for tier_upgrade
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`payment_sessions`**
```sql
CREATE TABLE payment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_session_id TEXT UNIQUE,
  plan_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending', -- pending, completed, failed, cancelled
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`admin_audit_log`**
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Backup and Recovery

**`user_backups`**
```sql
CREATE TABLE user_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  backup_type TEXT NOT NULL, -- manual, auto
  backup_data JSONB NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 5. Extensions Schema 🔧
Database extensions and foreign data wrappers.

**`wrappers_fdw_stats`**
- Statistics for foreign data wrappers
- Performance monitoring and optimization
- External API integration metrics

---

## Row Level Security (RLS) Policies 🔒

### User Data Protection
- All user-specific tables have RLS enabled
- Users can only access their own data
- Admin users have elevated permissions for management functions

### Example RLS Policies

```sql
-- Profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Financial data table
CREATE POLICY "Users can manage own financial data" ON financial_data
  FOR ALL USING (auth.uid() = user_id);

-- Premium status table
CREATE POLICY "Users can view own premium status" ON user_premium_status
  FOR SELECT USING (auth.uid() = user_id);
```

---

## Data Relationships 🔗

### User Hierarchy
```
auth.users (1) → profiles (1)
auth.users (1) → user_premium_status (1)
auth.users (1) → user_points (1)
auth.users (1) → financial_data (n)
auth.users (1) → user_backups (n)
```

### Administrative Relationships
```
auth.users (1) → premium_codes (n) [created_by]
auth.users (1) → admin_audit_log (n) [admin_user_id]
auth.users (1) → payment_sessions (n)
```

---

## Indexes and Performance 📈

### Critical Indexes
```sql
-- User lookups
CREATE INDEX idx_profiles_user_id ON profiles(id);
CREATE INDEX idx_financial_data_user_id ON financial_data(user_id);
CREATE INDEX idx_user_premium_status_user_id ON user_premium_status(user_id);

-- Performance optimization
CREATE INDEX idx_financial_data_category ON financial_data(category);
CREATE INDEX idx_financial_data_date ON financial_data(date);
CREATE INDEX idx_premium_codes_code ON premium_codes(code);

-- Audit and monitoring
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at);
CREATE INDEX idx_payment_sessions_stripe_id ON payment_sessions(stripe_session_id);
```

---

## Known Issues and Limitations ⚠️

### Current Challenges
1. **Supabase Auth Metadata**: Auth table not exposing user metadata properly
2. **RLS Implementation**: Some policies need refinement for proper access control
3. **Premium Logic**: Stripe integration with tier/time tracking needs fixes
4. **Admin Tools**: CMS integration requires dedicated domain setup
5. **Points System**: Auto-upgrade logic from points to tiers needs debugging

### Planned Improvements
1. **Database Migration**: Potential move to DBeaver-managed PostgreSQL
2. **Backup Enhancement**: Improved backup strategies and retention policies
3. **Performance Optimization**: Query optimization and caching strategies
4. **Audit Improvements**: Enhanced logging and monitoring capabilities

---

## Environment Configuration 🌍

### Production Environment
- **URL**: numoraq.online
- **Database**: Supabase Pro tier
- **Backups**: Enabled with retention policy

### Staging Environment
- **URL**: test.numoraq.online (planned)
- **Database**: Separate Supabase instance
- **Purpose**: Testing and development

### CMS Environment
- **URL**: cms.numoraq.online (planned)
- **Access**: Currently via CTRL+SHIFT+E in dashboard
- **Purpose**: Administrative interface

---

## Backup and Recovery Strategy 💾

### Backup Types
1. **Automatic Backups**: Supabase Pro tier daily backups
2. **Manual Backups**: User-initiated data exports
3. **Application Backups**: JSON/CSV exports via user interface

### Retention Policy
- **Manual Backups**: Last 2 retained per user
- **Automatic Backups**: Last 3 retained per user
- **System Backups**: 30-day retention on Supabase

---

## Security Considerations 🛡️

### Data Protection
- All sensitive data encrypted at rest
- JWT tokens for authentication
- Rate limiting on API endpoints
- SQL injection prevention through parameterized queries

### Access Control
- Role-based access control (RBAC)
- Row Level Security (RLS) enforcement
- Multi-factor authentication support
- Admin audit logging for all administrative actions

---

*Last Updated: January 2025*  
*Version: 1.0*  
*© 2025 NumoraQ. Database schema documentation.*