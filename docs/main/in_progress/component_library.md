# Component Library

This document provides an overview of the UI components in the Wealth Dashboard Flow app. Components are grouped by feature area with descriptions, primary files, and key usage notes.

## Hamburger Menu (Advanced Dashboard) (Header)
Description: A collapsible sidebar navigation menu used in the Advanced Dashboard layout. Supports both desktop and mobile breakpoints.  
Primary Components:
- **Navbar** (`src/components/Navbar.tsx`): Main wrapper that handles toggle state and breakpoint logic.  (advanced dashboard hamburger menu)
- **NavbarHeader** (`src/components/navbar/NavbarHeader.tsx`): Contains logo and hamburger icon.  
- **CurrencySelector** (`src/components/navbar/CurrencySelector.tsx`): Dropdown for switching currencies.  
- **DonationLinks** (`src/components/navbar/DonationLinks.tsx`): Quick links to donation flows.  
- **UserSettingsPanel** (`src/components/navbar/UserSettingsPanel.tsx`): Profile, settings, and logout menu.

## Hamburger Menu (Simple Dashboard)
Description: A streamlined top-bar menu for the Simple Dashboard view with minimal items.  
Primary Components:
- **Navbar** with limited menu items (leverages same `Navbar` component with a reduced item list).  (simple dashboard, todo)
- **DailyLoginButton** (`src/components/DailyLoginButton.tsx`): Prompts users to check in daily for rewards.  

## Advanced Dashboard (Main)
Description: Full-featured dashboard view with charts, metrics, and panels for power users.  
- **AdvancedDashboard** (`src/components/AdvancedDashboard.tsx`)

### Sub-components
- `DashboardHeader` (`src/components/dashboard/DashboardHeader.tsx`)  
- `DashboardTitle` (`src/components/dashboard/DashboardTitle.tsx`)  
- `MetricsOverview` (`src/components/dashboard/MetricsOverview.tsx`)  
- `ProjectionCard` (`src/components/dashboard/ProjectionCard.tsx`)  
- `ExchangeRatesBanner` (`src/components/dashboard/ExchangeRatesBanner.tsx`)  
- `DonationInterface` (`src/components/dashboard/DonationInterface.tsx`)  
- `PremiumStatusIndicator` (`src/components/dashboard/PremiumStatusIndicator.tsx`)  
- `UnicornStudioAnimation` (`src/components/dashboard/UnicornStudioAnimation.tsx`)  
- `AnimationDebugPanel` (`src/components/dashboard/AnimationDebugPanel.tsx`)  

## USER_INFO_CONFIG_UI
Description: Components for displaying and editing user profile and preferences.  
- `UserProfileSection` (`src/components/UserProfileSection.tsx`)  
- `UserPreferences` (`src/components/profile/UserPreferences.tsx`)  
- `AccountLinking` (`src/components/profile/AccountLinking.tsx`)  
- `AvatarSelector` (`src/components/profile/AvatarSelector.tsx`)  
- `NicknameEditor` (`src/components/profile/NicknameEditor.tsx`)  
- `ProfileUIDEditor` (`src/components/ProfileUIDEditor.tsx`)  
- `CloudSyncStatus` (`src/components/profile/CloudSyncStatus.tsx`)  
- `WalletLinking` (`src/components/profile/WalletLinking.tsx`)  
- `DegenModeSection` (`src/components/profile/DegenModeSection.tsx`)

## Leaderboard
Description: Displays user rankings, point categories, and CTAs for earning more points.  
- `LeaderboardHeader` (`src/components/leaderboard/LeaderboardHeader.tsx`)  
- `LeaderboardTable` (`src/components/leaderboard/LeaderboardTable.tsx`)  
- `UserStatsCard` (`src/components/leaderboard/UserStatsCard.tsx`)  
- `PointCategoriesGrid` (`src/components/leaderboard/PointCategoriesGrid.tsx`)  
- `CallToActionCard` (`src/components/leaderboard/CallToActionCard.tsx`)  
- Hook: `useLeaderboardData` (`src/hooks/leaderboard/useLeaderboardData.ts`)

## Simple Dashboard (Secondary)
Description: A pared-down dashboard for users without the full advanced feature set.  
- `SimpleDashboard` (`src/components/dashboard/SimpleDashboard.tsx`)  
  - Reuses `MetricsOverview`, `ExchangeRatesBanner`, `ProjectionCard` in a compact layout.

## Onboarding
Description: Multi-step walkthrough guiding new users through account setup and first actions.  
- `OnboardingFlow` (`src/components/OnboardingFlow.tsx`)  
- Page: `OnboardingPage` (`src/pages/OnboardingPage.tsx`)  

### Sub-components
- `FeaturesGrid` (`src/components/index/FeaturesGrid.tsx`)  
- `HeroSection` (`src/components/index/HeroSection.tsx`)  
- `UsageGuideSection` (`src/components/index/UsageGuideSection.tsx`)  
- `TrialExpirationGuard` (`src/components/TrialExpirationGuard.tsx`)

## Landing Page
Description: Public-facing homepage with marketing copy and CTAs.  
- `LandingPage` (`src/pages/LandingPage.tsx`)  
- Reuses `FeaturesGrid`, `HeroSection`, `UsageGuideSection`.

## DevMenu
Description: Hidden developer panel for toggling experimental flags and themes.  
- `DevMenu` (`src/components/DevMenu.tsx`)  
- `DegenModePanel` (`src/components/devmenu/DegenModePanel.tsx`)  
- `ThemeSelector` (`src/components/devmenu/ThemeSelector.tsx`)

## CMS / Admin Panel
Description: Interfaces for project configuration and admin-only actions.  
- `AdminPanel` (`src/components/AdminPanel.tsx`)  
- `ProjectSettingsPanel` (`src/components/cms/ProjectSettingsPanel.tsx`)  
- `SecureAdminPanel` (`src/components/SecureAdminPanel.tsx`)  
- `AdminSourceTracker` (`src/components/AdminSourceTracker.tsx`)  
- Hook: `useSecureAdminAuth` (`src/hooks/useSecureAdminAuth.tsx`)

## AI Chatbot
Description: Embedded AI advisor and feedback collection UI.  
- `AIAdvisor` (`src/components/ai/AIAdvisor.tsx`)  
- Service: `chatgptService` (`src/services/chatgptService.ts`)  
- `UserFeedbackDialog` (`src/components/UserFeedbackDialog.tsx`)

## Donation Tiers Panel
Description: UI for selecting donation tiers and processing payments.  
- `ProductStateSection` (`src/components/donation/ProductStateSection.tsx`)  
- `UnifiedPaymentFlow` (`src/components/payment/UnifiedPaymentFlow.tsx`)  
- `SolanaPaymentPanel` (`src/components/payment/SolanaPaymentPanel.tsx`)  
- Service: `cryptoPaymentService` (`src/services/cryptoPaymentService.ts`)

## Degen Tiers Panel
Description: Displays tiers and rewards in ‘Degen Mode’.  
- Reuses `PointCategoriesGrid`, `CallToActionCard`  
- `DegenModeSection` (`src/components/profile/DegenModeSection.tsx`)

## Visual Components
### Buttons
- `Button` (`src/components/ui/button.tsx`)  
- Variants: icon, ghost, outline, etc.  
### Design System
- `Card` (`src/components/ui/card.tsx`)  
- `Badge` (`src/components/ui/badge.tsx`)  
- `Avatar` (`src/components/ui/avatar.tsx`)  
- `Dialog` (`src/components/ui/dialog.tsx`)  
- `DropdownMenu`, `ContextMenu`, `Command`  
- Layout: `Accordion`, `CollapsibleSection`, `AspectRatio`  
- Charts: `Chart` (`src/components/ui/chart.tsx`)

## Data Management
Description: Exporting, importing, and data-manipulation tools.  
- `DataManagementSection` (`src/components/DataManagementSection.tsx`)  
- `DataToolbar` (`src/components/DataToolbar.tsx`)  
- Hook: `useDataOperations` (`src/contexts/financial-data/hooks/useDataOperations.ts`)

## JSON Export
Description: Export the current application state as JSON.  
- Implemented within `DataManagementSection`.

## PDF Export
Description: Generate downloadable PDF reports and statements.  
- `PDFExport` (`src/components/PDFExport.tsx`)

## XP Points (Leaderboard)
Description: Displays earned XP points and user point history.  
- `UserStatsCard` (`src/components/leaderboard/UserStatsCard.tsx`)  
- Hook: `useUserPoints` (`src/hooks/useUserPoints.ts`)

## Tier Points (for Tiers)
Description: Points thresholds for unlocking tiers and rewards.  
- `PointCategoriesGrid` (`src/components/leaderboard/PointCategoriesGrid.tsx`)

## Timing (Degen Plans)
Description: Scheduling and trial-period controls for Degen mode.  
- Hook: `useTrialActivation` (`src/hooks/useTrialActivation.ts`)  
- `TrialExpirationGuard` (`src/components/TrialExpirationGuard.tsx`)
