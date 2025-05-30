import express from "express";
import dishesController from "./dishes.controller.js";

const router = express.Router();

router.get("/dish/:id", dishesController.getDishById);

// Get a list of all dishes
router.get("/dishes", dishesController.getAllDishes);

router.get("/dishes/limited", dishesController.getDishesLimited);

// Get a list of filters (categories and tastes)
router.get("/dishes/filters", dishesController.getFilters);

// Get all dishes by filters
router.post("/dishes/filters", dishesController.getDishesByFilters);

export default router;
