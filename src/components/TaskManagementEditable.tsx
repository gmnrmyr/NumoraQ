
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, Trash2, Filter, SortAsc } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import TaskItem from "./TaskDragAndDrop";
import { useTranslation } from "@/contexts/TranslationContext";
import { Task } from '@/contexts/financial-data/types';

export const TaskManagementEditable = () => {
  const { data, updateTask, addTask, removeCompletedTasks } = useFinancialData();
  const { t } = useTranslation();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'personal' as 'goal' | 'asset' | 'finance' | 'personal',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    completed: false
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('priority');

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const taskToAdd = {
        // New enhanced fields
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        dueDate: newTask.dueDate,
        completed: newTask.completed,
        // Legacy fields for compatibility
        item: newTask.title,
        date: newTask.dueDate,
        priority: newTask.priority === 'high' ? 3 : newTask.priority === 'medium' ? 2 : 1,
        icon: '📝'
      };
      
      addTask(taskToAdd);
      setNewTask({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        dueDate: '',
        completed: false
      });
      setIsAddingTask(false);
    }
  };

  const handleReorderTasks = (dragIndex: number, hoverIndex: number) => {
    // Create a new array with reordered tasks
    const filteredTasks = getFilteredAndSortedTasks();
    const draggedTask = filteredTasks[dragIndex];
    const newTasks = [...filteredTasks];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, draggedTask);
    
    // Update the original data with new order
    // This is a simplified reordering - in a real app you'd want to persist order
    newTasks.forEach((task, index) => {
      updateTask(task.id, { ...task });
    });
  };

  const getFilteredAndSortedTasks = (): Task[] => {
    let filtered = data.tasks;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(task => {
        const category = task.category || 'personal';
        return category === filterCategory;
      });
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const getPriorityValue = (task: Task) => {
            if (typeof task.priority === 'number') return task.priority;
            const priority = task.priority || 'medium';
            return priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
          };
          return getPriorityValue(b) - getPriorityValue(a);
        case 'dueDate':
          const aDate = a.dueDate || a.date;
          const bDate = b.dueDate || b.date;
          if (!aDate && !bDate) return 0;
          if (!aDate) return 1;
          if (!bDate) return -1;
          return new Date(aDate).getTime() - new Date(bDate).getTime();
        case 'category':
          const aCategory = a.category || 'personal';
          const bCategory = b.category || 'personal';
          return aCategory.localeCompare(bCategory);
        case 'title':
          const aTitle = a.title || a.item;
          const bTitle = b.title || b.item;
          return aTitle.localeCompare(bTitle);
        default:
          return 0;
      }
    });
  };

  const activeTasks = getFilteredAndSortedTasks().filter(task => !task.completed);
  const completedTasks = getFilteredAndSortedTasks().filter(task => task.completed);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="bg-card/95 backdrop-blur-md border-2 border-accent brutalist-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-accent text-sm sm:text-base font-mono uppercase flex items-center gap-2">
                <CheckSquare size={20} />
                {t.tasks || "TASK MANAGEMENT"} ({activeTasks.length} active)
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32 bg-input border-2 border-border">
                  <Filter size={16} className="mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-2 border-border">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="goal">Goals</SelectItem>
                  <SelectItem value="asset">Assets</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-input border-2 border-border">
                  <SortAsc size={16} className="mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-2 border-border">
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={removeCompletedTasks}
                variant="outline"
                size="sm"
                className="brutalist-button text-red-600"
              >
                <Trash2 size={16} className="mr-1" />
                Clear Done
              </Button>
              
              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button size="sm" className="brutalist-button">
                    <Plus size={16} className="mr-1" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md bg-card border-2 border-border">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase">Add New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="brutalist-input"
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="brutalist-input"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={newTask.category} onValueChange={(value: any) => setNewTask({ ...newTask, category: value })}>
                        <SelectTrigger className="bg-input border-2 border-border">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-2 border-border">
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="goal">Goal</SelectItem>
                          <SelectItem value="asset">Asset</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                        <SelectTrigger className="bg-input border-2 border-border">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-2 border-border">
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="brutalist-input"
                    />
                    <Button onClick={handleAddTask} className="w-full brutalist-button">
                      Add Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Active Tasks */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm uppercase text-muted-foreground">Active Tasks</h3>
            {activeTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                onReorder={handleReorderTasks}
              />
            ))}
          </div>
          
          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="space-y-2 mt-6">
              <h3 className="font-mono text-sm uppercase text-muted-foreground">Completed Tasks</h3>
              {completedTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index + activeTasks.length}
                  onReorder={handleReorderTasks}
                />
              ))}
            </div>
          )}
          
          {data.tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground font-mono">
              No tasks yet. Add one to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
