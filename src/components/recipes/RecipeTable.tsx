"use client";

import type { Recipe } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Utensils } from "lucide-react";

interface RecipeTableProps {
  recipes: Recipe[];
}

function formatIngredients(recipe: Recipe): string[] {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
    }
  }
  return ingredients;
}

export default function RecipeTable({ recipes }: RecipeTableProps) {
  if (!recipes || recipes.length === 0) {
    return <p className="text-muted-foreground">No recipes found. Try a different search term.</p>;
  }

  return (
    <div className="rounded-lg border shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] hidden sm:table-cell">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Category / Area</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe.idMeal}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  src={recipe.strMealThumb || 'https://placehold.co/100x100.png'}
                  alt={recipe.strMeal}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                  data-ai-hint="food recipe"
                />
              </TableCell>
              <TableCell className="font-medium font-headline">{recipe.strMeal}</TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {recipe.strCategory && <div>{recipe.strCategory}</div>}
                {recipe.strArea && <div>{recipe.strArea}</div>}
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View Recipe</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl mb-2">{recipe.strMeal}</DialogTitle>
                      <DialogDescription className="flex items-center text-sm text-muted-foreground">
                        <Utensils className="h-4 w-4 mr-2 text-primary"/>
                        {recipe.strCategory && <span>{recipe.strCategory}</span>}
                        {recipe.strArea && <span className="mx-1">•</span>}
                        {recipe.strArea && <span>{recipe.strArea}</span>}
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[calc(90vh-10rem)] pr-4">
                    <div className="grid gap-6 py-4">
                      <div className="flex justify-center">
                        <Image
                          src={recipe.strMealThumb || 'https://placehold.co/400x300.png'}
                          alt={recipe.strMeal}
                          width={400}
                          height={300}
                          className="rounded-lg object-cover shadow-lg"
                           data-ai-hint="food meal"
                        />
                      </div>
                      <div>
                        <h3 className="font-headline text-xl mb-2 text-primary">Ingredients</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {formatIngredients(recipe).map((ing, index) => (
                            <li key={index}>{ing}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-headline text-xl mb-2 text-primary">Instructions</h3>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{recipe.strInstructions}</p>
                      </div>
                      {recipe.strYoutube && (
                        <div>
                          <h3 className="font-headline text-xl mb-2 text-primary">Video Tutorial</h3>
                          <a 
                            href={recipe.strYoutube} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent hover:underline"
                          >
                            Watch on YouTube
                          </a>
                        </div>
                      )}
                      {recipe.strTags && (
                         <div>
                          <h3 className="font-headline text-sm mb-1 text-muted-foreground">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {recipe.strTags.split(',').map(tag => (
                              <span key={tag} className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full">{tag.trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
