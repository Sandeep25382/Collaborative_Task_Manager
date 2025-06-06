"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search as SearchIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface RecipeSearchProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export default function RecipeSearch({ searchTerm, setSearchTerm }: RecipeSearchProps) {
  return (
    <div className="mb-6 max-w-md">
      <Label htmlFor="recipe-search" className="sr-only">Search Recipes</Label>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="recipe-search"
          type="search"
          placeholder="Search for recipes by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-base h-12 rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
}
