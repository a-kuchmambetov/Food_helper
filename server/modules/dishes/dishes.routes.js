import express from "express";
import dishesController from "./dishes.controller.js";
import {
  optionalAuth,
  authenticateToken,
  validateSession,
} from "../../middleware/auth.js";
import { searchRateLimit } from "../../middleware/security.js";

const router = express.Router();

// Public routes with optional authentication
router.get("/dish/:id", optionalAuth, dishesController.getDishById);
router.get("/dishes", optionalAuth, dishesController.getAllDishes);
router.get("/dishes/limited", optionalAuth, dishesController.getDishesLimited);

// Search routes with rate limiting
router.get("/dishes/filters", searchRateLimit, dishesController.getFilters);
router.post(
  "/dishes/filters",
  searchRateLimit,
  dishesController.getDishesByFilters
);

export default router;
