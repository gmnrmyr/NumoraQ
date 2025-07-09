# Numoraq - System Architecture & Roadmap

## 🚨 CRITICAL CONSTRAINTS
- **DO NOT BREAK EXISTING FUNCTIONALITY** - Users are already using the app
- **DO NOT CHANGE CURRENT DESIGN** - Maintain existing UI/UX
- **DO NOT REMOVE ANY FEATURES** - Only add new functionality
- **DO NOT LOSE USER DATA** - Preserve all existing user inputs
- **FOCUS ON ADDING FEATURES** - Avoid removing features unless absolutely necessary or asked
- **MAINTAIN HIGH CODE QUALITY** - Refactor only if necessary and safe

---

## 📋 Table of Contents

1. [Technology Stack](#technology-stack)
2. [Product Strategy & Business Model](#product-strategy--business-model)
3. [Core Platform Features](#core-platform-features)
4. [User Interface & Navigation](#user-interface--navigation)
5. [Theme & Customization System](#theme--customization-system)
6. [Authentication & User Management](#authentication--user-management)
7. [Data Management & Backend](#data-management--backend)
8. [Donation System & Monetization](#donation-system--monetization)
9. [Development & Admin Tools](#development--admin-tools)
10. [Roadmap & Upcoming Features](#roadmap--upcoming-features)
11. [Technical References](#technical-references)

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom themes
- **Build Tool:** Vite for fast development and builds
- **State Management:** React Context + custom hooks
- **Animations:** Unicorn Studio for premium dashboard animations
- **Charts:** Custom chart components with hover interactions

### Backend & Services
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Authentication:** Supabase Auth with email/password
- **Database:** PostgreSQL via Supabase
- **Real-time:** Supabase Realtime for live updates
- **File Storage:** Supabase Storage for assets

### Deployment & Infrastructure
- **Development:** Lovable Studio
- **Production:** Vercel/Netlify compatible
- **Domain:** Planning rebrand (considering "Numoraq")
- **CDN:** Static assets via deployment platform

### External APIs & Integrations
- **Live Prices:** Custom service for BTC/ETH prices
- **Future Integrations:** 
  - OpenSea for NFT floor prices
  - Debank/Zapper APIs for wallet auto-fetch
  - Google Auth (planned)
  - AI Chat (GPT API integration planned)

---

## 🎯 Product Strategy & Business Model

### ✅ **COMPLETED: Freemium SaaS Model Implementation**

#### Business Model Changes ✅ **COMPLETED**
- **Extended Beta Trial:** 3+ months full access for new users
- **Freemium Tiers:** Free trial with ads, Degen plans without ads
- **Degen Plans (Unified Premium):**
  - **Degen Pro:** $9.99/month - No ads, full features
  - **Degen Lifetime:** $299 - Best value, lifetime access
- **Donor System:** Separate badge/tier system alongside degen plans

#### Brand Evolution ✅ **COMPLETED**
- **Previous:** Open Findash  
- **Current:** Numoraq ✅ **COMPLETED**
- **Positioning:** "Start Free, Upgrade When Ready" ✅ **COMPLETED**
- **Target:** Serious wealth builders and crypto enthusiasts ✅ **COMPLETED**
- **Footer Updated:** Beta status, NUMORAQ branding ✅ **COMPLETED**

#### Landing Page Updates ✅ **COMPLETED**
- **Hero Messaging:** "Professional Financial Intelligence" ✅ **COMPLETED**
- **Pricing Section:** Free Trial, Degen Pro, Degen Lifetime ✅ **COMPLETED**
- **Value Props:** Updated for freemium model ✅ **COMPLETED**
- **CTAs:** Route to /payment instead of /donation ✅ **COMPLETED**
- **Sign In Button:** Added for existing users ✅ **COMPLETED**

#### New Pages Created ✅ **COMPLETED**
- **PaymentPage:** Unified degen plans + donor badges ✅ **COMPLETED**
- **PrivacyPage:** GDPR-compliant privacy policy ✅ **COMPLETED**
- **TermsPage:** Complete terms of service ✅ **COMPLETED**
- **App Routing:** /payment, /privacy, /terms routes ✅ **COMPLETED**

#### Email & Contact Updates ✅ **COMPLETED**
- **Email:** numoraq@gmail.com across all pages ✅ **COMPLETED**
- **Contact Info:** Standardized contact information ✅ **COMPLETED**
- **Support References:** Updated to "degen support" ✅ **COMPLETED**

#### Mobile Responsiveness ✅ **COMPLETED**
- **DevMenu:** Fixed mobile close button and responsive tabs ✅ **COMPLETED**
- **Cloud Sync:** Fixed mobile bleeding, responsive button layout ✅ **COMPLETED**
- **DataToolbar:** Improved mobile layout with shorter button text ✅ **COMPLETED**

---

## 🔄 **CURRENT PRIORITY: Payment Integration**

### 🚧 **Payment System Architecture (In Development)**

#### Current Beta Status
- **Manual Processing:** Donations via EVM address + email to numoraq@gmail.com
- **CMS Management:** Manual premium activation for direct payments
- **User Communication:** Beta notice explaining payment implementation status

#### Required Payment Integration
- **Seamless Integration Goal:** 
  - PayPal integration from numoraq@gmail.com
  - Stripe integration from numoraq@gmail.com
  - Automated subscription management
  - Real-time premium activation

#### Technical Requirements
1. **Payment Gateway Setup:**
   - Stripe Connect/Standard integration
   - PayPal Business account API integration
   - Webhook handling for payment confirmations
   - Subscription management (create, update, cancel)

2. **Database Integration:**
   - `payment_sessions` table (already created)
   - User subscription status tracking
   - Payment history and receipts
   - Automatic premium flag updates

3. **User Experience:**
   - One-click payment flow
   - Immediate premium activation
   - Email confirmations and receipts
   - Subscription management in user profile

4. **Security & Compliance:**
   - PCI DSS compliance considerations
   - Payment data encryption
   - Failed payment handling
   - Refund processing capabilities

#### Implementation Phases
1. **Phase 1:** Stripe integration with basic subscription handling
2. **Phase 2:** PayPal integration for broader payment options
3. **Phase 3:** Advanced subscription management (pausing, upgrading)
4. **Phase 4:** Payment analytics and financial reporting

---

## 🏗️ Core Platform Features

### Dashboard Overview ✅ **WORKING**
Central hub providing comprehensive financial life management.

#### Portfolio Management ✅ **WORKING**
| Feature | Status | Details |
|---------|--------|---------|
| **Liquid Assets** | ✅ Working | Crypto, stocks, REITs, precious metals, cash, NFTs |
| **Illiquid Assets** | ✅ Working | Real estate, collectibles, manual entry |
| **Live Prices** | 🟡 Partial | BTC/ETH only, expanding to more assets |
| **Wallet Auto-fetch** | 🚧 Planned | BTC, EVM, Solana integration |
| **NFT Floor Prices** | 🚧 Planned | OpenSea integration |
| **Portfolio Summary** | ✅ Working | Total values, percentages, active/inactive toggle |

#### Financial Tracking ✅ **WORKING**
| Feature | Status | Details |
|---------|--------|---------|
| **Income Tracking** | ✅ Working | Passive/active categorization |
| **Expense Tracking** | ✅ Working | Recurring/variable, manual entry |
| **Debt Management** | ✅ Working | Snowball/avalanche methods |
| **Task Management** | 🚧 Planned | Financial to-dos, reminders |

#### 📊 **Enhanced Projections & Analytics**
- **Current:** 12-month projections with user-selectable periods ✅ **WORKING**
- **Completed Enhancements:**
  - ✅ **Advanced Chart Hover:** Comprehensive financial data with expense triggers
  - ✅ **Variable Expense Visualization:** See what's causing big expense months
  - ✅ **Professional Styling:** Dark tooltips with backdrop blur and proper spacing
  - ✅ **Financial Breakdown:** Income/expense/debt breakdown in hover tooltips
- **Planned Enhancements:**
  - **Advanced Charts:** Multiple projection lines for different scenarios
  - **Compound Interest Visualization:** Show assets that compound over time
  - **Compounding Text Toggle:** Show what's compounding in text format
  - **Scenario Analysis:** Best/worst case projections

---

## 🎨 User Interface & Navigation

### Dashboard Navigation ✅ **WORKING**
- **Top Bar:** Minimalist with logo and hamburger menu
- **Hamburger Menu:** Feature-rich navigation drawer
  - User info and tier badges
  - Dashboard sections (Portfolio, Income, Expenses, etc.)
  - Community features (Profile, Leaderboard)
  - Settings and preferences
  - Support/donation links

### Landing Page ✅ **COMPLETED**
- **Current:** Animated with Unicorn Studio (`illusive_odyssey`) ✅ **WORKING**
- **Structure:** Hero, features, pricing, value props ✅ **COMPLETED**
- **CMS Integration:** Dynamic content management ✅ **WORKING**

### 🎮 **Degen Dashboard Animations (Role-Gated)** ✅ **WORKING**
| User Tier | Animation | Unicorn Studio ID | Resolution |
|-----------|-----------|-------------------|------------|
| Champion+ | Black Hole | `db3DaP9gWVnnnr7ZevK7` | 2000x900 |
| Whales+ | Dark Dither | `h49sb4lMLFG1hJLyIzdq` | 1440x900 |
| Contributor 50+ | DaTest | Video placeholder | Various |

**Implementation Notes:**
- Animations display behind header text ✅ **WORKING**
- Play/pause controls with animation ID for debugging ✅ **WORKING**
- Role gating enforced in hamburger menu ✅ **WORKING**
- Beta dashboard link for Whale+ users only ✅ **WORKING**

### Mobile Responsiveness ✅ **IMPROVED**
- **DevMenu:** Responsive design with mobile close button ✅ **COMPLETED**
- **Cloud Sync:** Fixed button bleeding, stacked layout on mobile ✅ **COMPLETED**
- **Button Text:** Shortened text for mobile screens ✅ **COMPLETED**
- **Touch Targets:** Improved button sizing for mobile ✅ **COMPLETED**

---

## 💰 Donation System & Monetization

### Current Dual System ✅ **WORKING**
- **Degen Plans:** Monthly/lifetime subscriptions for premium features
- **Donor Badges:** Separate recognition system for platform support
- **Crypto Donations:** Multiple wallet support (EVM active)
- **Payment Processing:** Manual during beta, automated system in development

### ✅ **Completed Monetization Features**
- **Pricing Pages:** PaymentPage with unified degen + donor systems ✅ **COMPLETED**
- **Subscription UI:** PremiumSubscriptionPanel with degen terminology ✅ **COMPLETED**
- **Payment Flow:** Basic structure ready for integration ✅ **COMPLETED**
- **User Messaging:** Beta payment status communicated ✅ **COMPLETED**

### ✅ **Wallet Linking & Direct Payments (Completed)**
- **Profile-Based Linking:** Users can link Solana & EVM wallets to their accounts
- **Persistent Storage:** Wallet connections saved locally with session management
- **Direct Payments:** One-click tier payments through linked wallets
- **Multi-Wallet Support:** Phantom, Solflare (Solana), MetaMask (EVM)
- **Payment Tiers:** All degen plans available through wallet payments
- **Live Pricing:** Real-time SOL price integration from CoinGecko
- **User Experience:** Seamless wallet connection → payment → tier activation

### 🚧 **Payment Integration (Backend Priority)**
- **Stripe Integration:** Automated subscription processing
- **PayPal Integration:** Alternative payment method
- **Subscription Management:** User self-service portal
- **Revenue Analytics:** MRR tracking and financial reporting

---

## 🚀 Roadmap & Upcoming Features

### Phase 1: Foundation ✅ **COMPLETED**
- ✅ Basic portfolio tracking
- ✅ Income/expense management
- ✅ Theme system
- ✅ Donation system
- ✅ Basic projections
- ✅ Business model pivot
- ✅ Landing page redesign
- ✅ Mobile responsiveness improvements

### Phase 2: Payment Integration ✅ **FRONTEND COMPLETE**
- ✅ Solana wallet payment integration (direct tier payments)
- ✅ Wallet linking system for profile-based connections
- ✅ Direct wallet payments (one-click through linked wallets)
- ✅ Payment UI improvements (dark mode, better styling)
- 🚧 Stripe payment integration (backend processing)
- 🚧 PayPal payment integration (backend processing)
- 🚧 Automated subscription management (webhooks)
- 🚧 Premium activation workflow (backend automation)
- 🚧 Payment analytics dashboard

### Phase 3: Enhanced Analytics ✅ **COMPLETED**
- ✅ Advanced chart hover interactions with comprehensive financial data
- ✅ Variable expense triggers display (shows what's causing big expense months)
- ✅ Enhanced mobile responsiveness
- ✅ AI Chat Assistant integration with maximize feature
- ✅ Rich text formatting in AI responses
- 🔄 Compound interest visualization
- 🔄 Date-based scheduling

### Phase 4: Automation & AI (Future)
- 🔄 **AI Chat Assistant:** GPT API integration for financial guidance
- 🔄 Wallet auto-fetch (BTC, EVM, Solana)
- 🔄 NFT floor price tracking
- 🔄 AI-powered forecasting
- 🔄 Smart expense categorization

### 🎯 **Current Priorities**
1. **Payment System Integration** - Stripe/PayPal integration (Solana ✅ completed)
2. **Subscription Management** - User self-service capabilities
3. **Advanced Features Polish** - Chart interactions ✅, AI chat ✅ completed
4. **Backend Payment Processing** - Webhook handling and automation
5. **Performance Optimization** - Loading times and responsiveness

---

## 📚 Technical References

### Key Files & Components
- **Theme System:** `src/index.css`, `src/main.tsx`
- **Navigation:** `src/components/Navbar.tsx`
- **Portfolio:** `src/components/portfolio/`
- **Dashboard:** `src/components/dashboard/`
- **Auth:** `src/contexts/AuthContext.tsx`
- **Data:** `src/contexts/financial-data/`
- **Hooks:** `src/hooks/`

### Important Hooks
- `useCMSSettings` - CMS settings management
- `useProjectSettings` - Project-level configuration
- `useUserTitle` - User tier and access control
- `useUnicornStudioAnimation` - Animation management
- `useAnimationToggle` - Animation controls

### Database Schema
- **Supabase Tables:** User data, CMS settings, auth
- **Local Storage:** User preferences, theme selection
- **Migration Files:** `supabase/migrations/`

---

## 📊 Success Metrics & KPIs

### Current Metrics
- **Active Users:** Dashboard engagement
- **Donation Conversion:** Tier upgrades
- **Feature Usage:** Portfolio tracking, projections
- **User Retention:** Return usage patterns

### 🎯 **Planned Metrics (Post-Pivot)**
- **Demo to Premium Conversion:** 30-day trial success
- **Monthly Recurring Revenue (MRR):** Subscription growth
- **Customer Lifetime Value (CLV):** User value over time
- **Churn Rate:** Subscription cancellations
- **Feature Adoption:** Premium feature usage

---

## 🔄 Update Log

**Last Updated:** January 2025
**Version:** v2.1.0
**Status:** Active Development - Payment Integration Focus

### Recent Completed Changes ✅
- ✅ Complete business model pivot to freemium SaaS
- ✅ Landing page redesign with pricing tiers
- ✅ PaymentPage creation with unified degen + donor systems
- ✅ Privacy and Terms pages implementation
- ✅ Email standardization to numoraq@gmail.com
- ✅ Mobile responsiveness improvements (DevMenu, cloud sync)
- ✅ Terminology unification (Premium → Degen)
- ✅ Footer beta status and branding updates
- ✅ **Enhanced Chart Hover Tooltips** - Comprehensive financial data display with expense triggers
- ✅ **Solana Wallet Payment Integration** - Direct tier payments with live pricing
- ✅ **AI Chat Maximize Feature** - Full-screen and mobile-optimized interface
- ✅ **AI Rich Text Formatting** - Bold, italics, currency highlighting
- ✅ **AI Financial Context Fix** - Accurate data calculations and projections
- ✅ **Payment UI Dark Mode Fix** - Automatic premium activation section styling
- ✅ **Landing Page Beta Badge** - Hover tooltip with contact information
- ✅ **Wallet Linking System** - Profile-based Solana & EVM wallet connections
- ✅ **Direct Wallet Payments** - One-click tier payments through linked wallets

### Current Focus 🚧
- Payment system integration (Stripe + PayPal backend completion)
- Automated subscription management and webhooks
- Backend integration for wallet payment verification
- Performance optimization and loading improvements
- Migration path: Manual EVM payments → Direct wallet payments (making manual sends obsolete)

### Next Review
- **When:** After payment integration completion
- **Focus:** Advanced analytics and AI features
- **Stakeholders:** Development team, business operations

---

*This document serves as both technical reference and strategic roadmap. Updated regularly as features are implemented and business strategy evolves.*

Myr's notes:> IT's important.


<---- Keep separated, will ask friends to help with this ---->

Ask Thiaguim and Denis (friends devs) to:

- Properly integrate, test and deploy payment systems for degen(premium plans) and badgets(badges+allowance animations on dev modes)>

- IF possible, see if they can help with fetching proper crypto price from wallet like debank or integrate to debank or zapper api.
[[[ this is only for COINS that users would have]]]
   ->>>> Then, we would really need to have a way to fetch the NFT floor prices from openasea as well..... (via contract address) (we have frontend ready)

- IF possible, see if they can help with the unicorn studio animation to have the same result as we have on landing page but on dashboard, cause our custom themes (black hole and dark ditther and etc.... those should have different animations from unicorns studio (including one that is the same as the one on landing page, and others that are different) on those themes but on dashboard.). Since this one has been so hard, we created Devmode -> Testinstances -> OpenTerminal which was a new dashboard we were building from scratch, making sure it had the animations working. But we didn't improve it, we just made it work.

- if its not asking too much, they might be able to help with translation as well... the app really needs to be translated from english to other languages.

- if its not asking too much as well... omg that will be asking too much, I know! But here we go: you know the brl;usd price we show on dashboard? would be AMAZING if users could change that as well.... to anything i would say... usd:euro, euro:brl, yen:usd, etc.....


---------------------------------------------------------------------------------------------------------------------------

unify payments page and payments system. also how we display that. user? degen? donor? thats it.
and how we fetch it. 

------------------------------------------------------------------------------------------------------------------------

hardcore review on all core values, review, roadmap and etc. and copy.


-----------------------------------------------------------------------------------------------------

we ABSOLUTELLY need a simple mode. i can teach most ppl to use the app but a SIMPLE DUMB mode would be amazing to have. (with all the features we have, but in simple interface, simple to understand, simple to do for dumb people as my friend said lol)

------------------------------------------------------------------------------------------------------

still havnt been able to display ads. google ads is blocking us for some reason not allowing us saying ads.txt is missing and our content is not relevant enough or something.
although we have the placeholder spaces working for non-degen users which is great.

---------------------------------------

we WILL at some point need to start tracking time left for trials to end. would be nice to be able to manually add more time for users (simply cause I want to). would be nice if this would be via our CMS (admin menu currently working)

[[[ also time for degens to end maybe....]]]

------------------------------------------------------


links: we will at some point need to rework msot of the links like github for example, we dont have github yet and stuff like that.... 

--------------------------------------------



