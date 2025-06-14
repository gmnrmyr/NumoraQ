
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  User, 
  Database, 
  Palette, 
  Upload, 
  Download,
  RotateCcw,
  TestTube
} from 'lucide-react';

const userProfiles = {
  user1_gui: {
    name: "GUI Developer",
    description: "UI/UX focused profile with design assets",
    data: {
      liquidAssets: [
        { id: '1', name: 'Checking Account', value: 15000, isActive: true },
        { id: '2', name: 'Savings Account', value: 45000, isActive: true },
        { id: '3', name: 'Design Tools Budget', value: 2500, isActive: true }
      ],
      passiveIncome: [
        { id: '1', name: 'UI Kit Sales', amount: 1200, status: 'active' as const },
        { id: '2', name: 'Design Subscription', amount: 800, status: 'active' as const }
      ],
      activeIncome: [
        { id: '1', name: 'Freelance Design', amount: 4500, status: 'active' as const },
        { id: '2', name: 'UI Consultation', amount: 2000, status: 'active' as const }
      ],
      expenses: [
        { id: '1', name: 'Adobe Creative Suite', amount: 60, type: 'recurring' as const, status: 'active' as const },
        { id: '2', name: 'Figma Pro', amount: 15, type: 'recurring' as const, status: 'active' as const },
        { id: '3', name: 'Design Courses', amount: 1200, type: 'variable' as const, status: 'active' as const }
      ]
    }
  },
  user2_fe: {
    name: "Frontend Developer",
    description: "Tech-focused profile with development assets",
    data: {
      liquidAssets: [
        { id: '1', name: 'Tech Savings', value: 25000, isActive: true },
        { id: '2', name: 'Emergency Fund', value: 20000, isActive: true },
        { id: '3', name: 'Equipment Fund', value: 5000, isActive: true }
      ],
      passiveIncome: [
        { id: '1', name: 'NPM Package Revenue', amount: 300, status: 'active' as const },
        { id: '2', name: 'Course Royalties', amount: 900, status: 'active' as const }
      ],
      activeIncome: [
        { id: '1', name: 'Frontend Development', amount: 6000, status: 'active' as const },
        { id: '2', name: 'Code Review Services', amount: 1500, status: 'active' as const }
      ],
      expenses: [
        { id: '1', name: 'GitHub Pro', amount: 4, type: 'recurring' as const, status: 'active' as const },
        { id: '2', name: 'Vercel Pro', amount: 20, type: 'recurring' as const, status: 'active' as const },
        { id: '3', name: 'Tech Conferences', amount: 3000, type: 'variable' as const, status: 'active' as const }
      ]
    }
  }
};

const colorSchemes = {
  default: "Default Scheme",
  high_contrast: "High Contrast",
  warm: "Warm Tones",
  cool: "Cool Tones",
  monochrome: "Monochrome"
};

export const DevMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedColorScheme, setSelectedColorScheme] = useState('default');
  const { data, resetData, importFromJSON, exportToCSV } = useFinancialData();
  const { toast } = useToast();

  const loadUserProfile = (profileKey: string) => {
    const profile = userProfiles[profileKey as keyof typeof userProfiles];
    if (profile) {
      try {
        // Create a partial data update
        const updatedData = {
          ...data,
          ...profile.data
        };
        
        importFromJSON(JSON.stringify(updatedData));
        toast({
          title: "Profile Loaded",
          description: `${profile.name} profile loaded successfully`,
        });
      } catch (error) {
        toast({
          title: "Profile Load Failed",
          description: "Could not load the selected profile",
          variant: "destructive",
        });
      }
    }
  };

  const generateTestData = () => {
    const testData = {
      ...data,
      liquidAssets: [
        { id: '1', name: 'Test Account 1', value: Math.floor(Math.random() * 50000), isActive: true },
        { id: '2', name: 'Test Account 2', value: Math.floor(Math.random() * 30000), isActive: true }
      ],
      expenses: [
        { id: '1', name: 'Test Expense 1', amount: Math.floor(Math.random() * 1000), type: 'recurring' as const, status: 'active' as const },
        { id: '2', name: 'Test Expense 2', amount: Math.floor(Math.random() * 500), type: 'variable' as const, status: 'active' as const }
      ]
    };
    
    importFromJSON(JSON.stringify(testData));
    toast({
      title: "Test Data Generated",
      description: "Random test data has been loaded",
    });
  };

  const exportCurrentData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Data Exported",
      description: "Current data exported for development use",
    });
  };

  const applyColorScheme = (scheme: string) => {
    // This would normally apply different CSS classes or update theme context
    setSelectedColorScheme(scheme);
    toast({
      title: "Color Scheme Applied",
      description: `${colorSchemes[scheme as keyof typeof colorSchemes]} applied`,
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-slate-800 text-white hover:bg-slate-700 border-slate-600"
        >
          <Settings size={16} />
          <span className="ml-2">Dev Menu</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-slate-900 text-white border-slate-700 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TestTube size={18} />
              Developer Menu
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Profiles Section */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <User size={14} />
              User Profiles
            </h4>
            <Select value={selectedProfile} onValueChange={setSelectedProfile}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a user profile" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Object.entries(userProfiles).map(([key, profile]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    <div>
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-xs text-slate-400">{profile.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProfile && (
              <Button
                onClick={() => loadUserProfile(selectedProfile)}
                size="sm"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
              >
                Load Profile
              </Button>
            )}
          </div>

          <Separator className="bg-slate-700" />

          {/* Data Testing Section */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Database size={14} />
              Data Testing
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={generateTestData}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw size={12} />
                Generate Test
              </Button>
              <Button
                onClick={exportCurrentData}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Download size={12} />
                Export JSON
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Color Scheme Testing */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Palette size={14} />
              Color Schemes
            </h4>
            <Select value={selectedColorScheme} onValueChange={applyColorScheme}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Object.entries(colorSchemes).map(([key, name]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-slate-700" />

          {/* Current State Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Current State</h4>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Assets: {data.liquidAssets?.length || 0} liquid, {data.illiquidAssets?.length || 0} illiquid</div>
              <div>Income: {data.passiveIncome?.length || 0} passive, {data.activeIncome?.length || 0} active</div>
              <div>Expenses: {data.expenses?.length || 0} items</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
