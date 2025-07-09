import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, RotateCcw, Save, Cloud, CloudOff, ChevronDown, ChevronUp, Settings, FileText } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { PDFExport } from "./PDFExport";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BackupManager } from "./backup/BackupManager";

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
  const [isCloudOpen, setIsCloudOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

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

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Collapsible open={isPanelOpen} onOpenChange={setIsPanelOpen}>
      <Card className="bg-card/95 backdrop-blur-md border-2 border-accent">
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
              <CardTitle className="text-accent font-mono uppercase text-sm flex items-center gap-2">
                <Settings size={16} />
                Data Management
              </CardTitle>
              {isPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Local Data Management */}
            <div>
              <h3 className="text-sm font-mono text-muted-foreground mb-2 uppercase">Local Operations</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <Button 
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  className="brutalist-button"
                >
                  <Download size={16} className="mr-1" />
                  CSV
                </Button>
                
                <Button
                  onClick={exportToJSON}
                  variant="outline"
                  size="sm"
                  className="brutalist-button"
                >
                  <Download size={16} className="mr-1" />
                  JSON
                </Button>
                
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
              </div>
            </div>

            {/* Export & Visualization */}
            <div>
              <h3 className="text-sm font-mono text-muted-foreground mb-2 uppercase flex items-center gap-2">
                <FileText size={14} />
                Export & Visualization
              </h3>
              <div className="flex justify-center">
                <PDFExport />
              </div>
              <p className="text-xs text-muted-foreground font-mono text-center mt-2">
                Generate a comprehensive financial report for printing or sharing
              </p>
            </div>

            {/* Backup Management */}
            <div>
              <BackupManager />
            </div>

            {/* Cloud Data Management */}
            {user && (
              <Collapsible open={isCloudOpen} onOpenChange={setIsCloudOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <h3 className="text-sm font-mono text-muted-foreground uppercase flex items-center gap-2">
                      <Cloud size={14} />
                      Cloud Sync
                      {syncState !== 'idle' && (
                        <div className="flex items-center gap-1" title={`Last sync: ${formatLastSync(lastSync)}`}>
                          {syncState === 'saving' && <CloudOff size={12} className="animate-spin text-blue-500" />}
                          {syncState === 'loading' && <CloudOff size={12} className="animate-spin text-blue-500" />}
                          {syncState === 'error' && <CloudOff size={12} className="text-red-500" />}
                        </div>
                      )}
                      {syncState === 'idle' && lastSync && (
                        <Cloud size={12} className="text-green-500" />
                      )}
                    </h3>
                    {isCloudOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <div className="flex gap-2">
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
                      Save to Cloud
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
                      Load from Cloud
                    </Button>
                  </div>
                  
                  {lastSync && (
                    <div className="text-xs text-muted-foreground font-mono">
                      Last sync: {formatLastSync(lastSync)}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}

            {!user && (
              <div className="text-xs text-muted-foreground font-mono text-center p-2 bg-muted/50 rounded">
                Sign in to enable cloud sync functionality
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
