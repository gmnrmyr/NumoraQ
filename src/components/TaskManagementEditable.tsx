
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle2, Circle, Trash2, Edit2, Save, X } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Task } from '@/contexts/financial-data/types';

export const TaskManagementEditable = () => {
  const { data, updateTasks } = useFinancialData();
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as 'low' | 'medium' | 'high' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Partial<Task>>({});

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
    };
    
    updateTasks([...data.tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium' });
  };

  const toggleTask = (id: string) => {
    updateTasks(data.tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    updateTasks(data.tasks.filter(task => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingTask(task);
  };

  const saveEdit = () => {
    if (!editingTask.title?.trim()) return;
    
    updateTasks(data.tasks.map(task => 
      task.id === editingId ? { ...task, ...editingTask } : task
    ));
    setEditingId(null);
    setEditingTask({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTask({});
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const activeTasks = data.tasks.filter(task => !task.completed);
  const completedTasks = data.tasks.filter(task => task.completed);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add New Task */}
      <Card className="brutalist-card bg-card border-2 border-border p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold font-mono text-accent uppercase tracking-wider mb-4">
          Add New Task
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="font-mono bg-input border-2 border-border"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="font-mono bg-input border-2 border-border px-3 py-2 rounded text-foreground"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <Textarea
            placeholder="Task description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="font-mono bg-input border-2 border-border"
            rows={2}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={addTask}
              className="brutalist-button bg-accent text-accent-foreground hover:bg-accent/90 flex-1 sm:flex-none"
            >
              <Plus size={16} className="mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Tasks */}
      <Card className="brutalist-card bg-card border-2 border-border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h3 className="text-lg sm:text-xl font-bold font-mono text-accent uppercase tracking-wider">
            Active Tasks ({activeTasks.length})
          </h3>
          {completedTasks.length > 0 && (
            <Button
              onClick={() => updateTasks(activeTasks)}
              variant="outline"
              size="sm"
              className="brutalist-button text-xs w-full sm:w-auto"
            >
              <Trash2 size={12} className="mr-1" />
              Clear Completed
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {activeTasks.map((task) => (
            <div key={task.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/20 border border-border">
              {editingId === task.id ? (
                <>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingTask.title || ''}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="font-mono text-sm bg-input border border-border"
                    />
                    <Textarea
                      value={editingTask.description || ''}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="font-mono text-sm bg-input border border-border"
                      rows={2}
                    />
                    <select
                      value={editingTask.priority || 'medium'}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="font-mono text-sm bg-input border border-border px-2 py-1 rounded w-full sm:w-auto"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end sm:justify-start">
                    <Button onClick={saveEdit} size="sm" className="brutalist-button bg-green-600 hover:bg-green-700">
                      <Save size={12} />
                    </Button>
                    <Button onClick={cancelEdit} size="sm" variant="outline" className="brutalist-button">
                      <X size={12} />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Button
                      onClick={() => toggleTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto hover:bg-transparent flex-shrink-0"
                    >
                      <Circle size={20} className="text-muted-foreground hover:text-accent" />
                    </Button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h4 className="font-mono font-semibold text-foreground text-sm break-words">
                          {task.title}
                        </h4>
                        <Badge className={`${getPriorityColor(task.priority)} text-white text-xs w-fit`}>
                          {task.priority.toUpperCase()}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="font-mono text-xs text-muted-foreground break-words">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end sm:justify-start flex-shrink-0">
                    <Button 
                      onClick={() => startEditing(task)}
                      size="sm" 
                      variant="outline" 
                      className="brutalist-button text-xs"
                    >
                      <Edit2 size={12} />
                    </Button>
                    <Button 
                      onClick={() => deleteTask(task.id)}
                      size="sm" 
                      variant="outline" 
                      className="brutalist-button text-xs text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {activeTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground font-mono text-sm">
              No active tasks. Add one above to get started!
            </div>
          )}
        </div>
      </Card>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card className="brutalist-card bg-card border-2 border-border p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold font-mono text-accent uppercase tracking-wider mb-4">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/20 border border-border opacity-60">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Button
                    onClick={() => toggleTask(task.id)}
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto hover:bg-transparent flex-shrink-0"
                  >
                    <CheckCircle2 size={20} className="text-green-500" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <h4 className="font-mono font-semibold text-foreground text-sm line-through break-words">
                        {task.title}
                      </h4>
                      <Badge className={`${getPriorityColor(task.priority)} text-white text-xs w-fit`}>
                        {task.priority.toUpperCase()}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="font-mono text-xs text-muted-foreground line-through break-words">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-end sm:justify-start flex-shrink-0">
                  <Button 
                    onClick={() => deleteTask(task.id)}
                    size="sm" 
                    variant="outline" 
                    className="brutalist-button text-xs text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
