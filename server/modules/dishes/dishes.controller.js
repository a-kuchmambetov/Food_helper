import dishesService from "./dishes.service.js";

// Get /dishes
async function getAllDishes(req, res) {
  try {
    const dishes = await dishesService.getAllDishes();
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error getting all dishes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// Get dishes by id
async function getDishById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Dish ID is required" });
    }
    const dishes = await dishesService.getDishById(id);
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error getting dish by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// Get /dishes/limited
async function getDishesLimited(req, res) {
  try {
    const { page = 1, elements = 7 } = req.query;
    const dishes = await dishesService.getDishesLimited(page, elements);
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error getting all dishes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// Get /dishes/filters
// Get the "filters" from the database to be used in the frontend
async function getFilters(req, res) {
  try {
    const filters = await dishesService.getFilters();
    const { categories, tastes } = filters;
    const result = {
      categories: categories.map((category) => category.name),
      tastes: tastes.map((taste) => taste.name),
    };
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting filter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// Post /dishes/filters
// Post filters to get all matched dishes
async function getDishesByFilters(req, res) {
  try {
    const { page = 0, elements = 0, includeCount = false } = req?.query;
    console.log(req.body, page, elements, includeCount);
    const result = await dishesService.getDishesByFilters(
      req.body,
      page,
      elements,
      includeCount === "true" ? true : false
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting filter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  getAllDishes,
  getDishById,
  getDishesLimited,
  getFilters,
  getDishesByFilters,
};
