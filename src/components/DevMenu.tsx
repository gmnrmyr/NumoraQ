
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
  user2_fe: {
    name: "Fernanda (FE)",
    description: "Random test profile for development",
    data: {
      userProfile: {
        name: "Fe",
        defaultCurrency: "USD" as const,
        language: "en" as const
      },
      exchangeRates: {
        brlToUsd: 0.20,
        usdToBrl: 5.00,
        btcPrice: 600000,
        ethPrice: 15000
      },
      liquidAssets: [
        { id: '1', name: 'Conta Corrente', value: 25000, icon: 'Banknote', color: 'text-green-600', isActive: true },
        { id: '2', name: 'Poupança', value: 15000, icon: 'PiggyBank', color: 'text-blue-600', isActive: true },
        { id: '3', name: 'Investimentos', value: 8000, icon: 'TrendingUp', color: 'text-purple-600', isActive: true }
      ],
      illiquidAssets: [
        { id: '1', name: 'Apartamento', value: 350000, icon: 'Building', color: 'text-slate-600', isActive: true },
        { id: '2', name: 'Carro', value: 45000, icon: 'Car', color: 'text-red-600', isActive: true }
      ],
      passiveIncome: [
        { id: '1', source: 'Aluguel', amount: 2500, status: 'active' as const, icon: 'Home' },
        { id: '2', source: 'Dividendos', amount: 800, status: 'active' as const, icon: 'TrendingUp' }
      ],
      activeIncome: [
        { id: '1', source: 'Salário CLT', amount: 5500, status: 'active' as const, icon: 'Briefcase' },
        { id: '2', source: 'Freelances', amount: 1500, status: 'active' as const, icon: 'Laptop' }
      ],
      expenses: [
        { id: '1', name: 'Aluguel', amount: 1800, category: 'Moradia', type: 'recurring' as const, status: 'active' as const },
        { id: '2', name: 'Supermercado', amount: 800, category: 'Alimentação', type: 'recurring' as const, status: 'active' as const },
        { id: '3', name: 'Transporte', amount: 400, category: 'Transporte', type: 'recurring' as const, status: 'active' as const },
        { id: '4', name: 'Lazer', amount: 600, category: 'Entretenimento', type: 'variable' as const, status: 'active' as const }
      ],
      tasks: [
        { id: '1', item: 'Revisar investimentos', date: 'Esta semana', priority: 1, icon: 'TrendingUp', completed: false },
        { id: '2', item: 'Planejar férias', date: 'Próximo mês', priority: 3, icon: 'Plane', completed: false }
      ],
      debts: [
        { id: '1', creditor: 'Cartão de Crédito', amount: 3500, dueDate: '2024-07-15', status: 'pending' as const, icon: 'CreditCard', description: 'Fatura pendente', isActive: true }
      ],
      properties: [
        { id: '1', name: 'Apartamento Centro', value: 350000, status: 'rented' as const, currentRent: 2500, statusIcon: '✅', statusText: 'Alugado', prediction: 'Atual', rentRange: 'R$ 2.500' }
      ]
    }
  },
  starter: {
    name: "Starter Profile",
    description: "Clean starter profile for new users",
    data: {
      userProfile: {
        name: "New User",
        defaultCurrency: "USD" as const,
        language: "en" as const
      },
      exchangeRates: {
        brlToUsd: 0.18,
        usdToBrl: 5.54,
        btcPrice: 588300,
        ethPrice: 14000
      },
      liquidAssets: [],
      illiquidAssets: [],
      passiveIncome: [],
      activeIncome: [],
      expenses: [],
      tasks: [],
      debts: [],
      properties: []
    }
  }
};

const colorSchemes = {
  default: { name: "Default", class: "" },
  high_contrast: { name: "High Contrast", class: "contrast-125 saturate-150" },
  warm: { name: "Warm Tones", class: "sepia-[0.15] hue-rotate-15" },
  cool: { name: "Cool Tones", class: "hue-rotate-180 saturate-125" },
  dual_tone: { name: "Dual Tone", class: "contrast-150 saturate-200 hue-rotate-90" },
  monochrome: { name: "Monochrome", class: "grayscale saturate-0" }
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
        importFromJSON(JSON.stringify(profile.data));
        toast({
          title: "Profile Loaded",
          description: `${profile.name} profile loaded successfully`,
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: "Profile Load Failed",
          description: "Could not load the selected profile",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  const generateTestData = () => {
    const testData = {
      ...data,
      liquidAssets: [
        { id: '1', name: 'Test Account 1', value: Math.floor(Math.random() * 50000), icon: 'Banknote', color: 'text-green-600', isActive: true },
        { id: '2', name: 'Test Account 2', value: Math.floor(Math.random() * 30000), icon: 'PiggyBank', color: 'text-blue-600', isActive: true }
      ],
      expenses: [
        { id: '1', name: 'Test Expense 1', amount: Math.floor(Math.random() * 1000), category: 'Test', type: 'recurring' as const, status: 'active' as const },
        { id: '2', name: 'Test Expense 2', amount: Math.floor(Math.random() * 500), category: 'Test', type: 'variable' as const, status: 'active' as const }
      ]
    };
    
    importFromJSON(JSON.stringify(testData));
    toast({
      title: "Test Data Generated",
      description: "Random test data has been loaded",
      duration: 2000,
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
      duration: 2000,
    });
  };

  const applyColorScheme = (scheme: string) => {
    const colorScheme = colorSchemes[scheme as keyof typeof colorSchemes];
    if (colorScheme) {
      // Remove all existing filter classes
      document.documentElement.className = document.documentElement.className
        .replace(/contrast-\d+/g, '')
        .replace(/saturate-\d+/g, '')
        .replace(/sepia-\[[^\]]+\]/g, '')
        .replace(/hue-rotate-\d+/g, '')
        .replace(/grayscale/g, '')
        .trim();
      
      // Apply new filter classes
      if (colorScheme.class) {
        document.documentElement.className += ` ${colorScheme.class}`;
      }
      
      setSelectedColorScheme(scheme);
      // Position toast away from menu
      setTimeout(() => {
        toast({
          title: "Color Filter Applied",
          description: `${colorScheme.name} filter applied`,
          duration: 2000,
        });
      }, 100);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-slate-800 text-white hover:bg-slate-700 border-slate-600 shadow-lg"
        >
          <Settings size={16} />
          <span className="ml-2">Config</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80">
      <Card className="bg-slate-900 text-white border-slate-700 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TestTube size={18} />
              Configuration Panel
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
              Test Profiles
            </h4>
            <Select value={selectedProfile} onValueChange={setSelectedProfile}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a test profile" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 z-50">
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
              Color Filters
            </h4>
            <Select value={selectedColorScheme} onValueChange={applyColorScheme}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 z-50">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    {scheme.name}
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
              <div>Tasks: {data.tasks?.length || 0} items</div>
              <div>Debts: {data.debts?.length || 0} items</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
