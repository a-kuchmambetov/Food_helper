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
        d.name AS name,
        d.number_of_servings AS "numberOfServings",
        d.cooking_time AS "cookingTime",
        d.cooking_difficulty AS "cookingDifficulty",
        mt.name AS "mealType",
        ARRAY_AGG(DISTINCT c.name) AS categories,
        ARRAY_AGG(DISTINCT t.name) AS tastes,
        -- Calculate total calories for the dish
        COALESCE(SUM(i.calories * di.quantity), 0) AS "totalCalories"
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
               d.name, d.number_of_servings, d.cooking_time, d.cooking_difficulty, mt.name, mt.meal_type_id
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
  targetCalories,
  useUserIngredients
) {
  try {
    // Build parameter list and figure out which $-placeholder to use
    const params = useUserIngredients
      ? [userId, targetCalories]
      : [targetCalories];
    const calorieParam = useUserIngredients ? 2 : 1;

    // 1) Base SELECT: add caloriesPerServing
    let sql = `
      SELECT
        d.dish_id            AS id,
        d.name,
        d.description,
        d.cooking_time       AS "cookingTime",
        d.cooking_difficulty AS "cookingDifficulty",
        d.number_of_servings AS "numberOfServings",
        ARRAY_AGG(DISTINCT c.name) AS categories,
        ARRAY_AGG(DISTINCT t.name) AS tastes,
        -- total calories for the whole recipe
        COALESCE(SUM(i.calories * di.quantity), 0) AS "totalCalories",
        -- calories _per serving_
        CASE
          WHEN d.number_of_servings > 0
          THEN COALESCE(SUM(i.calories * di.quantity), 0) / d.number_of_servings
          ELSE 0
        END AS "caloriesPerServing",
        COUNT(DISTINCT di.ingredient_id) AS total_ingredients
    `;

    // 1.a) If using user’s pantry, include match %
    if (useUserIngredients) {
      sql += `,
        COUNT(DISTINCT ii.ingredient_id) AS available_ingredients,
        CASE
          WHEN COUNT(DISTINCT di.ingredient_id) > 0
          THEN (COUNT(DISTINCT ii.ingredient_id)::float
                 / COUNT(DISTINCT di.ingredient_id) * 100)::int
          ELSE 0
        END AS ingredients_match_percentage
      `;
    }

    // 2) Joins
    sql += `
      FROM Dishes d
      LEFT JOIN Categories c        ON d.category_id   = c.category_id
      LEFT JOIN DishTastes dt       ON d.dish_id       = dt.dish_id
      LEFT JOIN Tastes t            ON dt.taste_id     = t.taste_id
      LEFT JOIN DishIngredients di  ON d.dish_id       = di.dish_id
      LEFT JOIN Ingredients i       ON di.ingredient_id = i.ingredient_id
    `;

    if (useUserIngredients) {
      sql += `
        LEFT JOIN IngredientInventory ii
          ON ii.ingredient_id = di.ingredient_id
         AND ii.user_id       = $1
      `;
    }

    // 3) Group, filter on caloriesPerServing, and order
    sql += `
      GROUP BY
        d.dish_id,
        d.name,
        d.description,
        d.cooking_time,
        d.cooking_difficulty,
        d.number_of_servings
      HAVING
        -- keep only those whose per-serving calories ≤ targetCalories
        (CASE
           WHEN d.number_of_servings > 0
           THEN SUM(i.calories * di.quantity) / d.number_of_servings
           ELSE 0
         END) <= $${calorieParam}
      ORDER BY
    `;

    if (useUserIngredients) {
      sql += `ingredients_match_percentage DESC, "caloriesPerServing" ASC`;
    } else {
      sql += `"caloriesPerServing" ASC`;
    }

    // 4) **NO** LIMIT → returns _all_ matching dishes
    const result = await db.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error("Error fetching recommended dishes:", error);
    throw new Error("Database query failed");
  }
}

// Add dish to meal plan
async function addDishToPlan(userId, dishId, mealTypeId, date) {
  try {
    // Check if any dish already exists for this user, meal type, and date
    const existingQuery = `
      SELECT d.name FROM PlanedDishes pd
      JOIN Dishes d ON pd.dish_id = d.dish_id
      WHERE pd.user_id = $1 AND pd.meal_type_id = $2 AND pd.date = $3
    `;
    const existing = await db.query(existingQuery, [userId, mealTypeId, date]);

    if (existing.rows.length > 0) {
      throw new Error(
        `A dish "${existing.rows[0].name}" is already planned for this meal type. Please remove it first to add a new dish.`
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
