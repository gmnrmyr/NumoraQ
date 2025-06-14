
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Download, Upload, RotateCcw, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DataToolbar: React.FC = () => {
  const { exportToCSV, importFromJSON, resetData, data } = useFinancialData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          importFromJSON(content);
          toast({
            title: "Data imported successfully",
            description: "Your financial data has been restored from the file.",
          });
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The file format is invalid or corrupted.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
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
    <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </Button>
            
            <Button
              onClick={handleExportJSON}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Backup JSON
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
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <RotateCcw size={16} />
            Reset Data
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-slate-600">
          💡 All data is automatically saved to your browser. Export for backup or sharing.
        </div>
      </CardContent>
    </Card>
  );
};
