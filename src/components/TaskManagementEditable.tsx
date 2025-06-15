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
    <Card className={`${bgColor} ${borderColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar size={20} />
          {title}
          <Badge variant="outline">{tasks.length} tasks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task: any) => {
          const Icon = iconMap[task.icon] || User;
          return (
            <div key={task.id} className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm ${task.completed ? 'opacity-75' : ''}`}>
              <div className="flex items-center gap-3 flex-1">
                <Icon size={16} className="text-slate-600" />
                <div className="flex-1">
                  <Input
                    value={task.item}
                    onChange={(e) => updateTask(task.id, { item: e.target.value })}
                    className={`border-none p-0 font-medium bg-transparent ${task.completed ? 'line-through text-slate-500' : ''}`}
                  />
                  <Input
                    value={task.date}
                    onChange={(e) => updateTask(task.id, { date: e.target.value })}
                    placeholder="Date"
                    className={`border-none p-0 text-xs text-slate-500 bg-transparent mt-1 ${task.completed ? 'line-through' : ''}`}
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
                    onSave={(value) => updateTask(task.id, { priority: Number(value) })}
                    type="number"
                    className="w-12"
                  />
                </div>
                <Button
                  onClick={() => updateTask(task.id, { completed: !task.completed })}
                  variant={task.completed ? "default" : "outline"}
                  size="sm"
                  className={task.completed ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  ✓
                </Button>
                <Button
                  onClick={() => removeTask(task.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
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
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center justify-between gap-2">
            <span>Task Overview</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={setShowCompleted}
                />
                <Label htmlFor="show-completed" className="text-sm font-medium">Show Completed</Label>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemoveCompleted}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={data.tasks.filter(t => t.completed).length === 0}
              >
                <Trash2 size={16} className="mr-1" />
                Delete Completed
              </Button>
              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus size={16} className="mr-1" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Task description"
                      value={newTask.item}
                      onChange={(e) => setNewTask({ ...newTask, item: e.target.value })}
                    />
                    <Input
                      placeholder="Date (optional)"
                      value={newTask.date}
                      onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Priority (1-30)"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) || 1 })}
                    />
                    <Button onClick={handleAddTask} className="w-full">
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
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">High Priority</div>
              <div className="text-2xl font-bold text-red-600">{highPriorityTasks.length}</div>
              <div className="text-xs text-slate-500">Urgent tasks</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Medium Priority</div>
              <div className="text-2xl font-bold text-yellow-600">{mediumPriorityTasks.length}</div>
              <div className="text-xs text-slate-500">Important tasks</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-slate-600">Low Priority</div>
              <div className="text-2xl font-bold text-green-600">{lowPriorityTasks.length}</div>
              <div className="text-xs text-slate-500">Future tasks</div>
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
          borderColor="border-red-200"
        />
        <TaskSection 
          title="Medium Priority Tasks" 
          tasks={mediumPriorityTasks} 
          bgColor="bg-yellow-50" 
          borderColor="border-yellow-200"
        />
        <TaskSection 
          title="Low Priority Tasks" 
          tasks={lowPriorityTasks} 
          bgColor="bg-green-50" 
          borderColor="border-green-200"
        />
      </div>
    </div>
  );
};
