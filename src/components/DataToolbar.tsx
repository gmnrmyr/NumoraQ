
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Download, Upload, RotateCcw, Cloud, CloudDownload, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DataToolbar: React.FC = () => {
  const { data, importFromJSON, resetData, saveToCloud, loadFromCloud, syncState, lastSync } = useFinancialData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOutOfSync = lastSync && data.lastModified && new Date(data.lastModified) > new Date(lastSync);

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
    <div className="flex flex-col gap-2 bg-white/50 border rounded-lg px-3 py-2 my-2">
      <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-between">
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
        
        <div className="flex gap-2 items-center">
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
            size="sm"
            onClick={() => loadFromCloud()}
            disabled={syncState !== 'idle'}
            className="flex items-center gap-2"
          >
            <CloudDownload size={16} />
            {syncState === 'loading' ? "Loading..." : "Load Cloud"}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={saveToCloud}
            disabled={syncState !== 'idle'}
            className="flex items-center gap-2"
          >
            <Cloud size={16} />
            {syncState === 'saving' ? "Saving..." : "Save Cloud"}
          </Button>
        </div>
      </div>
      
      <div className="mt-1 pt-2 border-t text-xs text-slate-600 flex justify-between items-center">
        <span>💡 Export your data as JSON for backup. Use Cloud Save for cross-device sync.</span>
        <div className="flex items-center gap-3 text-right">
            {isOutOfSync && (
                <span className="flex items-center gap-1 text-orange-500 font-semibold">
                    <AlertTriangle size={14} /> Unsaved changes
                </span>
            )}
            {lastSync ? (
                <span>Last cloud save: {new Date(lastSync).toLocaleString()}</span>
            ) : (
              <span>No cloud data synced yet.</span>
            )}
        </div>
      </div>
    </div>
  );
};
