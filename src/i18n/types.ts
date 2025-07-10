
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
  status: string;
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
  solanaWallet: string;
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
}
