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
