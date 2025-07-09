
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
  Database,
  HelpCircle,
  Sparkles,
  ExternalLink
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
    } else {
      toast({
        title: "No data to export",
        description: "There's no financial data to export.",
        variant: "destructive"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-blue-600" />
            <span className="font-medium text-gray-700 text-sm sm:text-base">Data Management</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            {/* Unsaved Changes Indicator */}
            <UnsavedChangesIndicator />
            
            {/* Cloud Operations */}
            {user && (
              <>
                <Button
                  onClick={() => saveToCloud()}
                  disabled={syncState === 'saving'}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                >
                  {syncState === 'saving' ? (
                    <RefreshCw size={12} className="mr-1 animate-spin" />
                  ) : (
                    <Cloud size={12} className="mr-1" />
                  )}
                  <span className="hidden sm:inline">Save to Cloud</span>
                  <span className="sm:hidden">Save</span>
                </Button>
                
                <Button
                  onClick={() => loadFromCloud()}
                  disabled={syncState === 'loading'}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  {syncState === 'loading' ? (
                    <RefreshCw size={12} className="mr-1 animate-spin" />
                  ) : (
                    <CloudDownload size={12} className="mr-1" />
                  )}
                  <span className="hidden sm:inline">Load from Cloud</span>
                  <span className="sm:hidden">Load</span>
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
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Upload size={20} />
                    Import Financial Data
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Quick Start Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Sparkles size={16} />
                      AI-Powered Data Conversion
                    </h3>
                    <div className="text-sm text-blue-800 space-y-2">
                      <p>💡 <strong>Pro Tip:</strong> Use AI tools to convert your data!</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div className="bg-white border border-blue-200 rounded p-2">
                          <p className="font-mono text-xs text-blue-700">
                            1. Export demo data first (JSON) <br/>
                            2. Copy your Excel/CSV data <br/>
                            3. Ask ChatGPT or Grok to convert it <br/>
                            4. Import the converted JSON
                          </p>
                        </div>
                        <div className="bg-white border border-blue-200 rounded p-2">
                          <p className="font-mono text-xs text-blue-700">
                            Example prompt: "Convert this Excel data to match this JSON format..."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-2">
                    <Label htmlFor="file-upload" className="flex items-center gap-2">
                      <FileText size={16} />
                      Upload JSON File
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground">
                      Select a JSON file exported from Numoraq or converted using AI tools
                    </p>
                  </div>
                  
                  {/* Direct Paste Section */}
                  <div className="space-y-2">
                    <Label htmlFor="json-data" className="flex items-center gap-2">
                      <Database size={16} />
                      Or paste JSON data directly
                    </Label>
                    <textarea
                      id="json-data"
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder='Paste your JSON data here...\n\nExample:\n{\n  "liquidAssets": [\n    {"name": "Bitcoin", "value": 50000, "type": "crypto"}\n  ],\n  "expenses": [\n    {"name": "Rent", "amount": 1200, "frequency": "monthly"}\n  ]\n}'
                      className="w-full h-48 p-3 border border-gray-200 rounded-md text-sm font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Data should match the JSON structure used by Numoraq
                    </p>
                  </div>

                  {/* Help Section */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                      <HelpCircle size={16} />
                      Need Help?
                    </h3>
                    <div className="text-sm text-yellow-800 space-y-2">
                      <p>• First time? Export demo data to see the format</p>
                      <p>• Have Excel/CSV data? Use AI tools like ChatGPT or Grok to convert it</p>
                      <p>• Use the feedback button to report issues or request features</p>
                      <p>• Pro tip: Start with small test imports to verify the format</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
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
