# Critical Fixes Application Guide

## 🚨 BEFORE YOU START
**BACKUP YOUR DATABASE** - These changes modify core tables and constraints.

## Step 1: Apply Database Migration
Run this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the entire content of:
-- supabase/migrations/20250120000000_comprehensive_fixes.sql
```

## Step 2: Deploy Updated Edge Functions
```bash
supabase functions deploy premium-codes
supabase functions deploy stripe-payment
```

## Step 3: Verify the Fixes

### Test 1: Check 30-Day Trials
```sql
-- Should show users with 30day_trial
SELECT count(*) FROM user_premium_status WHERE premium_type = '30day_trial';
```

### Test 2: Check Constraints
```sql
-- Should include all plan types including 30day_trial
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname LIKE '%user_premium_status_premium_type%';
```

### Test 3: Check Source Tracking
```sql
-- Should show different activation sources
SELECT activation_source, count(*) 
FROM user_premium_status 
GROUP BY activation_source;

-- Should show different points sources  
SELECT points_source, count(*) 
FROM user_points 
GROUP BY points_source;
```

## What Each Fix Does:

1. **Time Stacking** - Fixed frontend conflicts, webhook now properly extends existing time
2. **Stripe Tiers** - Fixed TypeScript schema mismatch and constraint issues  
3. **Degen Codes** - Fixed column mapping and edge function source tracking
4. **30-Day Trials** - Signup trigger now creates trials, backfilled existing users
5. **Admin Points** - Removed unique constraint conflicts, simplified logic
6. **Admin Logging** - Added source tracking to all premium/points with audit trail

## Expected Results:
- ✅ User with 3 months degen + 1 month purchase = 4 months total
- ✅ Stripe tier purchases update user status from newcomer  
- ✅ Admin degen codes activate without column errors
- ✅ Non-degen users see 30-day trial time in UI
- ✅ Admin points assignment works with feedback
- ✅ Admin panel shows source of all degen/tiers/points

## Troubleshooting:
If issues persist after migration:
1. Check browser console for JavaScript errors
2. Verify Supabase edge functions are deployed
3. Check Supabase logs for database errors
4. Restart your development server

**Remember**: All these changes are additive and preserve existing functionality! 