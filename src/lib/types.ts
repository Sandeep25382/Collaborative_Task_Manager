export const TASK_STATUSES = ["To Do", "In Progress", "Done"] as const;
export type Status = typeof TASK_STATUSES[number];

export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export type Priority = typeof TASK_PRIORITIES[number];

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: string; // Store as ISO string, handle Date object in UI
  assignee?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string; // URL to image
  strTags?: string;
  strYoutube?: string;
  // Ingredients and Measures (strIngredient1-20, strMeasure1-20)
  [key: string]: string | undefined | null; // For dynamic ingredient/measure access
}

export interface MealDBResponse {
  meals: Recipe[] | null;
}
