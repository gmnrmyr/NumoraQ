interface CryptoTransaction {
  hash: string;
  from: string;
  to: string;
  value: string; // in wei for ETH
  blockNumber: number;
  timestamp: number;
  gasUsed?: string;
  gasPrice?: string;
}

interface PaymentDetection {
  transactionHash: string;
  amount: number;
  currency: string;
  timestamp: number;
  fromAddress: string;
  confirmations: number;
}

export class CryptoPaymentService {
  private readonly ETHERSCAN_API_KEY = 'YourEtherscanAPIKey'; // Should be in env vars
  private readonly WALLET_ADDRESS = '0x6c21bB0Ef4b7d037aB6b124f372ae7705c6d74AD';
  
  // Minimum confirmations required
  private readonly MIN_CONFIRMATIONS = 3;
  
  // Cache to track processed transactions
  private processedTxHashes = new Set<string>();

  constructor() {
    // Load processed transactions from localStorage to persist across sessions
    const stored = localStorage.getItem('processed_crypto_payments');
    if (stored) {
      try {
        const hashes = JSON.parse(stored);
        this.processedTxHashes = new Set(hashes);
      } catch (error) {
        console.error('Error loading processed transactions:', error);
      }
    }
  }

  /**
   * Check for new incoming payments to the wallet
   */
  async checkForNewPayments(): Promise<PaymentDetection[]> {
    try {
      const transactions = await this.getRecentTransactions();
      const newPayments: PaymentDetection[] = [];
      
      for (const tx of transactions) {
        // Skip if already processed
        if (this.processedTxHashes.has(tx.hash)) {
          continue;
        }
        
        // Skip if not enough confirmations
        const currentBlock = await this.getCurrentBlockNumber();
        const confirmations = currentBlock - tx.blockNumber;
        if (confirmations < this.MIN_CONFIRMATIONS) {
          continue;
        }
        
        // Check if it's an incoming payment
        if (tx.to.toLowerCase() === this.WALLET_ADDRESS.toLowerCase()) {
          const amount = this.weiToEth(tx.value);
          
          // Only process payments above minimum threshold (e.g., $1 worth)
          if (amount >= 0.001) { // Minimum 0.001 ETH
            const payment: PaymentDetection = {
              transactionHash: tx.hash,
              amount,
              currency: 'ETH',
              timestamp: tx.timestamp,
              fromAddress: tx.from,
              confirmations
            };
            
            newPayments.push(payment);
            this.markAsProcessed(tx.hash);
          }
        }
      }
      
      return newPayments;
    } catch (error) {
      console.error('Error checking for new payments:', error);
      return [];
    }
  }

  /**
   * Get recent transactions for the wallet address
   */
  private async getRecentTransactions(): Promise<CryptoTransaction[]> {
    try {
      // Using Etherscan API for Ethereum mainnet
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${this.WALLET_ADDRESS}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${this.ETHERSCAN_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== '1') {
        throw new Error(`Etherscan API error: ${data.message}`);
      }
      
      return data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: parseInt(tx.blockNumber),
        timestamp: parseInt(tx.timeStamp),
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Fallback: return empty array instead of throwing
      return [];
    }
  }

  /**
   * Get current block number
   */
  private async getCurrentBlockNumber(): Promise<number> {
    try {
      const url = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${this.ETHERSCAN_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      return parseInt(data.result, 16);
    } catch (error) {
      console.error('Error getting current block number:', error);
      return 0;
    }
  }

  /**
   * Convert wei to ETH
   */
  private weiToEth(wei: string): number {
    return parseFloat(wei) / Math.pow(10, 18);
  }

  /**
   * Mark transaction as processed
   */
  private markAsProcessed(txHash: string): void {
    this.processedTxHashes.add(txHash);
    // Persist to localStorage
    localStorage.setItem(
      'processed_crypto_payments', 
      JSON.stringify(Array.from(this.processedTxHashes))
    );
  }

  /**
   * Validate a transaction hash manually
   */
  async validateTransactionHash(txHash: string): Promise<PaymentDetection | null> {
    try {
      const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.ETHERSCAN_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.result) {
        throw new Error('Transaction not found');
      }
      
      const tx = data.result;
      
      // Verify it's to our wallet
      if (tx.to?.toLowerCase() !== this.WALLET_ADDRESS.toLowerCase()) {
        throw new Error('Transaction is not to our wallet address');
      }
      
      // Get transaction receipt for confirmations
      const receiptUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.ETHERSCAN_API_KEY}`;
      const receiptResponse = await fetch(receiptUrl);
      const receiptData = await receiptResponse.json();
      
      if (!receiptData.result) {
        throw new Error('Transaction receipt not found');
      }
      
      const currentBlock = await this.getCurrentBlockNumber();
      const confirmations = currentBlock - parseInt(receiptData.result.blockNumber, 16);
      
      return {
        transactionHash: txHash,
        amount: this.weiToEth(tx.value),
        currency: 'ETH',
        timestamp: Date.now() / 1000, // Current timestamp since we don't have block timestamp
        fromAddress: tx.from,
        confirmations
      };
    } catch (error) {
      console.error('Error validating transaction:', error);
      return null;
    }
  }

  /**
   * Get ETH to USD conversion rate
   */
  async getETHPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      return data.ethereum?.usd || 0;
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      return 0;
    }
  }

  /**
   * Convert ETH amount to USD
   */
  async convertToUSD(ethAmount: number): Promise<number> {
    const ethPrice = await this.getETHPrice();
    return ethAmount * ethPrice;
  }

  /**
   * Start monitoring for payments (call this periodically)
   */
  startMonitoring(callback: (payments: PaymentDetection[]) => void, intervalMs: number = 30000): () => void {
    const interval = setInterval(async () => {
      const newPayments = await this.checkForNewPayments();
      if (newPayments.length > 0) {
        callback(newPayments);
      }
    }, intervalMs);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  /**
   * Get wallet address for display
   */
  getWalletAddress(): string {
    return this.WALLET_ADDRESS;
  }
} 