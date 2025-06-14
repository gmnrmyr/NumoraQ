
import React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface StatusToggleProps {
  status: 'active' | 'pending' | 'inactive' | 'paid' | 'partial' | 'rented' | 'renovating' | 'planned';
  onToggle: (newStatus: any) => void;
  options?: string[];
  className?: string;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({
  status,
  onToggle,
  options,
  className
}) => {
  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'active':
      case 'paid':
      case 'rented':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'pending':
      case 'renovating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'inactive':
      case 'partial':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200';
    }
  };

  const getStatusText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'inactive': return 'Inactive';
      case 'paid': return 'Paid';
      case 'partial': return 'Partial';
      case 'rented': return 'Rented';
      case 'renovating': return 'Renovating';
      case 'planned': return 'Planned';
      default: return currentStatus;
    }
  };

  const defaultOptions = ['active', 'pending', 'inactive'];
  const availableOptions = options || defaultOptions;

  const handleClick = () => {
    const currentIndex = availableOptions.indexOf(status);
    const nextIndex = (currentIndex + 1) % availableOptions.length;
    onToggle(availableOptions[nextIndex]);
  };

  return (
    <Badge
      className={cn(
        "cursor-pointer transition-colors select-none",
        getStatusColor(status),
        className
      )}
      onClick={handleClick}
      title="Click to toggle status"
    >
      {getStatusText(status)}
    </Badge>
  );
};
