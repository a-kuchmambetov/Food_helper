import express from "express";
import dishesController from "./dishes.controller.js";
import { authenticateToken } from "../../middleware/auth.js";
import { searchRateLimit } from "../../middleware/security.js";

const router = express.Router();

router.get("/dish/:id", dishesController.getDishById);
router.get("/dishes", dishesController.getAllDishes);
router.get(
  "/dishes/limited",

  dishesController.getDishesLimited
);

// Search routes with rate limiting
router.get("/dishes/filters", searchRateLimit, dishesController.getFilters);
router.post(
  "/dishes/filters",
  searchRateLimit,
  dishesController.getDishesByFilters
);

export default router;
