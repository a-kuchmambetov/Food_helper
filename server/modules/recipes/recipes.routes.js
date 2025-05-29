import express from "express";
import recipesController from "./recipes.controller.js";

const router = express.Router();

// Get a list of all dishes
router.get("/dishes", recipesController.getAllDishes);
router.get("/dishes/limited", recipesController.getDishesLimited);

// Get a list of filters (categories and tastes)
router.get("/dishes/filters", recipesController.getFilters);

// Get all dishes by filters
router.post("/dishes/filters", recipesController.getDishesByFilters);

export default router;
