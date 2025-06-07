import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import Button from "../component/Button";
import type { Ingredient, UserInventoryItem } from "../types/DbTypes";

function Inventory() {
  const { isAuthenticated, makeAuthenticatedRequest } = useAuth();
  const [userInventory, setUserInventory] = useState<UserInventoryItem[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState<string>("");
  const [adding, setAdding] = useState(false);

  // Fetch all available ingredients
  const fetchAllIngredients = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await makeAuthenticatedRequest("/inventory", {
        method: "GET",
      });
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
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add ingredient:", err);
      setError("Failed to add ingredient to inventory");
    } finally {
      setAdding(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Inventory</h1>
            <p className="text-tertiary-600">
              Manage your ingredients and quantities
            </p>
          </div>
          <Button
            label={showAddForm ? "Cancel" : "Add Ingredient"}
            onClick={() => {
              setShowAddForm(!showAddForm);
              setError(null);
              setSelectedIngredient(null);
              setQuantity("");
            }}
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Add Ingredient to Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ingredient-select"
                  className="block text-sm font-medium mb-2"
                >
                  Select Ingredient
                </label>
                <select
                  id="ingredient-select"
                  value={selectedIngredient || ""}
                  onChange={(e) =>
                    setSelectedIngredient(Number(e.target.value) || null)
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose an ingredient...</option>
                  {allIngredients.map((ingredient) => (
                    <option
                      key={ingredient.ingredient_id}
                      value={ingredient.ingredient_id}
                    >
                      {ingredient.name} ({ingredient.measure_unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                label={adding ? "Adding..." : "Add to Inventory"}
                onClick={addIngredientToInventory}
              />
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-700">
            <h2 className="text-xl font-semibold">Current Inventory</h2>
            <p className="text-tertiary-600 text-sm mt-1">
              {userInventory.length}{" "}
              {userInventory.length === 1 ? "ingredient" : "ingredients"} in
              your inventory
            </p>
          </div>

          {userInventory.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-tertiary-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
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
                <p className="text-sm mt-2">
                  Start by adding some ingredients to track your supplies
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary-600 uppercase tracking-wider">
                      Ingredient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary-600 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-tertiary-600 uppercase tracking-wider">
                      Calories (per unit)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {userInventory.map((item) => (
                    <tr
                      key={item.ingredient_id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-mono">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-tertiary-600">
                          {item.measure_unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-tertiary-600">
                          {item.calories}
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
