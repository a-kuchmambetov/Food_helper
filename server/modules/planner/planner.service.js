import * as db from "../../db/db.js";

// Get user's planned dishes
async function getUserPlannedDishes(userId, date = null) {
  try {
    let query = `
      SELECT 
        pd.user_id,
        pd.dish_id,
        pd.meal_type_id,
        pd.date,
        d.name AS dish_name,
        d.description,
        d.cooking_time AS "cookingTime",
        d.cooking_difficulty AS "cookingDifficulty",
        mt.name AS meal_type,
        ARRAY_AGG(DISTINCT c.name) AS categories,
        ARRAY_AGG(DISTINCT t.name) AS tastes,
        -- Calculate total calories for the dish
        COALESCE(SUM(i.calories * di.quantity), 0) AS total_calories
      FROM PlanedDishes pd
      JOIN Dishes d ON pd.dish_id = d.dish_id
      JOIN MealTypes mt ON pd.meal_type_id = mt.meal_type_id
      LEFT JOIN Categories c ON d.category_id = c.category_id
      LEFT JOIN DishTastes dt ON d.dish_id = dt.dish_id
      LEFT JOIN Tastes t ON dt.taste_id = t.taste_id
      LEFT JOIN DishIngredients di ON d.dish_id = di.dish_id
      LEFT JOIN Ingredients i ON di.ingredient_id = i.ingredient_id
      WHERE pd.user_id = $1
    `;

    const params = [userId];

    if (date) {
      query += ` AND pd.date = $2`;
      params.push(date);
    }

    query += `
      GROUP BY pd.user_id, pd.dish_id, pd.meal_type_id, pd.date, 
               d.name, d.description, d.cooking_time, d.cooking_difficulty, mt.name
      ORDER BY pd.date DESC, mt.meal_type_id, d.name
    `;

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error fetching user planned dishes:", error);
    throw new Error("Database query failed");
  }
}

// Get recommended dishes based on meal types and calories
async function getRecommendedDishes(
  userId,
  mealTypes,
  targetCalories,
  useUserIngredients
) {
  try {
    let baseQuery = `
      SELECT 
        d.dish_id AS id,
        d.name,
        d.description,
        d.cooking_time AS "cookingTime",
        d.cooking_difficulty AS "cookingDifficulty",
        ARRAY_AGG(DISTINCT c.name) AS categories,
        ARRAY_AGG(DISTINCT t.name) AS tastes,
        COALESCE(SUM(i.calories * di.quantity), 0) AS total_calories,
        COUNT(DISTINCT di.ingredient_id) AS total_ingredients
    `;

    if (useUserIngredients) {
      baseQuery += `,
        COUNT(DISTINCT ii.ingredient_id) AS available_ingredients,
        CASE 
          WHEN COUNT(DISTINCT di.ingredient_id) > 0 
          THEN (COUNT(DISTINCT ii.ingredient_id)::float / COUNT(DISTINCT di.ingredient_id) * 100)::int
          ELSE 0
        END AS ingredients_match_percentage
      `;
    }

    baseQuery += `
      FROM Dishes d
      LEFT JOIN Categories c ON d.category_id = c.category_id
      LEFT JOIN DishTastes dt ON d.dish_id = dt.dish_id
      LEFT JOIN Tastes t ON dt.taste_id = t.taste_id
      LEFT JOIN DishIngredients di ON d.dish_id = di.dish_id
      LEFT JOIN Ingredients i ON di.ingredient_id = i.ingredient_id
    `;

    if (useUserIngredients) {
      baseQuery += `
        LEFT JOIN IngredientInventory ii ON di.ingredient_id = ii.ingredient_id 
                                         AND ii.user_id = $1
      `;
    }

    baseQuery += `
      WHERE 1=1
      GROUP BY d.dish_id, d.name, d.description, d.cooking_time, d.cooking_difficulty
      HAVING COALESCE(SUM(i.calories * di.quantity), 0) <= $${
        useUserIngredients ? 2 : 1
      }
    `;

    if (useUserIngredients) {
      baseQuery += `
        ORDER BY ingredients_match_percentage DESC, total_calories ASC
        LIMIT 20
      `;
    } else {
      baseQuery += `
        ORDER BY total_calories ASC
        LIMIT 20
      `;
    }

    const params = useUserIngredients
      ? [userId, targetCalories]
      : [targetCalories];
    const result = await db.query(baseQuery, params);

    return result.rows;
  } catch (error) {
    console.error("Error fetching recommended dishes:", error);
    throw new Error("Database query failed");
  }
}

// Add dish to meal plan
async function addDishToPlan(userId, dishId, mealTypeId, date) {
  try {
    // Check if dish already exists for this user, meal type, and date
    const existingQuery = `
      SELECT 1 FROM PlanedDishes 
      WHERE user_id = $1 AND dish_id = $2 AND meal_type_id = $3 AND date = $4
    `;
    const existing = await db.query(existingQuery, [
      userId,
      dishId,
      mealTypeId,
      date,
    ]);

    if (existing.rows.length > 0) {
      throw new Error(
        "Dish already exists in the meal plan for this date and meal type"
      );
    }

    const query = `
      INSERT INTO PlanedDishes (user_id, dish_id, meal_type_id, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query(query, [userId, dishId, mealTypeId, date]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding dish to plan:", error);
    throw error;
  }
}

// Remove dish from meal plan
async function removeDishFromPlan(userId, dishId, mealTypeId, date) {
  try {
    const query = `
      DELETE FROM PlanedDishes 
      WHERE user_id = $1 AND dish_id = $2 AND meal_type_id = $3 AND date = $4
    `;

    const result = await db.query(query, [userId, dishId, mealTypeId, date]);
    return { affectedRows: result.rowCount };
  } catch (error) {
    console.error("Error removing dish from plan:", error);
    throw new Error("Database query failed");
  }
}

// Get all meal types
async function getMealTypes() {
  try {
    const query = `
      SELECT meal_type_id AS id, name 
      FROM MealTypes 
      ORDER BY meal_type_id
    `;

    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching meal types:", error);
    throw new Error("Database query failed");
  }
}

// Get dishes by meal type (helper function)
async function getDishesByMealType(mealTypeName) {
  try {
    // This is a simplified approach - in a real app you might have
    // more sophisticated logic for categorizing dishes by meal type
    const categoryMap = {
      Breakfast: ["Main Course", "Dessert"],
      Lunch: ["Main Course", "Soup", "Salad"],
      Dinner: ["Main Course", "Soup", "Salad"],
      Snack: ["Appetizer", "Dessert"],
    };

    const categories = categoryMap[mealTypeName] || ["Main Course"];

    const query = `
      SELECT 
        d.dish_id AS id,
        d.name,
        d.description,
        d.cooking_time AS "cookingTime",
        d.cooking_difficulty AS "cookingDifficulty",
        c.name AS category,
        COALESCE(SUM(i.calories * di.quantity), 0) AS total_calories
      FROM Dishes d
      LEFT JOIN Categories c ON d.category_id = c.category_id
      LEFT JOIN DishIngredients di ON d.dish_id = di.dish_id
      LEFT JOIN Ingredients i ON di.ingredient_id = i.ingredient_id
      WHERE c.name = ANY($1)
      GROUP BY d.dish_id, d.name, d.description, d.cooking_time, d.cooking_difficulty, c.name
      ORDER BY total_calories ASC
    `;

    const result = await db.query(query, [categories]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching dishes by meal type:", error);
    throw new Error("Database query failed");
  }
}

export default {
  getUserPlannedDishes,
  getRecommendedDishes,
  addDishToPlan,
  removeDishFromPlan,
  getMealTypes,
  getDishesByMealType,
};
