
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar } from "recharts";
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
  const [chartType, setChartType] = React.useState<'line' | 'bar'>(() => (localStorage.getItem('pj_chart_type') as any) || 'line');
  const [chartHeight, setChartHeight] = React.useState<number>(() => Number(localStorage.getItem('pj_chart_h')) || 256);
  const [showEvents, setShowEvents] = React.useState<boolean>(() => (localStorage.getItem('pj_chart_events') !== 'off'));
  const [showIlliquidChart, setShowIlliquidChart] = React.useState<boolean>(() => (localStorage.getItem('pj_chart_illiquid') === 'on'));
  // Annual rate (non-compounding, inflation-style growth)
  const [illiquidApy, setIlliquidApy] = React.useState<number>(() => {
    const v = localStorage.getItem('pj_illiq_apy');
    const n = v ? parseFloat(v) : 3.0; // default ~3%/yr; user can adjust per country
    return isNaN(n) ? 3.0 : n;
  });
  React.useEffect(() => { localStorage.setItem('pj_chart_type', chartType); }, [chartType]);
  React.useEffect(() => { localStorage.setItem('pj_chart_h', String(chartHeight)); }, [chartHeight]);
  React.useEffect(() => { localStorage.setItem('pj_chart_events', showEvents ? 'on' : 'off'); }, [showEvents]);
  React.useEffect(() => { localStorage.setItem('pj_chart_illiquid', showIlliquidChart ? 'on' : 'off'); }, [showIlliquidChart]);
  React.useEffect(() => { localStorage.setItem('pj_illiq_apy', String(illiquidApy)); }, [illiquidApy]);
  
  // Function to get actual calendar date for a given month offset (short year)
  const getActualDate = (monthOffset: number) => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthName = monthNames[targetDate.getMonth()];
    const year = String(targetDate.getFullYear()).slice(-2);
    
    return `${monthName} ${year}`;
  };

  // Build vertical markers (scheduled income starts/ends and yearly recurring triggers)
  const monthDiff = (from: Date, to: Date) => (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const { markerMonths, eventsByMonth } = React.useMemo(() => {
    const now = startOfMonth(new Date());
    const maxMonth = (projectionData?.length || 0) - 1;
    const byX = new Map<number, { starts: string[]; ends: string[]; yearly: number }>();

    const ensure = (x: number) => {
      let item = byX.get(x);
      if (!item) { item = { starts: [], ends: [], yearly: 0 }; byX.set(x, item); }
      return item;
    };

    // Passive income schedule markers
    (data.passiveIncome || []).forEach((inc: any) => {
      if (inc.useSchedule && inc.startDate) {
        const s = startOfMonth(new Date(String(inc.startDate)));
        const off = monthDiff(now, s);
        if (off >= 1 && off <= maxMonth) ensure(off).starts.push(String(inc.source || 'Income'));
      }
      if (inc.useSchedule && inc.endDate) {
        const e = startOfMonth(new Date(String(inc.endDate)));
        const off = monthDiff(now, e);
        if (off >= 1 && off <= maxMonth) ensure(off).ends.push(String(inc.source || 'Income'));
      }
    });

    // Yearly recurring triggers across entire period
    const recurring = (data.expenses || []).filter((e: any) => e.type === 'recurring' && e.status === 'active' && e.frequency === 'yearly');
    for (let i = 1; i <= maxMonth; i++) {
      const current = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const ym = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2,'0')}`;
      const countThisMonth = recurring.filter((e: any) => {
        if (e.useSchedule && e.startDate) {
          const s = String(e.startDate).slice(0,7);
          const en = e.endDate ? String(e.endDate).slice(0,7) : undefined;
          if (!(ym >= s && (!en || ym <= en))) return false;
        }
        const trig = Math.min(12, Math.max(1, Number(e.triggerMonth || 1)));
        return (current.getMonth() + 1) === trig;
      }).length;
      if (countThisMonth > 0) ensure(i).yearly += countThisMonth;
    }

    const months = Array.from(byX.keys()).sort((a,b) => a - b);
    return { markerMonths: months, eventsByMonth: byX };
  }, [data.passiveIncome, data.expenses, projectionData]);

  // Helper for tooltip: events list for a given month number
  const getEventsForMonth = (monthNumber: number) => {
    const entry = eventsByMonth.get(monthNumber);
    if (!entry) return { starts: [], ends: [], yearly: 0 };
    return entry;
  };

  // Compact number formatter for Y-axis
  const formatCompact = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1e9) return `${(n/1e9).toFixed(1).replace(/\.0$/,'')}B`;
    if (abs >= 1e6) return `${(n/1e6).toFixed(1).replace(/\.0$/,'')}M`;
    if (abs >= 1e3) return `${(n/1e3).toFixed(0)}k`;
    return String(n);
  };

  // Liquid chart uses projectionData directly
  const chartData = projectionData;

  // Illiquid projection chart (simple APY-based monthly compounding)
  const illiquidData = React.useMemo(() => {
    const totalNow = (data.illiquidAssets || [])
      .filter((a: any) => a.isActive)
      .reduce((sum: number, a: any) => sum + (a.value || 0), 0);
    const months = (projectionData?.length || 0) - 1;
    // Convert annual to simple monthly addition (no compounding)
    const monthlyAdd = totalNow * (Math.max(0, illiquidApy) / 100) / 12;
    const out: Array<{ month: number; value: number }> = [];
    for (let i = 0; i <= months; i++) {
      const v = totalNow + monthlyAdd * i;
      out.push({ month: i, value: Math.round(v) });
    }
    return out;
  }, [data.illiquidAssets, projectionData, illiquidApy]);
  
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

  // Function to get scheduled passive income triggers for a specific month
  const getScheduledPassiveIncomeForMonth = (monthNumber: number) => {
    const currentDate = new Date();
    const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthNumber, 1);
    const targetYm = targetMonth.toISOString().slice(0, 7);
    return (data.passiveIncome || [])
      .filter((income: any) => income.useSchedule && income.startDate)
      .filter((income: any) => {
        const startYm = String(income.startDate).slice(0, 7);
        const endYm = income.endDate ? String(income.endDate).slice(0, 7) : undefined;
        const starts = targetYm >= startYm;
        const notEnded = !endYm || targetYm <= endYm;
        return starts && notEnded;
      });
  };
  // Helper to format YYYY-MM as Mon YY
  const formatYmShort = (ym?: string) => {
    if (!ym || ym.length < 7 || ym.indexOf('-') === -1) return '';
    const [yyyy, mm] = ym.slice(0,7).split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mIdx = Math.max(1, Math.min(12, Number(mm))) - 1;
    const mon = monthNames[mIdx] || '';
    const yy = String(yyyy).slice(-2);
    return `${mon} ${yy}`;
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
      
      <div className="w-full" style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
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
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700 as any }}
            tickFormatter={formatCompact}
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
              const scheduledPassive = getScheduledPassiveIncomeForMonth(label);
              const monthEvents = getEventsForMonth(label);
              
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
                      {data.compoundedPassive > 0 && (
                        <div className="text-emerald-400">Compounded: {currencySymbol}{data.compoundedPassive.toLocaleString()}</div>
                      )}
                      {data.compoundedAssets > 0 && (
                        <div className="text-emerald-300">Assets (compounded): {currencySymbol}{data.compoundedAssets.toLocaleString()}</div>
                      )}
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

                  {/* Scheduled Passive Income Active This Month */}
                  {scheduledPassive.length > 0 && (
                    <div className="border-t border-green-400/30 pt-2">
                      <div className="text-green-400 font-semibold text-xs mb-1">
                        ✅ SCHEDULED PASSIVE INCOME ACTIVE
                      </div>
                      <div className="space-y-1">
                        {scheduledPassive.map((inc: any, index: number) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-green-300 truncate max-w-32" title={inc.source}>
                              {inc.source}
                              <span className="text-muted-foreground"> ({formatYmShort(String(inc.startDate))}{inc.endDate ? ` → ${formatYmShort(String(inc.endDate))}` : ' → ∞'})</span>
                            </span>
                            <span className="text-green-400 font-mono">
                              +{currencySymbol}{(inc.amount || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showEvents && (monthEvents.starts.length > 0 || monthEvents.ends.length > 0 || monthEvents.yearly > 0) && (
                    <div className="border-t border-cyan-400/30 pt-2">
                      <div className="text-cyan-400 font-semibold text-xs mb-1">📌 EVENTS</div>
                      {monthEvents.starts.length > 0 && (
                        <div className="text-xs text-cyan-300">Starts: {monthEvents.starts.slice(0,3).join(', ')}{monthEvents.starts.length>3?' …':''}</div>
                      )}
                      {monthEvents.ends.length > 0 && (
                        <div className="text-xs text-slate-300">Ends: {monthEvents.ends.slice(0,3).join(', ')}{monthEvents.ends.length>3?' …':''}</div>
                      )}
                      {monthEvents.yearly > 0 && (
                        <div className="text-xs text-amber-300">Yearly bills: {monthEvents.yearly}</div>
                      )}
                    </div>
                  )}
                  
                  <div className="border-t border-accent/30 pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Net Change:</span>
                      <span className={data.netChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {data.netChange >= 0 ? '+' : ''}{currencySymbol}{Number(data.netChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          {showEvents && markerMonths.map((m, idx) => (
            <ReferenceLine key={`mk-${idx}`} x={m} stroke="#22d3ee" strokeDasharray="6 4" ifOverflow="extendDomain" strokeWidth={2} strokeOpacity={0.35} />
          ))}
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
          {/* Separate illiquid chart is shown below when enabled */}
        </LineChart>
        ) : (
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 8 }} tickFormatter={formatMonthLabel} interval="preserveStartEnd" />
            <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700 as any }} tickFormatter={formatCompact} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.95)', border: '2px solid #333', borderRadius: 0, color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, minWidth: '280px', padding: '12px' }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload[0]) return null;
                return (
                  <div className="bg-black/80 backdrop-blur-md p-4 rounded-lg border border-white/20 space-y-1 shadow-2xl">
                    <div className="font-bold text-accent text-center">{`Month ${label} (${getActualDate(label)})`}</div>
                    <div className="flex justify-between text-xs"><span>Balance:</span><span className="font-bold">{currencySymbol}{Number(payload[0].payload.balance).toLocaleString()}</span></div>
                  </div>
                );
              }}
            />
            {showEvents && markerMonths.map((m, idx) => (
              <ReferenceLine key={`mkb-${idx}`} x={m} stroke="#22d3ee" strokeDasharray="6 4" ifOverflow="extendDomain" strokeWidth={2} strokeOpacity={0.35} />
            ))}
            <Bar dataKey="balance" fill={isPositiveProjection ? "#00ff00" : "#ff0066"} />
          </BarChart>
        )}
        </ResponsiveContainer>
      </div>
      {/* Small controls: chart type + height */}
      <div className="flex items-center justify-end gap-2 mt-2 text-[10px] font-mono">
        <div className="flex items-center gap-1 mr-auto">
          <span className="text-muted-foreground">Events:</span>
          <button className={`px-1 border ${showEvents?'border-accent text-accent':'border-border'}`} onClick={() => setShowEvents(!showEvents)}>{showEvents?'On':'Off'}</button>
          <span className="ml-2 text-muted-foreground">Illiquid chart:</span>
          <button className={`px-1 border ${showIlliquidChart?'border-accent text-accent':'border-border'}`} onClick={() => setShowIlliquidChart(!showIlliquidChart)}>{showIlliquidChart?'Shown':'Hidden'}</button>
          {showIlliquidChart && (
            <>
              <span className="ml-2 text-muted-foreground">APY%:</span>
              <input className="w-12 bg-input border border-border px-1"
                type="number" step="0.1" min="0" value={illiquidApy}
                onChange={(e)=> setIlliquidApy(Number(e.target.value) || 0)} />
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Style:</span>
          <button className={`px-1 border ${chartType==='line'?'border-accent text-accent':'border-border'}`} onClick={() => setChartType('line')}>Line</button>
          <button className={`px-1 border ${chartType==='bar'?'border-accent text-accent':'border-border'}`} onClick={() => setChartType('bar')}>Bar</button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Height:</span>
          <button className="px-1 border border-border" onClick={() => setChartHeight(Math.max(200, chartHeight-40))}>-</button>
          <button className="px-1 border border-border" onClick={() => setChartHeight(Math.min(800, chartHeight+40))}>+</button>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground font-mono mt-1">Liquid Projection</div>
      {showIlliquidChart && (
        <div className="w-full mt-4" style={{ height: `${Math.max(180, chartHeight-40)}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={illiquidData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 8 }} tickFormatter={formatMonthLabel} interval="preserveStartEnd" />
              <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700 as any }} tickFormatter={formatCompact} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.95)', border: '2px solid #333', borderRadius: 0, color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, minWidth: '220px', padding: '10px' }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload[0]) return null;
                  const d = payload[0].payload as any;
                  return (
                    <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/20 space-y-1 shadow-2xl">
                      <div className="font-bold text-cyan-400 text-center">Illiquid Projection</div>
                      <div className="flex justify-between text-xs"><span>Month:</span><span>M{label} ({getActualDate(label)})</span></div>
                      <div className="flex justify-between text-xs"><span>Value:</span><span className="font-bold">{currencySymbol}{Number(d.value).toLocaleString()}</span></div>
                      <div className="text-[10px] text-muted-foreground">Annual rate {illiquidApy}% (non-compounding)</div>
                    </div>
                  );
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-[10px] text-muted-foreground font-mono mt-1">Illiquid Projection</div>
        </div>
      )}
    </div>
  );
};
