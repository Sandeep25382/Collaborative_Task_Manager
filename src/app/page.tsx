"use client";

import TaskBoard from "@/components/tasks/TaskBoard";
import TaskForm from "@/components/tasks/TaskForm";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import TaskFilters from "@/components/tasks/TaskFilters";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

export default function TaskManagerPage() {
  const { openTaskForm } = useUIStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-3xl font-semibold text-foreground">Task Board</h1>
        <Button onClick={() => openTaskForm()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Task
        </Button>
      </div>
      
      <TaskFilters />
      <TaskBoard />
      
      {/* Dialogs managed by Zustand store, will render when their open state is true */}
      <TaskForm />
      <DeleteTaskDialog />
    </div>
  );
}
