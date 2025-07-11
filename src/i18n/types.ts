
export type Language = 'en' | 'pt' | 'es' | 'fr' | 'de';

export interface Translations {
  // App branding
  appName: string;
  appTagline: string;
  appDescription: string;
  
  // Navigation
  portfolio: string;
  income: string;
  expenses: string;
  assets: string;
  tasks: string;
  debt: string;
  
  // User profile
  userProfile: string;
  displayName: string;
  defaultCurrency: string;
  signIn: string;
  signOut: string;
  
  // Auth
  login: string;
  register: string;
  createAccount: string;
  loginWithGoogle: string;
  signInToSave: string;
  createAccountToSync: string;
  
  // Dashboard metrics
  availableNow: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  activeDebts: string;
  monthlyBalance: string;
  netWorth: string;
  totalAssets: string;
  
  // Data management
  dataManagement: string;
  saveToCloud: string;
  loadFromCloud: string;
  exportData: string;
  importData: string;
  resetData: string;
  
  // Live data
  liveNumbers: string;
  lastUpdated: string;
  updatedAgo: string;
  
  // Common actions
  add: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  close: string;
  search: string;
  filter: string;
  sort: string;
  
  // Time periods
  monthly: string;
  yearly: string;
  projection: string;
  
  // Status
  active: string;
  inactive: string;
  completed: string;
  pending: string;
  status: string;
  
  // Priority levels
  high: string;
  medium: string;
  low: string;
  
  // Unsaved changes
  unsavedChanges: string;
  unsavedChangesDesc: string;
  lastSync: string;
  lastModified: string;
  
  // Asset types
  liquidAssets: string;
  illiquidAssets: string;
  liquid: string;
  illiquid: string;
  realEstate: string;
  investments: string;
  
  // Income types
  passiveIncome: string;
  activeIncome: string;
  salary: string;
  freelance: string;
  dividends: string;
  rental: string;
  
  // Expense types
  recurringExpenses: string;
  variableExpenses: string;
  housing: string;
  transportation: string;
  food: string;
  entertainment: string;
  health: string;
  utilities: string;
  personal: string;
  travel: string;
  trips: string;
  other: string;
  
  // Financial terms
  amount: string;
  category: string;
  description: string;
  date: string;
  priority: string;
  notes: string;
  name: string;
  
  // Messages
  noDataYet: string;
  addFirstItem: string;
  syncingData: string;
  dataUpdated: string;
  errorOccurred: string;
  
  // Sorting options
  sortBy: string;
  sortByDate: string;
  sortByAmount: string;
  sortByPriority: string;
  sortByName: string;
  ascending: string;
  descending: string;
  
  // Expense-specific terms
  addExpense: string;
  addNewExpense: string;
  expenseName: string;
  selectCategory: string;
  selectType: string;
  recurring: string;
  variable: string;
  day: string;
  dueDayPlaceholder: string;
  inactiveExpenses: string;
  totalExpenses: string;
  oneTimeExpenses: string;
  combinedActiveExpenses: string;
  totalImpact: string;
  expenseSummary: string;
  tapToSwitch: string;
  
  // Debt-specific terms
  creditor: string;
  dueDate: string;
  debtStatus: string;
  partial: string;
  paid: string;
  due: string;
  
  // Dashboard interface
  userInfoConfigUI: string;
  profileCustomizeDesc: string;
  customizeExperience: string;
  accountLinking: string;
  walletLinking: string;
  directPayments: string;
  connectWallets: string;
  linkedWallets: string;
  payForTier: string;
  payForDegen: string;
  
  // Sync and time
  neverSynced: string;
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  
  // Degen mode
  degenMode: string;
  lifetimeAccess: string;
  noAdsEnabled: string;
  activateForAdFree: string;
  activateCode: string;
  buyDegen: string;
  premiumExperience: string;
  
  // Wallet connection
  solanaWalletConnect: string;
  evmWallet: string;
  connectSolana: string;
  connectMetamask: string;
  reconnectSolana: string;
  reconnectEVM: string;
  connecting: string;
  
  // Navigation sections
  dashboardSections: string;
  communityFeatures: string;
  settingsPreferences: string;
  supportDonation: string;
  
  // Dashboard sections
  overview: string;
  welcome: string;
  getStarted: string;
  addDemoData: string;
  addMyOwn: string;
  proTip: string;
  welcomeToNumoraq: string;
  demoDataDescription: string;
  hide: string;
  show: string;
  
  // Portfolio section
  portfolioSummary: string;
  totalLiquidActive: string;
  totalIlliquidActive: string;
  totalPortfolioActive: string;
  ofPortfolio: string;
  activeAssetsOnly: string;
  blockchainWallets: string;
  trackCryptoPortfolios: string;
  
  // Payment and Donation pages
  supportDonorBadges: string;
  supportPlatformDevelopment: string;
  degenPlansPremiumAccess: string;
  purchasePremiumAccess: string;
  premiumAccessNotice: string;
  premiumAccessDescription: string;
  simpleFlow: string;
  stripeIntegrationActive: string;
  loadingDonationInfo: string;
  loadingPaymentInfo: string;
  copied: string;
  walletAddressCopied: string;
  paymentSuccessful: string;
  welcomeToDegenClub: string;
  paymentCancelled: string;
  paymentCancelledDescription: string;
  comingSoon: string;
  willBeAvailableSoon: string;
  manualPaymentRequired: string;
  sendPaymentContactActivation: string;
  manualTransfer: string;
  sendExactAmountContact: string;
  paymentError: string;
  paymentCouldNotBeProcessed: string;
  currentStatus: string;
  paymentStatus: string;
  donationStatus: string;
  degenNo: string;
  selectDegenPlan: string;
  selectDonationTier: string;
  chooseDegenPlan: string;
  supportPlatformEarnBadges: string;
  popular: string;
  activateDegenPlan: string;
  completeDonation: string;
  processing: string;
  howItWorks: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  selectPreferredPlan: string;
  selectPreferredTier: string;
  choosePaymentMethod: string;
  completePaymentProcess: string;
  premiumFeaturesActivated: string;
  donorBadgeApplied: string;
  contactSupportHelp: string;
  thisPaymentMethodComingSoon: string;
  chooseAnotherOption: string;
  
  // Payment methods
  creditCardStripe: string;
  selectPaymentMethod: string;
  paymentDetails: string;
  solanaWallet: string;
  paypal: string;
  evmDirectTransfer: string;
  evmWalletConnect: string;
  pix: string;
  boleto: string;
  secureCreditCardPayments: string;
  directSolPayments: string;
  paypalAccountPayments: string;
  sendEthBscDirectly: string;
  connectMetamaskWallets: string;
  instantBrazilianPayments: string;
  brazilianBankSlip: string;
  securePaymentProcessing: string;
  paymentActive: string;
  disabled: string;
  
  // Navigation between payment pages
  switchToDonations: string;
  switchToPayments: string;
  currentlyOnPayments: string;
  currentlyOnDonations: string;
  
  // Footer
  advancedFinancialDashboard: string;
  beta: string;
  allRightsReserved: string;
  quickLinks: string;
  dashboard: string;
  home: string;
  leaderboard: string;
  upcomingFeatures: string;
  community: string;
  github: string;
  xTwitter: string;
  systemStatus: string;
  allSystemsOperational: string;
}
