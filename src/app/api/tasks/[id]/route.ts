import { NextResponse, type NextRequest } from 'next/server';
import { getTaskById, updateTask as updateTaskInStore, deleteTask as deleteTaskInStore } from '@/lib/server-store';
import { taskSchema } from '@/lib/schemas';
import type { Task } from '@/lib/types';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const task = getTaskById(id);
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error(`Error fetching task ${params.id}:`, error);
    return NextResponse.json({ message: 'Error fetching task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Allow partial updates, so use partial schema or handle carefully
    // For simplicity, we'll expect all fields for now, matching taskSchema
    // Or we can use .partial() if the schema is for full object
    const validation = taskSchema.partial().safeParse(body);


    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid task data', errors: validation.error.format() }, { status: 400 });
    }
    
    const taskExists = getTaskById(id);
    if (!taskExists) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    
    // The store function expects data without id, createdAt
    const { title, description, status, priority, dueDate, assignee } = validation.data;
    const taskDataForStore: Partial<Omit<Task, 'id' | 'createdAt'>> = {};

    if (title !== undefined) taskDataForStore.title = title;
    if (description !== undefined) taskDataForStore.description = description;
    if (status !== undefined) taskDataForStore.status = status;
    if (priority !== undefined) taskDataForStore.priority = priority;
    if (dueDate !== undefined) taskDataForStore.dueDate = dueDate === null ? undefined : dueDate;
    if (assignee !== undefined) taskDataForStore.assignee = assignee;


    const updatedTask = updateTaskInStore(id, taskDataForStore);
    if (!updatedTask) {
      // This case should ideally not happen if taskExists check passed
      return NextResponse.json({ message: 'Failed to update task or task not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(`Error updating task ${params.id}:`, error);
    return NextResponse.json({ message: 'Error updating task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const success = deleteTaskInStore(id);
    if (!success) {
      return NextResponse.json({ message: 'Task not found or could not be deleted' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting task ${params.id}:`, error);
    return NextResponse.json({ message: 'Error deleting task' }, { status: 500 });
  }
}
