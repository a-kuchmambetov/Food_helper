import plannerService from "./planner.service.js";

// Get all planned dishes for user
async function getUserPlannedDishes(req, res) {
  try {
    const userId = req.user.user_id;
    const { date } = req.query;

    const plannedDishes = await plannerService.getUserPlannedDishes(
      userId,
      date
    );
    res.status(200).json(plannedDishes);
  } catch (error) {
    console.error("Error getting user planned dishes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get recommended dishes based on criteria
async function getRecommendedDishes(req, res) {
  try {
    const userId = req.user.user_id;
    const {
      meals = ["Breakfast", "Lunch", "Dinner", "Snack"],
      calories = 2000,
      useUserIngredients = false,
    } = req.query;

    const mealTypes = Array.isArray(meals) ? meals : [meals];
    const targetCalories = parseInt(calories);
    const useIngredients = useUserIngredients === "true";

    const recommendedDishes = await plannerService.getRecommendedDishes(
      userId,
      mealTypes,
      targetCalories,
      useIngredients
    );

    res.status(200).json(recommendedDishes);
  } catch (error) {
    console.error("Error getting recommended dishes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add dish to meal plan
async function addDishToPlan(req, res) {
  try {
    const userId = req.user.user_id;
    const { dishId, mealTypeId, date } = req.body;

    if (!dishId || !mealTypeId || !date) {
      return res.status(400).json({
        error: "Dish ID, meal type ID, and date are required",
      });
    }

    const result = await plannerService.addDishToPlan(
      userId,
      dishId,
      mealTypeId,
      date
    );
    res.status(201).json({
      message: "Dish added to meal plan successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error adding dish to plan:", error);
    if (error.message.includes("already exists")) {
      res.status(409).json({ error: "Dish already planned for this meal" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// Remove dish from meal plan
async function removeDishFromPlan(req, res) {
  try {
    const userId = req.user.user_id;
    const { dishId, mealTypeId, date } = req.body;

    if (!dishId || !mealTypeId || !date) {
      return res.status(400).json({
        error: "Dish ID, meal type ID, and date are required",
      });
    }

    const result = await plannerService.removeDishFromPlan(
      userId,
      dishId,
      mealTypeId,
      date
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Planned dish not found" });
    }

    res
      .status(200)
      .json({ message: "Dish removed from meal plan successfully" });
  } catch (error) {
    console.error("Error removing dish from plan:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get available meal types
async function getMealTypes(req, res) {
  try {
    const mealTypes = await plannerService.getMealTypes();
    res.status(200).json(mealTypes);
  } catch (error) {
    console.error("Error getting meal types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  getUserPlannedDishes,
  getRecommendedDishes,
  addDishToPlan,
  removeDishFromPlan,
  getMealTypes,
};
