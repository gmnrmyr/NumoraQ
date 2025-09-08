interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface FinancialContext {
  // Portfolio & Assets
  totalLiquidAssets?: number;
  totalIlliquidAssets?: number;
  liquidAssets?: any[];
  illiquidAssets?: any[];
  portfolioSummary?: any;
  
  // Income & Expenses
  totalMonthlyIncome?: number;
  totalMonthlyExpenses?: number;
  totalAnnualIncome?: number;
  totalAnnualExpenses?: number;
  incomeStreams?: any[];
  expenseCategories?: any[];
  
  // Debt & Savings
  totalDebt?: number;
  debtAccounts?: any[];
  debtPayoffStrategy?: string;
  
  // Goals & Projections
  projectionPeriod?: number;
  projectedNetWorth?: number;
  savingsRate?: number;
  timeToFI?: number;
  
  // User Profile
  userAge?: number;
  userGoals?: string[];
  userRiskTolerance?: string;
  userNickname?: string;
  userTier?: string;
  
  // App Usage
  lastActivity?: string;
  featuresUsed?: string[];
}

export class ChatGPTService {
  private baseURL = 'https://hcnoxyfztviuwkiysitm.functions.supabase.co/ai-chat';

  constructor() {
    // No API key needed in the browser; requests go through Supabase Edge Function
  }

  private getSystemPrompt(personality: string, context?: FinancialContext): string {
    const basePrompt = `You are an AI Financial Advisor for Numoraq, a comprehensive financial dashboard platform that helps users track their complete financial picture and build wealth. `;
    
    const numoraqFeatures = `
NUMORAQ PLATFORM FEATURES:
• Portfolio Management: Liquid assets (crypto, stocks, REITs, precious metals, cash, NFTs) and illiquid assets (real estate, collectibles)
• Income & Expense Tracking: Complete categorization with active/passive income streams and recurring/variable expenses
• Debt Management: Snowball and avalanche payoff strategies with progress tracking
• Financial Projections: 12-month forecasting with compound interest calculations and Financial Independence (FI) planning
• Live Price Updates: Real-time crypto/stock prices with portfolio value tracking
• Wallet Integration: BTC, EVM, and Solana wallet auto-fetch capabilities
• Task Management: Financial to-dos and goal tracking
• Premium Features: Ad-free experience, advanced analytics, AI advisor (current feature)
• Multi-currency Support: Global currency conversion and tracking
• Data Backup: Cloud sync and local storage with export capabilities
`;

    const contextInfo = context ? `
CURRENT USER FINANCIAL SNAPSHOT:
• Portfolio: $${context.totalLiquidAssets?.toFixed(2) || 'Not set'} liquid + $${context.totalIlliquidAssets?.toFixed(2) || 'Not set'} illiquid assets
• Cash Flow: $${context.totalMonthlyIncome?.toFixed(2) || 'Not set'}/month income - $${context.totalMonthlyExpenses?.toFixed(2) || 'Not set'}/month expenses
• Debt: $${context.totalDebt?.toFixed(2) || 'No debt tracked'}${context.debtPayoffStrategy ? ` (${context.debtPayoffStrategy} strategy)` : ''}
• Savings Rate: ${context.savingsRate?.toFixed(1) || 'Not calculated'}%
• Projection Period: ${context.projectionPeriod || 12} months
• Net Worth Projection: $${context.projectedNetWorth?.toFixed(2) || 'Not calculated'}
• User Profile: ${context.userNickname || 'Anonymous'} (${context.userTier || 'Free'} tier)
• Key Assets: ${context.liquidAssets?.slice(0, 3).map((asset: any) => `${asset.name || asset.type}: $${asset.value?.toFixed(2) || '0'}`).join(', ') || 'None added yet'}
• Top Expenses: ${context.expenseCategories?.slice(0, 3).map((expense: any) => `${expense.name}: $${expense.amount?.toFixed(2) || '0'}/month`).join(', ') || 'None tracked yet'}
` : '';

    const personalityPrompts = {
      professional: `${basePrompt}You provide professional, data-driven financial advice with a focus on long-term wealth building. Be thorough, analytical, and conservative in your recommendations. Reference specific Numoraq features when giving advice.`,
      friendly: `${basePrompt}You're a supportive financial coach who provides encouragement and makes complex financial concepts easy to understand. Be warm, motivational, and practical. Help users navigate Numoraq's features to reach their goals.`,
      aggressive: `${basePrompt}You're a bold trading advisor focused on high-growth opportunities and active investing. Be direct about risks and opportunities, emphasizing momentum and market timing. Push users to maximize Numoraq's portfolio tracking for active strategies.`,
      conservative: `${basePrompt}You prioritize capital preservation and steady growth through safe investments. Focus on emergency funds, stable income, and risk mitigation strategies. Guide users to use Numoraq's debt tracking and projection features for financial security.`
    };

    return (personalityPrompts[personality as keyof typeof personalityPrompts] || personalityPrompts.professional) + 
           numoraqFeatures + contextInfo + `

RESPONSE GUIDELINES:
• Keep responses under 250 words for mobile readability
• **ALWAYS reference their actual financial data** - mention specific amounts, assets, or ratios when relevant
• Use **bold text** for emphasis on key points and recommendations
• Reference specific Numoraq features when giving advice (e.g., "Add this to your liquid assets tracking", "Update your projection period")
• Provide actionable, specific advice based on their current dashboard data
• Ask clarifying questions about their Numoraq setup when needed
• Encourage them to utilize features they haven't explored yet
• Be encouraging about their financial journey and progress tracking
• If they ask about features, explain how to use them in Numoraq
• For investment advice, remind them to update their portfolio tracking
• For budgeting, guide them to expense tracking features
• For debt payoff, reference the debt management section
• Format currency as $X,XXX and percentages as XX% for better readability
• Use bullet points (•) for lists and recommendations`;
  }

  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[], 
    personality: string = 'professional',
    financialContext?: FinancialContext
  ): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: this.getSystemPrompt(personality, financialContext) },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: message }
      ];

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 300,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I encountered an error processing your request.';

    } catch (error) {
      console.error('ChatGPT Service Error:', error);
      
      // Fallback responses based on personality
      const fallbackResponses = {
        professional: "I'm currently experiencing technical difficulties. Please check your portfolio diversification and consider scheduling a financial review.",
        friendly: "Oops! I'm having some technical trouble right now. In the meantime, keep tracking your expenses and you're doing great!",
        aggressive: "Technical issues detected! While I'm down, consider reviewing your high-growth positions and market trends.",
        conservative: "System temporarily unavailable. Focus on your emergency fund and stable investments while I recover."
      };

      return fallbackResponses[personality as keyof typeof fallbackResponses] || fallbackResponses.professional;
    }
  }

  // Helper method to extract comprehensive financial context from user data
  extractFinancialContext(userData: any): FinancialContext {
    try {
      // Portfolio & Assets - Only include active assets
      const liquidAssets = userData?.liquidAssets || [];
      const illiquidAssets = userData?.illiquidAssets || [];
      
      const activeLiquidAssets = liquidAssets.filter((asset: any) => asset.isActive);
      const activeIlliquidAssets = illiquidAssets.filter((asset: any) => asset.isActive);
      
      const totalLiquidAssets = activeLiquidAssets.reduce((sum: number, asset: any) => sum + (asset.value || 0), 0);
      const totalIlliquidAssets = activeIlliquidAssets.reduce((sum: number, asset: any) => sum + (asset.value || 0), 0);
      
      // Income & Expenses - Fix data structure matching
      const passiveIncomeStreams = userData?.passiveIncome || [];
      const activeIncomeStreams = userData?.activeIncome || [];
      const expenseCategories = userData?.expenses || [];
      
      // Calculate total monthly income (only active streams)
      const totalPassiveIncome = passiveIncomeStreams
        .filter((income: any) => income.status === 'active')
        .reduce((sum: number, income: any) => sum + (income.amount || 0), 0);
      
      const totalActiveIncome = activeIncomeStreams
        .filter((income: any) => income.status === 'active')
        .reduce((sum: number, income: any) => sum + (income.amount || 0), 0);
      
      const totalMonthlyIncome = totalPassiveIncome + totalActiveIncome;
      
      // Calculate total monthly expenses (only active recurring expenses + unscheduled variable)
      const recurringExpenses = expenseCategories
        .filter((expense: any) => expense.type === 'recurring' && expense.status === 'active')
        .reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);
      
      const unscheduledVariableExpenses = expenseCategories
        .filter((expense: any) => 
          expense.type === 'variable' && 
          expense.status === 'active' && 
          !expense.specificDate
        )
        .reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);
      
      const totalMonthlyExpenses = recurringExpenses + unscheduledVariableExpenses;
      
      // Debt - Fix data structure matching
      const debtAccounts = userData?.debts || [];
      const totalDebt = debtAccounts
        .filter((debt: any) => debt.isActive && debt.status !== 'paid')
        .reduce((sum: number, debt: any) => sum + (debt.amount || 0), 0);
      
      // Projections & Goals
      const projectionPeriod = userData?.projectionMonths || 12;
      const monthlySavings = totalMonthlyIncome - totalMonthlyExpenses;
      const savingsRate = totalMonthlyIncome > 0 ? (monthlySavings / totalMonthlyIncome) * 100 : 0;
      const projectedNetWorth = (totalLiquidAssets + totalIlliquidAssets) + (monthlySavings * projectionPeriod);
      
      // User Profile
      const userProfile = userData?.userProfile || {};
      const userTier = userData?.userTier || 'Free';
      
      return {
        // Portfolio & Assets
        totalLiquidAssets,
        totalIlliquidAssets,
        liquidAssets: activeLiquidAssets,
        illiquidAssets: activeIlliquidAssets,
        portfolioSummary: {
          totalValue: totalLiquidAssets + totalIlliquidAssets,
          assetCount: activeLiquidAssets.length + activeIlliquidAssets.length,
          diversification: this.calculateDiversification(activeLiquidAssets)
        },
        
        // Income & Expenses
        totalMonthlyIncome,
        totalMonthlyExpenses,
        totalAnnualIncome: totalMonthlyIncome * 12,
        totalAnnualExpenses: totalMonthlyExpenses * 12,
        incomeStreams: [...passiveIncomeStreams, ...activeIncomeStreams],
        expenseCategories,
        
        // Debt & Savings
        totalDebt,
        debtAccounts,
        debtPayoffStrategy: userData?.debtPayoffStrategy || 'Not set',
        
        // Goals & Projections
        projectionPeriod,
        projectedNetWorth,
        savingsRate,
        timeToFI: this.calculateTimeToFI(monthlySavings, totalLiquidAssets + totalIlliquidAssets, totalMonthlyExpenses),
        
        // User Profile
        userAge: userProfile.age,
        userGoals: userProfile.goals || [],
        userRiskTolerance: userProfile.riskTolerance || 'Not set',
        userNickname: userProfile.nickname || userData?.nickname,
        userTier,
        
        // App Usage
        lastActivity: userData?.lastActivity || 'Recent',
        featuresUsed: this.getUsedFeatures(userData)
      };
    } catch (error) {
      console.error('Error extracting financial context:', error);
      return {};
    }
  }

  private calculateDiversification(assets: any[]): string {
    if (!assets || assets.length === 0) return 'No assets';
    const assetTypes = [...new Set(assets.map(asset => asset.type))];
    if (assetTypes.length === 1) return 'Single asset type';
    if (assetTypes.length >= 3) return 'Well diversified';
    return 'Moderately diversified';
  }

  private calculateTimeToFI(monthlySavings: number, currentAssets: number, monthlyExpenses: number): number {
    if (monthlySavings <= 0 || monthlyExpenses <= 0) return 0;
    const fiTarget = monthlyExpenses * 12 * 25; // 25x annual expenses rule
    const remainingNeeded = fiTarget - currentAssets;
    return Math.max(0, Math.ceil(remainingNeeded / monthlySavings));
  }

  private getUsedFeatures(userData: any): string[] {
    const features = [];
    if (userData?.liquidAssets?.length > 0) features.push('Portfolio Tracking');
    if (userData?.illiquidAssets?.length > 0) features.push('Illiquid Assets');
    if ((userData?.passiveIncome?.length > 0) || (userData?.activeIncome?.length > 0)) features.push('Income Tracking');
    if (userData?.expenses?.length > 0) features.push('Expense Tracking');
    if (userData?.debts?.length > 0) features.push('Debt Management');
    if (userData?.projectionMonths) features.push('Financial Projections');
    if (userData?.tasks?.length > 0) features.push('Task Management');
    return features;
  }
} 