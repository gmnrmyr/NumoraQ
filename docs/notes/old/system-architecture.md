# NUMORAQ System Architecture

## Technology Stack

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom themes and brutalist design system
- **Build Tool:** Vite for fast development and optimized production builds
- **State Management:** React Context + custom hooks for centralized data flow
- **Animations:** Unicorn Studio for premium dashboard animations with role-gating
- **Charts:** Custom chart components with interactive hover tooltips and financial data display
- **Responsive Design:** Mobile-first approach with touch-optimized interfaces

### Backend & Services Infrastructure
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
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
- **Future Integrations:** OpenSea API, Debank/Zapper APIs, Google Auth, ChatGPT API, PayPal API

## Core Platform Features

### Portfolio Management
- **Liquid Assets:** Crypto, stocks, REITs, precious metals, cash, NFTs with real-time tracking
- **Illiquid Assets:** Real estate, collectibles, manual entry with value appreciation tracking
- **Live Prices:** BTC/ETH pricing with expanding asset coverage
- **Wallet Auto-fetch:** BTC, EVM, Solana integration with DeFi position tracking
- **NFT Floor Prices:** OpenSea integration for real-time collection valuations
- **Portfolio Summary:** Total values, percentages, active/inactive toggle with performance metrics

### Financial Tracking & Management
- **Income Tracking:** Passive/active categorization with detailed source tracking
- **Expense Tracking:** Recurring/variable, manual entry with 40+ categories
- **Debt Management:** Snowball/avalanche methods with payoff optimization
- **Task Management:** Financial to-dos, reminders with priority-based organization

### Projections & Analytics Engine
- **12-Month Projections:** User-selectable periods with scenario analysis
- **Advanced Chart Hover:** Comprehensive financial data with expense triggers and detailed breakdowns
- **Variable Expense Visualization:** Track what's causing big expense months with predictive analysis
- **Interactive Projections:** User-adjustable projection periods with scenario analysis
- **Financial Breakdown:** Income/expense/debt breakdown in hover tooltips with real-time calculations

## User Interface & Navigation

### Dashboard Navigation
- **Top Bar:** Minimalist with logo and hamburger menu
- **Hamburger Menu:** Feature-rich navigation drawer with comprehensive access
- **User info and tier badges:** Role-based access control
- **Dashboard sections:** Portfolio, Income, Expenses with intuitive organization
- **Community features:** Profile, Leaderboard for user engagement
- **Settings and preferences:** Customization options

### Landing Page Experience
- **Animated with Unicorn Studio:** `illusive_odyssey` animation
- **Structure:** Hero, features, pricing, value props with conversion optimization
- **CMS Integration:** Dynamic content management with real-time updates
- **Performance:** Optimized loading times with progressive enhancement

### Degen Dashboard Animations (Role-Gated)
| User Tier | Animation | Unicorn Studio ID | Resolution | Access Level |
|-----------|-----------|-------------------|------------|-------------|
| Champion+ | Black Hole | `db3DaP9gWVnnnr7ZevK7` | 2000x900 | Premium users |
| Whales+ | Dark Dither | `h49sb4lMLFG1hJLyIzdq` | 1440x900 | High-tier users |
| Contributor 50+ | DaTest | Video placeholder | Various | Community contributors |

### Mobile Responsiveness & Touch Optimization
- **DevMenu:** Responsive design with mobile close button and touch-friendly interface
- **Cloud Sync:** Fixed mobile bleeding, stacked layout on mobile with optimal spacing
- **Button Text:** Shortened text for mobile screens with clear call-to-actions
- **Touch Targets:** Improved button sizing for mobile with accessibility compliance
- **Gesture Support:** Swipe navigation and touch gestures for enhanced mobile experience

## Payment System & Monetization

### Dual System Architecture
- **Degen Plans:** Monthly/lifetime subscriptions for premium features with automated billing
- **Donor Badges:** Separate recognition system for platform support with community benefits
- **Crypto Donations:** Multiple wallet support (EVM active) with real-time transaction tracking
- **Payment Processing:** Stripe integration with webhook automation

### Monetization Features
- **Pricing Pages:** PaymentPage with unified degen + donor systems with transparent pricing
- **Subscription UI:** PremiumSubscriptionPanel with degen terminology and clear value propositions
- **Payment Flow:** Stripe integration with success/cancel handling and user feedback
- **Revenue Tracking:** Basic analytics with potential for advanced reporting

### Wallet Linking & Direct Payments
- **Profile-Based Linking:** Users can link Solana & EVM wallets to their accounts
- **Persistent Storage:** Wallet connections saved locally with session management
- **Direct Payments:** One-click tier payments through linked wallets with instant activation
- **Multi-Wallet Support:** Phantom, Solflare (Solana), MetaMask (EVM)
- **Payment Tiers:** All degen plans available through wallet payments
- **Live Pricing:** Real-time SOL price integration from CoinGecko

### Payment Integration (Stripe)
- **Stripe Integration:** Automated subscription processing via Supabase Edge Functions
- **Webhook Processing:** Automatic premium activation on payment completion
- **Payment Flow:** Stripe Checkout with success/cancel handling
- **Database Integration:** Payment sessions and premium status tracking
- **Security:** Webhook signature verification and environment variable protection

## Key Files & Components Architecture

### Core Components
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

## Database Schema

### Core Tables
- `user_premium_status`: Tracks premium access with time-based expiry
- `user_points`: Manages fidelity points and tier calculations  
- `payment_sessions`: Handles Stripe transactions with proper constraints
- `premium_codes`: Admin-generated codes for premium access
- `profiles`: User profile information
- `financial_data`: User financial information

### Security Features
- Row Level Security (RLS) on all tables
- JWT-based authentication
- Encrypted payment processing
- Rate limiting and audit logging

## Payment Processing Flow

1. User selects plan → Creates payment session
2. Stripe processes payment → Webhook confirms
3. Premium status activated → Time calculated and set
4. User sees status in UI → Countdown begins

## AI Integration

### ChatGPT Financial Advisor
- Complete dashboard data analysis
- Personalized financial advice
- Multiple personality modes (professional, aggressive, conservative)
- Rich text formatting and interactive chat
- Premium-only feature with usage tracking

## Community Features

### Leaderboard System
- Fidelity points based on platform engagement
- Tier-based recognition system (NEWCOMER → WHALE → LEGEND)
- User rankings and competitive elements
- Daily login streaks and rewards

### User Tiers
- NEWCOMER: 0 points (Welcome badge)
- SUPPORTER-BASIC: 10 points ($10+ donation)
- FRIEND: 20 points ($20+ donation)
- HELPER: 25 points ($25+ donation)
- CONTRIBUTOR: 50 points ($50+ donation)
- DONOR: 100 points ($100+ donation)
- BACKER: 500 points ($500+ donation)
- SUPPORTER: 1000 points ($1,000+ donation)
- CHAMPION: 2000 points ($2,000+ donation)
- PATRON: 5000 points ($5,000+ donation)
- LEGEND: 10000 points ($10,000+ donation)
- WHALE: 50000 points ($50,000+ donation)

## Premium Features

### Degen Plans
- Monthly Premium: $9.99/month
- 3 Month Premium: $24.99 (17% savings)
- 6 Month Premium: $44.99 (25% savings) - Most Popular
- Yearly Premium: $79.99 (33% savings)
- Lifetime Premium: $299 (Best value)

### Premium Benefits
- Ad-free experience
- AI Financial Advisor (ChatGPT integration)
- Premium dashboard themes and animations
- Advanced analytics and projections
- Priority support
- Exclusive community features

## Future Development

### Planned Features
- Complete Solana wallet integration
- NFT floor price tracking with OpenSea integration
- Automated wallet synchronization
- DeFi position monitoring
- Machine learning forecasting
- Automated expense categorization

### Infrastructure Improvements
- Database migration to DBeaver integration
- Multi-environment setup (test.numoraq.com)
- Backup systems implementation
- Disaster recovery procedures

## Security & Privacy

### Data Protection
- User data stored locally with optional cloud sync
- No data selling or third-party sharing
- GDPR-compliant privacy policies
- Secure payment processing with PCI compliance

### Authentication & Access Control
- Multi-factor authentication options
- Role-based access control
- Session management with automatic timeout
- Audit logging for admin actions

