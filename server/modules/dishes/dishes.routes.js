import express from "express";
import dishesController from "./dishes.controller.js";
import { authenticateToken, validateSession } from "../../middleware/auth.js";
import { searchRateLimit } from "../../middleware/security.js";

const router = express.Router();

router.get(
  "/dish/:id",
  authenticateToken,
  validateSession,
  dishesController.getDishById
);
router.get(
  "/dishes",
  authenticateToken,
  validateSession,
  dishesController.getAllDishes
);
router.get(
  "/dishes/limited",
  authenticateToken,
  validateSession,
  dishesController.getDishesLimited
);

// Search routes with rate limiting
router.get(
  "/dishes/filters",
  authenticateToken,
  validateSession,
  searchRateLimit,
  dishesController.getFilters
);
router.post(
  "/dishes/filters",
  authenticateToken,
  validateSession,
  searchRateLimit,
  dishesController.getDishesByFilters
);

export default router;
