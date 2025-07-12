# NUMORAQ System Architecture & Roadmap

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
8. [Payment System & Monetization](#payment-system--monetization)
9. [Development & Admin Tools](#development--admin-tools)
10. [Roadmap & Upcoming Features](#roadmap--upcoming-features)
11. [Technical References](#technical-references)
12. [External Development Tasks](#external-development-tasks)

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** React 18 with TypeScript for type safety and modern development
- **Styling:** Tailwind CSS with custom themes and brutalist design system
- **Build Tool:** Vite for fast development and optimized production builds
- **State Management:** React Context + custom hooks for centralized data flow
- **Animations:** Unicorn Studio for premium dashboard animations with role-gating
- **Charts:** Custom chart components with interactive hover tooltips and financial data display
- **Responsive Design:** Mobile-first approach with touch-optimized interfaces

### Backend & Services Infrastructure
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime) for scalable cloud infrastructure
- **Authentication:** Supabase Auth with email/password and Google OAuth integration
- **Database:** PostgreSQL via Supabase with real-time subscriptions and data sync
- **Real-time:** Supabase Realtime for live updates across multiple user sessions
- **File Storage:** Supabase Storage for user assets, images, and document management
- **Edge Functions:** Supabase Edge Functions for payment processing and webhook handling

### Deployment & Infrastructure
- **Development Environment:** Lovable Studio for collaborative development
- **Production Deployment:** Vercel/Netlify compatible with automatic CI/CD
- **Domain Management:** NUMORAQ branding with custom domain configuration
- **CDN:** Static assets via deployment platform with global content distribution
- **Environment Management:** Separate development, staging, and production environments

### External APIs & Integrations
- **Live Prices:** Custom service for BTC/ETH prices with real-time updates
- **Payment Processing:** Stripe integration with webhook automation and subscription management
- **Cryptocurrency Data:** CoinGecko API for comprehensive crypto price data
- **Future Integrations:** 
  - OpenSea API for NFT floor prices and collection data
  - Debank/Zapper APIs for wallet auto-fetch and DeFi position tracking
  - Google Auth for enhanced authentication options
  - ChatGPT API for AI-powered financial advisor features
  - PayPal API for alternative payment processing

---

## 🎯 Product Strategy & Business Model

### ✅ **COMPLETED: Freemium SaaS Model Implementation**

#### Business Model Evolution ✅ **COMPLETED**
- **Extended Beta Trial:** 3+ months full access for new users to experience premium features
- **Freemium Tiers:** Free trial with targeted ads, Degen plans without ads for optimal UX
- **Degen Plans (Unified Premium):**
  - **Degen Pro:** $9.99/month - No ads, full features, priority support
  - **Degen Lifetime:** $299 - Best value, lifetime access, exclusive features
- **Donor System:** Separate badge/tier system alongside degen plans for community recognition
- **Revenue Diversification:** Multiple payment methods and subscription options

#### Brand Evolution & Positioning ✅ **COMPLETED**
- **Previous Brand:** Open Findash (legacy branding)
- **Current Brand:** NUMORAQ ✅ **COMPLETED** - Professional financial intelligence platform
- **Positioning:** "Start Free, Upgrade When Ready" - Low barrier to entry with clear value progression
- **Target Audience:** Serious wealth builders, crypto enthusiasts, and financial professionals
- **Value Proposition:** Comprehensive financial management with AI-powered insights
- **Footer Updates:** Beta status communication, NUMORAQ branding consistency ✅ **COMPLETED**

#### Landing Page Transformation ✅ **COMPLETED**
- **Hero Messaging:** "Professional Financial Intelligence" - Clear value proposition
- **Pricing Section:** Free Trial, Degen Pro, Degen Lifetime with transparent pricing
- **Value Props:** Updated for freemium model with clear feature differentiation
- **CTAs:** Strategic routing to /payment instead of /donation for conversion optimization
- **Sign In Button:** Added for existing users with seamless authentication flow
- **Conversion Optimization:** A/B testing for optimal user journey and conversion rates

#### New Pages & User Experience ✅ **COMPLETED**
- **PaymentPage:** Unified degen plans + donor badges with comprehensive payment options
- **PrivacyPage:** GDPR-compliant privacy policy with user data protection
- **TermsPage:** Complete terms of service with legal compliance
- **App Routing:** /payment, /privacy, /terms routes with proper navigation structure
- **User Onboarding:** Guided setup process for new users with progressive disclosure

#### Communication & Support Infrastructure ✅ **COMPLETED**
- **Email Standardization:** numoraq@gmail.com across all pages for consistent communication
- **Contact Information:** Standardized contact details with multiple support channels
- **Support References:** Updated to "degen support" terminology for brand consistency
- **User Documentation:** Comprehensive help system and feature guides
- **Community Building:** User forums and knowledge sharing platforms

#### Mobile Experience Optimization ✅ **COMPLETED**
- **DevMenu:** Fixed mobile close button and responsive tabs for touch interfaces
- **Cloud Sync:** Fixed mobile bleeding, responsive button layout for optimal mobile UX
- **DataToolbar:** Improved mobile layout with shorter button text and touch-friendly targets
- **Touch Optimization:** Improved button sizing for mobile with accessibility compliance
- **Performance:** Optimized loading times and battery usage for mobile devices

---

## 🔄 **CURRENT PRIORITY: Payment Integration & System Enhancement**

### 🚧 **Payment System Architecture (In Development)**

#### Current Beta Status & Limitations
- **Manual Processing:** Donations via EVM address + email to numoraq@gmail.com for immediate support
- **CMS Management:** Manual premium activation for direct payments with admin oversight
- **User Communication:** Beta notice explaining payment implementation status and timeline
- **Payment Verification:** Manual confirmation process for security and fraud prevention
- **Revenue Tracking:** Basic tracking with potential for automated analytics

#### Required Payment Integration Goals
- **Seamless Integration Objective:** 
  - PayPal integration from numoraq@gmail.com for broader payment accessibility
  - Stripe integration from numoraq@gmail.com for automated subscription management
  - Automated subscription management with real-time activation
  - Real-time premium activation with immediate feature access
  - Comprehensive payment analytics and revenue reporting

#### Technical Requirements & Implementation
1. **Payment Gateway Setup:**
   - Stripe Connect/Standard integration with webhook handling
   - PayPal Business account API integration for alternative payments
   - Webhook handling for payment confirmations and subscription updates
   - Subscription management (create, update, cancel, pause, resume)
   - Failed payment handling with automatic retry logic

2. **Database Integration & Data Management:**
   - `payment_sessions` table (already created) for transaction tracking
   - User subscription status tracking with real-time updates
   - Payment history and receipts with detailed transaction logs
   - Automatic premium flag updates with immediate feature activation
   - Revenue analytics and financial reporting capabilities

3. **User Experience & Interface:**
   - One-click payment flow with minimal friction
   - Immediate premium activation with instant feature access
   - Email confirmations and receipts with professional branding
   - Subscription management in user profile with self-service options
   - Payment method management and billing history

4. **Security & Compliance Framework:**
   - PCI DSS compliance considerations for payment data protection
   - Payment data encryption with end-to-end security
   - Failed payment handling with graceful error recovery
   - Refund processing capabilities with automated workflows
   - Fraud detection and prevention measures

#### Implementation Phases & Timeline
1. **Phase 1:** Stripe integration with basic subscription handling (Completed)
2. **Phase 2:** PayPal integration for broader payment options (In Progress)
3. **Phase 3:** Advanced subscription management (pausing, upgrading, downgrading)
4. **Phase 4:** Payment analytics and financial reporting dashboard
5. **Phase 5:** Multi-currency support and international payment processing

---

## 🏗️ Core Platform Features

### Dashboard Overview ✅ **WORKING**
Central hub providing comprehensive financial life management with real-time data synchronization.

#### Portfolio Management ✅ **WORKING**
| Feature | Status | Details |
|---------|--------|---------|
| **Liquid Assets** | ✅ Working | Crypto, stocks, REITs, precious metals, cash, NFTs with real-time tracking |
| **Illiquid Assets** | ✅ Working | Real estate, collectibles, manual entry with value appreciation tracking |
| **Live Prices** | 🟡 Partial | BTC/ETH only, expanding to more assets with API integration |
| **Wallet Auto-fetch** | 🚧 Planned | BTC, EVM, Solana integration with DeFi position tracking |
| **NFT Floor Prices** | 🚧 Planned | OpenSea integration for real-time collection valuations |
| **Portfolio Summary** | ✅ Working | Total values, percentages, active/inactive toggle with performance metrics |

#### Financial Tracking & Management ✅ **WORKING**
| Feature | Status | Details |
|---------|--------|---------|
| **Income Tracking** | ✅ Working | Passive/active categorization with detailed source tracking |
| **Expense Tracking** | ✅ Working | Recurring/variable, manual entry with 40+ categories |
| **Debt Management** | ✅ Working | Snowball/avalanche methods with payoff optimization |
| **Task Management** | 🚧 Planned | Financial to-dos, reminders with priority-based organization |

#### 📊 **Enhanced Projections & Analytics Engine**
- **Current Capabilities:** 12-month projections with user-selectable periods ✅ **WORKING**
- **Completed Enhancements:**
  - ✅ **Advanced Chart Hover:** Comprehensive financial data with expense triggers and detailed breakdowns
  - ✅ **Variable Expense Visualization:** See what's causing big expense months with predictive analysis
  - ✅ **Professional Styling:** Dark tooltips with backdrop blur and proper spacing for optimal readability
  - ✅ **Financial Breakdown:** Income/expense/debt breakdown in hover tooltips with real-time calculations
  - ✅ **Interactive Projections:** User-adjustable projection periods with scenario analysis
- **Planned Enhancements:**
  - **Advanced Charts:** Multiple projection lines for different scenarios (optimistic, realistic, conservative)
  - **Compound Interest Visualization:** Show assets that compound over time with growth visualization
  - **Compounding Text Toggle:** Show what's compounding in text format for detailed analysis
  - **Scenario Analysis:** Best/worst case projections with risk assessment
  - **Monte Carlo Simulations:** Advanced probabilistic financial modeling

---

## 🎨 User Interface & Navigation

### Dashboard Navigation ✅ **WORKING**
- **Top Bar:** Minimalist with logo and hamburger menu for clean interface design
- **Hamburger Menu:** Feature-rich navigation drawer with comprehensive access
  - User info and tier badges with role-based access control
  - Dashboard sections (Portfolio, Income, Expenses, etc.) with intuitive organization
  - Community features (Profile, Leaderboard) for user engagement
  - Settings and preferences with customization options
  - Support/donation links with clear communication channels

### Landing Page Experience ✅ **COMPLETED**
- **Current Implementation:** Animated with Unicorn Studio (`illusive_odyssey`) ✅ **WORKING**
- **Structure:** Hero, features, pricing, value props with conversion optimization
- **CMS Integration:** Dynamic content management with real-time updates
- **Performance:** Optimized loading times with progressive enhancement
- **SEO Optimization:** Search engine optimization for organic traffic growth

### 🎮 **Degen Dashboard Animations (Role-Gated)** ✅ **WORKING**
| User Tier | Animation | Unicorn Studio ID | Resolution | Access Level |
|-----------|-----------|-------------------|------------|-------------|
| Champion+ | Black Hole | `db3DaP9gWVnnnr7ZevK7` | 2000x900 | Premium users with enhanced features |
| Whales+ | Dark Dither | `h49sb4lMLFG1hJLyIzdq` | 1440x900 | High-tier users with exclusive access |
| Contributor 50+ | DaTest | Video placeholder | Various | Community contributors with special recognition |

**Implementation Notes:**
- Animations display behind header text ✅ **WORKING** with proper layering
- Play/pause controls with animation ID for debugging ✅ **WORKING** with developer tools
- Role gating enforced in hamburger menu ✅ **WORKING** with secure access control
- Beta dashboard link for Whale+ users only ✅ **WORKING** with exclusive feature access
- Performance optimization for smooth animation rendering across devices

### Mobile Responsiveness & Touch Optimization ✅ **IMPROVED**
- **DevMenu:** Responsive design with mobile close button and touch-friendly interface ✅ **COMPLETED**
- **Cloud Sync:** Fixed mobile bleeding, stacked layout on mobile with optimal spacing ✅ **COMPLETED**
- **Button Text:** Shortened text for mobile screens with clear call-to-actions ✅ **COMPLETED**
- **Touch Targets:** Improved button sizing for mobile with accessibility compliance ✅ **COMPLETED**
- **Gesture Support:** Swipe navigation and touch gestures for enhanced mobile experience
- **Performance:** Optimized loading times and battery usage for mobile devices

---

## 💰 Payment System & Monetization

### Current Dual System Architecture ✅ **WORKING**
- **Degen Plans:** Monthly/lifetime subscriptions for premium features with automated billing
- **Donor Badges:** Separate recognition system for platform support with community benefits
- **Crypto Donations:** Multiple wallet support (EVM active) with real-time transaction tracking
- **Payment Processing:** Manual during beta, automated system in development with webhook integration

### ✅ **Completed Monetization Features**
- **Pricing Pages:** PaymentPage with unified degen + donor systems with transparent pricing ✅ **COMPLETED**
- **Subscription UI:** PremiumSubscriptionPanel with degen terminology and clear value propositions ✅ **COMPLETED**
- **Payment Flow:** Basic structure ready for integration with conversion optimization ✅ **COMPLETED**
- **User Messaging:** Beta payment status communicated with clear expectations ✅ **COMPLETED**
- **Revenue Tracking:** Basic analytics with potential for advanced reporting

### ✅ **Wallet Linking & Direct Payments (Completed)**
- **Profile-Based Linking:** Users can link Solana & EVM wallets to their accounts with secure authentication
- **Persistent Storage:** Wallet connections saved locally with session management and data persistence
- **Direct Payments:** One-click tier payments through linked wallets with instant activation
- **Multi-Wallet Support:** Phantom, Solflare (Solana), MetaMask (EVM) with cross-chain compatibility
- **Payment Tiers:** All degen plans available through wallet payments with flexible options
- **Live Pricing:** Real-time SOL price integration from CoinGecko with automatic updates
- **Transaction Security:** Secure payment processing with fraud prevention measures

### ✅ **Payment Integration (Stripe Implementation Complete)**
- **Stripe Integration:** ✅ Automated subscription processing via Supabase Edge Functions with webhook handling
- **Webhook Processing:** ✅ Automatic premium activation on payment completion with real-time updates
- **Payment Flow:** ✅ Stripe Checkout with success/cancel handling and user feedback
- **Database Integration:** ✅ Payment sessions and premium status tracking with comprehensive logging
- **Security:** ✅ Webhook signature verification and environment variable protection with PCI compliance
- **PayPal Integration:** 🚧 Alternative payment method (planned) for broader accessibility
- **Subscription Management:** 🚧 User self-service portal (planned) with account management
- **Revenue Analytics:** 🚧 MRR tracking and financial reporting (planned) for business intelligence

---

## 🚀 Roadmap & Upcoming Features

### Phase 1: Foundation ✅ **COMPLETED**
- ✅ Basic portfolio tracking with real-time updates
- ✅ Income/expense management with comprehensive categorization
- ✅ Theme system with role-gated animations
- ✅ Donation system with crypto support
- ✅ Basic projections with financial modeling
- ✅ Business model pivot to freemium SaaS
- ✅ Landing page redesign with conversion optimization
- ✅ Mobile responsiveness improvements with touch optimization

### Phase 2: Payment Integration ✅ **STRIPE COMPLETE**
- ✅ Solana wallet payment integration (direct tier payments with instant activation)
- ✅ Wallet linking system for profile-based connections with secure authentication
- ✅ Direct wallet payments (one-click through linked wallets with real-time pricing)
- ✅ Payment UI improvements (dark mode, better styling with accessibility compliance)
- ✅ Stripe payment integration (backend processing via Supabase Edge Functions)
- ✅ Automated subscription management (webhook processing with error handling)
- ✅ Premium activation workflow (automatic activation on payment with immediate access)
- ✅ Payment success/cancel handling with URL parameters and user feedback
- 🚧 PayPal payment integration (backend processing with alternative payment options)
- 🚧 Payment analytics dashboard with comprehensive reporting

### Phase 3: Enhanced Analytics ✅ **COMPLETED**
- ✅ Advanced chart hover interactions with comprehensive financial data display
- ✅ Variable expense triggers display (shows what's causing big expense months)
- ✅ Enhanced mobile responsiveness with touch optimization
- ✅ AI Chat Assistant integration with maximize feature and rich text formatting
- ✅ Rich text formatting in AI responses with professional styling
- 🔄 Compound interest visualization with growth tracking
- 🔄 Date-based scheduling with automated reminders

### Phase 4: Automation & AI (Future Development)
- 🔄 **AI Chat Assistant:** GPT API integration for financial guidance with personalized advice
- 🔄 Wallet auto-fetch (BTC, EVM, Solana) with DeFi position tracking
- 🔄 NFT floor price tracking with OpenSea integration
- 🔄 AI-powered forecasting with machine learning algorithms
- 🔄 Smart expense categorization with automated classification

### 🎯 **Current Priorities & Development Focus**
1. **Payment System Integration** - Stripe/PayPal integration (Solana ✅ completed)
2. **Subscription Management** - User self-service capabilities with account management
3. **Advanced Features Polish** - Chart interactions ✅, AI chat ✅ completed
4. **Backend Payment Processing** - Webhook handling and automation with error recovery
5. **Performance Optimization** - Loading times and responsiveness with user experience focus

---

## 📚 Technical References

### Key Files & Components Architecture
- **Theme System:** `src/index.css`, `src/main.tsx` with CSS variables and theme management
- **Navigation:** `src/components/Navbar.tsx` with responsive design and role-based access
- **Portfolio:** `src/components/portfolio/` with comprehensive asset management
- **Dashboard:** `src/components/dashboard/` with real-time data display
- **Auth:** `src/contexts/AuthContext.tsx` with secure authentication flow
- **Data:** `src/contexts/financial-data/` with centralized state management
- **Hooks:** `src/hooks/` with reusable logic and custom functionality

### Important Hooks & State Management
- `useCMSSettings` - CMS settings management with dynamic content updates
- `useProjectSettings` - Project-level configuration with environment-specific settings
- `useUserTitle` - User tier and access control with role-based permissions
- `useUnicornStudioAnimation` - Animation management with performance optimization
- `useAnimationToggle` - Animation controls with user preference persistence

### Database Schema & Data Architecture
- **Supabase Tables:** User data, CMS settings, auth, payment sessions with comprehensive relationships
- **Local Storage:** User preferences, theme selection with data persistence
- **Migration Files:** `supabase/migrations/` with version control and rollback capabilities
- **Real-time Subscriptions:** Live data updates with conflict resolution and synchronization

---

## 📊 Success Metrics & KPIs

### Current Metrics & Performance Tracking
- **Active Users:** Dashboard engagement with session duration and feature usage
- **Premium Conversion:** Trial to paid conversion rate with funnel optimization
- **Feature Usage:** Portfolio tracking, projections with user behavior analysis
- **User Retention:** Return usage patterns with cohort analysis and churn prediction

### 🎯 **Planned Metrics (Post-Pivot)**
- **Demo to Premium Conversion:** 30-day trial success with conversion optimization
- **Monthly Recurring Revenue (MRR):** Subscription growth with revenue forecasting
- **Customer Lifetime Value (CLV):** User value over time with retention modeling
- **Churn Rate:** Subscription cancellations with retention strategies
- **Feature Adoption:** Premium feature usage with user engagement tracking

---

## 🔄 Update Log

**Last Updated:** January 2025
**Version:** v2.1.0
**Status:** Active Development - Payment Integration Focus

### Recent Completed Changes ✅
- ✅ Complete business model pivot to freemium SaaS with comprehensive pricing strategy
- ✅ Landing page redesign with pricing tiers and conversion optimization
- ✅ PaymentPage creation with unified degen + donor systems with transparent pricing
- ✅ Privacy and Terms pages implementation with legal compliance
- ✅ Email standardization to numoraq@gmail.com with consistent branding
- ✅ Mobile responsiveness improvements (DevMenu, cloud sync) with touch optimization
- ✅ Terminology unification (Premium → Degen) with brand consistency
- ✅ Footer beta status and branding updates with clear communication
- ✅ **Enhanced Chart Hover Tooltips** - Comprehensive financial data display with expense triggers
- ✅ **Solana Wallet Payment Integration** - Direct tier payments with live pricing
- ✅ **AI Chat Maximize Feature** - Full-screen and mobile-optimized interface
- ✅ **AI Rich Text Formatting** - Bold, italics, currency highlighting
- ✅ **AI Financial Context Fix** - Accurate data calculations and projections
- ✅ **Payment UI Dark Mode Fix** - Automatic premium activation section styling
- ✅ **Landing Page Beta Badge** - Hover tooltip with contact information
- ✅ **Wallet Linking System** - Profile-based Solana & EVM wallet connections
- ✅ **Direct Wallet Payments** - One-click tier payments through linked wallets
- ✅ **Stripe Payment Integration** - Complete backend processing with webhook automation
- ✅ **Payment Success Handling** - URL parameter detection and premium activation
- ✅ **Supabase Edge Functions** - Secure payment processing with environment variables

### Current Focus 🚧
- PayPal payment integration (backend processing with alternative payment options)
- Payment analytics dashboard and revenue tracking with comprehensive reporting
- Backend integration for wallet payment verification with security measures
- Performance optimization and loading improvements with user experience focus
- Migration path: Manual EVM payments → Direct wallet payments (making manual sends obsolete)

### Next Review & Strategic Planning
- **When:** After payment integration completion with comprehensive testing
- **Focus:** Advanced analytics and AI features with user experience enhancement
- **Stakeholders:** Development team, business operations, user feedback integration

---

## 👥 External Development Tasks

### High Priority (Friends Dev Tasks)
1. **Payment Backend Integration**
   - PayPal integration from numoraq@gmail.com with automated processing
   - Automated subscription management with real-time activation
   - Real-time premium activation with immediate feature access
   - Webhook handling for payment confirmations and subscription updates

2. **Crypto Price Integration**
   - Debank/Zapper API integration for wallet auto-fetch with comprehensive data
   - Real-time token balance and value updates with portfolio tracking
   - Multi-chain support (BTC, EVM, Solana) with cross-chain compatibility
   - DeFi position tracking with yield farming and liquidity pool monitoring

3. **NFT Floor Price Integration**
   - OpenSea API integration via contract address with real-time updates
   - Real-time floor price updates with collection analytics
   - Portfolio value calculations with NFT performance tracking
   - Collection metadata and rarity analysis for comprehensive valuation

### Medium Priority
1. **Animation System Enhancement**
   - Unicorn Studio integration for dashboard themes with role-gated access
   - Role-gated animations (Black Hole, Dark Dither, etc.) with performance optimization
   - Performance optimization for animations with smooth rendering across devices
   - Custom animation creation for exclusive user tiers

2. **Translation System**
   - Multi-language support implementation with comprehensive localization
   - Translation management system with content versioning
   - User language preferences with automatic detection
   - Cultural adaptation for different markets and user bases

3. **Multi-currency Exchange Rates**
   - Dynamic currency conversion with real-time exchange rates
   - User-selectable currency pairs with comprehensive coverage
   - Real-time exchange rate updates with historical data
   - Currency preference persistence with automatic conversion

### Low Priority (Nice to Have)
1. **Advanced Analytics Dashboard**
   - Comprehensive financial reporting with customizable metrics
   - User behavior analysis with engagement tracking
   - Performance optimization recommendations with automated insights
   - Custom report generation with export capabilities

2. **Social Features**
   - User leaderboards with competitive elements
   - Community forums with knowledge sharing
   - Achievement system with gamification elements
   - Social sharing with privacy controls

---

*This document serves as both technical reference and strategic roadmap. Updated regularly as features are implemented and business strategy evolves. Maintains comprehensive coverage of all system aspects while providing clear development priorities and implementation guidance.*

