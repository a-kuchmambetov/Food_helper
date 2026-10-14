"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Button from "../component/Button";
import Badge from "../component/CatalogTable/Badge";
import { useAuth } from "../contexts/useAuth";
import type { DishData } from "../types/DbTypes";

function Dish() {
  const { id } = useParams<{ id: string }>();
  const [dishData, setDishData] = useState<DishData>({} as DishData);
  const router = useRouter();
  const { makeAuthenticatedRequest } = useAuth();

  const fetchDishData = useCallback(async () => {
    try {
      const response = await makeAuthenticatedRequest(`/dish/${id}`);
      setDishData(response.data as DishData);
      console.log("Fetched dish data:", response.data);
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
    }
  }, [id, makeAuthenticatedRequest]);

  useEffect(() => {
    if (id) {
      fetchDishData();
    }
  }, [fetchDishData, id]);

  function goToDishPage() {
    router.back();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4 text-white">
      <div className="mt-8 w-full max-w-2xl rounded-2xl border border-zinc-700 p-8 shadow-xl">
        <Button label="Go back" onClick={goToDishPage} />
        <h1 className="mb-6 text-center text-3xl font-extrabold tracking-wide text-gray-100">
          {dishData.name}
        </h1>
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {Array.isArray(dishData.categories) &&
            dishData.categories.map((cat, i) => <Badge key={i} text={cat} />)}
          {Array.isArray(dishData.tastes) &&
            dishData.tastes.map((taste, i) => (
              <Badge key={i + "taste"} text={taste} />
            ))}
          <span className="inline-flex items-center rounded-full border-2 border-zinc-600 bg-zinc-700 px-2 py-1 text-xs font-medium text-gray-200">
            {dishData.cookingTime} min
          </span>
          <span className="inline-flex items-center rounded-full border-2 border-zinc-600 bg-zinc-700 px-2 py-1 text-xs font-medium text-yellow-400">
            {[1, 2, 3].map((i) =>
              i <= dishData.cookingDifficulty ? (
                <span key={i}>★</span>
              ) : (
                <span key={i} className="text-zinc-500">
                  ☆
                </span>
              ),
            )}
          </span>
        </div>
        <p className="mb-4 text-center text-base text-gray-300 italic">
          {dishData.description}
        </p>
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-gray-200">Recipe</h2>
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-base leading-relaxed whitespace-pre-line shadow-inner">
            {dishData.recipe &&
              dishData.recipe
                .replace(/(Step \d+:)/g, "\n$1")
                .split("\n")
                .map((line, index) => (
                  <span
                    key={index}
                    className={
                      line.startsWith("Step")
                        ? "font-semibold text-green-200"
                        : ""
                    }
                  >
                    {line}
                    {index > 0 && <br />}
                  </span>
                ))}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-bold text-gray-200">Ingredients</h2>
          <ul className="list-inside list-disc rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-inner">
            {Array.isArray(dishData.ingredients) &&
              dishData.ingredients.map((ingredient, idx) => (
                <li key={idx} className="mb-1 text-base text-gray-100">
                  <span className="font-semibold text-green-200">
                    {ingredient.name}
                  </span>
                  : {ingredient.quantity}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dish;
