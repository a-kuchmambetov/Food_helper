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

async function getDishesById(id) {
  try {
    const result = await db.query(
      `SELECT 
        d.dish_id AS id,
        d.name,
        d.description,
        ARRAY_AGG(DISTINCT c.name) AS categories,
        ARRAY_AGG(DISTINCT t.name) AS tastes,
        d.cooking_time AS "cookingTime",
        d.cooking_difficulty AS "cookingDifficulty", 
        r.instructions AS "recipe", 
        ARRAY_AGG(DISTINCT jsonb_build_object('name', i.name, 'quantity', di.quantity)) AS ingredients
      FROM dishes d
      LEFT JOIN categories c ON d.category_id = c.category_id
      LEFT JOIN dishtastes dt ON d.dish_id = dt.dish_id
      LEFT JOIN tastes t ON dt.taste_id = t.taste_id
      LEFT JOIN recipes r ON d.dish_id = r.dish_id
      LEFT JOIN dishingredients di ON d.dish_id = di.dish_id
      LEFT JOIN ingredients i ON di.ingredient_id = i.ingredient_id
      WHERE d.dish_id = $1
      GROUP BY d.dish_id, r.instructions;`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching dish by ID:", error);
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

async function getDishesByFilters(
  filters,
  page = 1,
  elements = 10,
  includeCount = false
) {
  // Creating request params WHERE/GROUP BY/HAVING (to avoid SQL injection)
  const baseParams = [
    filters.dishName || "",
    filters.categories?.length > 0 ? filters.categories : null,
    filters.tastes?.length > 0 ? filters.tastes : null,
    filters.cookingTime ?? 9999,
    filters.cookingDifficulty?.length > 0 ? filters.cookingDifficulty : null,
  ];

  // If we need number of dishes adding SELECT COUNT(*) OVER()
  const countSqlPart = includeCount ? `COUNT(*) OVER() AS total_count,` : "";

  const query = `
    SELECT
      ${countSqlPart}
      d.dish_id   AS id,
      d.name,
      d.description,
      ARRAY_AGG(DISTINCT c.name) AS categories,
      ARRAY_AGG(DISTINCT t.name) AS tastes,
      d.cooking_time       AS "cookingTime",
      d.cooking_difficulty AS "cookingDifficulty"
    FROM dishes d
    LEFT JOIN categories c  ON d.category_id = c.category_id
    LEFT JOIN dishtastes dt ON d.dish_id = dt.dish_id
    LEFT JOIN tastes t      ON dt.taste_id = t.taste_id
    WHERE 1=1
      AND d.name ILIKE '%' || $1 || '%'
      AND (array_length($2::text[],1) IS NULL OR c.name = ANY($2))
      AND (array_length($3::text[],1) IS NULL OR t.name = ANY($3))
      AND d.cooking_time <= $4
      AND (array_length($5::int[],1) IS NULL OR d.cooking_difficulty = ANY($5))
    GROUP BY d.dish_id
    ${
      filters.tastes?.length > 0
        ? "HAVING COUNT(DISTINCT t.name) = array_length($3::text[],1)"
        : ""
    }
    ORDER BY d.dish_id
    LIMIT  $6 OFFSET $7;
  `;

  const params = baseParams.concat([elements, (page - 1) * elements]);

  const result = await db.query(query, params);
  // If includeCount = true, each row will have total_count
  if (includeCount) {
    const totalCount =
      result.rowCount === 0 ? 0 : parseInt(result.rows[0].total_count, 10);
    // Deleting total_count from EACH row
    const dishes = result.rows.map((r) => {
      const { total_count, ...rest } = r;
      return rest;
    });
    return { totalCount, dishes };
  } else {
    return { dishes: result.rows };
  }
}

export default {
  getAllDishes,
  getDishesLimited,
  getDishById: getDishesById,
  getFilters,
  getDishesByFilters,
};
