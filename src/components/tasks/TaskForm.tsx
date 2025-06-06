"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { taskSchema, type TaskFormData } from "@/lib/schemas";
import type { Task, Status, Priority } from "@/lib/types";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/types";
import { useUIStore } from "@/stores/uiStore";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

async function fetchTaskById(taskId: string): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  return response.json();
}

async function createTask(data: TaskFormData): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create task');
  }
  return response.json();
}

async function updateTask({ id, data }: { id: string; data: Partial<TaskFormData> }): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update task');
  }
  return response.json();
}

export default function TaskForm() {
  const { isTaskFormOpen, closeTaskForm, editingTaskId } = useUIStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: editingTask, isLoading: isLoadingTask, error: taskError } = useQuery<Task, Error>({
    queryKey: ['task', editingTaskId],
    queryFn: () => fetchTaskById(editingTaskId!),
    enabled: !!editingTaskId && isTaskFormOpen,
  });
  
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: undefined,
      assignee: "",
    },
  });

  useEffect(() => {
    if (isTaskFormOpen) {
      if (editingTaskId && editingTask) {
        reset({
          title: editingTask.title,
          description: editingTask.description || "",
          status: editingTask.status,
          priority: editingTask.priority,
          dueDate: editingTask.dueDate ? format(parseISO(editingTask.dueDate), 'yyyy-MM-dd') : undefined,
          assignee: editingTask.assignee || "",
        });
      } else {
        reset({ // Reset to default for new task
          title: "",
          description: "",
          status: "To Do",
          priority: "Medium",
          dueDate: undefined,
          assignee: "",
        });
      }
    }
  }, [isTaskFormOpen, editingTaskId, editingTask, reset]);


  const mutation = useMutation({
    mutationFn: editingTaskId ? (data: TaskFormData) => updateTask({ id: editingTaskId, data }) : createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: editingTaskId ? "Task Updated" : "Task Created",
        description: `Task "${editingTaskId ? editingTask?.title : control._formValues.title}" has been successfully ${editingTaskId ? 'updated' : 'created'}.`,
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const onSubmit = (data: TaskFormData) => {
    // Ensure dueDate is either a valid ISO string or undefined
    const dataToSubmit = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };
    mutation.mutate(dataToSubmit as TaskFormData); // Cast because schema expects string for date, but API might get full Date
  };

  const handleClose = () => {
    reset();
    closeTaskForm();
  };
  
  if (editingTaskId && isLoadingTask) {
    return (
      <Dialog open={isTaskFormOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
           <DialogHeader>
            <DialogTitle>Loading Task...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (editingTaskId && taskError) {
     toast({
        variant: "destructive",
        title: "Error loading task",
        description: taskError.message,
      });
      handleClose(); // Close form on error
      return null;
  }


  return (
    <Dialog open={isTaskFormOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{editingTaskId ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} aria-invalid={errors.title ? "true" : "false"} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? parseISO(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee (Optional)</Label>
              <Input id="assignee" {...register("assignee")} />
              {errors.assignee && <p className="text-sm text-destructive">{errors.assignee.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {(isSubmitting || mutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingTaskId ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
