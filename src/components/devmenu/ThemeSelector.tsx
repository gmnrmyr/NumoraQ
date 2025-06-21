import React from 'react';

interface ThemeSelectorProps {
  onApplyTheme: (theme: string) => void;
  getDonationAmount: () => number;
  isChampionUser: boolean;
}

export const ThemeSelector = ({ onApplyTheme, getDonationAmount, isChampionUser }: ThemeSelectorProps) => {
  // Check if user has CHAMPION role (2000+ points)
  const isContributor = getDonationAmount() >= 50; // 50+ points for Contributor+
  const isWhalesUser = getDonationAmount() >= 10000; // 10,000+ points for Whales+

  const themes = [
    {
      id: 'neon',
      name: 'Neon',
      description: 'Vibrant and glowing neon style',
      requirement: 'Basic',
      locked: false,
      category: 'basic'
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      description: 'Classic black and white aesthetic',
      requirement: 'Basic',
      locked: false,
      category: 'basic'
    },
    {
      id: 'dual-tone',
      name: 'Dual Tone',
      description: 'Elegant two-color design',
      requirement: 'Basic',
      locked: false,
      category: 'basic'
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Maximum readability with stark contrasts',
      requirement: 'Basic',
      locked: false,
      category: 'basic'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      description: 'Futuristic and gritty cyberpunk style',
      requirement: 'Contributor+ (50+ pts)',
      locked: !isContributor,
      category: 'contributor'
    },
    {
      id: 'matrix',
      name: 'Matrix',
      description: 'Digital rain and code-inspired design',
      requirement: 'Contributor+ (50+ pts)',
      locked: !isContributor,
      category: 'contributor'
    },
    {
      id: 'gold',
      name: 'Gold',
      description: 'Luxurious and opulent gold theme',
      requirement: 'Contributor+ (50+ pts)',
      locked: !isContributor,
      category: 'contributor'
    },
    
    // Premium themes for Champion+ users
    {
      id: 'black-hole',
      name: 'Black Hole',
      description: 'Cosmic void with gravitational animations',
      requirement: 'Champion+ (2000+ pts)',
      locked: !isChampionUser,
      category: 'premium'
    },
    
    // Ultra Premium themes for Whales+ users  
    {
      id: 'dark-dither',
      name: 'Dark Dither',
      description: 'Monochrome dithered aesthetic with flowing animations',
      requirement: 'Whales+ (10000+ pts)',
      locked: !isWhalesUser,
      category: 'ultra'
    },
    {
      id: 'leras', 
      name: 'Leras',
      description: 'Exclusive artistic theme with ethereal visuals',
      requirement: 'Whales+ (10000+ pts)',
      locked: !isWhalesUser,
      category: 'ultra'
    },

    // Testing themes
    {
      id: 'da-test',
      name: 'DA Test',
      description: 'Development testing environment',
      requirement: 'Contributor+ (50+ pts)',
      locked: getDonationAmount() < 50,
      category: 'testing'
    }
  ];

  return (
    <div className="space-y-4">
      {themes.map((theme) => (
        <div
          key={theme.id}
          className={`p-4 border rounded-md cursor-pointer ${theme.locked
            ? 'border-gray-700 bg-gray-900 text-gray-500 hover:bg-gray-800'
            : 'border-accent hover:bg-accent/10 transition-colors duration-200'
            }`}
          onClick={() => {
            if (!theme.locked) {
              onApplyTheme(theme.id);
            }
          }}
        >
          <div className="flex justify-between items-center">
            <div className="font-bold font-mono uppercase">{theme.name}</div>
            {theme.locked && (
              <span className="text-xs italic">
                Locked ({theme.requirement})
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            {theme.description}
          </p>
        </div>
      ))}
    </div>
  );
};
