import invService from "./inventory.service.js";

// Get all ingredients from general inventory
const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await invService.getAllIngredients();
    res.status(200).json({
      data: ingredients,
      message: "Ingredients retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get ingredients owned by user
const getUserIngredients = async (req, res) => {
  console.log(
    "Getting users ingredient from inventory",
    req.body,
    req.user?.user_id
  );
  try {
    const userId = req.user?.user_id; // Assuming user ID comes from auth middleware

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const ingredients = await invService.getUserIngredients(userId);
    res.status(200).json({
      data: ingredients,
      message: "User ingredients retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add ingredient to user inventory
const addIngredientToInventory = async (req, res) => {
  console.log("Adding ingredient to inventory", req.body, req.user?.user_id);
  try {
    const userId = req.user?.user_id; // Assuming user ID comes from auth middleware
    const { ingredient_id, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!ingredient_id || !quantity) {
      return res.status(400).json({
        message: "Ingredient ID and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than zero",
      });
    }

    const result = await invService.addIngredientToInventory(
      userId,
      ingredient_id,
      quantity
    );
    res.status(201).json({
      data: result,
      message: "Ingredient added to inventory successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove an ingredient from user inventory
const removeIngredientFromInventory = async (req, res) => {
  try {
    const userId = req.user?.user_id; // Assuming user ID comes from auth middleware
    const { ingredient_id } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!ingredient_id) {
      return res.status(400).json({
        message: "Ingredient ID is required",
      });
    }

    const result = await invService.removeIngredientFromInventory(
      userId,
      ingredient_id
    );
    res.status(200).json({
      data: result,
      message: "Ingredient removed from inventory successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update the quantity of an ingredient in user inventory

const updateIngredientQuantity = async (req, res) => {
  try {
    const userId = req.user?.user_id; // Assuming user ID comes from auth middleware
    const { ingredient_id, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!ingredient_id || quantity === undefined) {
      return res.status(400).json({
        message: "Ingredient ID and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than zero",
      });
    }

    const result = await invService.updateIngredientQuantity(
      userId,
      ingredient_id,
      quantity
    );
    res.status(200).json({
      data: result,
      message: "Ingredient quantity updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default {
  getAllIngredients,
  getUserIngredients,
  addIngredientToInventory,
  removeIngredientFromInventory,
  updateIngredientQuantity,
};
