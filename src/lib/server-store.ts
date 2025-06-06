import type { Task, Status, Priority } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Initial mock data
let tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Implement User Authentication',
    description: 'Set up NextAuth.js with credentials provider.',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // One week from now
    assignee: 'Dev Team Lead',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Design Database Schema',
    description: 'Plan out the tables and relationships for the project.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Backend Team',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated builds and deployments.',
    status: 'Done',
    priority: 'Medium',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Write API Documentation',
    description: 'Document all endpoints using Swagger/OpenAPI.',
    status: 'To Do',
    priority: 'Medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getAllTasks = (): Task[] => tasks;

export const getTaskById = (id: string): Task | undefined => tasks.find(task => task.id === id);

export const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const now = new Date().toISOString();
  const newTask: Task = { 
    ...taskData, 
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | undefined => {
  let updatedTask: Task | undefined;
  const now = new Date().toISOString();
  tasks = tasks.map(task => {
    if (task.id === id) {
      updatedTask = { ...task, ...updates, id, updatedAt: now };
      return updatedTask;
    }
    return task;
  });
  return updatedTask;
};

export const deleteTask = (id: string): boolean => {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  return tasks.length < initialLength;
};
