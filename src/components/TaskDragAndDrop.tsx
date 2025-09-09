
import React, { useState } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Task } from '@/contexts/financial-data/types/tasks';
import { Button } from '@/components/ui/button';
import { EditableValue } from '@/components/ui/editable-value';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Trash2, Calendar } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  index: number;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, onReorder }) => {
  const { updateTask, removeTask } = useFinancialData();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== index) {
      onReorder(dragIndex, index);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'goal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'asset': return 'bg-green-100 text-green-800 border-green-200';
      case 'finance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'personal': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string | number) => {
    const priorityStr = typeof priority === 'number' ? 
      (priority >= 5 ? 'critical' : priority >= 4 ? 'urgent' : priority >= 3 ? 'high' : priority >= 2 ? 'medium' : 'low') : 
      priority;
    
    switch (priorityStr) {
      case 'critical': return 'bg-red-900 text-red-100 border-red-800';
      case 'urgent': return 'bg-red-600 text-red-100 border-red-500';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper functions to get task properties (supporting both old and new formats)
  const getTaskTitle = () => task.title || task.item;
  const getTaskDescription = () => task.description;
  const getTaskCategory = () => task.category || 'personal';
  const getTaskDueDate = () => task.dueDate || task.date;
  const getTaskPriority = () => {
    if (typeof task.priority === 'number') {
      return task.priority >= 5 ? 'critical' : task.priority >= 4 ? 'urgent' : task.priority >= 3 ? 'high' : task.priority >= 2 ? 'medium' : 'low';
    }
    return task.priority || 'medium';
  };

  const handleCategoryChange = (newCategory: string) => {
    updateTask(task.id, { category: newCategory as 'goal' | 'asset' | 'finance' | 'personal' });
  };

  const handlePriorityChange = (newPriority: string) => {
    const priorityValue = newPriority === 'critical' ? 5 : 
                         newPriority === 'urgent' ? 4 : 
                         newPriority === 'high' ? 3 : 
                         newPriority === 'medium' ? 2 : 1;
    updateTask(task.id, { priority: priorityValue });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        p-3 bg-background/50 border-2 border-border brutalist-card cursor-move
        ${isDragging ? 'opacity-50' : ''}
        ${draggedOver ? 'border-accent' : ''}
        ${task.completed ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <GripVertical size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
        
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => updateTask(task.id, { completed: !!checked })}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <EditableValue
              value={getTaskTitle()}
              onSave={(value) => updateTask(task.id, { 
                title: String(value),
                item: String(value) // Update both for compatibility
              })}
              type="text"
              className={`font-medium text-sm font-mono ${task.completed ? 'line-through' : ''}`}
            />
          </div>
          
          {getTaskDescription() && (
            <div className="mb-2 break-words overflow-wrap-anywhere">
              <EditableValue
                value={getTaskDescription() || ''}
                onSave={(value) => updateTask(task.id, { description: String(value) })}
                type="text"
                className="text-xs text-muted-foreground font-mono break-words overflow-wrap-anywhere"
                placeholder="Add description..."
              />
            </div>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={getTaskCategory()} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-auto h-6 bg-transparent border-0 p-0">
                <Badge className={getCategoryColor(getTaskCategory())}>
                  {getTaskCategory()}
                </Badge>
              </SelectTrigger>
              <SelectContent className="bg-card border-2 border-border">
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="goal">Goal</SelectItem>
                <SelectItem value="asset">Asset</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={getTaskPriority()} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-auto h-6 bg-transparent border-0 p-0">
                <Badge className={getPriorityColor(getTaskPriority())}>
                  {getTaskPriority()}
                </Badge>
              </SelectTrigger>
              <SelectContent className="bg-card border-2 border-border">
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={12} />
              <EditableValue
                value={getTaskDueDate() || ''}
                onSave={(value) => updateTask(task.id, { 
                  dueDate: String(value),
                  date: String(value) // Update both for compatibility
                })}
                type="text"
                className="text-xs font-mono"
                placeholder="Add date..."
              />
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => removeTask(task.id)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 p-1 h-6 w-6 border-2 border-border flex-shrink-0"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
