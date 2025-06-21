
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Search, Building } from "lucide-react";
import { searchStocks } from '@/services/stockService';

interface StockSelectorProps {
  value: string;
  onChange: (symbol: string, name: string) => void;
  placeholder?: string;
  assetType?: 'stock' | 'reit';
}

export const StockSelector = ({ 
  value, 
  onChange, 
  placeholder = "Search stocks (e.g., AAPL, NVDA)", 
  assetType = 'stock' 
}: StockSelectorProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const results = searchStocks(query, assetType);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, assetType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value.toUpperCase();
    setQuery(newQuery);
  };

  const handleSelectStock = (stock: any) => {
    setQuery(stock.symbol);
    onChange(stock.symbol, stock.name);
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
          handleSelectStock(suggestions[selectedIndex]);
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
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border-2 border-border shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((stock, index) => {
            const IconComponent = stock.type === 'reit' ? Building : TrendingUp;
            return (
              <button
                key={stock.symbol}
                onClick={() => handleSelectStock(stock)}
                className={`w-full px-3 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none font-mono text-sm flex items-center justify-between ${
                  index === selectedIndex ? 'bg-muted' : ''
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <IconComponent size={12} />
                    <span className="font-bold">{stock.symbol}</span>
                    <Badge variant="outline" className="text-xs">
                      {stock.exchange}
                    </Badge>
                    {stock.type === 'reit' && (
                      <Badge variant="secondary" className="text-xs">
                        {stock.symbol.includes('.SA') ? 'FII' : 'REIT'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {stock.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
