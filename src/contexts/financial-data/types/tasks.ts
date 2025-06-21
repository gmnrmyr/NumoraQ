
export interface Task {
  id: string;
  // Legacy fields for backward compatibility
  item: string;
  date: string;
  priority: number;
  icon: string;
  completed: boolean;
  // New enhanced fields
  title?: string;
  description?: string;
  category?: 'goal' | 'asset' | 'finance' | 'personal';
  dueDate?: string;
}

// Alias for backward compatibility
export type TaskItem = Task;
