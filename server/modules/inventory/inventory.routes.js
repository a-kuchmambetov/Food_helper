import express from "express";
import invController from "./inventory.controller.js";
import { authenticateToken, validateSession } from "../../middleware/auth.js";

const router = express.Router();

// Get all ingridients from general inventory
router.get(
  "/inventory",
  authenticateToken,
  validateSession,
  invController.getAllIngredients
);
// Get ingridient owned by user
router.get(
  "/inventory/user",
  authenticateToken,
  validateSession,
  invController.getUserIngredients
);

// Add ingridient to user inventory
router.post(
  "/inventory/user",
  authenticateToken,
  validateSession,
  invController.addIngredientToInventory
);

export default router;
