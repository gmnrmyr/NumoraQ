
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
      // This is a placeholder for PDF export functionality
      // We'll need to implement a proper PDF generation service
      toast({
        title: "PDF Export",
        description: "PDF export feature coming soon! 🚀"
      });
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
             syncState === 'syncing' ? '⟳ Syncing...' : 
             syncState === 'error' ? '✗ Error' : '⟳ Loading...'}
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
                disabled={syncState === 'syncing'}
                size="sm"
                className="brutalist-button text-xs"
              >
                <Save size={14} className="mr-1" />
                Save to Cloud
              </Button>
              <Button
                onClick={() => loadFromCloud()}
                disabled={syncState === 'syncing'}
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
              Badass PDF
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
