"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../component/Button";
import { useAuth } from "../contexts/useAuth";
import type { Ingredient, UserInventoryItem } from "../types/DbTypes";

function Inventory() {
  const { isAuthenticated, makeAuthenticatedRequest } = useAuth();
  const [userInventory, setUserInventory] = useState<UserInventoryItem[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<number | null>(
    null,
  );
  const [quantity, setQuantity] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all available ingredients
  const fetchAllIngredients = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await makeAuthenticatedRequest("/inventory");
      setAllIngredients(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
      setError("Failed to load ingredients");
    }
  }, [isAuthenticated, makeAuthenticatedRequest]);

  // Fetch user inventory
  const fetchUserInventory = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await makeAuthenticatedRequest("/inventory/user", {
        method: "GET",
      });
      setUserInventory(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch user inventory:", err);
      setError("Failed to load your inventory");
    }
  }, [isAuthenticated, makeAuthenticatedRequest]);
  // Add ingredient to inventory
  const addIngredientToInventory = async () => {
    if (
      !selectedIngredient ||
      !quantity ||
      isNaN(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      setError("Please select an ingredient and enter a valid quantity");
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const response = await makeAuthenticatedRequest("/inventory/user", {
        method: "POST",
        data: {
          ingredient_id: selectedIngredient,
          quantity: Number(quantity),
        },
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }
      fetchUserInventory(); // Refresh inventory after adding
      // Reset form
      setSelectedIngredient(null);
      setQuantity("");
      setSearchTerm("");
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add ingredient:", err);
      setError("Failed to add ingredient to inventory");
    } finally {
      setAdding(false);
    }
  };
  // Update ingredient quantity
  const updateIngredientQuantity = async (ingredientId: number) => {
    if (
      !editQuantity ||
      isNaN(Number(editQuantity)) ||
      Number(editQuantity) <= 0
    ) {
      setError("Please enter a valid quantity");
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      const response = await makeAuthenticatedRequest("/inventory/user", {
        method: "PUT",
        data: {
          ingredient_id: ingredientId,
          quantity: Number(editQuantity),
        },
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      fetchUserInventory(); // Refresh inventory after updating
      setEditingItem(null);
      setEditQuantity("");
    } catch (err) {
      console.error("Failed to update ingredient:", err);
      setError("Failed to update ingredient quantity");
    } finally {
      setUpdating(false);
    }
  };

  // Delete ingredient from inventory
  const deleteIngredientFromInventory = async (ingredientId: number) => {
    setDeleting(ingredientId);
    setError(null);

    try {
      const response = await makeAuthenticatedRequest("/inventory/user", {
        method: "DELETE",
        data: {
          ingredient_id: ingredientId,
        },
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      fetchUserInventory(); // Refresh inventory after deleting
    } catch (err) {
      console.error("Failed to delete ingredient:", err);
      setError("Failed to delete ingredient from inventory");
    } finally {
      setDeleting(null);
    }
  };
  // Calculate total calories
  const totalCalories = userInventory.reduce((total, item) => {
    return total + item.quantity * item.calories;
  }, 0);

  // Filter ingredients based on search term
  const filteredIngredients = allIngredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get selected ingredient name for display
  const selectedIngredientName = selectedIngredient
    ? allIngredients.find((ing) => ing.ingredient_id === selectedIngredient)
        ?.name || ""
    : "";
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserInventory(), fetchAllIngredients()]);
      setLoading(false);
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [fetchAllIngredients, fetchUserInventory, isAuthenticated]);
  // Handle click outside to close form and dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown if clicking outside
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        showDropdown
      ) {
        setShowDropdown(false);
      }

      // Close form if clicking outside
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        showAddForm
      ) {
        setShowAddForm(false);
        setError(null);
        setSelectedIngredient(null);
        setQuantity("");
        setSearchTerm("");
      }
    };

    if (showAddForm || showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddForm, showDropdown]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <p>Loading your inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Your Inventory</h1>
            <p className="text-tertiary">
              Manage your ingredients and quantities
            </p>
          </div>{" "}
          <Button
            label="Add Ingredient"
            onClick={() => {
              if (!showAddForm) {
                setShowAddForm(true);
                setError(null);
                setSelectedIngredient(null);
                setQuantity("");
                setSearchTerm("");
              }
            }}
          />
        </div>
        {error && (
          <div className="mb-6 rounded border border-red-500 bg-red-900/20 px-4 py-3 text-red-200">
            {error}
          </div>
        )}{" "}
        {showAddForm && (
          <div
            ref={formRef}
            className="mb-8 rounded-lg border border-zinc-700 bg-zinc-900 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Add Ingredient to Inventory
              </h2>{" "}
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                  setSelectedIngredient(null);
                  setQuantity("");
                  setSearchTerm("");
                }}
                className="text-tertiary transition-colors hover:text-white"
                aria-label="Close form"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>{" "}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="ingredient-search"
                  className="mb-2 block text-sm font-medium"
                >
                  Select Ingredient
                </label>
                <div className="relative" ref={dropdownRef}>
                  <input
                    id="ingredient-search"
                    type="text"
                    value={searchTerm || selectedIngredientName}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedIngredient(null);
                      setShowDropdown(true);
                    }}
                    onFocus={() => {
                      setShowDropdown(true);
                      setSearchTerm("");
                    }}
                    placeholder="Type to search ingredients..."
                    className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    autoComplete="off"
                  />
                  {showDropdown && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-zinc-600 bg-zinc-800 shadow-lg">
                      {filteredIngredients.length > 0 ? (
                        filteredIngredients.map((ingredient) => (
                          <div
                            key={ingredient.ingredient_id}
                            onClick={() => {
                              setSelectedIngredient(ingredient.ingredient_id);
                              setSearchTerm("");
                              setShowDropdown(false);
                            }}
                            className="cursor-pointer border-b border-zinc-700 px-3 py-2 text-white last:border-b-0 hover:bg-zinc-700"
                          >
                            <div className="font-medium">{ingredient.name}</div>
                            <div className="text-sm text-tertiary">
                              Unit: {ingredient.measure_unit} •{" "}
                              {ingredient.calories} cal/unit
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-tertiary">
                          No ingredients found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>{" "}
            <div className="mt-4 flex items-center justify-between">
              <Button
                label={adding ? "Adding..." : "Add to Inventory"}
                onClick={addIngredientToInventory}
              />
              <span className="text-xs text-tertiary">
                Click outside to close
              </span>
            </div>
          </div>
        )}
        <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
          {" "}
          <div className="border-b border-zinc-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Current Inventory</h2>
                <p className="mt-1 text-sm text-tertiary">
                  {userInventory.length}{" "}
                  {userInventory.length === 1 ? "ingredient" : "ingredients"} in
                  your inventory
                </p>
              </div>
              {userInventory.length > 0 && (
                <div className="text-right">
                  <div className="text-lg font-semibold text-emerald-600">
                    Total: {totalCalories.toFixed(1)} calories
                  </div>
                  <div className="text-sm text-tertiary">
                    Combined caloric value
                  </div>
                </div>
              )}
            </div>
          </div>
          {userInventory.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-4 text-tertiary">
                <svg
                  className="mx-auto mb-4 h-16 w-16 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-lg">Your inventory is empty</p>
                <p className="mt-2 text-sm">
                  Start by adding some ingredients to track your supplies
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-tertiary uppercase">
                      Ingredient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-tertiary uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-tertiary uppercase">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-tertiary uppercase">
                      Calories (per unit)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-tertiary uppercase">
                      Total Calories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-tertiary uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {userInventory.map((item) => (
                    <tr
                      key={item.ingredient_id}
                      className="transition-colors hover:bg-zinc-800/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingItem === item.ingredient_id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              className="w-24 rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-sm text-white"
                              aria-label="Edit quantity"
                            />
                            <button
                              onClick={() =>
                                updateIngredientQuantity(item.ingredient_id)
                              }
                              disabled={updating}
                              className="text-sm text-green-400 hover:text-green-300"
                            >
                              {updating ? "..." : "✓"}
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(null);
                                setEditQuantity("");
                              }}
                              className="text-sm text-red-400 hover:text-red-300"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="font-mono text-sm text-white">
                            {item.quantity}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-tertiary">
                          {item.measure_unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-tertiary">
                          {item.calories}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-emerald-600">
                          {(item.quantity * item.calories).toFixed(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {editingItem === item.ingredient_id ? null : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingItem(item.ingredient_id);
                                  setEditQuantity(item.quantity.toString());
                                }}
                                className="rounded border border-blue-400 px-2 py-1 text-sm text-blue-400 transition-colors hover:border-blue-300 hover:text-blue-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  deleteIngredientFromInventory(
                                    item.ingredient_id,
                                  )
                                }
                                disabled={deleting === item.ingredient_id}
                                className="rounded border border-red-400 px-2 py-1 text-sm text-red-400 transition-colors hover:border-red-300 hover:text-red-300 disabled:opacity-50"
                              >
                                {deleting === item.ingredient_id
                                  ? "..."
                                  : "Delete"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
