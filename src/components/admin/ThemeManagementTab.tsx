
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Eye, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const ThemeManagementTab: React.FC = () => {
  const themes = [
    { id: 'default', name: 'Default Brutalist', preview: '#000000', status: 'active' },
    { id: 'neon', name: 'Neon Cyber', preview: '#00ff00', status: 'available' },
    { id: 'monochrome', name: 'Monochrome', preview: '#888888', status: 'available' },
    { id: 'dual-tone', name: 'Dual Tone', preview: '#4f46e5', status: 'available' },
    { id: 'high-contrast', name: 'High Contrast', preview: '#ffffff', status: 'available' },
    { id: 'cyberpunk', name: 'Cyberpunk', preview: '#ff00ff', status: 'premium' },
    { id: 'matrix', name: 'Matrix', preview: '#008000', status: 'premium' },
    { id: 'gold', name: 'Gold Rush', preview: '#ffd700', status: 'premium' }
  ];

  const applyTheme = (themeId: string) => {
    const root = document.documentElement;
    
    // Reset all themes first
    root.classList.remove('theme-neon', 'theme-monochrome', 'theme-dual-tone', 'theme-high-contrast', 'theme-cyberpunk', 'theme-matrix', 'theme-gold');
    
    if (themeId !== 'default') {
      root.classList.add(`theme-${themeId}`);
    }
    
    localStorage.setItem('selectedTheme', themeId);
    
    toast({
      title: "Theme Applied",
      description: `${themeId.charAt(0).toUpperCase() + themeId.slice(1)} theme activated.`
    });
  };

  const exportTheme = (themeId: string) => {
    toast({
      title: "Export Theme",
      description: "Theme export functionality coming soon!",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'premium':
        return <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Available</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground font-mono">
        Manage and customize dashboard themes. Premium themes require donor status.
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-muted p-4 border-2 border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-mono font-bold">{theme.name}</h3>
                {getStatusBadge(theme.status)}
              </div>
              <div 
                className="w-8 h-8 border-2 border-border"
                style={{ backgroundColor: theme.preview }}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => applyTheme(theme.id)}
                size="sm"
                className="brutalist-button flex-1"
                disabled={theme.status === 'premium'}
              >
                <Eye size={14} className="mr-1" />
                Apply
              </Button>
              <Button
                onClick={() => exportTheme(theme.id)}
                variant="outline"
                size="sm"
                className="brutalist-button"
              >
                <Download size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Theme Creation */}
      <div className="bg-muted p-4 border-2 border-border">
        <h3 className="font-mono font-bold mb-3">Custom Theme Creator</h3>
        <div className="text-sm text-muted-foreground font-mono">
          🎨 Custom theme builder coming soon! Create your own color schemes and typography settings.
        </div>
        <Button className="brutalist-button mt-3" disabled>
          <Palette size={16} className="mr-2" />
          Create Custom Theme
        </Button>
      </div>
    </div>
  );
};
