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
