
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, AlertCircle, User, FileText, Wrench, Car, Home, Plus, Trash2, Edit } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";

const iconMap: { [key: string]: any } = {
  User, FileText, Wrench, Car, Home, AlertCircle
};

export const TaskManagementEditable = () => {
  const { data, updateTask, addTask, removeTask } = useFinancialData();
  const [newTask, setNewTask] = useState({
    item: '',
    date: '',
    priority: 1,
    icon: 'User',
    completed: false
  });
  const [isAddingTask, setIsAddingTask] = useState(false);

  const getPriorityColor = (priority: number) => {
    if (priority <= 5) return 'glass-error text-destructive';
    if (priority <= 15) return 'glass-warning text-warning';
    return 'glass-success text-success';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority <= 5) return 'High';
    if (priority <= 15) return 'Medium';
    return 'Low';
  };

  const handleAddTask = () => {
    if (newTask.item.trim()) {
      addTask(newTask);
      setNewTask({
        item: '',
        date: '',
        priority: 1,
        icon: 'User',
        completed: false
      });
      setIsAddingTask(false);
    }
  };

  const sortedTasks = [...data.tasks].sort((a, b) => a.priority - b.priority);
  const highPriorityTasks = sortedTasks.filter(task => task.priority <= 5);
  const mediumPriorityTasks = sortedTasks.filter(task => task.priority > 5 && task.priority <= 15);
  const lowPriorityTasks = sortedTasks.filter(task => task.priority > 15);

  const TaskSection = ({ title, tasks, bgClass }: any) => (
    <Card className={`${bgClass} rounded-2xl border-0`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar size={20} />
          {title}
          <Badge variant="outline" className="bg-white/20 border-white/30">{tasks.length} tasks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task: any) => {
          const Icon = iconMap[task.icon] || User;
          return (
            <div key={task.id} className={`flex items-center justify-between p-4 glass-card rounded-xl ${task.completed ? 'opacity-75' : ''}`}>
              <div className="flex items-center gap-3 flex-1">
                <Icon size={16} className="text-primary" />
                <div className="flex-1">
                  <Input
                    value={task.item}
                    onChange={(e) => updateTask(task.id, { item: e.target.value })}
                    className={`border-0 bg-transparent p-0 font-medium focus:ring-0 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  />
                  <Input
                    value={task.date}
                    onChange={(e) => updateTask(task.id, { date: e.target.value })}
                    placeholder="Date"
                    className={`border-0 bg-transparent p-0 text-xs text-muted-foreground focus:ring-0 mt-1 ${task.completed ? 'line-through' : ''}`}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityLabel(task.priority)}
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-xs">#</span>
                  <EditableValue
                    value={task.priority}
                    onSave={(value) => updateTask(task.id, { priority: value })}
                    type="number"
                    className="w-12 bg-white/20 border-white/30"
                  />
                </div>
                <Button
                  onClick={() => updateTask(task.id, { completed: !task.completed })}
                  variant={task.completed ? "default" : "outline"}
                  size="sm"
                  className={`glass-card border-0 ${task.completed ? "bg-success text-success-foreground hover:bg-success/80" : "hover:bg-white/20"}`}
                >
                  ✓
                </Button>
                <Button
                  onClick={() => removeTask(task.id)}
                  variant="outline"
                  size="sm"
                  className="glass-card border-0 text-destructive hover:bg-destructive/20"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Task Overview */}
      <Card className="glass-primary rounded-2xl border-0">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            Task Overview
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto glass-card border-0 hover:bg-white/20">
                  <Plus size={16} className="mr-1" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card-enhanced border-0">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Task description"
                    value={newTask.item}
                    onChange={(e) => setNewTask({ ...newTask, item: e.target.value })}
                    className="glass-card border-white/30"
                  />
                  <Input
                    placeholder="Date (optional)"
                    value={newTask.date}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                    className="glass-card border-white/30"
                  />
                  <Input
                    type="number"
                    placeholder="Priority (1-30)"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) || 1 })}
                    className="glass-card border-white/30"
                  />
                  <Button onClick={handleAddTask} className="w-full glass-card border-0 bg-primary hover:bg-primary/80">
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 glass-card rounded-xl">
              <div className="text-sm text-muted-foreground">High Priority</div>
              <div className="text-2xl font-bold text-destructive">{highPriorityTasks.length}</div>
              <div className="text-xs text-muted-foreground">Urgent tasks</div>
            </div>
            <div className="text-center p-4 glass-card rounded-xl">
              <div className="text-sm text-muted-foreground">Medium Priority</div>
              <div className="text-2xl font-bold text-warning">{mediumPriorityTasks.length}</div>
              <div className="text-xs text-muted-foreground">Important tasks</div>
            </div>
            <div className="text-center p-4 glass-card rounded-xl">
              <div className="text-sm text-muted-foreground">Low Priority</div>
              <div className="text-2xl font-bold text-success">{lowPriorityTasks.length}</div>
              <div className="text-xs text-muted-foreground">Future tasks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Sections */}
      <div className="space-y-6">
        <TaskSection 
          title="High Priority Tasks" 
          tasks={highPriorityTasks} 
          bgClass="glass-error"
        />
        <TaskSection 
          title="Medium Priority Tasks" 
          tasks={mediumPriorityTasks} 
          bgClass="glass-warning"
        />
        <TaskSection 
          title="Low Priority Tasks" 
          tasks={lowPriorityTasks} 
          bgClass="glass-success"
        />
      </div>
    </div>
  );
};
