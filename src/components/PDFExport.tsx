
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { toast } from "@/hooks/use-toast";

export const PDFExport = () => {
  const { data } = useFinancialData();

  const generatePDFContent = () => {
    const activeLiquidAssets = data.liquidAssets.filter(asset => asset.isActive);
    const activeIlliquidAssets = data.illiquidAssets.filter(asset => asset.isActive);
    const activeIncome = data.activeIncome.filter(income => income.status === 'active');
    const passiveIncome = data.passiveIncome.filter(income => income.status === 'active');
    const fixedExpenses = data.expenses.filter(expense => expense.status === 'active' && expense.type === 'fixed');
    const variableExpenses = data.expenses.filter(expense => expense.status === 'active' && expense.type === 'variable');
    const activeDebts = data.debts.filter(debt => debt.isActive !== false);

    const totalLiquid = activeLiquidAssets.reduce((sum, asset) => sum + asset.value, 0);
    const totalIlliquid = activeIlliquidAssets.reduce((sum, asset) => sum + asset.value, 0);
    const totalActiveIncome = activeIncome.reduce((sum, income) => sum + income.amount, 0);
    const totalPassiveIncome = passiveIncome.reduce((sum, income) => sum + income.amount, 0);
    const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalVariableExpenses = variableExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpenses = totalFixedExpenses + totalVariableExpenses;
    const totalDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);
    const netWorth = totalLiquid + totalIlliquid - totalDebt;
    const monthlyBalance = totalActiveIncome + totalPassiveIncome - totalExpenses;

    const currency = data.userProfile.defaultCurrency === 'BRL' ? 'R$' : '$';
    const currentDate = new Date().toLocaleDateString();

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Financial Summary - ${data.userProfile.name}</title>
    <style>
        body { 
            font-family: 'Courier New', monospace; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #000; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
        }
        .title { 
            font-size: 24px; 
            font-weight: bold; 
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .subtitle { 
            font-size: 14px; 
            color: #666;
        }
        .section { 
            margin: 25px 0; 
            padding: 15px; 
            border: 2px solid #000;
            background: #f9f9f9;
        }
        .section-title { 
            font-size: 16px; 
            font-weight: bold; 
            text-transform: uppercase; 
            margin-bottom: 15px;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
        }
        .summary-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin: 20px 0;
        }
        .metric { 
            padding: 10px; 
            border: 1px solid #000;
            background: white;
        }
        .metric-label { 
            font-size: 12px; 
            color: #666; 
            text-transform: uppercase;
        }
        .metric-value { 
            font-size: 18px; 
            font-weight: bold;
            color: #000;
        }
        .item { 
            margin: 8px 0; 
            padding: 8px; 
            border-left: 3px solid #000;
            background: white;
        }
        .item-name { 
            font-weight: bold; 
        }
        .item-value { 
            float: right; 
            font-weight: bold;
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #000;
            padding-top: 20px;
        }
        .positive { color: #22c55e; }
        .negative { color: #ef4444; }
        .warning { color: #f59e0b; }
        .subsection { 
            margin: 15px 0; 
            padding: 10px; 
            border: 1px solid #666;
            background: #fdfdfd;
        }
        .subsection-title { 
            font-size: 14px; 
            font-weight: bold; 
            margin-bottom: 10px;
            color: #444;
        }
        @media print {
            body { margin: 20px; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Financial Dashboard Summary</div>
        <div class="subtitle">Generated for ${data.userProfile.name} on ${currentDate}</div>
        <div class="subtitle">Open Findash - Personal Finance Tracker</div>
    </div>

    <div class="summary-grid">
        <div class="metric">
            <div class="metric-label">Net Worth</div>
            <div class="metric-value ${netWorth >= 0 ? 'positive' : 'negative'}">${currency} ${netWorth.toLocaleString()}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Monthly Balance</div>
            <div class="metric-value ${monthlyBalance >= 0 ? 'positive' : 'negative'}">${currency} ${monthlyBalance.toLocaleString()}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Total Assets</div>
            <div class="metric-value">${currency} ${(totalLiquid + totalIlliquid).toLocaleString()}</div>
        </div>
        <div class="metric">
            <div class="metric-label">Total Debt</div>
            <div class="metric-value ${totalDebt > 0 ? 'negative' : ''}">${currency} ${totalDebt.toLocaleString()}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Liquid Assets (${currency} ${totalLiquid.toLocaleString()})</div>
        ${activeLiquidAssets.map(asset => `
            <div class="item">
                <span class="item-name">${asset.name}</span>
                <span class="item-value">${currency} ${asset.value.toLocaleString()}</span>
            </div>
        `).join('')}
        ${activeLiquidAssets.length === 0 ? '<div class="item">No liquid assets recorded</div>' : ''}
    </div>

    <div class="section">
        <div class="section-title">Illiquid Assets (${currency} ${totalIlliquid.toLocaleString()})</div>
        ${activeIlliquidAssets.map(asset => `
            <div class="item">
                <span class="item-name">${asset.name}</span>
                <span class="item-value">${currency} ${asset.value.toLocaleString()}</span>
            </div>
        `).join('')}
        ${activeIlliquidAssets.length === 0 ? '<div class="item">No illiquid assets recorded</div>' : ''}
    </div>

    <div class="section">
        <div class="section-title">Monthly Income (${currency} ${(totalActiveIncome + totalPassiveIncome).toLocaleString()})</div>
        ${activeIncome.map(income => `
            <div class="item">
                <span class="item-name">${income.source} (Active)</span>
                <span class="item-value positive">${currency} ${income.amount.toLocaleString()}</span>
            </div>
        `).join('')}
        ${passiveIncome.map(income => `
            <div class="item">
                <span class="item-name">${income.source} (Passive)</span>
                <span class="item-value positive">${currency} ${income.amount.toLocaleString()}</span>
            </div>
        `).join('')}
        ${activeIncome.length === 0 && passiveIncome.length === 0 ? '<div class="item">No income sources recorded</div>' : ''}
    </div>

    <div class="section">
        <div class="section-title">Monthly Expenses (${currency} ${totalExpenses.toLocaleString()})</div>
        
        ${fixedExpenses.length > 0 ? `
        <div class="subsection">
            <div class="subsection-title">Fixed Expenses (${currency} ${totalFixedExpenses.toLocaleString()})</div>
            ${fixedExpenses.map(expense => `
                <div class="item">
                    <span class="item-name">${expense.name} (${expense.category})</span>
                    <span class="item-value negative">${currency} ${expense.amount.toLocaleString()}</span>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${variableExpenses.length > 0 ? `
        <div class="subsection">
            <div class="subsection-title">Variable Expenses (${currency} ${totalVariableExpenses.toLocaleString()})</div>
            ${variableExpenses.map(expense => `
                <div class="item">
                    <span class="item-name">${expense.name} (${expense.category})</span>
                    <span class="item-value negative">${currency} ${expense.amount.toLocaleString()}</span>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${fixedExpenses.length === 0 && variableExpenses.length === 0 ? '<div class="item">No expenses recorded</div>' : ''}
    </div>

    ${totalDebt > 0 ? `
    <div class="section">
        <div class="section-title">Outstanding Debts (${currency} ${totalDebt.toLocaleString()})</div>
        ${activeDebts.map(debt => `
            <div class="item">
                <span class="item-name">${debt.creditor} (${debt.status})</span>
                <span class="item-value ${debt.status === 'paid' ? 'positive' : 'negative'}">${currency} ${debt.amount.toLocaleString()}</span>
            </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="footer">
        <p>Generated by Open Findash - Personal Finance Dashboard</p>
        <p>Currency: ${data.userProfile.defaultCurrency} | Projection Period: ${data.projectionMonths} months</p>
        <p>This report contains ${data.liquidAssets.length + data.illiquidAssets.length} assets, ${data.activeIncome.length + data.passiveIncome.length} income sources, ${fixedExpenses.length + variableExpenses.length} expenses, and ${data.debts.length} debt entries.</p>
    </div>
</body>
</html>
    `;
  };

  const exportToPDF = () => {
    try {
      const htmlContent = generatePDFContent();
      
      // Create a new window/tab with the content
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load, then trigger print dialog
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
        
        toast({
          title: "Print Dialog Opened",
          description: "The print dialog has been opened in a new tab. Select 'Save as PDF' as your printer destination.",
        });
      } else {
        // Fallback for blocked popups
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial-summary-${data.userProfile.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "PDF Export Downloaded",
          description: "Your financial summary has been downloaded. Open it in your browser and use Print > Save as PDF.",
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your financial summary.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={exportToPDF}
      variant="outline"
      size="sm"
      className="brutalist-button bg-blue-50 hover:bg-blue-100 border-blue-200"
    >
      <Printer size={16} className="mr-1" />
      Export PDF
    </Button>
  );
};
