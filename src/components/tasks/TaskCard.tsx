"use client";

import type { Task, Status } from "@/lib/types";
import { TASK_STATUSES } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Edit3, Trash2, MoreVertical, CalendarDays, User, ArrowDown, Minus, ArrowUp, CheckCircle2, CircleDotDashed, ListChecks, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useUIStore } from "@/stores/uiStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

async function updateTaskStatus( {taskId, status}: {taskId: string; status: Status} ): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update task status');
  }
  return response.json();
}


const priorityIcons = {
  Low: <ArrowDown className="mr-1 h-4 w-4 text-blue-500" />,
  Medium: <Minus className="mr-1 h-4 w-4 text-yellow-500" />,
  High: <ArrowUp className="mr-1 h-4 w-4 text-red-500" />,
};

const priorityBadgeVariant = {
  Low: "outline",
  Medium: "secondary",
  High: "destructive",
} as const;


interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { openTaskForm, openDeleteConfirm } = useUIStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Status Updated",
        description: `Task "${task.title}" status updated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    },
  });

  const handleStatusChange = (newStatus: Status) => {
    mutation.mutate({ taskId: task.id, status: newStatus });
  };

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 bg-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg mb-1">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openTaskForm(task.id)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => openDeleteConfirm(task.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {task.description && <CardDescription className="text-sm text-muted-foreground break-words whitespace-pre-wrap">{task.description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
           <Badge variant={priorityBadgeVariant[task.priority]} className="flex items-center">
            {priorityIcons[task.priority]}
            {task.priority} Priority
          </Badge>
        </div>
        {task.dueDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
            Due: {format(parseISO(task.dueDate), "MMM d, yyyy")}
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-2 h-4 w-4 text-primary" />
            Assigned to: {task.assignee}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t">
         <span className="text-xs text-muted-foreground">
           Updated: {format(parseISO(task.updatedAt), "MMM d, p")}
         </span>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {TASK_STATUSES.map(status => (
                <DropdownMenuItem 
                  key={status} 
                  onClick={() => handleStatusChange(status)}
                  disabled={task.status === status || mutation.isPending}
                  className={cn(task.status === status && "bg-accent text-accent-foreground")}
                >
                  {status === "To Do" && <ListChecks className="mr-2 h-4 w-4" />}
                  {status === "In Progress" && <CircleDotDashed className="mr-2 h-4 w-4" />}
                  {status === "Done" && <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
