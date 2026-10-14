"use client";

import type { RecommendedDish } from "../types/DbTypes";
import Badge from "./CatalogTable/Badge";

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
    <div className="rounded-lg border border-zinc-600 bg-zinc-800 p-3 transition-colors hover:bg-zinc-700/50">
      <h4
        className="mb-2 cursor-pointer font-medium text-white transition-colors hover:text-blue-400"
        onClick={() => onDishClick(dish.id)}
      >
        {dish.name}
      </h4>

      {dish.description && (
        <p className="mb-2 line-clamp-2 text-sm text-gray-400">
          {dish.description}
        </p>
      )}

      <div className="mb-2 flex flex-wrap gap-1">
        {dish.categories?.slice(0, 2).map((cat, i) => (
          <Badge key={i} text={cat} />
        ))}
        {dish.tastes?.slice(0, 1).map((taste, i) => (
          <Badge key={i + "taste"} text={taste} />
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center">
          <svg
            className="mr-1 h-3 w-3"
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
            className="mr-1 h-3 w-3"
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
        className="flex w-full items-center justify-center rounded bg-blue-600 py-2 text-sm text-white transition-colors hover:bg-blue-700"
      >
        <svg
          className="mr-1 h-4 w-4"
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
