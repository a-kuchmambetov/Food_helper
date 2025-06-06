import * as db from "../../db/db.js";

//Get all ingridients from general inventory
const getAllIngredients = async () => {
  try {
    const query = `
            SELECT 
                i.ingredient_id,
                i.name,
                i.calories,
                mu.name as measure_unit
            FROM Ingredients i
            JOIN MeasureUnits mu ON i.measure_unit_id = mu.measure_unit_id
            ORDER BY i.name
        `;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to get all ingredients: ${error.message}`);
  }
};

//Get ingridient owned by user
const getUserIngredients = async (userId) => {
  try {
    const query = `
            SELECT 
                i.ingredient_id,
                i.name,
                i.calories,
                mu.name as measure_unit,
                ii.quantity
            FROM IngredientInventory ii
            JOIN Ingredients i ON ii.ingredient_id = i.ingredient_id
            JOIN MeasureUnits mu ON i.measure_unit_id = mu.measure_unit_id
            WHERE ii.user_id = $1
            ORDER BY i.name
        `;
    const result = await db.query(query, [userId]);
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to get user ingredients: ${error.message}`);
  }
};

// Add ingridient to user inventory
const addIngredientToInventory = async (userId, ingredientId, quantity) => {
  try {
    const query = `
            INSERT INTO IngredientInventory (user_id, ingredient_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, ingredient_id)
            DO UPDATE SET quantity = IngredientInventory.quantity + EXCLUDED.quantity
            RETURNING *
        `;
    const result = await db.query(query, [userId, ingredientId, quantity]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to add ingredient to inventory: ${error.message}`);
  }
};

export default {
  getAllIngredients,
  getUserIngredients,
  addIngredientToInventory,
};
