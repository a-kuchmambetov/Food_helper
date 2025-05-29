import recipesService from "./recipes.service.js";

// Get /dishes
async function getAllDishes(req, res) {
  try {
    const dishes = await recipesService.getAllDishes();
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error getting all dishes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// Get /dishes/limited
async function getDishesLimited(req, res) {
  try {
    const { page = 1, elements = 7 } = req.query;
    const dishes = await recipesService.getDishesLimited(page, elements);
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
    const filters = await recipesService.getFilters();
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
// Get dishes by filters
async function getDishesByFilters(req, res) {
  try {
    const { page = 0, elements = 0 } = req?.query;
    console.log(req.body, page, elements);
    const result = await recipesService.getDishesByFilters(
      req.body,
      page,
      elements
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting filter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  getAllDishes,
  getDishesLimited,
  getFilters,
  getDishesByFilters,
};
