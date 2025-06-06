"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TASK_STATUSES, TASK_PRIORITIES, type Status, type Priority } from "@/lib/types";
import { useUIStore } from "@/stores/uiStore";
import { Filter, Search } from "lucide-react";

export default function TaskFilters() {
  const { taskFilters, setTaskFilters } = useUIStore();

  const handleStatusChange = (value: string) => {
    setTaskFilters({ status: value === "All" ? "All" : value as Status });
  };

  const handlePriorityChange = (value: string) => {
    setTaskFilters({ priority: value === "All" ? "All" : value as Priority });
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskFilters({ searchTerm: event.target.value });
  };

  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex items-center text-lg font-medium text-primary mr-4">
        <Filter className="h-5 w-5 mr-2" />
        Filters
      </div>
      <div className="grid gap-2 w-full sm:w-auto">
        <Label htmlFor="status-filter" className="sr-only">Status</Label>
        <Select value={taskFilters.status || "All"} onValueChange={handleStatusChange}>
          <SelectTrigger id="status-filter" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {TASK_STATUSES.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 w-full sm:w-auto">
        <Label htmlFor="priority-filter" className="sr-only">Priority</Label>
        <Select value={taskFilters.priority || "All"} onValueChange={handlePriorityChange}>
          <SelectTrigger id="priority-filter" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Priorities</SelectItem>
            {TASK_PRIORITIES.map(priority => (
              <SelectItem key={priority} value={priority}>{priority}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 w-full sm:flex-1 sm:max-w-xs relative">
        <Label htmlFor="search-filter" className="sr-only">Search Tasks</Label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="search-filter"
          type="search"
          placeholder="Search by title..."
          value={taskFilters.searchTerm || ""}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
    </div>
  );
}
