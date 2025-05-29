import e from "express";
import * as db from "../../db/db.js";

async function getAllDishes() {
  try {
    const result = await db.query("SELECT * FROM dishes");
    return result.rows;
  } catch (error) {
    console.error("Error fetching all dishes:", error);
    throw new Error("Database query failed");
  }
}

async function getDishesLimited(page = 1, elements = 7) {
  try {
    const result = await db.query(
      `SELECT 
        d.dish_id AS id,
        d.name,
        d.description,
        ARRAY_AGG(DISTINCT c.name) AS categories,
        ARRAY_AGG(DISTINCT t.name) AS tastes,
        d.cooking_time AS "cookingTime",
        d.cooking_difficulty AS "cookingDifficulty"
      FROM dishes d
      LEFT JOIN categories c ON d.category_id = c.category_id
      LEFT JOIN dishtastes dt ON d.dish_id = dt.dish_id
      LEFT JOIN tastes t ON dt.taste_id = t.taste_id
      GROUP BY d.dish_id
      ORDER BY d.dish_id
      LIMIT $1 OFFSET $2;`,
      [elements, (page - 1) * elements]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching all dishes:", error);
    throw new Error("Database query failed");
  }
}

async function getAllCategories() {
  try {
    const result = await db.query("SELECT * FROM categories");
    return result.rows;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw new Error("Database query failed");
  }
}

async function getAllTastes() {
  try {
    const result = await db.query("SELECT * FROM tastes");
    return result.rows;
  } catch (error) {
    console.error("Error fetching all filters:", error);
    throw new Error("Database query failed");
  }
}

async function getFilters() {
  try {
    const categories = await getAllCategories();
    const tastes = await getAllTastes();
    return { categories, tastes };
  } catch (error) {
    console.error("Error fetching all filters:", error);
    throw new Error("Database query failed");
  }
}

async function getDishesByFilters(filters, page = 0, elements = 0) {
  let query = `
  SELECT 
    d.dish_id AS id,
    d.name,
    d.description,
    ARRAY_AGG(DISTINCT c.name) AS categories,
    ARRAY_AGG(DISTINCT t.name) AS tastes,
    d.cooking_time AS "cookingTime",
    d.cooking_difficulty AS "cookingDifficulty"
  FROM dishes d
  LEFT JOIN categories c ON d.category_id = c.category_id
  LEFT JOIN dishtastes dt ON d.dish_id = dt.dish_id
  LEFT JOIN tastes t ON dt.taste_id = t.taste_id
  WHERE 1=1
    AND d.name ILIKE '%' || $1 || '%'
    AND (array_length($2::text[], 1) IS NULL OR c.name = ANY($2))
    AND (array_length($3::text[], 1) IS NULL OR t.name = ANY($3))
    AND d.cooking_time <= $4
    AND (array_length($5::int[], 1) IS NULL OR d.cooking_difficulty = ANY($5)) 
  GROUP BY d.dish_id`;
  try {
    const params = Object.values(filters);

    // Add HAVING clause right after GROUP BY
    if (filters?.tastes.length > 0) {
      query += `\nHAVING COUNT(DISTINCT t.name) = ${filters.tastes.length}`;
    }

    // Add ORDER BY, LIMIT, OFFSET after HAVING
    if (page > 0 && elements > 0) {
      query += `\nORDER BY d.dish_id LIMIT ${elements} OFFSET ${
        (page - 1) * elements
      };`;
    }

    const result = await db.query(query, params);

    return result.rows;
  } catch (error) {
    console.error("Error fetching dishes by filters:", error);
    throw new Error("Database query failed");
  }
}

export default {
  getAllDishes,
  getDishesLimited,
  getFilters,
  getDishesByFilters,
};
