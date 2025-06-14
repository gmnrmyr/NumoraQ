
import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface EditableValueProps {
  value: number;
  onSave: (value: number) => void;
  className?: string;
  prefix?: string;
  suffix?: string;
  type?: 'currency' | 'number' | 'percentage';
}

export const EditableValue: React.FC<EditableValueProps> = ({
  value,
  onSave,
  className,
  prefix = '',
  suffix = '',
  type = 'currency'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const numericValue = parseFloat(editValue) || 0;
    onSave(numericValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  const formatValue = (val: number) => {
    if (type === 'currency') {
      return val.toLocaleString();
    } else if (type === 'percentage') {
      return val.toFixed(2);
    }
    return val.toString();
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn("w-full min-w-0", className)}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer hover:bg-slate-100 px-1 py-0.5 rounded transition-colors",
        className
      )}
      title="Click to edit"
    >
      {prefix}{formatValue(value)}{suffix}
    </span>
  );
};
