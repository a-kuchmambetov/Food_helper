"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../component/Button";
import MealCard from "../component/MealCard";
import RecommendationCard from "../component/RecommendationCard";
import { useAuth } from "../contexts/useAuth";
import type {
  DayPlan,
  MealType,
  PlannedDish,
  RecommendedDish,
} from "../types/DbTypes";

function Planner() {
  const { isAuthenticated, makeAuthenticatedRequest } = useAuth();
  const router = useRouter();

  // State management
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [recommendedDishes, setRecommendedDishes] = useState<RecommendedDish[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Recommendation filters
  // const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [targetCalories, setTargetCalories] = useState<number>(2000);
  // const [useUserIngredients, setUseUserIngredients] = useState<boolean>(false);
  const [showRecommendations, setShowRecommendations] =
    useState<boolean>(false);

  // Add dish modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<RecommendedDish | null>(
    null,
  );
  const [selectedMealTypeForAdd, setSelectedMealTypeForAdd] = useState<
    number | null
  >(null);
  // Fetch meal types
  const fetchMealTypes = useCallback(async () => {
    try {
      const response = await makeAuthenticatedRequest("/planner/meal-types", {
        method: "GET",
      });
      setMealTypes(response.data || []);

      // Initialize selected meal types with all available types
      // const allMealNames = (response.data || []).map((mt: MealType) => mt.name);
      // setSelectedMealTypes(allMealNames);
    } catch (err) {
      console.error("Failed to fetch meal types:", err);
      setError("Failed to load meal types");
    }
  }, [makeAuthenticatedRequest]);

  // Fetch user's planned dishes for the selected date
  const fetchPlannedDishes = useCallback(
    async (date: string) => {
      try {
        const response = await makeAuthenticatedRequest(
          `/planner/user?date=${date}`,
        );

        const plannedDishes: PlannedDish[] = response.data || [];

        // Group dishes by meal type and calculate total calories
        const meals: { [mealType: string]: PlannedDish[] } = {};
        let totalCalories = 0;

        plannedDishes.forEach((dish) => {
          if (!meals[dish.mealType]) {
            meals[dish.mealType] = [];
          }
          meals[dish.mealType].push(dish);
          totalCalories += dish.totalCalories / dish.numberOfServings || 0;
        });

        setDayPlan({
          date,
          totalCalories,
          meals,
        });
      } catch (err) {
        console.error("Failed to fetch planned dishes:", err);
        setError("Failed to load your meal plan");
      }
    },
    [makeAuthenticatedRequest],
  );

  // Fetch recommended dishes
  const fetchRecommendedDishes = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        calories: (
          targetCalories -
          (dayPlan?.totalCalories || 0) +
          100
        ).toString(),
      });

      const response = await makeAuthenticatedRequest(
        `/planner/dishes?${params}`,
        { method: "GET" },
      );

      setRecommendedDishes(response.data || []);
    } catch (err) {
      console.error("Failed to fetch recommended dishes:", err);
      setError("Failed to load recommended dishes");
    }
  }, [dayPlan?.totalCalories, makeAuthenticatedRequest, targetCalories]);

  // Add dish to meal plan
  const addDishToPlan = async (
    dishId: number,
    mealTypeId: number,
    date: string,
  ) => {
    try {
      await makeAuthenticatedRequest("/planner/add", {
        method: "POST",
        data: {
          dishId,
          mealTypeId,
          date,
        },
      });

      setSuccess("Dish added to your meal plan!");
      setShowAddModal(false);
      setSelectedDish(null);
      setSelectedMealTypeForAdd(null);

      // Refresh the plan
      await fetchPlannedDishes(selectedDate);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      console.error("Failed to add dish to plan:", err);
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "status" in err.response &&
        err.response.status === 409
      ) {
        // Get the error message from the server response
        const errorMessage =
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "error" in err.response.data &&
          typeof err.response.data.error === "string"
            ? err.response.data.error
            : "Only one dish per meal type is allowed!";
        setError(errorMessage);
      } else {
        setError("Failed to add dish to meal plan");
      }
    }
  };

  // Remove dish from meal plan
  const removeDishFromPlan = async (
    dishId: number,
    mealTypeId: number,
    date: string,
  ) => {
    try {
      await makeAuthenticatedRequest("/planner/remove", {
        method: "DELETE",
        data: {
          dishId,
          mealTypeId,
          date,
        },
      });

      setSuccess("Dish removed from your meal plan!");

      // Refresh the plan
      await fetchPlannedDishes(selectedDate);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to remove dish from plan:", err);
      setError("Failed to remove dish from meal plan");
    }
  };

  // Open add dish modal
  const openAddModal = (dish: RecommendedDish) => {
    setSelectedDish(dish);
    setShowAddModal(true);
  };

  // Navigate to dish detail
  const goToDish = (dishId: number) => {
    router.push(`/dish/${dishId}`);
  };
  // Initial data loading
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchMealTypes(), fetchPlannedDishes(selectedDate)]);
      setLoading(false);
    };

    loadInitialData();
  }, [
    isAuthenticated,
    router,
    selectedDate,
    fetchMealTypes,
    fetchPlannedDishes,
  ]);

  // Handle date change
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    fetchPlannedDishes(newDate);
  };

  useEffect(() => {
    fetchRecommendedDishes();
  }, [dayPlan?.totalCalories, fetchRecommendedDishes]);

  // Auto-clear error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <p>Loading your meal planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Meal Planner</h1>
            <p className="text-gray-400">
              Plan your meals and track your nutrition
            </p>
          </div>
          {/* Date selector */}
          <div className="flex items-center gap-4">
            <label htmlFor="date-selector" className="text-sm font-medium">
              Select Date:
            </label>
            <input
              id="date-selector"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              title="Select date for meal planning"
            />
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 rounded border border-red-500 bg-red-900/20 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded border border-green-500 bg-green-900/20 px-4 py-3 text-green-200">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Main Meal Plan */}
          <div className="xl:col-span-2">
            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
              <div className="border-b border-zinc-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Meal Plan for {new Date(selectedDate).toLocaleDateString()}
                  </h2>
                  <div className="text-sm text-gray-400">
                    Total:{" "}
                    <span className="font-semibold text-yellow-400">
                      {(dayPlan?.totalCalories || 0).toFixed(0)} calories
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!dayPlan || Object.keys(dayPlan.meals).length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mb-4 text-gray-500">
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-lg">No meals planned for this day</p>
                      <p className="mt-2 text-sm">
                        Start by getting some dish recommendations and adding
                        them to your plan
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mealTypes.map((mealType) => {
                      const mealsForType = dayPlan.meals[mealType.name] || [];
                      return (
                        <div
                          key={mealType.id}
                          className="rounded-lg border border-zinc-700"
                        >
                          {" "}
                          <div className="border-b border-zinc-700 bg-zinc-800 px-4 py-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">
                                {mealType.name}
                              </h3>
                              {mealsForType.length > 0 && (
                                <span className="rounded-full bg-green-600 px-2 py-1 text-xs text-green-100">
                                  ✓ Planned
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {mealsForType.length > 0 ? (
                                <>
                                  1 dish •{" "}
                                  {mealsForType
                                    .reduce(
                                      (sum, dish) =>
                                        sum +
                                        (dish.totalCalories /
                                          dish.numberOfServings || 0),
                                      0,
                                    )
                                    .toFixed(0)}{" "}
                                  calories
                                </>
                              ) : (
                                "No dish planned"
                              )}
                            </p>
                          </div>
                          <div className="p-4">
                            {mealsForType.length === 0 ? (
                              <p className="py-4 text-center text-gray-500">
                                No dishes planned for{" "}
                                {mealType.name.toLowerCase()}
                              </p>
                            ) : (
                              <div className="grid gap-4">
                                {mealsForType.map((dish) => (
                                  <MealCard
                                    key={`${dish.dish_id}-${dish.meal_type_id}`}
                                    dish={dish}
                                    onRemove={(dishId, mealTypeId) =>
                                      removeDishFromPlan(
                                        dishId,
                                        mealTypeId,
                                        selectedDate,
                                      )
                                    }
                                    onDishClick={goToDish}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
              <div className="border-b border-zinc-700 px-6 py-4">
                <h2 className="text-xl font-semibold">Get Recommendations</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Find dishes that match your preferences
                </p>
              </div>

              <div className="p-6">
                {/* Recommendation Filters */}
                <div className="mb-6 space-y-4">
                  {" "}
                  {/* Target Calories */}
                  <div>
                    <label
                      htmlFor="target-calories"
                      className="mb-2 block text-sm font-medium"
                    >
                      Target Calories for Day
                    </label>
                    <input
                      id="target-calories"
                      type="number"
                      value={targetCalories}
                      onChange={(e) =>
                        setTargetCalories(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                      min="500"
                      max="5000"
                      title="Target calories for the day"
                      placeholder="2000"
                    />
                  </div>
                </div>

                {/* Get Recommendations Button */}
                <Button
                  label={
                    showRecommendations
                      ? "Refresh Recommendations"
                      : "Get Recommendations"
                  }
                  onClick={() => {
                    setShowRecommendations(true);
                    fetchRecommendedDishes();
                  }}
                />

                {/* Recommended Dishes */}
                {showRecommendations && (
                  <div className="mt-6">
                    <h3 className="mb-4 font-semibold">Recommended Dishes</h3>
                    {recommendedDishes.length === 0 ? (
                      <p className="py-4 text-center text-gray-500">
                        No recommendations found. Try adjusting your filters.
                      </p>
                    ) : (
                      <div className="max-h-96 space-y-3 overflow-y-auto">
                        {recommendedDishes.map((dish) => (
                          <RecommendationCard
                            key={dish.id}
                            dish={dish}
                            onAddToPlan={openAddModal}
                            onDishClick={goToDish}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Dish Modal */}
        {showAddModal && selectedDish && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6">
              <h3 className="mb-4 text-xl font-semibold">
                Add "{selectedDish.name}" to Plan
              </h3>{" "}
              <div className="mb-4">
                <label
                  htmlFor="meal-type-select"
                  className="mb-2 block text-sm font-medium"
                >
                  Select Meal Type
                </label>
                <select
                  id="meal-type-select"
                  value={selectedMealTypeForAdd || ""}
                  onChange={(e) =>
                    setSelectedMealTypeForAdd(Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  title="Select meal type for this dish"
                >
                  <option value="">Choose a meal type...</option>{" "}
                  {mealTypes.map((mealType) => {
                    const hasExistingDish =
                      (dayPlan?.meals?.[mealType.name]?.length ?? 0) > 0;
                    return (
                      <option
                        key={mealType.id}
                        value={mealType.id}
                        disabled={hasExistingDish}
                      >
                        {mealType.name}
                        {hasExistingDish ? " (Already has a dish)" : ""}
                      </option>
                    );
                  })}
                </select>
                {/* Warning message for disabled options */}
                <p className="mt-2 text-sm text-yellow-400">
                  Note: Each meal type can only have one dish. Remove existing
                  dishes to add new ones.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (selectedMealTypeForAdd) {
                      addDishToPlan(
                        selectedDish.id,
                        selectedMealTypeForAdd,
                        selectedDate,
                      );
                    }
                  }}
                  disabled={!selectedMealTypeForAdd}
                  className="flex-1 rounded bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-600"
                >
                  Add to Plan
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedDish(null);
                    setSelectedMealTypeForAdd(null);
                  }}
                  className="flex-1 rounded bg-gray-600 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Planner;
