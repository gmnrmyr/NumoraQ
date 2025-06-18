
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, AlertCircle, User, FileText, Wrench, Car, Home, Plus, Trash2 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import { EditableValue } from "@/components/ui/editable-value";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const iconMap: { [key: string]: any } = {
  User, FileText, Wrench, Car, Home, AlertCircle
};

export const TaskManagementEditable = () => {
  const { data, updateTask, addTask, removeTask, removeCompletedTasks } = useFinancialData();
  const [newTask, setNewTask] = useState({
    item: '',
    date: '',
    priority: 1,
    icon: 'User',
    completed: false
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const getPriorityColor = (priority: number) => {
    if (priority <= 5) return 'bg-red-100 text-red-800 border-red-200';
    if (priority <= 15) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
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

  const handleRemoveCompleted = () => {
    if (window.confirm('Are you sure you want to delete all completed tasks? This action cannot be undone.')) {
      removeCompletedTasks();
    }
  };

  const tasksToDisplay = showCompleted ? data.tasks : data.tasks.filter(t => !t.completed);
  const sortedTasks = [...tasksToDisplay].sort((a, b) => a.priority - b.priority);
  const highPriorityTasks = sortedTasks.filter(task => task.priority <= 5);
  const mediumPriorityTasks = sortedTasks.filter(task => task.priority > 5 && task.priority <= 15);
  const lowPriorityTasks = sortedTasks.filter(task => task.priority > 15);

  const TaskSection = ({ title, tasks, bgColor, borderColor }: any) => (
    <Card className={`bg-card/95 backdrop-blur-md border-2 ${borderColor} brutalist-card`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono uppercase text-foreground">
          <Calendar size={20} />
          {title}
          <Badge variant="outline" className="font-mono">{tasks.length} tasks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task: any) => {
          const Icon = iconMap[task.icon] || User;
          return (
            <div key={task.id} className={`flex items-center justify-between p-3 bg-background/50 border-2 border-border brutalist-card ${task.completed ? 'opacity-75' : ''}`}>
              <div className="flex items-center gap-3 flex-1">
                <Icon size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <Input
                    value={task.item}
                    onChange={(e) => updateTask(task.id, { item: e.target.value })}
                    className={`border-2 border-border bg-input p-2 font-medium font-mono ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  />
                  <Input
                    value={task.date}
                    onChange={(e) => updateTask(task.id, { date: e.target.value })}
                    placeholder="Date"
                    className={`border-2 border-border bg-input p-2 text-xs text-muted-foreground mt-1 font-mono ${task.completed ? 'line-through' : ''}`}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityLabel(task.priority)}
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono">#</span>
                  <EditableValue
                    value={task.priority}
                    onSave={(value) => updateTask(task.id, { priority: Number(value) })}
                    type="number"
                    className="w-12 bg-input border-2 border-border font-mono"
                  />
                </div>
                <Button
                  onClick={() => updateTask(task.id, { completed: !task.completed })}
                  variant={task.completed ? "default" : "outline"}
                  size="sm"
                  className={`border-2 border-border font-mono ${task.completed ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  ✓
                </Button>
                <Button
                  onClick={() => removeTask(task.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 border-2 border-border"
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
      <Card className="bg-card/95 backdrop-blur-md border-2 border-accent brutalist-card">
        <CardHeader>
          <CardTitle className="text-accent flex items-center justify-between gap-2 font-mono uppercase">
            <span>Task Overview</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={setShowCompleted}
                />
                <Label htmlFor="show-completed" className="text-sm font-medium font-mono">Show Completed</Label>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemoveCompleted}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-2 border-border font-mono"
                disabled={data.tasks.filter(t => t.completed).length === 0}
              >
                <Trash2 size={16} className="mr-1" />
                Delete Completed
              </Button>
              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button size="sm" className="brutalist-button">
                    <Plus size={16} className="mr-1" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-2 border-border">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase">Add New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Task description"
                      value={newTask.item}
                      onChange={(e) => setNewTask({ ...newTask, item: e.target.value })}
                      className="brutalist-input"
                    />
                    <Input
                      placeholder="Date (optional)"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                      className="brutalist-input"
                    />
                    <Input
                      type="number"
                      placeholder="Priority (1-30)"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) || 1 })}
                      className="brutalist-input"
                    />
                    <Button onClick={handleAddTask} className="w-full brutalist-button">
                      Add Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background/50 border-2 border-border brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">High Priority</div>
              <div className="text-2xl font-bold text-red-400 font-mono">{highPriorityTasks.length}</div>
              <div className="text-xs text-muted-foreground font-mono">Urgent tasks</div>
            </div>
            <div className="text-center p-4 bg-background/50 border-2 border-border brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">Medium Priority</div>
              <div className="text-2xl font-bold text-yellow-400 font-mono">{mediumPriorityTasks.length}</div>
              <div className="text-xs text-muted-foreground font-mono">Important tasks</div>
            </div>
            <div className="text-center p-4 bg-background/50 border-2 border-border brutalist-card">
              <div className="text-sm text-muted-foreground font-mono uppercase">Low Priority</div>
              <div className="text-2xl font-bold text-green-400 font-mono">{lowPriorityTasks.length}</div>
              <div className="text-xs text-muted-foreground font-mono">Future tasks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Sections */}
      <div className="space-y-6">
        <TaskSection 
          title="High Priority Tasks" 
          tasks={highPriorityTasks} 
          bgColor="bg-red-50" 
          borderColor="border-red-600"
        />
        <TaskSection 
          title="Medium Priority Tasks" 
          tasks={mediumPriorityTasks} 
          bgColor="bg-yellow-50" 
          borderColor="border-yellow-600"
        />
        <TaskSection 
          title="Low Priority Tasks" 
          tasks={lowPriorityTasks} 
          bgColor="bg-green-50" 
          borderColor="border-green-600"
        />
      </div>
    </div>
  );
};
