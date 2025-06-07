import express from "express";
import invController from "./inventory.controller.js";
import { authenticateToken, validateSession } from "../../middleware/auth.js";

const router = express.Router();

// Get all ingridients from general inventory
router.get("/inventory", authenticateToken, invController.getAllIngredients);
// Get ingridient owned by user
router.get(
  "/inventory/user",
  authenticateToken,
  invController.getUserIngredients
);

// Add ingridient to user inventory
router.post(
  "/inventory/user",
  authenticateToken,
  invController.addIngredientToInventory
);

// Remove ingridient from user inventory
router.delete(
  "/inventory/user",
  authenticateToken,
  invController.removeIngredientFromInventory
);

// Update ingridient in user inventory
router.put(
  "/inventory/user",
  authenticateToken,
  invController.updateIngredientQuantity
);
export default router;
