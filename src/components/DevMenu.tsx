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
    name: "Guilherme (GUI)",
    description: "GUI's complete financial profile",
    data: {
      userProfile: {
        name: "Gui",
        defaultCurrency: "BRL" as const,
        language: "en" as const
      },
      exchangeRates: {
        brlToUsd: 0.18,
        usdToBrl: 5.54,
        btcPrice: 588300,
        ethPrice: 14000
      },
      liquidAssets: [
        { id: '1', name: 'BTC', value: 33500, icon: 'Bitcoin', color: 'text-orange-600', isActive: true },
        { id: '2', name: 'Altcoins & NFT', value: 4500, icon: 'Coins', color: 'text-purple-600', isActive: true },
        { id: '3', name: 'Banco', value: 100, icon: 'Banknote', color: 'text-green-600', isActive: true },
        { id: '4', name: 'PXL DEX', value: 50000, icon: 'Coins', color: 'text-blue-600', isActive: false }
      ],
      illiquidAssets: [
        { id: '1', name: 'Bens GUI', value: 50000, icon: 'Building', color: 'text-slate-600', isActive: true },
        { id: '2', name: 'Bens Pais', value: 30000, icon: 'Building', color: 'text-slate-600', isActive: true }
      ],
      passiveIncome: [
        { id: '1', source: 'Locação Macuco', amount: 6000, status: 'pending' as const, icon: 'Home', note: 'Não alugado ainda, simulado' },
        { id: '2', source: 'Locação Laurindo', amount: 1600, status: 'active' as const, icon: 'Home' },
        { id: '3', source: 'Aposentadoria Mãe', amount: 1518, status: 'active' as const, icon: 'User' },
        { id: '4', source: 'Locação Ataliba', amount: 1300, status: 'active' as const, icon: 'Home' },
        { id: '5', source: 'Apoio da IRA', amount: 1000, status: 'active' as const, icon: 'Heart' },
        { id: '6', source: 'Aposentadoria Pai', amount: 0, status: 'pending' as const, icon: 'User' }
      ],
      activeIncome: [
        { id: '1', source: 'Freelas Pai', amount: 600, status: 'active' as const, icon: 'Briefcase' },
        { id: '2', source: 'CLT GUI (Gestor Seller)', amount: 1800, status: 'active' as const, icon: 'Briefcase' },
        { id: '3', source: 'Freelas GUI', amount: 600, status: 'active' as const, icon: 'Briefcase' }
      ],
      expenses: [
        { id: '1', name: 'Condomínio Macuco', amount: 1117, category: 'Vacância', type: 'recurring' as const, status: 'active' as const },
        { id: '2', name: 'Locação Taubaté', amount: 2800, category: 'Moradia', type: 'recurring' as const, status: 'active' as const },
        { id: '3', name: 'Convênio GUI', amount: 1163, category: 'Saúde', type: 'recurring' as const, status: 'active' as const },
        { id: '4', name: 'Convênio Mãe', amount: 1295, category: 'Saúde', type: 'recurring' as const, status: 'active' as const },
        { id: '5', name: 'Cannabis GUI', amount: 1000, category: 'Vícios', type: 'recurring' as const, status: 'active' as const },
        { id: '6', name: 'Internet Vivo', amount: 90, category: 'Serviços', type: 'recurring' as const, status: 'active' as const },
        { id: '7', name: 'Goró Pai', amount: 100, category: 'Vícios', type: 'recurring' as const, status: 'active' as const },
        { id: '8', name: 'IPVA (2)', amount: 100, category: 'Imposto', type: 'recurring' as const, status: 'active' as const },
        { id: '9', name: 'Mercado - Limpeza', amount: 200, category: 'Higiene', type: 'recurring' as const, status: 'active' as const },
        { id: '10', name: 'IPTU (3)', amount: 200, category: 'Imposto', type: 'recurring' as const, status: 'active' as const },
        { id: '11', name: 'Planos Celulares', amount: 270, category: 'Serviços', type: 'recurring' as const, status: 'active' as const },
        { id: '12', name: 'Reforma Macuco', amount: 7100, category: 'Reforma', type: 'variable' as const, status: 'active' as const },
        { id: '13', name: 'Cartão Inter GUI', amount: 4600, category: 'Cartão', type: 'variable' as const, status: 'active' as const }
      ],
      tasks: [
        { id: '1', item: 'Exames', date: 'Domingo', priority: 1, icon: 'User', completed: false },
        { id: '2', item: 'Encontrar carteira de trabalho', date: 'Segunda', priority: 2, icon: 'FileText', completed: false },
        { id: '3', item: 'Consulta Psiquiatra', date: 'Julho', priority: 5, icon: 'User', completed: false },
        { id: '4', item: 'Pagar contas pendentes', date: 'Urgente', priority: 7, icon: 'CreditCard', completed: false },
        { id: '5', item: 'Fotografar móveis/scooter', date: 'Esta semana', priority: 8, icon: 'Camera', completed: false }
      ],
      debts: [
        { id: '1', creditor: 'Goodstorage Avaria', amount: 1200, dueDate: 'INDEF', status: 'pending' as const, icon: 'Home', description: 'Storage damage compensation', isActive: true },
        { id: '2', creditor: 'Devo Mãe', amount: 2000, dueDate: 'INDEF', status: 'pending' as const, icon: 'User', description: 'Condomínio, convênio, etc', isActive: true },
        { id: '3', creditor: 'Devo Fernando', amount: 5000, dueDate: 'INDEF', status: 'pending' as const, icon: 'User', description: 'Personal loan', isActive: true }
      ],
      properties: [
        { id: '1', name: 'Laurindo', value: 230400, status: 'rented' as const, currentRent: 1600, statusIcon: '✅', statusText: 'Alugado', prediction: 'Atual', rentRange: 'R$ 1.600' },
        { id: '2', name: 'Macuco (Moema)', value: 1050000, status: 'renovating' as const, currentRent: 0, expectedRent: 6000, statusIcon: '🔄', statusText: 'Reformando', prediction: 'outubro/2025', rentRange: 'R$ 6.000' },
        { id: '3', name: 'Ataliba (comercial)', value: 206220, minValue: 172440, maxValue: 240000, status: 'planned' as const, currentRent: 0, expectedRent: 1750, statusIcon: '📋', statusText: 'Planejado', prediction: '2027', rentRange: 'R$ 1.500-2.000' }
      ]
    }
  },
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
  }
};

const colorSchemes = {
  default: { name: "Default", class: "" },
  high_contrast: { name: "High Contrast", class: "contrast-125 saturate-150" },
  warm: { name: "Warm Tones", class: "sepia-[0.15] hue-rotate-15" },
  cool: { name: "Cool Tones", class: "hue-rotate-180 saturate-125" },
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
      toast({
        title: "Color Scheme Applied",
        description: `${colorScheme.name} filter applied`,
      });
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-slate-800 text-white hover:bg-slate-700 border-slate-600 shadow-lg"
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
              Color Filters
            </h4>
            <Select value={selectedColorScheme} onValueChange={applyColorScheme}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
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
