"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Recipe, MealDBResponse } from "@/lib/types";
import RecipeSearch from "@/components/recipes/RecipeSearch";
import RecipeTable from "@/components/recipes/RecipeTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff, ChefHat } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";


async function fetchRecipes(searchTerm: string): Promise<Recipe[]> {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: MealDBResponse = await response.json();
  return data.meals || []; // API returns null if no meals found
}

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: recipes, isLoading, error, isFetching } = useQuery<Recipe[], Error>({
    queryKey: ['recipes', debouncedSearchTerm],
    queryFn: () => fetchRecipes(debouncedSearchTerm),
    placeholderData: (prevData) => prevData, // Keep previous data while fetching new
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-headline text-3xl font-semibold text-foreground">Recipe Finder</h1>
        <p className="text-muted-foreground">
          Discover delicious recipes from around the world. Start by typing a recipe name below.
        </p>
      </header>
      
      <RecipeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading && !recipes && ( // Show initial loading skeleton
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      )}
      
      {isFetching && recipes && ( // Show subtle loading indicator when refetching with existing data
         <p className="text-sm text-muted-foreground flex items-center"><ChefHat className="h-4 w-4 mr-2 animate-pulse"/>Searching for recipes...</p>
      )}

      {error && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertTitle className="font-headline">Error Loading Recipes</AlertTitle>
          <AlertDescription>
            Could not fetch recipes. Please check your connection or try again later.
            <p className="mt-2 text-xs">Details: {error.message}</p>
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && recipes && (
        <RecipeTable recipes={recipes} />
      )}
      
      {!isLoading && !error && recipes && recipes.length === 0 && debouncedSearchTerm !== "" && (
         <Alert>
            <ChefHat className="h-4 w-4" />
            <AlertTitle className="font-headline">No Recipes Found</AlertTitle>
            <AlertDescription>
              We couldn't find any recipes matching "{debouncedSearchTerm}". Try a different search term.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
