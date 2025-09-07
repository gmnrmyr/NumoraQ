
export interface UserProfile {
  name: string;
  defaultCurrency: string;
  language: string;
  avatarIcon?: string;
  liveDataEnabled?: boolean;
  donorWallet?: string; // Added for donor wallet address
  totalDonated?: number; // Added for total donation amount
  theme?: string; // Added for theme preference
  premiumExpiresAt?: string; // Added for premium expiration tracking
}

export interface ExchangeRates {
  brlToUsd: number;
  usdToBrl: number;
  btcPrice: number;
  ethPrice: number;
  solPrice: number;
  lastUpdated: string;
}
