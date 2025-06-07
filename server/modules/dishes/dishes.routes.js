import express from "express";
import dishesController from "./dishes.controller.js";
import { authenticateToken } from "../../middleware/auth.js";
import { searchRateLimit } from "../../middleware/security.js";

const router = express.Router();

router.get("/dish/:id", authenticateToken, dishesController.getDishById);
router.get("/dishes", authenticateToken, dishesController.getAllDishes);
router.get(
  "/dishes/limited",
  authenticateToken,
  dishesController.getDishesLimited
);

// Search routes with rate limiting
router.get(
  "/dishes/filters",
  authenticateToken,
  searchRateLimit,
  dishesController.getFilters
);
router.post(
  "/dishes/filters",
  authenticateToken,
  searchRateLimit,
  dishesController.getDishesByFilters
);

export default router;
