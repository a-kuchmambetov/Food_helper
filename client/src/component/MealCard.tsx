import Badge from "./CatalogTable/Badge";
import type { PlannedDish } from "../types/DbTypes";

interface MealCardProps {
  dish: PlannedDish;
  onRemove: (dishId: number, mealTypeId: number) => void;
  onDishClick: (dishId: number) => void;
}

function MealCard({ dish, onRemove, onDishClick }: MealCardProps) {
  return (
    <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4
            className="font-medium text-white cursor-pointer hover:text-blue-400 transition-colors mb-2"
            onClick={() => onDishClick(dish.dish_id)}
          >
            {dish.dish_name}
          </h4>

          <div className="flex flex-wrap gap-2 mb-3">
            {dish.categories?.map((cat, i) => (
              <Badge key={i} text={cat} />
            ))}
            {dish.tastes?.map((taste, i) => (
              <Badge key={i + "taste"} text={taste} />
            ))}
          </div>

          <div className="flex gap-4 text-sm text-gray-400">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {dish.calories} cal
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {dish.cookingTime} min
            </span>
            <span className="flex items-center text-yellow-400">
              {"★".repeat(dish.cookingDifficulty)}
              <span className="text-zinc-500">
                {"☆".repeat(3 - dish.cookingDifficulty)}
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={() => onRemove(dish.dish_id, dish.meal_type_id)}
          className="ml-4 text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-colors"
          title="Remove from plan"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MealCard;
