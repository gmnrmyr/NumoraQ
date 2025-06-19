
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Save, Download, Upload, FileText, Share2, FileX } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const DataManagementSection = () => {
  const { 
    data, 
    exportToCSV, 
    importFromJSON, 
    resetData, 
    saveToCloud, 
    loadFromCloud, 
    syncState, 
    lastSync 
  } = useFinancialData();
  const { user } = useAuth();
  const { toast } = useToast();

  const exportToJSON = () => {
    const dataToExport = JSON.stringify(data, null, 2);
    const blob = new Blob([dataToExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-findash-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "JSON Export Complete",
      description: "Your financial data has been exported as JSON."
    });
  };

  const exportToPDF = async () => {
    try {
      // Generate HTML content for PDF-like view
      const getCurrencySymbol = (currency: string) => {
        switch (currency) {
          case 'BRL': return 'R$';
          case 'USD': return '$';
          case 'EUR': return '€';
          default: return currency;
        }
      };

      const currencySymbol = getCurrencySymbol(data.userProfile.defaultCurrency);
      const totalPassive = data.passiveIncome.filter(i => i.status === 'active').reduce((sum, i) => sum + i.amount, 0);
      const totalActive = data.activeIncome.filter(i => i.status === 'active').reduce((sum, i) => sum + i.amount, 0);
      const totalExpenses = data.expenses.filter(e => e.status === 'active').reduce((sum, e) => sum + e.amount, 0);
      const totalLiquid = data.liquidAssets.filter(a => a.isActive).reduce((sum, a) => sum + a.value, 0);
      const totalIlliquid = data.illiquidAssets.filter(a => a.isActive).reduce((sum, a) => sum + a.value, 0);
      const totalDebt = data.debts.filter(d => d.isActive).reduce((sum, d) => sum + d.amount, 0);
      const netWorth = totalLiquid + totalIlliquid - totalDebt;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>OPEN FINDASH - Financial Summary</title>
          <style>
            body { font-family: 'Courier New', monospace; margin: 40px; background: #000; color: #fff; }
            .header { text-align: center; border: 3px solid #00ff00; padding: 20px; margin-bottom: 30px; }
            .section { border: 2px solid #fff; padding: 15px; margin: 20px 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .metric { background: #1a1a1a; padding: 10px; border: 1px solid #333; }
            h1 { color: #00ff00; text-transform: uppercase; }
            h2 { color: #fff; text-transform: uppercase; border-bottom: 1px solid #333; }
            .positive { color: #00ff00; }
            .negative { color: #ff0066; }
            .date { text-align: right; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏴‍☠️ OPEN FINDASH - BADASS FINANCIAL SUMMARY 🏴‍☠️</h1>
            <div class="date">Generated: ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="section">
            <h2>💰 NET WORTH</h2>
            <div class="metric">
              <strong class="${netWorth >= 0 ? 'positive' : 'negative'}">
                ${currencySymbol} ${netWorth.toLocaleString()}
              </strong>
            </div>
          </div>

          <div class="grid">
            <div class="section">
              <h2>📈 INCOME</h2>
              <div class="metric">Passive: ${currencySymbol} ${totalPassive.toLocaleString()}</div>
              <div class="metric">Active: ${currencySymbol} ${totalActive.toLocaleString()}</div>
              <div class="metric"><strong>Total: ${currencySymbol} ${(totalPassive + totalActive).toLocaleString()}</strong></div>
            </div>
            
            <div class="section">
              <h2>💸 EXPENSES</h2>
              <div class="metric">Monthly: ${currencySymbol} ${totalExpenses.toLocaleString()}</div>
              <div class="metric">Annual: ${currencySymbol} ${(totalExpenses * 12).toLocaleString()}</div>
            </div>
          </div>

          <div class="grid">
            <div class="section">
              <h2>🏦 ASSETS</h2>
              <div class="metric">Liquid: ${currencySymbol} ${totalLiquid.toLocaleString()}</div>
              <div class="metric">Illiquid: ${currencySymbol} ${totalIlliquid.toLocaleString()}</div>
              <div class="metric"><strong>Total: ${currencySymbol} ${(totalLiquid + totalIlliquid).toLocaleString()}</strong></div>
            </div>
            
            <div class="section">
              <h2>💳 DEBT</h2>
              <div class="metric negative">Total Debt: ${currencySymbol} ${totalDebt.toLocaleString()}</div>
            </div>
          </div>

          <div class="section">
            <h2>📊 ${data.projectionMonths}-MONTH PROJECTION</h2>
            <div class="metric">
              Net Result: <span class="${((totalPassive + totalActive - totalExpenses) * data.projectionMonths >= 0) ? 'positive' : 'negative'}">
                ${currencySymbol} ${((totalPassive + totalActive - totalExpenses) * data.projectionMonths).toLocaleString()}
              </span>
            </div>
          </div>

          <div style="text-align: center; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
            <p>💀 STAY DEGEN, STAY RICH 💀</p>
            <p>Create your own dashboard at: <strong>OPEN FINDASH</strong></p>
          </div>
        </body>
        </html>
      `;

      // Create a new window/tab with the HTML content
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Add print functionality
        setTimeout(() => {
          newWindow.print();
        }, 500);

        toast({
          title: "🏴‍☠️ Badass PDF Ready!",
          description: "Your financial summary is ready to print/save as PDF!"
        });
      } else {
        toast({
          title: "PDF Export",
          description: "Please allow popups to generate your badass PDF summary.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareProfile = async () => {
    try {
      // This is a placeholder for sharing functionality
      toast({
        title: "Share Dashboard",
        description: "Dashboard sharing feature coming soon! 🔗"
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not share dashboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = e.target?.result as string;
          const success = importFromJSON(jsonData);
          if (success) {
            toast({
              title: "Import Successful",
              description: "Your data has been imported successfully."
            });
          } else {
            toast({
              title: "Import Failed",
              description: "Invalid file format or corrupted data.",
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({
            title: "Import Error",
            description: "Could not read the file. Please check the format.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      resetData();
      toast({
        title: "Data Reset",
        description: "All data has been reset to default values."
      });
    }
  };

  return (
    <Card className="bg-card border-2 border-border brutalist-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 font-mono uppercase">
            <FileText size={16} />
            Data Management
          </CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {syncState === 'idle' ? '✓ Synced' : 
             syncState === 'loading' ? '⟳ Loading...' : 
             syncState === 'saving' ? '⟳ Saving...' : 
             syncState === 'error' ? '✗ Error' : '⟳ Processing...'}
          </Badge>
        </div>
        {lastSync && (
          <p className="text-xs text-muted-foreground font-mono">
            Last sync: {new Date(lastSync).toLocaleString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cloud Operations */}
        {user && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase text-muted-foreground">Cloud Storage</h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => saveToCloud()}
                disabled={syncState === 'saving' || syncState === 'loading'}
                size="sm"
                className="brutalist-button text-xs"
              >
                <Save size={14} className="mr-1" />
                Save to Cloud
              </Button>
              <Button
                onClick={() => loadFromCloud()}
                disabled={syncState === 'saving' || syncState === 'loading'}
                size="sm"
                variant="outline"
                className="brutalist-button text-xs"
              >
                <Download size={14} className="mr-1" />
                Load from Cloud
              </Button>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold uppercase text-muted-foreground">Export & Share</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={exportToCSV}
              size="sm"
              variant="outline"
              className="brutalist-button text-xs"
            >
              <Download size={14} className="mr-1" />
              Export CSV
            </Button>
            <Button
              onClick={exportToJSON}
              size="sm"
              variant="outline"
              className="brutalist-button text-xs"
            >
              <Download size={14} className="mr-1" />
              Export JSON
            </Button>
            <Button
              onClick={exportToPDF}
              size="sm"
              variant="outline"
              className="brutalist-button text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-purple-500"
            >
              <FileText size={14} className="mr-1" />
              🏴‍☠️ Badass PDF
            </Button>
            <Button
              onClick={shareProfile}
              size="sm"
              variant="outline"
              className="brutalist-button text-xs bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white border-green-500"
            >
              <Share2 size={14} className="mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Import Options */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold uppercase text-muted-foreground">Import Data</h4>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <Button
                size="sm"
                variant="outline"
                className="brutalist-button text-xs"
                asChild
              >
                <span>
                  <Upload size={14} className="mr-1" />
                  Import JSON
                </span>
              </Button>
            </label>
            <Button
              onClick={handleReset}
              size="sm"
              variant="outline"
              className="brutalist-button text-xs text-red-600 hover:text-red-700 border-red-600"
            >
              <FileX size={14} className="mr-1" />
              Reset Data
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono bg-muted p-2 border-2 border-border rounded">
          💾 <strong>Pro tip:</strong> Export your data regularly as backup. Cloud sync requires login.
        </div>
      </CardContent>
    </Card>
  );
};
