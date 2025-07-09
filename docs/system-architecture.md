# Numoraq - System Architecture & Roadmap

## 🚨 CRITICAL CONSTRAINTS
- **DO NOT BREAK EXISTING FUNCTIONALITY** - Users are already using the app
- **DO NOT CHANGE CURRENT DESIGN** - Maintain existing UI/UX
- **DO NOT REMOVE ANY FEATURES** - Only add new functionality
- **DO NOT LOSE USER DATA** - Preserve all existing user inputs
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

### Current Model: Open Source & Donations
- **100% Free & Open Source** - Current positioning
- **Donation-based** - Users donate to unlock premium features
- **Privacy-first** - No tracking, local-first data

### 🔄 **PLANNED PIVOT: Freemium SaaS Model**

#### New Business Model Strategy
- **Demo Period:** 30 days full access for new users
- **Freemium Tiers:** Basic free tier with limitations
- **Premium Plans (Degen Plans):**
  - 1 Month: $X
  - 3 Months: $X
  - 6 Months: $X
  - 1 Year: $X
  - 5 Years: $X
  - **Lifetime Access (Founders):** ~$1,000 USD

#### Positioning Changes
- **From:** "100% Free Forever"
- **To:** "Start Free, Upgrade When Ready"
- **Target:** Serious financial planners and crypto enthusiasts
- **Value Prop:** Advanced analytics, AI insights, automation

#### Brand Evolution
- **Previous:** Open Findash  
- **Current:** Numoraq ✅ **COMPLETED**
- **Goal:** More professional, less "open source hobby"

---

## 🏗️ Core Platform Features

### Dashboard Overview
Central hub providing comprehensive financial life management.

#### Portfolio Management
| Feature | Status | Details |
|---------|--------|---------|
| **Liquid Assets** | ✅ Working | Crypto, stocks, REITs, precious metals, cash, NFTs |
| **Illiquid Assets** | ✅ Working | Real estate, collectibles, manual entry |
| **Live Prices** | 🟡 Partial | BTC/ETH only, expanding to more assets |
| **Wallet Auto-fetch** | 🚧 Planned | BTC, EVM, Solana integration |
| **NFT Floor Prices** | 🚧 Planned | OpenSea integration |
| **Portfolio Summary** | ✅ Working | Total values, percentages, active/inactive toggle |

#### Financial Tracking
| Feature | Status | Details |
|---------|--------|---------|
| **Income Tracking** | ✅ Working | Passive/active categorization |
| **Expense Tracking** | ✅ Working | Recurring/variable, manual entry |
| **Debt Management** | ✅ Working | Snowball/avalanche methods |
| **Task Management** | 🚧 Planned | Financial to-dos, reminders |

#### 📊 **Enhanced Projections & Analytics**
- **Current:** 12-month projections with user-selectable periods
- **Planned Enhancements:**
  - **Advanced Charts:** Multiple projection lines for different scenarios
  - **Compound Interest Visualization:** Show assets that compound over time
  - **Interactive Hover:** See specific expenses/income triggering chart points
  - **Compounding Text Toggle:** Show what's compounding in text format
  - **Scenario Analysis:** Best/worst case projections

#### 📅 **Advanced Date-based Features**
- **Debt/Expense Scheduling:** Set start and end dates for payments
- **Brazilian Installment Support:** Common "parcelas" system
- **Recurring Transaction Management:** Better handling of scheduled payments
- **Date-based Projections:** Account for known future changes

---

## 🎨 User Interface & Navigation

### Dashboard Navigation
- **Top Bar:** Minimalist with logo and hamburger menu
- **Hamburger Menu:** Feature-rich navigation drawer
  - User info and tier badges
  - Dashboard sections (Portfolio, Income, Expenses, etc.)
  - Community features (Profile, Leaderboard)
  - Settings and preferences
  - Support/donation links

### Landing Page
- **Current:** Animated with Unicorn Studio (`illusive_odyssey`)
- **Structure:** Hero, features, value props, social proof
- **Planned:** CMS-driven content management

### 🎮 **Premium Dashboard Animations (Role-Gated)**
| User Tier | Animation | Unicorn Studio ID | Resolution |
|-----------|-----------|-------------------|------------|
| Champion+ | Black Hole | `db3DaP9gWVnnnr7ZevK7` | 2000x900 |
| Whales+ | Dark Dither | `h49sb4lMLFG1hJLyIzdq` | 1440x900 |
| Contributor 50+ | DaTest | Video placeholder | Various |

**Implementation Notes:**
- Animations display behind header text
- Play/pause controls with animation ID for debugging
- Role gating enforced in hamburger menu
- Beta dashboard link for Whale+ users only
- Minimal hacking nomenclature and pixel art accents

---

## 🎨 Theme & Customization System

### Theme Architecture
- **Theme Classes:** Applied to `<html>` element (e.g., `theme-monochrome`)
- **Default Theme:** CSS variables in `src/index.css`
- **Storage:** `localStorage.selectedTheme`
- **Initialization:** Applied on app load via `src/main.tsx`

### Access Control
- **Public Themes:** Available to all users
- **Premium Themes:** Require specific donation tiers
- **Dev Override:** Testing access via Dev Menu

### Adding New Themes
1. Add `.theme-<name>` block in `src/index.css`
2. Update theme selectors in Dev Menu and CMS
3. Set access requirements if premium

---

## 🔐 Authentication & User Management

### Current Authentication
- **Primary:** Email/password via Supabase Auth
- **Storage:** User data in Supabase + localStorage
- **Roles:** User, Admin, Superadmin

### 🚀 **Planned Authentication Enhancements**
- **Google Auth:** High priority but technically challenging
- **Multi-auth Support:** 
  - Email (current)
  - Solana wallet linking
  - Discord account linking
- **Enhanced Profile Management:**
  - Avatar customization
  - Nickname/display name
  - Privacy settings

### User Tiers & Access
- **Free Users:** Basic features, 30-day demo
- **Premium Users:** Full feature access, no ads
- **Donation Tiers:** Legacy system (transitioning)
- **Role-based Access:** Admin panel, premium themes

---

## 💾 Data Management & Backend

### Data Architecture
- **Local-First:** Data stored in localStorage for speed
- **Cloud Sync:** Optional Supabase synchronization
- **Export Options:** CSV, PDF, JSON formats
- **Import Support:** JSON data import/export

### 🔄 **Enhanced Data Management**
- **AI-powered Data Conversion:** Guide users to use ChatGPT/Grok for data formatting
- **Excel Integration:** Better import from spreadsheets
- **Demo Data:** Pre-populated examples for new users
- **Data Migration:** Smooth transitions between versions

### CMS & Settings
- **CMS Settings:** Managed via `useCMSSettings` hook
- **Project Settings:** `useProjectSettings` for project-level config
- **Live Updates:** Real-time settings changes via Supabase

---

## 💰 Donation System & Monetization

### Current Donation System
- **Crypto Donations:** Multiple wallet support
- **Tier System:** Based on donation amounts
- **Rewards:** Badges, titles, premium themes
- **PayPal:** Coming soon

### 🎯 **Planned Premium Monetization**
- **Subscription Tiers:** Monthly/yearly premium plans
- **Founder Packages:** Lifetime access for early adopters
- **Feature Gating:** Advanced analytics, AI features
- **Ad-free Experience:** Premium users see no ads

### Revenue Streams
1. **Premium Subscriptions:** Primary revenue
2. **Founder Packages:** One-time high-value sales
3. **Enterprise:** Future B2B opportunities
4. **Donations:** Legacy support system

---

## 🛠️ Development & Admin Tools

### Dev Menu
- **Access:** DEV button (bottom left)
- **Features:** Theme switching, code activation, debug info
- **Implementation:** `src/components/DevMenu.tsx`

### Admin Panel (CMS)
- **Access:** Admin/Superadmin roles only
- **Features:** Site settings, user management, premium codes
- **Security:** Role-based access control

### 🔧 **Enhanced Development Tools**
- **Beta Dashboard:** Local testing environment
- **Animation Testing:** Unicorn Studio credit management
- **User Research Tools:** Feedback compilation
- **AI Documentation:** Automated doc updates

---

## 🚀 Roadmap & Upcoming Features

### Phase 1: Foundation (Current)
- ✅ Basic portfolio tracking
- ✅ Income/expense management
- ✅ Theme system
- ✅ Donation system
- ✅ Basic projections

### Phase 2: Enhanced Analytics (In Progress)
- 🚧 Advanced chart interactions
- 🚧 Compound interest visualization
- 🚧 Date-based scheduling
- 🚧 Beta dashboard animations
- 🚧 Improved mobile layout

### Phase 3: Automation & AI (Planned)
- 🔄 **AI Chat Assistant:** GPT API integration for financial guidance
- 🔄 Wallet auto-fetch (BTC, EVM, Solana)
- 🔄 NFT floor price tracking
- 🔄 AI-powered forecasting
- 🔄 Smart expense categorization

### Phase 4: Business Model Pivot (Strategic)
- 🎯 **Freemium Model:** 30-day demo + premium tiers
- 🎯 **Brand Rebrand:** New name (Numoraq consideration)
- 🎯 Google Auth integration
- 🎯 Enterprise features
- 🎯 Advanced user onboarding

### Phase 5: Advanced Features (Future)
- 🔮 Multi-language platform integration
- 🔮 Community features and social elements
- 🔮 API for third-party integrations
- 🔮 Mobile app development
- 🔮 Advanced security features

### 🎯 **Immediate Priorities**
1. **AI Chat Integration** - High impact, user-requested
2. **Simple Onboarding** - Critical for demo users
3. **Advanced Chart Features** - Differentiation from competitors
4. **Date-based Expense/Debt Tracking** - Brazilian market need
5. **Beta Dashboard Finalization** - Premium user experience

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

**Last Updated:** [Current Date]
**Version:** -12500
**Status:** Active Development

### Recent Changes
- Integrated admin notes into comprehensive roadmap
- Added business model pivot strategy
- Enhanced feature prioritization
- Added success metrics framework

### Next Review
- **When:** After Phase 2 completion
- **Focus:** Business model transition planning
- **Stakeholders:** Development team, product strategy

---

*This document serves as both technical reference and strategic roadmap. Update regularly as features are implemented and business strategy evolves.*
