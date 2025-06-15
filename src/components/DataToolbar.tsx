import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Download, Upload, RotateCcw, Save, Cloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DataToolbar: React.FC = () => {
  const { data, importFromJSON, resetData, saveToCloud, isSyncing } = useFinancialData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const success = importFromJSON(content);
          if (success) {
            toast({
              title: "Data imported successfully",
              description: "Your financial data has been restored from the file.",
            });
          } else {
            throw new Error("Import failed");
          }
        } catch (error) {
          console.error('Import error:', error);
          toast({
            title: "Import failed",
            description: "The file format is invalid or corrupted. Please ensure it's a valid JSON file.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Data exported successfully",
        description: "Your financial data has been exported as JSON.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to default values? This action cannot be undone.')) {
      resetData();
      toast({
        title: "Data reset",
        description: "All data has been reset to default values.",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-between bg-white/50 border rounded-lg px-3 py-2 my-2">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleExportJSON}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export JSON
        </Button>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Import JSON
        </Button>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
      
      <div className="flex gap-1 items-center">
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <RotateCcw size={16} />
          Reset Data
        </Button>
        
        <Button
          variant="outline"
          onClick={saveToCloud}
          disabled={isSyncing}
          className="flex items-center gap-2"
        >
          <Cloud size={16} />
          {isSyncing ? "Saving..." : "Save to Cloud"}
        </Button>
      </div>
      
      <div className="mt-2 text-xs text-slate-600">
        💡 Export your data as JSON for backup or sharing. Import to restore from backup.
      </div>
    </div>
  );
};
