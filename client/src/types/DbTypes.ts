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
  id: number;
  name: string;
}

export interface PlannedDish {
  user_id: number;
  dish_id: number;
  meal_type_id: number;
  date: string;
  name: string;
  numberOfServings: number;
  cookingTime: number;
  cookingDifficulty: number;
  mealType: string;
  categories: string[];
  tastes: string[];
  totalCalories: number;
}

export interface RecommendedDish {
  id: number;
  name: string;
  description: string;
  cookingTime: number;
  cookingDifficulty: number;
  numberOfServings: number;
  categories: string[];
  tastes: string[];
  totalCalories: number;
}

export interface DayPlan {
  date: string;
  totalCalories: number;
  meals: {
    [mealType: string]: PlannedDish[];
  };
}
