import Badge from "./CatalogTable/Badge";
import type { RecommendedDish } from "../types/DbTypes";

interface RecommendationCardProps {
  dish: RecommendedDish;
  onAddToPlan: (dish: RecommendedDish) => void;
  onDishClick: (dishId: number) => void;
}

function RecommendationCard({
  dish,
  onAddToPlan,
  onDishClick,
}: RecommendationCardProps) {
  return (
    <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3 hover:bg-zinc-700/50 transition-colors">
      <h4
        className="font-medium text-white cursor-pointer hover:text-blue-400 transition-colors mb-2"
        onClick={() => onDishClick(dish.id)}
      >
        {dish.name}
      </h4>

      {dish.description && (
        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
          {dish.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        {dish.categories?.slice(0, 2).map((cat, i) => (
          <Badge key={i} text={cat} />
        ))}
        {dish.tastes?.slice(0, 1).map((taste, i) => (
          <Badge key={i + "taste"} text={taste} />
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
        <span className="flex items-center">
          <svg
            className="w-3 h-3 mr-1"
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
          {(dish.totalCalories / dish.numberOfServings).toFixed(0)} cal per
          serving
        </span>
        <span className="flex items-center">
          <svg
            className="w-3 h-3 mr-1"
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

      <button
        onClick={() => onAddToPlan(dish)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition-colors flex items-center justify-center"
      >
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add to Plan
      </button>
    </div>
  );
}

export default RecommendationCard;
