
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, CheckSquare, Square, Calendar, CleaningServices } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { useTranslation } from "@/contexts/TranslationContext";

export const TaskManagementEditable = () => {
  const { t } = useTranslation();
  const { data, updateTask, addTask, removeTask, removeCompletedTasks } = useFinancialData();
  
  const [newTask, setNewTask] = useState({
    item: '',
    date: new Date().toISOString().split('T')[0],
    priority: 1,
    icon: 'CheckSquare',
    completed: false
  });
  
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    if (newTask.item.trim()) {
      addTask(newTask);
      setNewTask({
        item: '',
        date: new Date().toISOString().split('T')[0],
        priority: 1,
        icon: 'CheckSquare',
        completed: false
      });
      setIsAddingTask(false);
    }
  };

  const completedTasks = data.tasks.filter(task => task.completed);
  const pendingTasks = data.tasks.filter(task => !task.completed);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Pending Tasks */}
      <Card className="bg-card/80 backdrop-blur-sm border-orange-400 border-2">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-orange-400 flex items-center gap-2 font-mono uppercase text-sm sm:text-base">
              <CheckSquare size={20} />
              {t.tasks} ({pendingTasks.length})
            </CardTitle>
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-orange-900 text-xs sm:text-sm">
                  <Plus size={14} />
                  <span className="hidden sm:inline ml-1">{t.add}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-orange-400 border-2 mx-2 max-w-[95vw] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase text-foreground text-sm">{t.add} {t.task}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input 
                    placeholder={t.description} 
                    value={newTask.item} 
                    onChange={e => setNewTask({...newTask, item: e.target.value})} 
                    className="bg-input border-border border-2 text-foreground font-mono text-sm"
                  />
                  <Input 
                    type="date" 
                    value={newTask.date} 
                    onChange={e => setNewTask({...newTask, date: e.target.value})} 
                    className="bg-input border-border border-2 text-foreground font-mono text-sm"
                  />
                  <Button onClick={handleAddTask} className="w-full bg-orange-400 text-orange-900 hover:bg-orange-500 font-mono uppercase text-xs">
                    {t.add}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-80 overflow-y-auto">
          {pendingTasks.map(task => (
            <div key={task.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded border border-border">
              <Button
                onClick={() => updateTask(task.id, { completed: !task.completed })}
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-orange-400 hover:text-orange-300 flex-shrink-0"
              >
                {task.completed ? <CheckSquare size={16} /> : <Square size={16} />}
              </Button>
              <div className="flex-1 min-w-0">
                <div className={`font-mono text-xs sm:text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'} break-words`}>
                  {task.item}
                </div>
                <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  {new Date(task.date).toLocaleDateString()}
                </div>
              </div>
              <Button
                onClick={() => removeTask(task.id)}
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-red-400 hover:text-red-300 flex-shrink-0"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          {pendingTasks.length === 0 && (
            <div className="text-center text-muted-foreground font-mono text-xs py-4">
              No pending tasks
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card className="bg-card/80 backdrop-blur-sm border-green-400 border-2">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-green-400 flex items-center gap-2 font-mono uppercase text-sm sm:text-base">
              <CheckSquare size={20} />
              Completed ({completedTasks.length})
            </CardTitle>
            {completedTasks.length > 0 && (
              <Button 
                onClick={removeCompletedTasks}
                size="sm" 
                variant="outline" 
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-red-900 text-xs sm:text-sm"
              >
                <CleaningServices size={14} />
                <span className="hidden sm:inline ml-1">Clear</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 max-h-80 overflow-y-auto">
          {completedTasks.map(task => (
            <div key={task.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border opacity-75">
              <Button
                onClick={() => updateTask(task.id, { completed: !task.completed })}
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-green-400 hover:text-green-300 flex-shrink-0"
              >
                <CheckSquare size={16} />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs sm:text-sm line-through text-muted-foreground break-words">
                  {task.item}
                </div>
                <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  {new Date(task.date).toLocaleDateString()}
                </div>
              </div>
              <Button
                onClick={() => removeTask(task.id)}
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-red-400 hover:text-red-300 flex-shrink-0"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          {completedTasks.length === 0 && (
            <div className="text-center text-muted-foreground font-mono text-xs py-4">
              No completed tasks
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
