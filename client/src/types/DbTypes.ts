export interface CatalogData {
  id: number;
  name: string;
  description: string;
  categories: string[];
  tastes: string[];
  cookingTime: number;
  cookingDifficulty: number;
}

export interface FilteredCatalogData {
  totalCount: number;
  data: CatalogData[];
}

export interface DishData extends CatalogData {
  recipe: string;
  ingredients: { name: string; quantity: number }[];
}

export interface Ingredient {
  ingredient_id: number;
  name: string;
  calories: number;
  measure_unit: string;
}

export interface UserInventoryItem {
  ingredient_id: number;
  name: string;
  calories: number;
  measure_unit: string;
  quantity: number;
}

export interface MealType {
  meal_type_id: number;
  name: string;
}

export interface PlannedDish {
  planned_dish_id: number;
  dish_id: number;
  dish_name: string;
  meal_type_id: number;
  meal_type_name: string;
  date: string;
  calories: number;
  categories: string[];
  tastes: string[];
  cookingTime: number;
  cookingDifficulty: number;
}

export interface RecommendedDish {
  dish_id: number;
  name: string;
  description: string;
  calories: number;
  categories: string[];
  tastes: string[];
  cookingTime: number;
  cookingDifficulty: number;
  meal_type_name?: string;
}

export interface DayPlan {
  date: string;
  totalCalories: number;
  meals: {
    [mealType: string]: PlannedDish[];
  };
}
