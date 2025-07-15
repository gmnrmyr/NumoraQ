NUMORAQ Product Requirements Document (PRD) ✨📘🧠

Executive Summary 🚀📊🧩
NUMORAQ is a comprehensive, crypto-native financial management platform tailored for serious investors, Web3 enthusiasts, and financially curious individuals. It combines traditional finance tools with cutting-edge blockchain integrations, AI-powered advisory, and a gamified XP-driven user engagement system called “Degen Plans.” The mission is to give users full control of their net worth across all asset classes — from fiat to DeFi — while incentivizing action, discipline, and education through community-driven systems. 💡🔐🌐

Application Overview 🧭📌🔍
Core Purpose 🎯📈💼
Track and visualize total net worth across liquid (crypto, stocks, fiat) and illiquid assets (real estate, NFTs, collectibles).
Offer gamified personal finance with XP, streaks, and loyalty-based tiers.
Deliver personalized, AI-powered financial advisory (GPT).
Provide donation-based roles and wallet-linked premium features.

Target Audience 👤🌍📣
Primary: Crypto investors, degen traders, and portfolio optimizers
Secondary: Wealth builders, high-income earners seeking gamified control
Tertiary: Community-first users interested in personal finance mastery

Technical Architecture 🛠️💻📡
Frontend Stack 🎨🧑‍💻⚛️
React 18 + TypeScript
TailwindCSS + Brutalist theme tokens
Vite for build optimization
React Context + Custom Hooks
Unicorn Studio for role-based animations
Custom Charts for projections and asset breakdowns

Backend Stack 🧮🔒🌐
Supabase for Auth, PostgreSQL, Storage, and Realtime
Row Level Security (RLS) on all data layers
Edge Functions for payment/webhook logic
Stripe for Degen Plan subscriptions
CoinGecko + custom live price APIs
ChatGPT API for personalized AI advisory

Infrastructure 🌐🚧📦
Production: numoraq.online
Staging/Test: test.numoraq.online (not yet live)
CMS/Admin: Currently accessible via CTRL+SHIFT+E in the main dashboard (to be migrated to cms.numoraq.online eventually)
CI/CD: GitHub → Vercel → Supabase migrations
Backups: Enabled via Supabase Pro tier
Potential Future Migration: To DBeaver-managed DB if cost reduction becomes necessary 💾🔄💡


Core Features 🧩🔥📊
1. Advanced Portfolio Management 💼📊🔗
Categorization of assets by liquidity
BTC/ETH + Solana live sync
NFTs with floor prices via OpenSea (in progress)
Manual entry for collectibles, real estate
Auto wallet sync (in progress)

2. Income & Expense Tracking 💰📆📉
40+ custom expense categories
Active/passive income source breakdown
Recurring vs variable tracking
Mobile-friendly UX for fast logging

3. Debt Management 📉📋🏦
Avalanche and snowball payoff strategies (in progress)
Monthly payment tracking

4. Financial Forecasting 📊🔮📈
12-month interactive projection tool
Optimistic/Realistic/Pessimistic toggles (in progress)

5. Community & Gamification 🏆🎮💬
XP (renamed from “points”) earned by usage via daily check-in on leaderboard
Tier-based system from NEWCOMER to WHALE
Streaks: daily/weekly/monthly rewards

6. Premium Access via Degen Plans 💎💳⏳
Stripe-powered payment flow
Plans: Monthly, 3M, 6M, Annual, Lifetime
AI GPT access gated by tier
Premium-only dashboard animations
Wallet-based one-click premium unlock
7. USER_INFO_CONFIG_UI 👤⚙️💻 (Advanced Dashboard)
User Identity & Status:
UID, DONOR status, locale (e.g., 🇧🇷 BRL/🇺🇸 EN)
Degen Mode status with expiration timer
EXTEND TIME/BUY MORE CTAs
Debug Panel:
Premium status, trial status, raw expiration timestamps
Browser time sync validation
Source attribution (e.g., "Source: Unknown")
Testing Tools:
- DB TEST (backend connectivity check)
- POINTS TEST (XP system validation)
Account Linking:
- Email/Gmail/Discord OAuth integrations
- Wallet connections (Solana + EVM) with reconnect flow
- Direct crypto payments for tiers via linked wallets

Data Management:
- Local import/export (CSV/JSON)
- PDF report generation
- Backup system with retention policy (last 2 manual + 3 auto)
- Cloud sync with timestamped last activity

User Experience (UX) 🎨📲🧠
Design Language 🧱🌑🖥️
Brutalist layout: terminal-inspired aesthetics
Game-like tier UX (rank titles, color codes)
Dark mode default, responsive grid layout

Navigation 🧭📂👆
Hamburger menu → dashboard sections
Tiers and XP progress visible from nav
“Dev Mode” UI toggles available to all users

Onboarding 📝🚀🔐
Currently OFF — accessible only via “restart tutorial” on Simple Dashboard.
Simple Dashboard is not yet main; Advanced Dashboard is currently the default.
Onboarding to be reactivated once Simple Dashboard is promoted to default.

Monetization Strategy (Updated) 💸📊🧾
Degen Plans (Frontend: “Plans” / Backend: “Time Credit”) 🗓️💳⏱️
User-Facing:
Displayed as plans:
Monthly Premium: $9.99
3-Month Premium: $24.99
6-Month Premium: $44.99
Yearly Premium: $79.99
Lifetime Premium: $299

Backend Logic:
Subscriptions are stored as premium time credits (e.g., hours or timestamps)
Time from trials and codes are also counted with metadata: source: trial, source: admin, stripe subscription, etc.
If user upgrade to a new recurring plan, it adds up to remaining hours and extends premium state
Stripe handles recurring billing; DB tracks expiration
Admins can manually adjust time credit

Table: user_premium_status
plan_type, is_active, premium_expires_at, source, activated_code

Tier System & Role Logic (Updated) 🧬🏅📈
Frontend:
Roles: NEWCOMER → WHALE based on XP

Backend:
Tiers are based on user_points
Points are cumulative; small tier purchases add up
Stripe tiers convert to points → tier auto-upgrades based on thresholds
Admins can manually add points in CMS (currently buggy)

Table: user_points
Field
Description
user_id
Linked to auth
total_points
Cumulative score
current_tier
Computed from points
source
(e.g. Stripe, referral, admin)

Known Technical Challenges 🧱🛑🔍
Supabase Auth table is not exposing metadata (affects CMS + leaderboard)
CMS is limited, buggy, and embedded inside dashboard (access via CTRL+SHIFT+E)
Stripe tier purchases not reflecting roles
Degen time stacking not showing in user config
Admin codes are bugged (only works to assign to self, if admin, via cms panel and once.)
Admin points interface shows no feedback and has no effect (only works to assign to self, if admin, via cms panel and one time.)

Success Metrics (KPIs) 📊📈🏆
Daily Active Users (DAU)
XP accumulation rate
Trial to paid conversion rate
Tier upgrades via Stripe
Referral activations
GPT usage by tier

Roadmap 🛤️🗺️🚧
Phase 1 (Now) 🟢🧪🔧
test.numoraq.online and proper CI CD to both prod and test/dev. Make suredatabase backups for test and prod are working well.

Fix degen stacking logic
Fix points → tier auto upgrade
Add tracking of source (trial/payment/code)
CMS UI/UX overhaul
Translations (finish)

Phase 2 🟡⚙️📡
Wallet sync for Solana + EVM
NFT + DeFi price tracking
More categories on liquid assets (NFT isnt a category yet)
GPT financial persona advisor
Tier-based DevMenu skins (some with Unicorn Studio or Three.js animation)
Dashboard Popup (image for now), uploadable via CMS.

Phase 3 🔵📱📤
DBeaver migration (for free backups)
Mobile App
Open banking sync
Marketing & Awareness, Indexing.

CMS Functionality (admins) 📊📈🏆
Create codes that add premium time for users (degen codes) with time defined by admin [without breaking the main logic and purchases via stripe]
Create codes that add tiers for users (tiers) [without breaking the main logic and purchases via stripe]
See most important databases and be able to visually manage them in a comprehensive way
See the most important logs
Manage Version Control (displayed for users)
Living Documentation(advanced): Visually show admins how our structure work similar to a figjam board in a way that stays updated, maybe via script.

Conclusion 🧾✅🚀
NUMORAQ is approaching MVP status, with most financial tracking systems functional and early gamification layers deployed. Degen and Tier logic exist in frontend and CMS with some working Stripe calls, but backend still needs time/point stack tracking. Admin tools are limited but viable, onboarding is paused until simple dashboard is default, and all development is happening on production until test.numoraq.online is launched. With fixes and refinement, NUMORAQ is positioned to lead crypto wealth tooling. 🌟📊🔓

© 2025 NumoraQ. Not a financial advisor. Made by degens for all financial analysis frens.


