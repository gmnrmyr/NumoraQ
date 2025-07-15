# NUMORAQ - Runbook: Current State → Desired State 📋

## 🎯 CURRENT STATE (How it is today)

### Current Architecture
```
GitHub (main branch) → Lovable CI/CD → numoraq.online
                            ↓
                    Supabase Database (prod)
```

### Current Deploy Process
1. **Development**: You edit the code
2. **Commit**: `git add . → git commit -m "..." → git push`
3. **Deploy**: Lovable detects push and publishes automatically
4. **Database**: Automatic migrations via Supabase
5. **Rollback**: If problems occur, you revert to previous commit

### Identified Problems
- ❌ **No test environment**: Changes go directly to users
- ❌ **No deploy backup**: If Lovable fails, you lose control
- ❌ **Integrated CMS**: Makes maintenance and updates difficult
- ❌ **Single branch**: Doesn't allow parallel development
- ❌ **Manual deploy**: Depends on Lovable for everything

---

## 🚀 DESIRED STATE (Where we want to go)

### Desired Architecture
```
GitHub (main)    → Vercel → numoraq.online (PROD)
       ↓                      ↓
GitHub (develop) → Vercel → test.numoraq.online (TEST)
                              ↓
                    cms.numoraq.online (CMS)
                              ↓
                    Supabase DB (prod + test)
```

### Desired Deploy Process
1. **Development**: You edit in feature/xxx branch
2. **Test**: Merge to develop → Auto-deploy to test.numoraq.online
3. **Validation**: Test features in staging
4. **Production**: Merge to main → Auto-deploy to numoraq.online
5. **Rollback**: Revert via Vercel or GitHub in seconds

---

## 📝 MIGRATION RUNBOOK

### PHASE 1: PREPARATION (1 day)
**Objective**: Complete backup and initial setup

#### 1.1 Backup Current State
```bash
# 1. Code backup
git checkout main
git pull origin main
git tag backup-lovable-$(date +%Y%m%d)
git push origin backup-lovable-$(date +%Y%m%d)

# 2. Database backup
# Via Supabase Dashboard: Settings → Database → Create backup
```

#### 1.2 Document Environment Variables
```javascript
// In browser console (numoraq.online):
console.log({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  // Copy ALL values and save securely
});
```

#### 1.3 Create Vercel Account
1. Go to vercel.com
2. Connect with your GitHub account
3. Don't import the project yet

---

### PHASE 2: TEST ENVIRONMENT (2 days)
**Objective**: Create functioning test.numoraq.online

#### 2.1 Create Test Database
```sql
-- 1. New Supabase project (test-numoraq)
-- 2. Clone prod schema:
-- In dashboard: Settings → Database → Schema → Export
-- In new project: Import schema
-- 3. Configure RLS same as prod
```

#### 2.2 Branch Strategy
```bash
# Create development branch
git checkout -b develop
git push -u origin develop

# Configure main branch protection
# GitHub → Settings → Branches → Add rule
# Require pull request reviews: ON
```

#### 2.3 Test Deploy
1. **Vercel**: Import Project → Choose your repo
2. **Configure**:
   - Branch: develop
   - Framework: Vite
   - Build: `npm run build`
   - Output: dist

#### 2.4 Configure Environment Variables (Test)
```bash
# In Vercel Dashboard → Settings → Environment Variables
VITE_SUPABASE_URL=https://test-xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...test...
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=staging
```

#### 2.5 Configure Domain
```bash
# Vercel → Settings → Domains
# Add: test.numoraq.online
# Configure DNS: CNAME test -> cname.vercel-dns.com
```

---

### PHASE 3: PRODUCTION MIGRATION (1 day)
**Objective**: Migrate numoraq.online to Vercel

#### 3.1 Configure Production in Vercel
1. New Vercel project
2. Configure:
   - Branch: main
   - Same settings as test

#### 3.2 Configure Environment Variables (Production)
```bash
# Use SAME variables currently in Lovable
VITE_SUPABASE_URL=https://prod-xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...prod...
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
NODE_ENV=production
```

#### 3.3 Migration Test
1. Deploy in preview first
2. Test critical functionalities:
   - Login/registration
   - Stripe payments
   - Dashboard data
   - AI advisor

#### 3.4 Domain Migration
1. Configure numoraq.online in Vercel
2. Update DNS to point to Vercel
3. Wait for propagation (5-60 minutes)
4. Test production

---

### PHASE 4: SEPARATE CMS (3 days)
**Objective**: Create cms.numoraq.online

#### 4.1 Create CMS Project
```bash
# New GitHub repo: numoraq-cms
npx create-next-app@latest numoraq-cms --typescript --tailwind
cd numoraq-cms

# Install dependencies
npm install @supabase/supabase-js
npm install @types/node
```

#### 4.2 Configure Dual Connections
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseProd = createClient(
  process.env.SUPABASE_PROD_URL!,
  process.env.SUPABASE_PROD_SERVICE_KEY!
)

export const supabaseTest = createClient(
  process.env.SUPABASE_TEST_URL!,
  process.env.SUPABASE_TEST_SERVICE_KEY!
)
```

#### 4.3 CMS Interface
```typescript
// components/AdminPanel.tsx
export default function AdminPanel() {
  const [environment, setEnvironment] = useState<'prod' | 'test'>('test')
  const supabase = environment === 'prod' ? supabaseProd : supabaseTest
  
  return (
    <div>
      <EnvironmentToggle value={environment} onChange={setEnvironment} />
      <UserManagement supabase={supabase} />
      <CodeGeneration supabase={supabase} />
      <DatabaseViewer supabase={supabase} />
    </div>
  )
}
```

#### 4.4 Deploy CMS
- Deploy on Vercel
- Domain: cms.numoraq.online
- **Note**: Frontend in progress at https://cms-numoraq.lovable.app/

---

### PHASE 5: FINAL WORKFLOW (1 day)
**Objective**: Document and test complete process

#### 5.1 Development Process
```bash
# 1. Create feature
git checkout develop
git pull origin develop
git checkout -b feature/new-functionality

# 2. Develop
# ... code ...

# 3. Test locally
npm run dev

# 4. Push to test
git push origin feature/new-functionality
# Create PR to develop
# Test on test.numoraq.online

# 5. Deploy production
# Create PR from develop to main
# Test on numoraq.online
```

#### 5.2 Configure Webhooks
```bash
# GitHub → Settings → Webhooks
# Notify Vercel about changes
```

---

## 🔧 MONITORING TOOLS

### Logs and Alerts
```typescript
// utils/monitoring.ts
export const logError = (error: Error, context: string) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service
    console.error(`[${context}]`, error)
  }
}
```

### Health Checks
```typescript
// api/health.ts
export default async function handler(req, res) {
  const health = {
    database: await checkDatabase(),
    stripe: await checkStripe(),
    timestamp: new Date().toISOString()
  }
  
  res.json(health)
}
```

---

## 🚨 ROLLBACK PLAN

### Code (Deploy)
```bash
# Option 1: Vercel Dashboard
# Deployments → Promote previous deployment

# Option 2: Git
git revert HEAD
git push origin main
# Vercel auto-deploys

# Option 3: Emergency
# Temporarily: Reactivate Lovable
```

### Database
```sql
-- Restore via Supabase Dashboard
-- Or automatic script
```

---

## 📊 VALIDATION CHECKLIST

### Pre-Deploy
- [ ] Complete backup performed
- [ ] Environment variables documented
- [ ] Staging tests passing
- [ ] Test database functioning

### During Deploy
- [ ] DNS propagated
- [ ] SSL working
- [ ] Environment variables configured
- [ ] Build successful

### Post-Deploy
- [ ] Login works
- [ ] Payments work
- [ ] Dashboard loads
- [ ] AI advisor responds
- [ ] Performance OK

---

## 🎯 REALISTIC TIMELINE

### Week 1 (Preparation)
- **Day 1**: Backup + Vercel setup
- **Day 2**: Test database + staging deploy
- **Day 3**: Intensive staging tests

### Week 2 (Migration)
- **Day 4**: Production migration
- **Day 5**: Tests and adjustments
- **Day 6**: Basic CMS

### Week 3 (Polish)
- **Day 7**: Advanced CMS
- **Day 8**: Documentation
- **Day 9**: Training and final tests

---

## 💰 ESTIMATED COSTS

### Vercel
- **Hobby**: $0 (limited)
- **Pro**: $20/month (recommended)

### Supabase
- **Production**: $25/month (Pro)
- **Test**: $0 (Free tier)

### Domains
- **Subdomains**: $0 (if you already have numoraq.online)

**Total monthly**: ~$45

---

## 🤝 NEXT STEPS

1. **Confirm plan**: Do you approve this strategy?
2. **Backup**: Should we start with complete backup?
3. **Vercel**: Create account and first test?
4. **Support**: When do you need practical help?

---

## 📝 NOTES

- This runbook is conservative and safe
- Prioritizes not breaking what works today
- Gradually evolves to professional structure
- Current CMS frontend in progress: https://cms-numoraq.lovable.app/

**Ready to start?** 🚀

---

*Last Updated: July 15 2025*  
*© 2025 NumoraQ. Migration runbook documentation.*