
import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface EditableValueProps {
  value: number | string;
  onSave: (value: number | string) => void;
  className?: string;
  prefix?: string;
  suffix?: string;
  type?: 'currency' | 'number' | 'percentage' | 'text';
  placeholder?: string;
  disabled?: boolean;
}

export const EditableValue: React.FC<EditableValueProps> = ({
  value,
  onSave,
  className,
  prefix = '',
  suffix = '',
  type = 'currency',
  placeholder,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // When value prop changes from parent, update our local copy if not editing
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value.toString());
    }
  }, [value, isEditing]);

  // Focus and select input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    // Only save if value actually changed
    if (editValue !== value.toString()) {
      if (type === 'text') {
        onSave(editValue);
      } else {
        const numericValue = parseFloat(editValue) || 0;
        onSave(numericValue);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value.toString()); // Revert changes
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Simple blur handler - only save if there are actual changes
  const handleBlur = () => {
    if (editValue !== value.toString()) {
      handleSave();
    } else {
      setIsEditing(false);
    }
  };
  
  const handleStartEditing = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    // Sync with prop value before entering edit mode
    setEditValue(value.toString());
    setIsEditing(true);
  };

  const formatValue = (val: number | string) => {
    if (type === 'text') {
      return val.toString();
    }
    if (type === 'currency') {
      // Use toLocaleString for currency formatting
      return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (type === 'percentage') {
      return Number(val).toFixed(2);
    }
    return val.toString();
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={type === 'text' ? 'text' : 'number'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("w-full min-w-0", className)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      onClick={handleStartEditing}
      className={cn(
        disabled ? "cursor-default opacity-60" : "cursor-pointer hover:bg-slate-100",
        "px-1 py-0.5 rounded transition-colors",
        value === '' && placeholder ? 'text-slate-400' : '',
        className
      )}
      title={disabled ? "Editing disabled" : "Click to edit"}
    >
      {value === '' && placeholder ? placeholder : `${prefix}${formatValue(value)}${suffix}`}
    </span>
  );
};
