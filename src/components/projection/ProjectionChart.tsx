
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFinancialData } from "@/contexts/FinancialDataContext";

interface ProjectionChartProps {
  projectionData: any[];
  isPositiveProjection: boolean;
  currencySymbol: string;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  projectionData,
  isPositiveProjection,
  currencySymbol
}) => {
  const { data } = useFinancialData();
  
  // Function to get actual calendar date for a given month offset
  const getActualDate = (monthOffset: number) => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthName = monthNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    
    return `${monthName} ${year}`;
  };
  
  // Function to format month label with actual date (shorter for X-axis)
  const formatMonthLabel = (monthNumber: number) => {
    if (monthNumber === 0) return 'Now';
    const actualDate = getActualDate(monthNumber);
    return `M${monthNumber} (${actualDate})`;
  };
  
  // Function to get dot color based on balance
  const getDotColor = (balance: number) => {
    return balance >= 0 ? "#00ff00" : "#ff0066"; // Green for positive, red for negative
  };
  
  // Function to get variable expense triggers for a specific month
  const getVariableExpenseTriggers = (monthNumber: number) => {
    if (monthNumber === 0) return [];
    
    const currentDate = new Date();
    const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthNumber, 1);
    
    const activeVariableExpenses = data.expenses
      .filter(expense => expense.type === 'variable' && expense.status === 'active');
    
    const triggersThisMonth = [];
    
    activeVariableExpenses.forEach(expense => {
      if (expense.specificDate) {
        const expenseDate = new Date(expense.specificDate);
        if (expenseDate.getFullYear() === targetMonth.getFullYear() && 
            expenseDate.getMonth() === targetMonth.getMonth()) {
          triggersThisMonth.push(expense);
        }
      } else if (monthNumber === 1) {
        // Legacy behavior: unscheduled variable expenses apply in month 1
        triggersThisMonth.push(expense);
      }
    });
    
    return triggersThisMonth;
  };
  return (
    <div className="w-full mb-6 py-4">
      {/* Color Legend */}
      <div className="flex items-center justify-center gap-4 mb-2 text-xs font-mono">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-green-400">Positive Balance</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-red-400">Negative Balance</span>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={projectionData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 8 }}
            tickFormatter={formatMonthLabel}
            interval="preserveStartEnd"
          />
          <YAxis 
            label={{ 
              value: 'Balance', 
              angle: -90, 
              position: 'insideLeft',
              fill: 'rgba(255,255,255,0.6)',
              fontSize: 12
            }}
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.95)', 
              border: '2px solid #333',
              borderRadius: 0,
              color: '#fff',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              minWidth: '280px',
              padding: '12px'
            }}
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload[0]) return null;
              
              const data = payload[0].payload;
              const isCurrentMonth = label === 0;
              const variableTriggers = getVariableExpenseTriggers(label);
              
              return (
                <div className="bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/20 space-y-3 shadow-2xl">
                  <div className="font-bold text-accent border-b border-accent/30 pb-2 text-center">
                    {isCurrentMonth ? 'Current Position' : `Month ${label} (${getActualDate(label)}) Projection`}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-green-400 font-semibold">INCOME</div>
                      <div>Active: {currencySymbol}{data.activeIncome?.toLocaleString() || '0'}</div>
                      <div>Passive: {currencySymbol}{data.passiveIncome?.toLocaleString() || '0'}</div>
                      {data.dividendIncome > 0 && (
                        <div className="text-cyan-400">Dividends: {currencySymbol}{data.dividendIncome.toLocaleString()}</div>
                      )}
                      <div className="border-t border-green-400/30 pt-1 font-semibold">
                        Total: {currencySymbol}{data.monthlyIncome?.toLocaleString() || '0'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-red-400 font-semibold">EXPENSES</div>
                      <div>Fixed: {currencySymbol}{data.recurringExpenses?.toLocaleString() || '0'}</div>
                      <div>Variable: {currencySymbol}{data.variableExpenses?.toLocaleString() || '0'}</div>
                      <div className="border-t border-red-400/30 pt-1 font-semibold">
                        Total: {currencySymbol}{data.monthlyExpenses?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Variable Expense Triggers */}
                  {variableTriggers.length > 0 && (
                    <div className="border-t border-orange-400/30 pt-2">
                      <div className="text-orange-400 font-semibold text-xs mb-1">
                        🎯 EXPENSE TRIGGERS THIS MONTH
                      </div>
                      <div className="space-y-1">
                        {variableTriggers.map((trigger, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-orange-300 truncate max-w-32" title={trigger.name}>
                              {trigger.name}
                            </span>
                            <span className="text-orange-400 font-mono">
                              {currencySymbol}{trigger.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-accent/30 pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Net Change:</span>
                      <span className={data.netChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {data.netChange >= 0 ? '+' : ''}{currencySymbol}{Math.round(data.netChange).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Balance:</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: getDotColor(data.balance) }}
                        ></div>
                        <span className={`font-bold ${data.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {currencySymbol}{Number(data.balance).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {data.cumulativeGrowth !== undefined && (
                      <div className="flex justify-between">
                        <span>Growth:</span>
                        <span className={data.cumulativeGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {data.cumulativeGrowth >= 0 ? '+' : ''}{currencySymbol}{Math.round(data.cumulativeGrowth).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {!isCurrentMonth && (
                    <div className="text-xs text-muted-foreground border-t border-accent/20 pt-1">
                      💡 {data.netChange >= 0 ? 'Positive' : 'Negative'} cash flow month
                    </div>
                  )}
                </div>
              );
            }}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke={isPositiveProjection ? "#00ff00" : "#ff0066"} 
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              const dotColor = getDotColor(payload?.balance || 0);
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={3} 
                  fill={dotColor}
                  stroke={dotColor}
                  strokeWidth={1}
                />
              );
            }}
            activeDot={(props) => {
              const { cx, cy, payload } = props;
              const dotColor = getDotColor(payload?.balance || 0);
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={5} 
                  fill={dotColor}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
