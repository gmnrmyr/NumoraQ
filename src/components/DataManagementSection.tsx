import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, RotateCcw, Save, Cloud, CloudOff } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { PDFExport } from "./PDFExport";

export const DataManagementSection = () => {
  const { 
    exportToCSV, 
    importFromJSON, 
    resetData, 
    saveToCloud, 
    loadFromCloud, 
    syncState, 
    lastSync 
  } = useFinancialData();
  const { user } = useAuth();

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = importFromJSON(content);
        if (success) {
          toast({
            title: "Data imported successfully",
            description: "Your financial data has been updated."
          });
        } else {
          toast({
            title: "Import failed",
            description: "Please check your file format and try again.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      resetData();
      toast({
        title: "Data reset",
        description: "All data has been reset to default values."
      });
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card className="bg-card/95 backdrop-blur-md border-2 border-accent">
      <CardHeader>
        <CardTitle className="text-accent font-mono uppercase text-sm">Data Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          <Button 
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="brutalist-button"
          >
            <Download size={16} className="mr-1" />
            CSV
          </Button>
          
          <PDFExport />
          
          <Button
            variant="outline"
            size="sm"
            className="brutalist-button relative"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload size={16} className="mr-1" />
            Import
            <Input
              id="file-input"
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </Button>
          
          <Button 
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="brutalist-button text-red-600 hover:text-red-700"
          >
            <RotateCcw size={16} className="mr-1" />
            Reset
          </Button>

          {user ? (
            <div className="flex gap-1">
              <Button
                onClick={() => saveToCloud()}
                disabled={syncState === 'saving' || syncState === 'loading'}
                variant="outline"
                size="sm"
                className="brutalist-button flex-1"
              >
                {syncState === 'saving' ? (
                  <CloudOff size={16} className="mr-1 animate-spin" />
                ) : (
                  <Save size={16} className="mr-1" />
                )}
                Save
              </Button>
              <Button
                onClick={() => loadFromCloud()}
                disabled={syncState === 'saving' || syncState === 'loading'}
                variant="outline"
                size="sm"
                className="brutalist-button flex-1"
              >
                {syncState === 'loading' ? (
                  <CloudOff size={16} className="mr-1 animate-spin" />
                ) : (
                  <Cloud size={16} className="mr-1" />
                )}
                Load
              </Button>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground font-mono text-center">
              Login for cloud sync
            </div>
          )}
        </div>
        
        {user && lastSync && (
          <div className="mt-2 text-xs text-muted-foreground font-mono">
            Last sync: {formatLastSync(lastSync)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
