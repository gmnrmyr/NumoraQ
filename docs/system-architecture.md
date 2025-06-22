# Theme, CMS, Access, and Technology Guide

## Technology Stack

- **Frontend:** React (with TypeScript), Tailwind CSS, Vite
- **State Management:** React Context, custom hooks
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Deployment:** Developed at Lovable Studio, deployable to Vercel/Netlify or similar
- **Other:** Unicorn Studio for dashboard and landing page animations

---

## Main Site Functionality

- **Personal Finance Dashboard:**  
  The dashboard is the core of Open Findash, providing a comprehensive overview and management of your financial life.  
  **Main modules:**
  - **Portfolio:**  
    - *Liquid Assets*: Crypto (BTC, ETH, altcoins), stocks, REITs, precious metals, cash, NFTs, and more.  
      - **Status:** Manual entry for all; live price updates only for BTC/ETH.  
      - **Planned:** Auto-fetch for wallets (BTC, EVM, Solana), NFT floor prices, more asset types.
    - *Illiquid Assets*: Real estate, collectibles, other non-liquid holdings.  
      - **Status:** Manual entry; inactive asset handling.
      - **Guidance:** Use Assets tab for real estate; advanced tracking for stocks in Liquid Assets.
    - *Portfolio Summary*:  
      - Total liquid, illiquid, and combined values.
      - Percentage breakdowns.
      - "Active Assets Only" toggle.
  - **Income:**  
    - Track all income sources, categorized as passive (e.g., dividends, staking) or active (salary, freelance).
    - **Status:** Manual entry; breakdown shown in dashboard.
    - **Planned:** Automated income detection from linked accounts.
  - **Expenses:**  
    - Track recurring and variable expenses.
    - **Status:** Manual entry; monthly and total breakdowns.
    - **Planned:** Smart categorization, AI suggestions.
  - **Debts:**  
    - Track all debts, due dates, and repayment status.
    - **Status:** Manual entry; snowball/avalanche payoff methods.
    - **Planned:** Debt payoff projections, reminders.
  - **Tasks:**  
    - Financial to-dos, reminders, and goals.
    - **Status:** [[[]]] Planned for future release.
  - **Assets:**  
    - Unified view of all assets (liquid + illiquid).
    - **Status:** Working; see Portfolio modules above.
  - **Projections:**  
    - Always shows a 12-month (or user-selected) projection of balances, income, expenses, and net worth.
    - **Status:** Working; user can select projection period (e.g., 12, 24, 50 months).
    - **Planned:** AI-powered forecasting, scenario analysis.

  **Quick Reference Table:**

  | Module         | Working? | Manual/Auto | Notes/Planned Improvements                  |
  |----------------|----------|-------------|---------------------------------------------|
  | Liquid Assets  | ✅       | Manual      | BTC/ETH live price; auto-fetch coming soon  |
  | Illiquid Assets| ✅       | Manual      | Inactive asset handling                     |
  | Income         | ✅       | Manual      | Passive/active breakdown                    |
  | Expenses       | ✅       | Manual      | Recurring/variable; smart AI planned        |
  | Debts          | ✅       | Manual      | Snowball/avalanche; projections planned     |
  | Tasks          | 🚧       | -           | Planned: reminders, to-dos                  |
  | Projections    | ✅       | Auto        | User-selectable period; AI planned          |

  **User Experience:**
  - All modules are accessible from the dashboard.
  - Data can be imported/exported (CSV, PDF, JSON).
  - Cloud sync via Supabase.
  - Live market data (BTC, ETH, BRL/USD) shown with last update timestamp.
  - Profile, language, and currency selection available.
  - Linked accounts (email, wallet, Discord) planned for multi-auth.

  [[[]] Expand each module section as new features are released. Use this structure for clarity and completeness.]
- **Donation System:**  
  Users can donate via crypto or (soon) PayPal to unlock badges, titles, and premium features.
- **Mobile-First, Brutalist/Modern UI:**  
  Responsive design with theme and accent customization.

---

## Main Panels

- **Dashboard:**  
  Central hub for all financial data, analytics, and projections.
- **Donation Page:**  
  Shows donation options, user tiers, and recognition.
- **Admin Panel (CMS):**  
  For site admins to manage CMS settings, wallets, premium codes, and users.
- **Dev Menu:**  
  Developer/debug panel for theme switching, testing, and code activation.
- **CMS Settings Panel:**  
  For editing site name, wallets, PayPal, upcoming features, and main color scheme.

---

## Theme System

- **Theme Classes:**  
  Visual themes are applied as classes on `<html>` (e.g., `theme-monochrome`, `theme-neon`, `theme-black-hole`).
- **Default Theme:**  
  Set via `:root` in [`src/index.css`](../src/index.css).  
  If no theme class is present, these variables are used.
- **Theme Switching:**  
  - Users can change themes via the Dev Menu or CMS.
  - Selected theme is stored in `localStorage.selectedTheme`.
  - On app load, [`src/main.tsx`](../src/main.tsx) applies the correct class.
- **Adding a New Theme:**  
  1. Add a `.theme-<name>` block in [`src/index.css`](../src/index.css).
  2. Add the theme to the Dev Menu and CMS selectors.

---

## Dev Mode

- **Access:**  
  Open the Dev Menu via the "DEV" button (bottom left).
- **Features:**  
  - Switch between all available themes for testing.
  - Activate premium/degen codes.
  - Debug user titles, roles, and access.
  - See current user status and donation level.
- **Implementation:**  
  See [`src/components/DevMenu.tsx`](../src/components/DevMenu.tsx) and [`src/components/devmenu/ThemeSelector.tsx`](../src/components/devmenu/ThemeSelector.tsx).

---

## Titles, Donation Tiers, and Access

- **Titles:**  
  User titles (e.g., CHAMPION, LEGEND, WHALE) are based on total donation points.
- **Donation Tiers:**  
  Each tier unlocks badges, premium features, and sometimes exclusive themes (see [DonationPage](../src/pages/DonationPage.tsx)).
- **Access Control:**  
  - Some themes (e.g., Black Hole, Dark Dither) are only available to users with certain titles or donation levels.
  - Logic for access is in [`useUserTitle`](../src/hooks/useUserTitle.ts) and theme selectors.
- **How Titles Work:**  
  - Titles are assigned automatically based on donation totals.
  - See the hardcoded tiers in [`DonationPage.tsx`](../src/pages/DonationPage.tsx) and [`useUserTitle.ts`](../src/hooks/useUserTitle.ts).

---

## CMS Settings

- **Where Settings Are Stored:**  
  CMS settings are managed via the `useCMSSettings` hook (`src/hooks/useCMSSettings.ts`).  
  These settings are fetched from Supabase and provided to the app.
- **How to Access Settings:**  
  Use the `useCMSSettings` hook in your component:
  ```tsx
  const { settings, loading } = useCMSSettings();
  ```
- **Common Settings:**
  - `website_name`: The name of the site, used in headers and footers.
  - `project_wallet_evm`, `project_wallet_solana`, etc.: Wallet addresses for donations.
  - `project_paypal_email`: PayPal email for donations.
  - Other settings may include feature toggles, theme defaults, and donation tiers.
- **Updating Settings:**  
  - Settings can be updated via the CMS admin panel (if enabled).
  - **Only users with `admin` or `superadmin` roles can access and update the CMS.**
  - Changes are reflected in the app after a reload or via live updates if supported.

---

## Main Hooks

- **useCMSSettings:**  
  Loads and updates CMS settings from the backend.  
  [`src/hooks/useCMSSettings.ts`](../src/hooks/useCMSSettings.ts)
- **useProjectSettings:**  
  Loads project-level settings for display and editing.  
  [`src/hooks/useProjectSettings.ts`](../src/hooks/useProjectSettings.ts)
- **useUserTitle:**  
  Determines user title and access based on donation points.  
  [`src/hooks/useUserTitle.ts`](../src/hooks/useUserTitle.ts)
- **useUnicornStudioAnimation:**  
  Handles loading and controlling dashboard animations.  
  [`src/hooks/useUnicornStudioAnimation.tsx`](../src/hooks/useUnicornStudioAnimation.tsx)
- **useAnimationToggle:**  
  Controls animation enable/disable state.  
  [`src/hooks/useAnimationToggle.ts`](../src/hooks/useAnimationToggle.ts)

---

## Backend & Data

- **Supabase:**  
  Used for authentication, CMS settings, and user data storage.  
  See [`src/integrations/supabase/`](../src/integrations/supabase/) and hooks above.
- **CMS Settings Table:**  
  Stores site-wide settings (wallets, PayPal, color scheme, etc.).
- **User Data:**  
  Stored in Supabase and localStorage for fast access and offline support.

---

## Interaction Between Theme, CMS, and Access

- **Theme Selection Order:**  
  1. User’s `localStorage.selectedTheme` (if set)
  2. CMS default theme (if set)
  3. Fallback to `:root` CSS variables
- **Access Control:**  
  - User’s title (from donation points) determines which themes and features are available.
  - Dev Menu can override for testing, but access checks still apply for premium themes.
- **CMS Access:**  
  - Only users with `admin` or `superadmin` roles can access the CMS/admin panel.

---

## Leaderboard

- **Points System:**  
  The leaderboard currently uses donation points (same as user titles) to rank users. In the future, this may be separated from donation points for more nuanced ranking.
- **Privacy:**  
  The leaderboard is private by default: it only shows anonymous users and your own position. No public user data is exposed.
- **Access:**  
  Leaderboard data is restricted at the Supabase backend level to ensure privacy and security.
- **Self-View:**  
  Logged-in users can see their own rank and points on the leaderboard.

---

## Upcoming Features

The following features are planned or in active development. For the most up-to-date list, see the [Donation Page](../src/pages/DonationPage.tsx) and [`ProductStateSection`](../src/components/donation/ProductStateSection.tsx).

- **PayPal Donations:**  
  Enable tier tracking and donations via PayPal (coming soon).
- **Automatic Wallet Value Fetching:**  
  Real-time portfolio updates for BTC, EVM, and Solana chains.
- **NFT Floor Tracking:**  
  Integration with OpenSea to track NFT collection floor prices.
- **Advanced Analytics:**  
  Enhanced portfolio analytics with profit/loss tracking and performance metrics.
- **Goal Tracking:**  
  Set financial goals and track progress with projections and milestones.
- **Artistic Dashboard Animations:**  
  Themed, immersive animations that change the feel of your dashboard (visual rollout in progress).
- **AI-powered Forecasting:**  
  Predict your financial future using AI-generated models.
- **AI Chatbot Assistant:**  
  Ask financial questions, navigate your dashboard, or log data via chat.
- **Wallet + NFT Fetching:**  
  Sync Ethereum wallets and NFT contracts into your dashboard automatically.
- **Leaderboard Opt-in:**  
  Rank among top contributors (optional and privacy-respecting).
- **Improved Mobile Layout:**  
  Responsive redesign with better animation handling on small screens.
- **Rebrand:**  
  A new, abstract name is coming soon. All current users will retain full access and donor status.
- **Stocks, REITs, and Precious Metals:**  
  UI for these asset classes is available, but price syncing and live updates are not yet implemented.
- **Translation Improvements:**  
  Major overhaul of Portuguese (pt) translations. Considering integrating an open-source translation platform for better quality and community contributions.
- **Premium (Degen Mode):**  
  Premium users see fewer ads (Google AdSense integration in progress). Degen mode unlocks extra features and disables ads.
- **New Dashboard Instance:**  
  A separate dashboard instance for testing and fixing Unicorn Studio animations, especially for theme compatibility.
- **User Research & AI Feedback:**  
  Add user research tools and make it easy for AI to read/compile user feedback to improve documentation and features.
- **JSON Export/Import for Data Management:**  
  Users can export their data as JSON and import it back.  
  - **Instructions on Landing Page:** How to export demo data, edit it (e.g., with AI or by pasting from Excel), and re-import into the app.
  - **AI Integration:** Guide users to use tools like Grok or ChatGPT to convert their data for import.

---

## See Also

- [`src/index.css`](../src/index.css) for theme variable definitions.
- [`src/main.tsx`](../src/main.tsx) for theme initialization logic.
- [`src/hooks/useCMSSettings.ts`](../src/hooks/useCMSSettings.ts) for CMS settings logic.
- [`src/hooks/useUserTitle.ts`](../src/hooks/useUserTitle.ts) for title/donation logic.
- [`src/components/DevMenu.tsx`](../src/components/DevMenu.tsx) for dev/debug controls.

---

# System Architecture & Platform Overview

## Platform Status Overview

- **Logo & Branding:**  
  Open Findash branding is present throughout the UI.

- **User Info & Config Panel:**  
  - Avatar, username, UID, and donation tier (e.g., WHALE) are displayed.
  - Language and currency selection (🇧🇷 BRL, 🇺🇸 EN).
  - Degen Mode and Lifetime/Premium status indicators.
  - Profile customization options.
  - **Linked Accounts:**  
    - Email (primary auth)
    - Solana wallet (linking planned)
    - Discord account (linking planned)
    - Multi-auth support (planned)

- **Data Management:**  
  - Local operations: CSV import/export, reset.
  - PDF export for financial reports.
  - Cloud sync (Supabase backend).
  - Live price/projection settings.

- **Market Data:**  
  - Live toggle (ON/OFF)
  - Exchange rates: BRL/USD, BTC, ETH
  - Last updated timestamp
  - Projection period (user-selectable, e.g., 50 months)

---

## Dashboard Panels & Metrics

- **Overview Panel:**  
  - Available Now: Liquid assets total, count.
  - Monthly Income: Total, passive/active breakdown.
  - Monthly Expenses: Total, count.
  - Active Debts: Total, count.
  - Monthly Balance: Net flow.
  - Projection summary (e.g., 50-month projection).

- **Portfolio Overview:**  
  - **Coming Soon:**  
    - Auto-fetch wallet values (BTC, EVM, Solana)
    - NFT floor price integration (OpenSea)
    - BTC/ETH asset valuation (in development)
    - Manual asset entry is current default

- **Liquid Assets:**  
  - List of all liquid assets (crypto, stocks, cash, wallets, NFTs, etc.)
  - Hide/show inactive assets
  - Add/edit/delete assets
  - Asset details: name, value, type, quantity, wallet address, etc.

- **Illiquid Assets:**  
  - List of illiquid assets (real estate, collectibles, etc.)
  - Inactive asset handling
  - Guidance: Use Assets tab for real estate, advanced tracking for stocks

- **Portfolio Summary:**  
  - Total liquid, illiquid, and combined portfolio values
  - Percentage breakdowns
  - "Active Assets Only" toggle

- **Advanced Financial Projection:**  
  - Current balance, projected balance, total growth, monthly average
  - Financial Independence (FI) ratio and status
  - Income breakdown (passive, active, recurring expenses, net monthly)
  - Monthly breakdown table/chart
  - Risk assessment (emergency fund, income stability, growth trend)
  - AI Insights (growth trajectory, net flow, FI progress)

---

## Core Features: Status

| Feature                        | Status         | Notes/Planned Improvements                        |
|--------------------------------|---------------|---------------------------------------------------|
| Liquid Asset Tracking          | ✅ Working     | Manual entry, live price for BTC/ETH only         |
| Illiquid Asset Tracking        | ✅ Working     | Manual entry, real estate via Assets tab          |
| Wallet Tracking (BTC/EVM/SOL)  | 🚧 In Progress| Auto-fetch coming soon, manual for now            |
| NFT Floor Price Integration    | 🚧 Planned    | OpenSea integration planned                       |
| Income/Expense Tracking        | ✅ Working     | Passive/active income, recurring/variable expenses|
| Debt Tracking                  | ✅ Working     | Status, due dates, snowball method                |
| Financial Projections          | ✅ Working     | 12+ months, user-selectable period                |
| AI Insights                    | ✅ Working     | Basic insights, more AI features planned          |
| Data Export/Import             | ✅ Working     | CSV, PDF, JSON (import/export improvements planned)|
| Cloud Sync                     | ✅ Working     | Supabase backend                                  |
| Multi-auth/Linked Accounts     | 🚧 Planned    | Email, wallet, Discord                            |
| Donation System                | ✅ Working     | Crypto, PayPal (PayPal coming soon)               |
| Premium/Degen Mode             | ✅ Working     | No ads, extra features                            |
| Theme System                   | ✅ Working     | Multiple themes, access by tier                   |
| Leaderboard                    | ✅ Working     | Private by default, opt-in planned                |
| Mobile Optimization            | 🚧 Improving  | Ongoing improvements                              |
| Translation (PT/EN)            | ✅ Working     | Major overhaul in progress                        |

---

## What’s Not Working / Limitations

- Live price updates only for BTC/ETH (other assets manual)
- Wallet auto-fetch (BTC/EVM/SOL) not yet live
- NFT floor price tracking not yet live
- Multi-auth (wallet, Discord) not yet live
- Some advanced analytics and AI features are planned but not yet implemented

---

## See Also

- [src/components/portfolio/LiquidAssetsCard.tsx](../src/components/portfolio/LiquidAssetsCard.tsx)
- [src/components/portfolio/IlliquidAssetsCard.tsx](../src/components/portfolio/IlliquidAssetsCard.tsx)
- [src/components/portfolio/WalletTracker.tsx](../src/components/portfolio/WalletTracker.tsx)
- [src/components/dashboard/MetricsOverview.tsx](../src/components/dashboard/MetricsOverview.tsx)
- [src/components/projection/ProjectionChart.tsx](../src/components/projection/ProjectionChart.tsx)
- [src/contexts/financial-data/initialState.ts](../src/contexts/financial-data/initialState.ts)
- [src/hooks/useLivePriceUpdates.ts](../src/components/portfolio/hooks/useLivePriceUpdates.ts)

---

*Update this document as features are released or changed. Use [[[]]] or <----- for inline notes and TODOs as you iterate!*

## Navigation & UI Structure

### Dashboard Navbar

The dashboard navigation is designed for simplicity and power, with a minimalist top bar and a feature-rich hamburger menu.

- **Top Bar:**
  - Open Findash Logo (always visible, links to dashboard home)
  - Hamburger Menu (☰) – opens the main navigation drawer

- **Hamburger Menu Contents:**
  - **User Info:**  
    - Username (or "Sign In" if logged out, prominent)
    - User avatar and tier badge (e.g., WHALE)
  - **Dashboard Links:**  
    - Portfolio
    - Income
    - Expenses
    - Assets
    - Tasks & Debt
  - **Community:**  
    - Profile
    - Leaderboard
  - **Settings:**  
    - Language selector (🇧🇷/🇺🇸)
    - Currency selector (BRL/USD/etc.)
  - **Support the Project:**  
    - Link to donation page or modal
  - **Sign Out / Sign In:**  
    - Large, prominent button at the bottom
    - Shows "Sign Out" if logged in, "Sign In" if logged out

> **Note:** All navigation is accessible via keyboard and optimized for mobile/touch. The hamburger menu is the primary navigation hub for all dashboard features.

---

### Landing Page

The landing page is the public face of Open Findash, focused on conversion, clarity, and showcasing the platform’s unique value. It is animated (Unicorn Studio, codename: `illusive_odyssey`) and will soon be fully CMS-driven for copy and feature control.

- **Header:**
  - Open Findash Logo
  - Navigation: Features | About | Get Started | Play Anim (Heavy GPU)
  - "100% Free & Open Source" badge

- **Hero Section:**
  - **Headline:**  
    - "Your Money, Your Dashboard"
  - **Subheadline:**  
    - "Track crypto, manage expenses, and build wealth with the most privacy-focused financial dashboard. No tracking, just pure financial clarity."
  - **CTAs:**  
    - Start Building Wealth (primary)
    - View Demo (secondary)

- **Feature Highlights (Animated):**
  - Portfolio Overview (sample data: Bitcoin, Cash, Real Estate)
  - Income vs Expenses (sample data: Monthly In/Out, Net Growth)
  - Visuals: Unicorn Studio animation (`illusive_odyssey`), dynamic charts

- **Value Propositions:**
  - Portfolio Tracking: Real-time crypto, stocks, and liquid assets with beautiful visualizations
  - Privacy First: Data stays local, optional cloud sync with E2E encryption
  - Lightning Fast: Modern web tech, no lag
  - Built by Degens, for Degens: Open source, privacy-first, crypto-native

- **Social Proof & Trust:**
  - "100% Free Forever"
  - "0 Data Tracking"
  - Join the Revolution

- **Footer:**
  - Open Findash Logo
  - Links: Privacy | Terms
  - Copyright © 2024
  - Version info (e.g., -12500)

---

### Planned / In Progress

- **CMS-Driven Landing Page:**  
  All landing page copy, feature lists, and CTAs will be editable via the CMS for rapid iteration and localization.
- **More Animations:**  
  Additional Unicorn Studio animations and interactive elements.
- **Better Info Architecture:**  
  Improved sectioning, testimonials, and community highlights.
- **A/B Testing:**  
  Planned for future growth and optimization.

---

### References

- [`src/components/Navbar.tsx`](../src/components/Navbar.tsx) – Dashboard navbar logic
- [`src/components/HamburgerMenu.tsx`](../src/components/HamburgerMenu.tsx) – Hamburger menu implementation
- [`src/pages/LandingPage.tsx`](../src/pages/LandingPage.tsx) – Landing page structure and animation
- [`src/components/landing/IllusiveOdyssey.tsx`](../src/components/landing/IllusiveOdyssey.tsx) – Unicorn Studio animation

---

> **[[[]]]** Expand this section as navigation or landing features evolve. Document all major UI/UX changes, especially those affecting onboarding, conversion, or accessibility.

---

## Beta Dashboard Animation Integration (Role-Gated, Local-First)

- Build and test the beta dashboard locally before deploying to production to avoid unnecessary Unicorn Studio credit usage.
- Integrate Unicorn Studio animations using the exact embed code for each role:
  - Champion+: Black Hole (`db3DaP9gWVnnnr7ZevK7`, 2000x900 or 400x400)
  - Whales+: Dark Dither (`h49sb4lMLFG1hJLyIzdq`, 1440x900)
  - Contributor 50+: DaTest (video placeholder)
- Animations must be displayed behind the header text, with play/pause controls and the animation ID visible for debugging.
- Role gating must be enforced in the hamburger menu and animation toggles (not just DevMenu).
- The beta dashboard link should appear in the hamburger menu for Whale+ users only, without disrupting existing navigation.
- Use minimal hacking nomenclature and subtle pixel art accents for the UI.
- Panels and navbar must use the same user data as the main dashboard.
- Refactor code to be modular (separate animation, UI, and data logic).
- Test all animations locally on multiple devices and provide fallbacks (static PNGs or videos) if needed.
- Track and minimize Unicorn Studio credit usage.
