
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Download, Upload, Palette, Database } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';

interface DevMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevMenu = ({ isOpen, onClose }: DevMenuProps) => {
  const { loadSampleData, exportData, importData } = useFinancialData();
  const [selectedUser, setSelectedUser] = useState<string>('user1');
  const [selectedTheme, setSelectedTheme] = useState<string>('default');

  if (!isOpen) return null;

  const handleLoadUserData = (userType: string) => {
    const sampleData = {
      user1: {
        name: "GUI User",
        profile: "Designer/Frontend",
        liquidAssets: [
          { id: '1', name: 'Checking Account', value: 15000, type: 'cash', isActive: true },
          { id: '2', name: 'Savings Account', value: 25000, type: 'cash', isActive: true },
        ],
        passiveIncome: [
          { id: '1', source: 'Dividends', amount: 1500, status: 'active' as const },
          { id: '2', source: 'Rental Income', amount: 2000, status: 'active' as const },
        ]
      },
      user2: {
        name: "FE User",
        profile: "Frontend Developer",
        liquidAssets: [
          { id: '1', name: 'Tech Savings', value: 35000, type: 'cash', isActive: true },
          { id: '2', name: 'Investment Account', value: 45000, type: 'investment', isActive: true },
        ],
        passiveIncome: [
          { id: '1', source: 'Freelance Contracts', amount: 3000, status: 'active' as const },
          { id: '2', source: 'Side Projects', amount: 1200, status: 'active' as const },
        ]
      }
    };

    console.log(`Loading sample data for ${userType}:`, sampleData[userType as keyof typeof sampleData]);
    // You can extend this to actually load the data into context
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importData(data);
          console.log('Data imported successfully');
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4">
      <Card className="w-80 max-h-[90vh] overflow-y-auto contrast-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-readable-bold flex items-center gap-2">
              <Settings size={20} />
              Dev Menu
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Testing */}
          <div className="space-y-2">
            <h3 className="text-readable-bold flex items-center gap-2">
              <User size={16} />
              User Testing
            </h3>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">GUI User (Designer)</SelectItem>
                <SelectItem value="user2">FE User (Developer)</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => handleLoadUserData(selectedUser)}
              className="w-full"
              size="sm"
            >
              Load User Data
            </Button>
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-2">
            <h3 className="text-readable-bold flex items-center gap-2">
              <Database size={16} />
              Data Management
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleExportData}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download size={14} />
                Export
              </Button>
              <label className="cursor-pointer">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center gap-1"
                  asChild
                >
                  <span>
                    <Upload size={14} />
                    Import
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <Separator />

          {/* Theme Testing */}
          <div className="space-y-2">
            <h3 className="text-readable-bold flex items-center gap-2">
              <Palette size={16} />
              Theme Testing
            </h3>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Contrast</SelectItem>
                <SelectItem value="high">High Contrast</SelectItem>
                <SelectItem value="colorblind">Colorblind Friendly</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="text-xs">
              Theme: {selectedTheme}
            </Badge>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h3 className="text-readable-bold">Quick Actions</h3>
            <div className="space-y-1">
              <Button 
                onClick={() => loadSampleData()}
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                Load Sample Data
              </Button>
              <Button 
                onClick={() => console.log('Clearing all data...')}
                variant="outline"
                size="sm"
                className="w-full justify-start text-destructive"
              >
                Clear All Data
              </Button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="text-xs text-readable-muted space-y-1">
            <div>Build: Development</div>
            <div>Version: 1.0.0</div>
            <div>Last Updated: {new Date().toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
