"use client";

import type { Task, Status } from "@/lib/types";
import TaskCard from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, CircleDotDashed, ListChecks } from "lucide-react";

interface TaskColumnProps {
  status: Status;
  tasks: Task[];
}

const statusIcons = {
  "To Do": <ListChecks className="mr-2 h-5 w-5 text-blue-500" />,
  "In Progress": <CircleDotDashed className="mr-2 h-5 w-5 text-yellow-500 animate-pulse" />,
  "Done": <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />,
};

export default function TaskColumn({ status, tasks }: TaskColumnProps) {
  return (
    <div className="flex-1 min-w-[300px] max-w-md bg-secondary/50 rounded-lg p-4 shadow">
      <div className="flex items-center mb-4">
        {statusIcons[status]}
        <h2 className="font-headline text-xl font-semibold text-foreground">{status} ({tasks.length})</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-20rem)] pr-3"> {/* Adjust height as needed */}
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks in this status.</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </ScrollArea>
    </div>
  );
}
