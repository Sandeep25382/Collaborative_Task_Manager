import { NextResponse, type NextRequest } from 'next/server';
import { getAllTasks, createTask as createTaskInStore } from '@/lib/server-store';
import { taskSchema } from '@/lib/schemas';
import type { Task } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const tasks = getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = taskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid task data', errors: validation.error.format() }, { status: 400 });
    }

    // The store function expects data without id, createdAt, updatedAt
    const { title, description, status, priority, dueDate, assignee } = validation.data;
    const taskDataForStore: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || undefined, // Ensure undefined if null or empty
      assignee,
    };
    
    const newTask = createTaskInStore(taskDataForStore);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
  }
}
