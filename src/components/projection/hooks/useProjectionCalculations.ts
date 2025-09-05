
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
    
    // Get monthly income and expenses
    // Base passive income: only active streams without scheduling
    const passiveIncomeList = data.passiveIncome || [];
    // Exclude compounding-enabled incomes from base; they will be modeled as principal growth
    const baseUnscheduledActivePassiveIncome = passiveIncomeList
      .filter((income: any) => income.status === 'active' && !income.useSchedule && !income.compoundEnabled)
      .reduce((sum: number, income: any) => sum + (income.amount || 0), 0);
    
    const totalActiveIncome = data.activeIncome
      .filter(income => income.status === 'active')
      .reduce((sum, income) => sum + income.amount, 0);
    
    const totalRecurringExpenses = data.expenses
      .filter(expense => expense.type === 'recurring' && expense.status === 'active')
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Get variable expenses with proper date handling
    const activeVariableExpenses = data.expenses
      .filter(expense => expense.type === 'variable' && expense.status === 'active');
    
    // Helper to get scheduled passive income amount for a given month offset
    const getScheduledPassiveIncomeForMonth = (monthOffset: number) => {
      const currentDate = new Date();
      const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
      const targetYm = targetMonth.toISOString().slice(0, 7);
      return passiveIncomeList
        .filter((income: any) => income.useSchedule && income.startDate)
        .filter((income: any) => {
          const startYm = String(income.startDate).slice(0, 7);
          const endYm = income.endDate ? String(income.endDate).slice(0, 7) : undefined;
          const starts = targetYm >= startYm;
          const notEnded = !endYm || targetYm <= endYm;
          return starts && notEnded;
        })
        .reduce((sum: number, income: any) => sum + (income.amount || 0), 0);
    };

    // Compounding passive income: track principals and compute monthly growth
    // Use APY to compute effective monthly compounding rate: (1+APY)^(1/12)-1
    const monthlyRateFor = (annualApy?: number) => (annualApy ? Math.pow(1 + (annualApy / 100), 1/12) - 1 : 0);
    // Initialize principals map for compounding-enabled items; principal derived from income.amount
    const compoundedItems = (passiveIncomeList as any[]).filter((inc) => inc.compoundEnabled);
    const principalById: Record<string, number> = {};
    compoundedItems.forEach((inc) => {
      principalById[inc.id] = Math.max(0, Number(inc.amount) || 0);
    });

    // Include dividend income in passive income for month 0
    const scheduledPassiveMonth0 = getScheduledPassiveIncomeForMonth(0);
    // Add compounded monthly gains for month 0 (only for active + schedule conditions)
    const compoundedGainMonth0 = compoundedItems.reduce((sum, inc) => {
      // Respect status and schedule for month 0
      const isActive = inc.status === 'active';
      const month0Allowed = !inc.useSchedule || (inc.startDate && (!inc.endDate || String(inc.startDate).slice(0,7) <= new Date().toISOString().slice(0,7) && new Date().toISOString().slice(0,7) <= String(inc.endDate).slice(0,7)));
      if (!isActive || !month0Allowed) return sum;
      const rate = monthlyRateFor(inc.compoundAnnualRate);
      const base = principalById[inc.id] || 0;
      const gain = base * rate;
      principalById[inc.id] = base + gain; // grow principal
      return sum + gain;
    }, 0);
    // Liquid assets compounding month 0
    const liquidCompoundItems = activeLiquidAssets.filter((a: any) => a.compoundEnabled);
    const liquidMonthlyRateFor = (annualApy?: number) => (annualApy ? Math.pow(1 + (annualApy / 100), 1/12) - 1 : 0);
    const liquidPrincipalById: Record<string, number> = {};
    liquidCompoundItems.forEach((asset: any) => {
      liquidPrincipalById[asset.id] = Math.max(0, Number(asset.value) || 0);
    });
    const liquidCompoundedGainMonth0 = liquidCompoundItems.reduce((sum, asset: any) => {
      const rate = liquidMonthlyRateFor(asset.compoundAnnualRate);
      const base = liquidPrincipalById[asset.id] || 0;
      const gain = base * rate;
      liquidPrincipalById[asset.id] = base + gain;
      return sum + gain;
    }, 0);

    const totalPassiveIncomeWithDividendsMonth0 = baseUnscheduledActivePassiveIncome + scheduledPassiveMonth0 + compoundedGainMonth0 + monthlyDividendIncome;
    const monthlyNetIncomeMonth0 = totalPassiveIncomeWithDividendsMonth0 + totalActiveIncome - totalRecurringExpenses;
    
    // Calculate projection for each month
    let runningBalance = totalLiquid;
    let cumulativeDividends = 0;
    
    // Add current month (month 0)
    projectionData.push({
      month: 0,
      balance: Math.round(runningBalance),
      monthlyIncome: totalPassiveIncomeWithDividendsMonth0 + totalActiveIncome + liquidCompoundedGainMonth0,
      monthlyExpenses: totalRecurringExpenses,
      netChange: 0,
      passiveIncome: totalPassiveIncomeWithDividendsMonth0,
      activeIncome: totalActiveIncome,
      recurringExpenses: totalRecurringExpenses,
      cumulativeGrowth: 0,
      balanceChange: 0,
      dividendIncome: monthlyDividendIncome,
      variableExpenses: 0,
      compoundedPassive: compoundedGainMonth0,
      compoundedAssets: liquidCompoundedGainMonth0
    });
    
    // Calculate future months with compound growth for REITs and specific date expenses
    for (let i = 1; i <= months; i++) {
      const previousBalance = runningBalance;
      
      // Calculate which variable expenses should trigger this month
      const currentDate = new Date();
      const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      
      let variableExpensesThisMonth = 0;
      
      activeVariableExpenses.forEach(expense => {
        if (expense.specificDate) {
          // If expense has a specific date, check if it matches this month
          const expenseDate = new Date(expense.specificDate);
          if (expenseDate.getFullYear() === targetMonth.getFullYear() && 
              expenseDate.getMonth() === targetMonth.getMonth()) {
            variableExpensesThisMonth += expense.amount;
          }
        } else {
          // If no specific date, apply in month 1 only (legacy behavior)
          if (i === 1) {
            variableExpensesThisMonth += expense.amount;
          }
        }
      });
      
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
      
      const scheduledPassiveThisMonth = getScheduledPassiveIncomeForMonth(i);
      // Compounded monthly gains per item this month (respect status and schedule)
      const compoundedGainThisMonth = compoundedItems.reduce((sum, inc) => {
        const isActive = inc.status === 'active';
        const currentDate = new Date();
        const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const targetYm = targetMonth.toISOString().slice(0,7);
        const scheduleOk = !inc.useSchedule || (inc.startDate && (!inc.endDate || (String(inc.startDate).slice(0,7) <= targetYm && targetYm <= String(inc.endDate).slice(0,7))));
        if (!isActive || !scheduleOk) return sum;
        const rate = monthlyRateFor(inc.compoundAnnualRate);
        const base = principalById[inc.id] || 0;
        const gain = base * rate;
        principalById[inc.id] = base + gain; // grow principal
        return sum + gain;
      }, 0);
      // Liquid assets compounding this month
      const liquidCompoundedGainThisMonth = liquidCompoundItems.reduce((sum, asset: any) => {
        const rate = liquidMonthlyRateFor(asset.compoundAnnualRate);
        const base = liquidPrincipalById[asset.id] || 0;
        const gain = base * rate;
        liquidPrincipalById[asset.id] = base + gain;
        return sum + gain;
      }, 0);

      const totalPassiveThisMonth = baseUnscheduledActivePassiveIncome + scheduledPassiveThisMonth + compoundedGainThisMonth + currentMonthDividendIncome;
      // Include liquid asset compounding as monthly income contribution
      const monthlyIncomeThisMonth = totalPassiveThisMonth + totalActiveIncome + liquidCompoundedGainThisMonth;
      const monthlyChange = monthlyIncomeThisMonth - (totalRecurringExpenses + variableExpensesThisMonth);
      
      runningBalance += monthlyChange;
      
      projectionData.push({
        month: i,
        balance: Math.round(runningBalance),
        monthlyIncome: monthlyIncomeThisMonth,
        monthlyExpenses: totalRecurringExpenses + variableExpensesThisMonth,
        netChange: monthlyChange,
        passiveIncome: totalPassiveThisMonth,
        activeIncome: totalActiveIncome,
        recurringExpenses: totalRecurringExpenses,
        variableExpenses: variableExpensesThisMonth,
        cumulativeGrowth: runningBalance - totalLiquid,
        balanceChange: runningBalance - previousBalance,
        dividendIncome: currentMonthDividendIncome,
        compoundedPassive: compoundedGainThisMonth,
        compoundedAssets: liquidCompoundedGainThisMonth
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
