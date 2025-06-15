
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
}

export const EditableValue: React.FC<EditableValueProps> = ({
  value,
  onSave,
  className,
  prefix = '',
  suffix = '',
  type = 'currency',
  placeholder
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // When entering edit mode, set editValue from value prop
  useEffect(() => {
    if (isEditing) {
      setEditValue(value.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Don't close editing due to value prop change while editing
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value.toString());
    }
  }, [value, isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (type === 'text') {
      onSave(editValue);
    } else {
      const numericValue = parseFloat(editValue) || 0;
      onSave(numericValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    // Only save when blur is real (not click inside input)
    if (isEditing) {
      handleSave();
    }
  };

  const formatValue = (val: number | string) => {
    if (type === 'text') {
      return val.toString();
    }
    if (type === 'currency') {
      return Number(val).toLocaleString();
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
        className={cn("w-full min-w-0", className)}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer hover:bg-slate-100 px-1 py-0.5 rounded transition-colors",
        value === '' && placeholder ? 'text-slate-400' : '',
        className
      )}
      title="Click to edit"
    >
      {value === '' && placeholder ? placeholder : `${prefix}${formatValue(value)}${suffix}`}
    </span>
  );
};
