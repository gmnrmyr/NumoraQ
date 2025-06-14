
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins } from "lucide-react";
import { iconMap, iconOptions, groupedIcons } from './IconData';

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange, placeholder }) => {
  const SelectedIcon = iconMap[value] || Coins;
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          <div className="flex items-center gap-2">
            <SelectedIcon size={20} />
            <span>{iconOptions.find(opt => opt.value === value)?.label || placeholder}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {Object.entries(groupedIcons).map(([category, icons]) => (
          <div key={category}>
            <div className="px-2 py-1.5 text-sm font-semibold text-slate-600 bg-slate-50">
              {category}
            </div>
            {icons.map((iconOption) => {
              const IconComponent = iconMap[iconOption.value];
              return (
                <SelectItem key={iconOption.value} value={iconOption.value}>
                  <div className="flex items-center gap-2">
                    <IconComponent size={16} />
                    <span>{iconOption.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
};
