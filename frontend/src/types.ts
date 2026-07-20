export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  projectId: string;
  projectName: string;
  categoryId?: string;
  categoryName?: string;
  storyPoints: number;
  milestones: Milestone[];
  comments: Comment[];
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string; // Tailwind hex or class name
  progress: number;
  status: 'planning' | 'active' | 'review' | 'completed';
  dueDate: string;
  category: string;
  stakeholders: {
    name: string;
    avatar: string;
    role: string;
  }[];
  pulseFeed: {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
  }[];
}

export interface AppSettings {
  theme: 'obsidian' | 'slate' | 'light';
  accentColor: string; // e.g., 'blue', 'purple', 'emerald', 'amber', 'rose'
  glassmorphism: boolean;
  density: 'compact' | 'standard' | 'cozy';
  soundEffects: boolean;
  smartTransitions: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  streakDays: number;
  productivityScore: number;
  weeklyTaskCount: number[]; // Array of 7 numbers representing completed tasks per day of current week
  productivityTrend: number; // Percentage change vs last week
  level: number;
  xp: number;
  nextLevelXp: number;
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export interface Notification {
  id: string;
  type: 'due_today' | 'overdue' | 'completed' | 'project_update';
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  duration?: string; // e.g. "1h"
  type: 'task' | 'meeting' | 'milestone' | 'focus';
  color: string;
  taskId?: string;
  description?: string;
}
