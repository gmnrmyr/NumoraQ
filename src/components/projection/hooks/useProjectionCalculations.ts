import { useFinancialData } from "@/contexts/FinancialDataContext";

export const useProjectionCalculations = () => {
  const { data } = useFinancialData();

  const calculateProjection = () => {
    const months = data.projectionMonths;
    const projectionData = [];
    
    // Get current liquid assets (only active ones)
    const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
    const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
    
    // Calculate monthly dividend income from auto-compound REITs
    const autoCompoundAssets = activeLiquidAssets.filter(asset => asset.isReit && asset.autoCompound);
    const monthlyDividendIncome = autoCompoundAssets.reduce((sum, asset) => {
      if (asset.monthlyYield && asset.value) {
        return sum + (asset.value * (asset.monthlyYield / 100));
      }
      return sum;
    }, 0);
    
    // Get monthly income and expenses (only active ones)
    const totalPassiveIncome = data.passiveIncome
      .filter(income => income.status === 'active')
      .reduce((sum, income) => sum + income.amount, 0);
    
    const totalActiveIncome = data.activeIncome
      .filter(income => income.status === 'active')
      .reduce((sum, income) => sum + income.amount, 0);
    
    const totalRecurringExpenses = data.expenses
      .filter(expense => expense.type === 'recurring' && expense.status === 'active')
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalVariableExpenses = data.expenses
      .filter(expense => expense.type === 'variable' && expense.status === 'active')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    // Include dividend income in passive income
    const totalPassiveIncomeWithDividends = totalPassiveIncome + monthlyDividendIncome;
    const monthlyNetIncome = totalPassiveIncomeWithDividends + totalActiveIncome - totalRecurringExpenses;
    
    // Calculate projection for each month
    let runningBalance = totalLiquid;
    let cumulativeDividends = 0;
    
    // Add current month (month 0)
    projectionData.push({
      month: 0,
      balance: Math.round(runningBalance),
      monthlyIncome: totalPassiveIncomeWithDividends + totalActiveIncome,
      monthlyExpenses: totalRecurringExpenses,
      netChange: 0,
      passiveIncome: totalPassiveIncomeWithDividends,
      activeIncome: totalActiveIncome,
      recurringExpenses: totalRecurringExpenses,
      cumulativeGrowth: 0,
      balanceChange: 0,
      dividendIncome: monthlyDividendIncome
    });
    
    // Calculate future months with compound growth for REITs
    for (let i = 1; i <= months; i++) {
      const previousBalance = runningBalance;
      
      // Apply monthly variable expenses only in month 1
      const variableExpensesThisMonth = i === 1 ? totalVariableExpenses : 0;
      
      // Calculate compound growth for REIT dividends
      const currentMonthDividendIncome = autoCompoundAssets.reduce((sum, asset) => {
        if (asset.monthlyYield && asset.value) {
          // Compound the REIT value with accumulated dividends
          const currentValue = asset.value + (cumulativeDividends * (asset.value / totalLiquid));
          return sum + (currentValue * (asset.monthlyYield / 100));
        }
        return sum;
      }, 0);
      
      cumulativeDividends += currentMonthDividendIncome;
      
      const totalPassiveThisMonth = totalPassiveIncome + currentMonthDividendIncome;
      const monthlyChange = totalPassiveThisMonth + totalActiveIncome - totalRecurringExpenses - variableExpensesThisMonth;
      
      runningBalance += monthlyChange;
      
      projectionData.push({
        month: i,
        balance: Math.round(runningBalance),
        monthlyIncome: totalPassiveThisMonth + totalActiveIncome,
        monthlyExpenses: totalRecurringExpenses + variableExpensesThisMonth,
        netChange: monthlyChange,
        passiveIncome: totalPassiveThisMonth,
        activeIncome: totalActiveIncome,
        recurringExpenses: totalRecurringExpenses,
        variableExpenses: variableExpensesThisMonth,
        cumulativeGrowth: runningBalance - totalLiquid,
        balanceChange: runningBalance - previousBalance,
        dividendIncome: currentMonthDividendIncome
      });
    }
    
    return projectionData;
  };

  const projectionData = calculateProjection();
  const initialBalance = projectionData[0]?.balance || 0;
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  const isPositiveProjection = finalBalance >= initialBalance;
  const totalGrowth = finalBalance - initialBalance;
  const monthlyAverage = totalGrowth / data.projectionMonths;

  // Financial Independence calculations
  const monthlyExpenses = data.expenses
    .filter(expense => expense.type === 'recurring' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const passiveIncome = data.passiveIncome
    .filter(income => income.status === 'active')
    .reduce((sum, income) => sum + income.amount, 0);

  const fiRatio = monthlyExpenses > 0 ? (passiveIncome / monthlyExpenses) * 100 : 0;
  const monthsToFI = passiveIncome < monthlyExpenses && monthlyAverage > 0 
    ? Math.ceil((monthlyExpenses * 25 - initialBalance) / monthlyAverage) 
    : 0;

  return {
    projectionData,
    initialBalance,
    finalBalance,
    isPositiveProjection,
    totalGrowth,
    monthlyAverage,
    fiRatio,
    monthsToFI,
    monthlyExpenses,
    passiveIncome
  };
};
