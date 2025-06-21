
import { useFinancialData } from "@/contexts/FinancialDataContext";

export const useProjectionCalculations = () => {
  const { data } = useFinancialData();

  const calculateProjection = () => {
    const months = data.projectionMonths;
    const projectionData = [];
    
    // Get current liquid assets (only active ones)
    const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
    const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
    
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

    // Helper function to get variable expenses for a specific month
    const getVariableExpensesForMonth = (monthOffset: number) => {
      const currentDate = new Date();
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
      const targetMonth = targetDate.toISOString().slice(0, 7); // YYYY-MM format
      
      return data.expenses
        .filter(expense => {
          if (expense.type !== 'variable' || expense.status !== 'active') return false;
          
          // If no specific date, it's a monthly variable expense (triggers every month)
          if (!expense.specificDate) return true;
          
          // If specific date matches this exact month, include it
          const expenseMonth = expense.specificDate.slice(0, 7);
          return expenseMonth === targetMonth;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
    };
    
    const monthlyNetIncome = totalPassiveIncome + totalActiveIncome - totalRecurringExpenses;
    
    // Calculate projection for each month
    let runningBalance = totalLiquid;
    
    // Add current month (month 0)
    const currentMonthVariableExpenses = getVariableExpensesForMonth(0);
    projectionData.push({
      month: 0,
      balance: Math.round(runningBalance),
      monthlyIncome: totalPassiveIncome + totalActiveIncome,
      monthlyExpenses: totalRecurringExpenses + currentMonthVariableExpenses,
      netChange: 0,
      passiveIncome: totalPassiveIncome,
      activeIncome: totalActiveIncome,
      recurringExpenses: totalRecurringExpenses,
      variableExpenses: currentMonthVariableExpenses,
      cumulativeGrowth: 0,
      balanceChange: 0
    });
    
    // Calculate future months
    for (let i = 1; i <= months; i++) {
      const previousBalance = runningBalance;
      
      // Get variable expenses for this specific month
      const variableExpensesThisMonth = getVariableExpensesForMonth(i);
      const monthlyChange = monthlyNetIncome - variableExpensesThisMonth;
      
      runningBalance += monthlyChange;
      
      projectionData.push({
        month: i,
        balance: Math.round(runningBalance),
        monthlyIncome: totalPassiveIncome + totalActiveIncome,
        monthlyExpenses: totalRecurringExpenses + variableExpensesThisMonth,
        netChange: monthlyChange,
        passiveIncome: totalPassiveIncome,
        activeIncome: totalActiveIncome,
        recurringExpenses: totalRecurringExpenses,
        variableExpenses: variableExpensesThisMonth,
        cumulativeGrowth: runningBalance - totalLiquid,
        balanceChange: runningBalance - previousBalance
      });
    }
    
    return projectionData;
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'BRL': return 'R$';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const projectionData = calculateProjection();
  const initialBalance = projectionData[0]?.balance || 0;
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  const isPositiveProjection = finalBalance >= initialBalance;
  const totalGrowth = finalBalance - initialBalance;
  const monthlyAverage = totalGrowth / data.projectionMonths;
  const currencySymbol = getCurrencySymbol(data.userProfile.defaultCurrency);

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
    currencySymbol,
    fiRatio,
    monthsToFI,
    monthlyExpenses,
    passiveIncome
  };
};
