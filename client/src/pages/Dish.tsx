import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../component/Button";
import Badge from "../component/CatalogTable/Badge";

import type { DishData } from "../types/DbTypes";

async function GetDishDataFromDB(id: string): Promise<DishData> {
  const API_URL = import.meta.env.VITE_API_URL;
  return axios({
    method: "get",
    url: `${API_URL}/dish/${id}`,
  })
    .then((response) => {
      if (response.status === 200) return response.data;
      throw new Error("Failed to fetch dish data from the server");
    })
    .catch((error) => {
      console.error("Error fetching dish data:", error);
      return null; // Return null on error
    });
}

function Dish() {
  const { id } = useParams();
  const [dishData, setDishData] = useState<DishData>({} as DishData);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      GetDishDataFromDB(id).then(setDishData);
    }
  }, [id]);

  function goToDishPage() {
    navigate(`/`);
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen text-white p-4">
      <div className="w-full max-w-2xl rounded-2xl shadow-xl p-8 mt-8 border border-zinc-700">
        <Button label="Go back" onClick={goToDishPage} />
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-100 tracking-wide">
          {dishData.name}
        </h1>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {Array.isArray(dishData.categories) &&
            dishData.categories.map((cat, i) => <Badge key={i} text={cat} />)}
          {Array.isArray(dishData.tastes) &&
            dishData.tastes.map((taste, i) => (
              <Badge key={i + "taste"} text={taste} />
            ))}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-200 bg-zinc-700 border-2 border-zinc-600">
            {dishData.cookingTime} min
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-yellow-400 bg-zinc-700 border-2 border-zinc-600">
            {[1, 2, 3].map((i) =>
              i <= dishData.cookingDifficulty ? (
                <span key={i}>★</span>
              ) : (
                <span key={i} className="text-zinc-500">
                  ☆
                </span>
              )
            )}
          </span>
        </div>
        <p className="text-base mb-4 text-gray-300 italic text-center">
          {dishData.description}
        </p>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-200">Recipe</h2>
          <div className="bg-zinc-900 rounded-lg p-4 text-base leading-relaxed whitespace-pre-line shadow-inner border border-zinc-700">
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
                    <br />
                  </span>
                ))}
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-gray-200">Ingredients</h2>
          <ul className="list-disc list-inside bg-zinc-900 rounded-lg p-4 shadow-inner border border-zinc-700">
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
