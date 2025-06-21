
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coins, Search } from "lucide-react";

const METALS = [
  { symbol: 'XAU', name: 'Gold', unit: 'oz' },
  { symbol: 'XAG', name: 'Silver', unit: 'oz' },
  { symbol: 'XPT', name: 'Platinum', unit: 'oz' },
  { symbol: 'XPD', name: 'Palladium', unit: 'oz' }
];

interface PreciousMetalSelectorProps {
  value: string;
  onChange: (symbol: string, name: string) => void;
  placeholder?: string;
}

export const PreciousMetalSelector = ({ 
  value, 
  onChange, 
  placeholder = "Search precious metals (Gold, Silver...)" 
}: PreciousMetalSelectorProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const results = METALS.filter(metal => 
        metal.name.toLowerCase().includes(query.toLowerCase()) ||
        metal.symbol.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleSelectMetal = (metal: any) => {
    setQuery(metal.symbol);
    onChange(metal.symbol, metal.name);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectMetal(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="pl-10 bg-input border-2 border-border font-mono"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-card border-2 border-border shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((metal, index) => (
            <button
              key={metal.symbol}
              onClick={() => handleSelectMetal(metal)}
              className={`w-full px-3 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none font-mono text-sm flex items-center justify-between ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Coins size={12} />
                  <span className="font-bold">{metal.symbol}</span>
                  <Badge variant="outline" className="text-xs">
                    {metal.unit}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {metal.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
