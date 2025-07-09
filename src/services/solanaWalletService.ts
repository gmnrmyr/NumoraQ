interface SolanaWalletConnection {
  publicKey: string;
  connected: boolean;
  signTransaction?: (transaction: any) => Promise<any>;
  disconnect: () => Promise<void>;
}

interface SolanaPaymentTier {
  tier: string;
  solAmount: number;
  usdValue: number;
  benefits: string[];
}

interface SolanaPaymentResult {
  success: boolean;
  transactionHash?: string;
  tier?: string;
  error?: string;
}

export class SolanaWalletService {
  private wallet: SolanaWalletConnection | null = null;
  private readonly PROJECT_WALLET = 'Au5F8YjkVL7CK2ZjVkxEKZhPQGzkS2b6fLGhQHfMWYY5'; // Replace with actual project wallet
  
  // Solana payment tiers - updated based on SOL price
  private readonly PAYMENT_TIERS: SolanaPaymentTier[] = [
    {
      tier: 'DEGEN_LIFETIME',
      solAmount: 3.5, // ~$299 at $85/SOL
      usdValue: 299,
      benefits: ['Lifetime access', 'All features', 'Priority support']
    },
    {
      tier: 'DEGEN_PRO',
      solAmount: 0.12, // ~$9.99 at $85/SOL
      usdValue: 9.99,
      benefits: ['Monthly access', 'All features', 'No ads']
    },
    {
      tier: 'WHALE',
      solAmount: 11.8, // ~$1000 at $85/SOL
      usdValue: 1000,
      benefits: ['Whale tier', 'Exclusive features', 'Direct support']
    },
    {
      tier: 'CHAMPION',
      solAmount: 5.9, // ~$500 at $85/SOL
      usdValue: 500,
      benefits: ['Champion tier', 'Advanced features', 'Priority access']
    }
  ];

  constructor() {
    this.initializeWallet();
  }

  private async initializeWallet() {
    try {
      // Check if Phantom wallet is available
      if (typeof window !== 'undefined' && (window as any).solana) {
        const solana = (window as any).solana;
        if (solana.isPhantom) {
          console.log('Phantom wallet detected');
          return;
        }
      }
      
      // Check for other Solana wallets (Solflare, Backpack, etc.)
      if (typeof window !== 'undefined' && (window as any).solflare) {
        console.log('Solflare wallet detected');
        return;
      }
      
      console.log('No Solana wallet detected');
    } catch (error) {
      console.error('Error initializing Solana wallet:', error);
    }
  }

  async connectWallet(): Promise<SolanaWalletConnection | null> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Solana wallet only available in browser');
      }

      let solana = (window as any).solana;
      
      // Try Phantom first
      if (solana?.isPhantom) {
        const resp = await solana.connect();
        this.wallet = {
          publicKey: resp.publicKey.toString(),
          connected: true,
          signTransaction: solana.signTransaction,
          disconnect: () => solana.disconnect()
        };
        return this.wallet;
      }
      
      // Try Solflare
      if ((window as any).solflare) {
        solana = (window as any).solflare;
        const resp = await solana.connect();
        this.wallet = {
          publicKey: resp.publicKey.toString(),
          connected: true,
          signTransaction: solana.signTransaction,
          disconnect: () => solana.disconnect()
        };
        return this.wallet;
      }
      
      throw new Error('No Solana wallet found. Please install Phantom or Solflare wallet.');
    } catch (error) {
      console.error('Failed to connect Solana wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    if (this.wallet) {
      try {
        await this.wallet.disconnect();
        this.wallet = null;
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    }
  }

  getConnectedWallet(): SolanaWalletConnection | null {
    return this.wallet;
  }

  getPaymentTiers(): SolanaPaymentTier[] {
    return this.PAYMENT_TIERS;
  }

  async processPayment(tier: string): Promise<SolanaPaymentResult> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    const tierData = this.PAYMENT_TIERS.find(t => t.tier === tier);
    if (!tierData) {
      throw new Error('Invalid tier selected');
    }

    try {
      // This is a placeholder for actual Solana transaction logic
      // In production, you would:
      // 1. Create a transaction to send SOL to project wallet
      // 2. Sign the transaction with user's wallet
      // 3. Send transaction to Solana network
      // 4. Wait for confirmation
      // 5. Update user's tier status

      console.log(`Processing payment for ${tier}: ${tierData.solAmount} SOL`);
      
      // Simulate transaction creation and signing
      const mockTransaction = {
        from: this.wallet.publicKey,
        to: this.PROJECT_WALLET,
        amount: tierData.solAmount,
        tier: tier
      };

      // In production, replace with actual Solana transaction logic
      const transactionHash = `solana_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      return {
        success: true,
        transactionHash,
        tier: tier
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  async getSolanaPrice(): Promise<number> {
    try {
      // In production, use CoinGecko or similar API
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      return data.solana?.usd || 85; // Fallback to $85
    } catch (error) {
      console.error('Failed to fetch SOL price:', error);
      return 85; // Fallback price
    }
  }

  async updateTierPricing(): Promise<void> {
    try {
      const solPrice = await this.getSolanaPrice();
      
      // Update tier pricing based on current SOL price
      this.PAYMENT_TIERS.forEach(tier => {
        tier.solAmount = tier.usdValue / solPrice;
      });
    } catch (error) {
      console.error('Failed to update tier pricing:', error);
    }
  }

  // Check if user has made a payment (for backend integration)
  async verifyPayment(transactionHash: string): Promise<boolean> {
    try {
      // This would integrate with Solana RPC to verify transaction
      // For now, return true for demo purposes
      console.log(`Verifying transaction: ${transactionHash}`);
      return true;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const solanaWalletService = new SolanaWalletService(); 