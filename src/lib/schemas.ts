import { z } from 'zod';
import { TASK_STATUSES, TASK_PRIORITIES } from './types';

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100, { message: "Title must be 100 characters or less" }),
  description: z.string().max(500, { message: "Description must be 500 characters or less" }).optional(),
  status: z.enum(TASK_STATUSES, { required_error: "Status is required" }),
  priority: z.enum(TASK_PRIORITIES, { required_error: "Priority is required" }),
  dueDate: z.string().optional().nullable().refine(val => {
    if (!val) return true;
    // Basic ISO date format check, can be more robust
    return !isNaN(Date.parse(val));
  }, { message: "Invalid date format" }),
  assignee: z.string().max(50, { message: "Assignee name must be 50 characters or less" }).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
