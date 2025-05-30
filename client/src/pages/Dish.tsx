import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../component/Button";

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
    <div className="flex flex-col items-center justify-start h-full text-white p-4 ">
      <div className="container">
        <Button label="Go back" onClick={goToDishPage} />
        <h1 className="text-2xl font-bold mb-4">{dishData.name}</h1>
        <p className="text-lg mb-2">Category: {dishData.categories}</p>
        <p className="text-lg mb-2">Taste: {dishData.tastes}</p>
        <p className="text-lg mb-2">
          Cooking Time: {dishData.cookingTime} minutes
        </p>
        <p className="text-lg mb-2">
          Cooking Difficulty: {dishData.cookingDifficulty}
        </p>
        <p className="text-lg mb-2">Description: {dishData.description}</p>
        <p className="text-lg mb-2">
          Recipe:{" "}
          {dishData.recipe &&
            dishData.recipe.replace(/(Step \d+:)/g, "\n$1").split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
        </p>
        <div className="text-lg mb-2">
          Ingredients:
          <ul className="list-disc list-inside">
            {Array.isArray(dishData.ingredients) &&
              dishData.ingredients.map((ingredient, idx) => (
                <li key={idx}>
                  {ingredient.name}: {ingredient.quantity}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dish;
