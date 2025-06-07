import express from "express";
import plannerController from "./planner.controller.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = express.Router();

// Get all planed dishes for user
router.get(
  "/planner/user",
  authenticateToken,
  plannerController.getUserPlannedDishes
);

// Get list of all dishes mathing query params for certain whole day
// Get query params:
//  selected meals (breakfast, lunch, etc.); Default: all meals (breakfast, lunch, dinner, snack)
//  custom amount of callories; Default: 2000
//  taking into account user's ingredients; Default: false
router.get(
  "/planner/dishes",
  authenticateToken,
  plannerController.getRecommendedDishes
);

// Add a dish to user's meal plan
router.post("/planner/add", authenticateToken, plannerController.addDishToPlan);

// Remove a dish from user's meal plan
router.delete(
  "/planner/remove",
  authenticateToken,
  plannerController.removeDishFromPlan
);

// Get meal types
router.get(
  "/planner/meal-types",
  authenticateToken,
  plannerController.getMealTypes
);

export default router;
