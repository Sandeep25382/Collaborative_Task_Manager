import { create } from 'zustand';
import type { Status, Priority } from '@/lib/types';

export interface TaskFilters {
  status?: Status | 'All';
  priority?: Priority | 'All';
  searchTerm?: string;
}

interface UIState {
  taskFilters: TaskFilters;
  setTaskFilters: (filters: Partial<TaskFilters>) => void;
  
  isTaskFormOpen: boolean;
  editingTaskId: string | null; // ID of task being edited, or null for new task
  openTaskForm: (taskId?: string) => void;
  closeTaskForm: () => void;
  
  taskToDeleteId: string | null;
  openDeleteConfirm: (taskId: string) => void;
  closeDeleteConfirm: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  taskFilters: { status: 'All', priority: 'All', searchTerm: '' },
  setTaskFilters: (filters) => set((state) => ({ 
    taskFilters: { ...state.taskFilters, ...filters } 
  })),
  
  isTaskFormOpen: false,
  editingTaskId: null,
  openTaskForm: (taskId) => set({ isTaskFormOpen: true, editingTaskId: taskId || null }),
  closeTaskForm: () => set({ isTaskFormOpen: false, editingTaskId: null }),
  
  taskToDeleteId: null,
  openDeleteConfirm: (taskId) => set({ taskToDeleteId: taskId }),
  closeDeleteConfirm: () => set({ taskToDeleteId: null }),
}));
