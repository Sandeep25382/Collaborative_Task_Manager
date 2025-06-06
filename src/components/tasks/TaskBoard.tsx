"use client";

import { useQuery } from "@tanstack/react-query";
import type { Task, Status } from "@/lib/types";
import { TASK_STATUSES } from "@/lib/types";
import TaskColumn from "./TaskColumn";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, WifiOff } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

async function fetchTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export default function TaskBoard() {
  const { taskFilters } = useUIStore();
  const { data: tasks, isLoading, error, refetch } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const filteredTasks = tasks?.filter(task => {
    const statusMatch = taskFilters.status === 'All' || task.status === taskFilters.status;
    const priorityMatch = taskFilters.priority === 'All' || task.priority === taskFilters.priority;
    const searchTermMatch = !taskFilters.searchTerm || task.title.toLowerCase().includes(taskFilters.searchTerm.toLowerCase());
    return statusMatch && priorityMatch && searchTermMatch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto p-1">
        {TASK_STATUSES.map(status => (
          <div key={status} className="flex-1 min-w-[300px] max-w-md bg-secondary/50 rounded-lg p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-24 w-full mb-2" />
            <Skeleton className="h-24 w-full mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
       <Alert variant="destructive" className="max-w-2xl mx-auto">
        <WifiOff className="h-4 w-4" />
        <AlertTitle className="font-headline">Error Loading Tasks</AlertTitle>
        <AlertDescription>
          Could not fetch tasks from the server. Please check your connection or try again later.
          <p className="mt-2 text-xs">Details: {error.message}</p>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!tasks || tasks.length === 0 && (taskFilters.status === 'All' && taskFilters.priority === 'All' && !taskFilters.searchTerm) ) {
     return (
      <Alert className="max-w-lg mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="font-headline">No Tasks Yet!</AlertTitle>
        <AlertDescription>
          It looks like there are no tasks. Try creating a new task to get started.
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4"> {/* Negative margin to extend scroll area slightly */}
      {TASK_STATUSES.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={filteredTasks.filter((task) => task.status === status)}
        />
      ))}
    </div>
  );
}
