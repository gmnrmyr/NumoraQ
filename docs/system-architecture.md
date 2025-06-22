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
  Track assets, income, expenses, debts, projections, and more.
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

*This documentation is a living document. Please update as features and architecture evolve!*
