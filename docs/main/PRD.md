# NUMORAQ Product Requirements Document (PRD) ✨📘🧠

## Executive Summary 🚀📊🧩
NUMORAQ is a comprehensive, crypto-native financial management platform tailored for serious investors, Web3 enthusiasts, and financially curious individuals. It combines traditional finance tools with cutting-edge blockchain integrations, AI-powered advisory, and a gamified XP-driven user engagement system called "Degen Plans." The mission is to give users full control of their net worth across all asset classes - from fiat to DeFi - while incentivizing action, discipline, and education through community-driven systems. 💡🔐🌐

---

## Application Overview 🧭📌🔍
### Core Purpose 🎯📈💼
- Track and visualize total net worth across liquid (crypto, stocks, fiat) and illiquid assets (real estate, NFTs, collectibles)
- Offer gamified personal finance with XP, streaks, and loyalty-based tiers
- Deliver personalized, AI-powered financial advisory (GPT)
- Provide donation-based roles and wallet-linked premium features

### Target Audience 👤🌍📣
- **Primary:** Crypto investors, degen traders, portfolio optimizers
- **Secondary:** Wealth builders, high-income earners seeking gamified control
- **Tertiary:** Community-first users interested in personal finance mastery

---

## Technical Architecture 🛠️💻📡
### Frontend Stack 🎨🧑‍💻⚛️
- React 18 + TypeScript
- TailwindCSS + Brutalist theme tokens
- Vite for build optimization
- React Context + Custom Hooks
- Unicorn Studio for role-based animations
- Custom Charts for projections and asset breakdowns

### Backend Stack 🧮🔒🌐
- Supabase for Auth, PostgreSQL, Storage, and Realtime
- Row Level Security (RLS) on all data layers
- Edge Functions for payment/webhook logic
- Stripe for Degen Plan subscriptions
- CoinGecko + custom live price APIs
- ChatGPT API for personalized AI advisory

### Infrastructure 🌐🚧📦
- **Production:** numoraq.online
- **Staging/Test:** test.numoraq.online (not yet live)
- **CMS/Admin:** 
  - Currently accessible via CTRL+SHIFT+E in main dashboard
  - Future migration to cms.numoraq.online (frontend in progress at [https://cms-numoraq.lovable.app/](https://cms-numoraq.lovable.app/))
  - Test version needed: testcms.numoraq.online
- **CI/CD:** GitHub → Vercel → Supabase migrations
- **Backups:** Enabled via Supabase Pro tier
- **Potential Future Migration:** To DBeaver-managed DB for cost reduction 💾🔄💡

---

## Core Features 🧩🔥📊
1. **Advanced Portfolio Management 💼📊🔗**  
   - Categorization by liquidity
   - BTC/ETH + Solana live sync
   - NFTs with OpenSea floor prices (in progress)
   - Manual entry for collectibles/real estate
   - Auto wallet sync (in progress)

    (adm notes) Advanced Dashboard is made of:
   [----> Sections -> Portfolio(liquid, iliquid), Income(passive,active), Expenses(recurring,variable), Assets(real estate mostly), Tasks & Debt. (projection is on all screen on adv dashboard same as a box with some values breakdowns)]

2. **Income & Expense Tracking 💰📆📉**  
   - 40+ custom expense categories
   - Active/passive income breakdown
   - Recurring vs variable tracking
   - Mobile-friendly UX for fast logging

3. **Debt Management 📉📋🏦**  
   - Avalanche/snowball payoff strategies (in progress)
   - Monthly payment tracking

4. **Financial Forecasting 📊🔮📈**  
   - 12-month interactive projections
   - Optimistic/Realistic/Pessimistic toggles (in progress)

5. **Community & Gamification 🏆🎮💬**  
   - XP (renamed from "points") earned via daily check-in
   - Tier system: NEWCOMER → WHALE
   - Daily/weekly/monthly streaks

6. **Premium Access via Degen Plans 💎💳⏳**  
   - Stripe-powered subscriptions
   - Plans: Monthly ($9.99), 3M ($24.99), 6M ($44.99), Annual ($79.99), Lifetime ($299)
   - Tier-gated AI GPT access
   - Premium-only animations
   - Wallet-based one-click unlock

7. **USER_INFO_CONFIG_UI 👤⚙️💻 (Advanced Dashboard)**  
   - **User Identity & Status:**
     - UID, DONOR status, locale (e.g., 🇧🇷 BRL/🇺🇸 EN)
     - Degen Mode status with expiration timer
     - EXTEND TIME/BUY MORE CTAs
   - **Debug Panel:**
     - Premium status, trial status, raw expiration timestamps
     - Browser time sync validation
     - Source attribution (e.g., "Source: Unknown")
   - **Testing Tools:**
     - DB TEST (backend connectivity check)
     - POINTS TEST (XP system validation)
   - **Account Linking:**
     - Email/Gmail/Discord OAuth
     - Wallet connections (Solana + EVM) with reconnect
     - Direct crypto payments for tiers
   - **Data Management:**
     - Local import/export (CSV/JSON)
     - PDF report generation
     - Backup system with retention policy (last 2 manual + 3 auto)
     - Cloud sync with timestamped last activity

---

## User Experience (UX) 🎨📲🧠
### Design Language 🧱🌑🖥️
- Brutalist terminal-inspired aesthetics
- Game-like tier UX with rank titles/colors
- Dark mode default + responsive grid

### Navigation 🧭📂👆
- Hamburger menu → dashboard sections
- Visible tier/XP progress in nav
- "Dev Mode" UI toggles for all users

### Onboarding 📝🚀🔐
- Currently OFF (accessible via "restart tutorial" on Simple Dashboard)
- Advanced Dashboard is current default
- To be reactivated when Simple Dashboard becomes main interface

---

## Monetization Strategy 💸📊🧾
### Degen Plans (Frontend: "Plans" / Backend: "Time Credit") 🗓️💳⏱️
| Plan | Price |
|------|-------|
| Monthly Premium | $9.99 |
| 3-Month Premium | $24.99 |
| 6-Month Premium | $44.99 |
| Yearly Premium | $79.99 |
| Lifetime Premium | $299 |

**Backend Logic:**  
- Stored as premium time credits (hours/timestamps)
- Time from trials/codes counted with metadata
- New plans stack with remaining time
- Stripe handles recurring billing
- Admins can manually adjust time

**Table: `user_premium_status`**  
| Field | Description |
|-------|-------------|
| `plan_type` | Subscription type |
| `is_active` | Current status |
| `premium_expires_at` | Expiration timestamp |
| `source` | Origin (trial/admin/Stripe) |
| `activated_code` | Redeemed code |

### Tier System & Role Logic 🧬🏅📈
**Frontend:**  
NEWCOMER → WHALE progression via XP  

**Backend:**  
- Tiers based on cumulative points
- Stripe purchases convert to points → auto-upgrade tiers
- Admins can manually add points (currently buggy)

**Table: `user_points`**  
| Field | Description |
|-------|-------------|
| `user_id` | Linked to auth |
| `total_points` | Cumulative score |
| `current_tier` | Computed from points |
| `source` | Origin (Stripe/referral/admin) |

---

## Known Technical Challenges 🧱🛑🔍
1. Supabase Auth metadata not exposed (affects CMS/leaderboard RLS policies)
2. CMS buggy/embedded in dashboard (CTRL+SHIFT+E access)
3. Stripe purchases not reflecting roles/time stacking
4. Degen time stacking not showing in user config
5. Admin codes bugged:
   - Only work for self-assignment
   - Single-use only
6. Admin points interface:
   - No feedback on actions
   - Only affects current user
   - Requires unification of two admin panels

---

## Success Metrics (KPIs) 📊📈🏆
- Daily Active Users (DAU)
- XP accumulation rate
- Trial → paid conversion rate
- Tier upgrades via Stripe
- Referral activations
- GPT usage by tier

---

## Roadmap 🛤️🗺️🚧
### Phase 1 (Now) 🟢🧪🔧
- Launch test.numoraq.online with CI/CD to prod/test
- Ensure database backups for test/prod
- Migrate CMS to cms.numoraq.online (access test data)
- Implement RLS on Supabase
- Fix degen stacking logic
- Repair points → tier auto-upgrade
- Add source tracking (trial/payment/code)
- CMS UI overhaul + finish translations

### Phase 2 🟡⚙️📡
- Wallet sync (Solana/EVM)
- NFT/DeFi price tracking
- Add NFT asset category
- GPT financial personas (degen/doomer)
- Tier-based DevMenu skins (Unicorn Studio/Three.js)
- Dashboard popups (CMS-uploadable images)
- Portfolio history charts:
  - Daily value snapshots
  - Growth/loss visualization
  - AI spending advice based on trends

### Phase 3 🔵📱📤
- DBeaver migration for free backups
- Mobile App development
- Open banking sync
- Marketing & indexing initiatives

---

## CMS Functionality (Admins) 📊📈🏆
- Create premium time codes (degen codes)
- Create tier upgrade codes
- Visual database management
- Log monitoring
- Version control display
- Living documentation (auto-updated system diagrams)

---

## Conclusion 🧾✅🚀
NUMORAQ approaches MVP status with functional financial tracking and early gamification. Degen/Tier logic exists in frontend/CMS with partial Stripe integration, but backend needs stack tracking fixes. Admin tools are limited but viable. Onboarding is paused until Simple Dashboard becomes default. With refinement, NUMORAQ is positioned to lead crypto wealth tooling. 🌟📊🔓  

*© 2025 NumoraQ. Not a financial advisor. Made by degens for all financial analysis frens.*  

**PRD References:**  
- [Latest English Version](https://docs.google.com/document/d/1Und0RvCxhr1vSufZVWZYWy6zo00aOsNfkiuzuu7WqTw/edit?usp=sharing)  
- [Latest Portuguese Version](https://docs.google.com/document/d/1WEbcmNcQmkZ36jmakewg5-7CWd6pivhsMLBvje9D71Y/edit?usp=sharing)