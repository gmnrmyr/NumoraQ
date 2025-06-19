
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Cloud, 
  CloudDownload, 
  AlertCircle,
  FileText,
  Database
} from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UnsavedChangesIndicator } from "./UnsavedChangesIndicator";

export const DataToolbar = () => {
  const { 
    exportToCSV, 
    importFromJSON, 
    resetData, 
    saveToCloud, 
    loadFromCloud, 
    syncState 
  } = useFinancialData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [importData, setImportData] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);

  const exportToJSON = () => {
    const data = localStorage.getItem('financialData');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'financial-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "JSON exported successfully",
        description: "Your financial data has been downloaded as JSON."
      });
    }
  };

  const handleImport = () => {
    if (importData.trim()) {
      const success = importFromJSON(importData);
      if (success) {
        toast({
          title: "Data imported successfully",
          description: "Your financial data has been updated."
        });
        setImportData('');
        setIsImportOpen(false);
      } else {
        toast({
          title: "Import failed",
          description: "The data format is invalid. Please check your JSON data.",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-blue-600" />
            <span className="font-medium text-gray-700">Data Management</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Unsaved Changes Indicator */}
            <UnsavedChangesIndicator />
            
            {/* Cloud Operations */}
            {user && (
              <>
                <Button
                  onClick={() => saveToCloud()}
                  disabled={syncState === 'saving'}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {syncState === 'saving' ? (
                    <RefreshCw size={14} className="mr-1 animate-spin" />
                  ) : (
                    <Cloud size={14} className="mr-1" />
                  )}
                  Save to Cloud
                </Button>
                
                <Button
                  onClick={() => loadFromCloud()}
                  disabled={syncState === 'loading'}
                  variant="outline"
                  size="sm"
                >
                  {syncState === 'loading' ? (
                    <RefreshCw size={14} className="mr-1 animate-spin" />
                  ) : (
                    <CloudDownload size={14} className="mr-1" />
                  )}
                  Load from Cloud
                </Button>
              </>
            )}
            
            {/* Local Operations */}
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
            >
              <Download size={14} className="mr-1" />
              Export CSV
            </Button>

            <Button
              onClick={exportToJSON}
              variant="outline"
              size="sm"
            >
              <Download size={14} className="mr-1" />
              Export JSON
            </Button>
            
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload size={14} className="mr-1" />
                  Import JSON
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Import Financial Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Upload JSON File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="json-data">Or paste JSON data directly</Label>
                    <textarea
                      id="json-data"
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Paste your JSON data here..."
                      className="w-full h-48 p-3 border border-gray-200 rounded-md text-sm font-mono"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={!importData.trim()}>
                      <FileText size={14} className="mr-1" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              onClick={resetData}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <RefreshCw size={14} className="mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
