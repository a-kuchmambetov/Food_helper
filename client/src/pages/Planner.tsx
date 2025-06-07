import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../component/Button";
import MealCard from "../component/MealCard";
import RecommendationCard from "../component/RecommendationCard";
import type {
  MealType,
  PlannedDish,
  RecommendedDish,
  DayPlan,
} from "../types/DbTypes";

function Planner() {
  const { isAuthenticated, makeAuthenticatedRequest } = useAuth();
  const navigate = useNavigate();

  // State management
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [recommendedDishes, setRecommendedDishes] = useState<RecommendedDish[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Recommendation filters
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [targetCalories, setTargetCalories] = useState<number>(2000);
  const [useUserIngredients, setUseUserIngredients] = useState<boolean>(false);
  const [showRecommendations, setShowRecommendations] =
    useState<boolean>(false);

  // Add dish modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<RecommendedDish | null>(
    null
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
      const allMealNames = (response.data || []).map((mt: MealType) => mt.name);
      setSelectedMealTypes(allMealNames);
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
          { method: "GET" }
        );

        const plannedDishes: PlannedDish[] = response.data?.plannedDishes || [];

        // Group dishes by meal type and calculate total calories
        const meals: { [mealType: string]: PlannedDish[] } = {};
        let totalCalories = 0;

        plannedDishes.forEach((dish) => {
          if (!meals[dish.meal_type_name]) {
            meals[dish.meal_type_name] = [];
          }
          meals[dish.meal_type_name].push(dish);
          totalCalories += dish.calories || 0;
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
    [makeAuthenticatedRequest]
  );

  // Fetch recommended dishes
  const fetchRecommendedDishes = async () => {
    try {
      const params = new URLSearchParams({
        meals: selectedMealTypes.join(","),
        calories: targetCalories.toString(),
        useUserIngredients: useUserIngredients.toString(),
      });

      const response = await makeAuthenticatedRequest(
        `/planner/dishes?${params}`,
        { method: "GET" }
      );

      setRecommendedDishes(response.data || []);
    } catch (err) {
      console.error("Failed to fetch recommended dishes:", err);
      setError("Failed to load recommended dishes");
    }
  };
  // Add dish to meal plan
  const addDishToPlan = async (
    dishId: number,
    mealTypeId: number,
    date: string
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
        setError("This dish is already planned for this meal!");
      } else {
        setError("Failed to add dish to meal plan");
      }
    }
  };

  // Remove dish from meal plan
  const removeDishFromPlan = async (
    dishId: number,
    mealTypeId: number,
    date: string
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

  // Handle meal type selection for recommendations
  const handleMealTypeToggle = (mealTypeName: string) => {
    setSelectedMealTypes((prev) =>
      prev.includes(mealTypeName)
        ? prev.filter((mt) => mt !== mealTypeName)
        : [...prev, mealTypeName]
    );
  };

  // Open add dish modal
  const openAddModal = (dish: RecommendedDish) => {
    setSelectedDish(dish);
    setShowAddModal(true);
  };

  // Navigate to dish detail
  const goToDish = (dishId: number) => {
    navigate(`/dish/${dishId}`);
  };
  // Initial data loading
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
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
    navigate,
    selectedDate,
    fetchMealTypes,
    fetchPlannedDishes,
  ]);

  // Handle date change
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    fetchPlannedDishes(newDate);
  };

  // Auto-clear error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your meal planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meal Planner</h1>
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
              className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              title="Select date for meal planning"
            />
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Meal Plan */}
          <div className="xl:col-span-2">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Meal Plan for {new Date(selectedDate).toLocaleDateString()}
                  </h2>
                  <div className="text-sm text-gray-400">
                    Total:{" "}
                    <span className="text-yellow-400 font-semibold">
                      {dayPlan?.totalCalories || 0} calories
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!dayPlan || Object.keys(dayPlan.meals).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-lg">No meals planned for this day</p>
                      <p className="text-sm mt-2">
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
                          key={mealType.meal_type_id}
                          className="border border-zinc-700 rounded-lg"
                        >
                          <div className="bg-zinc-800 px-4 py-3 border-b border-zinc-700">
                            <h3 className="font-semibold text-lg">
                              {mealType.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {mealsForType.length}{" "}
                              {mealsForType.length === 1 ? "dish" : "dishes"} •{" "}
                              {mealsForType.reduce(
                                (sum, dish) => sum + (dish.calories || 0),
                                0
                              )}{" "}
                              calories
                            </p>
                          </div>

                          <div className="p-4">
                            {mealsForType.length === 0 ? (
                              <p className="text-gray-500 text-center py-4">
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
                                        selectedDate
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
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden sticky top-6">
              <div className="px-6 py-4 border-b border-zinc-700">
                <h2 className="text-xl font-semibold">Get Recommendations</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Find dishes that match your preferences
                </p>
              </div>

              <div className="p-6">
                {/* Recommendation Filters */}
                <div className="space-y-4 mb-6">
                  {" "}
                  {/* Target Calories */}
                  <div>
                    <label
                      htmlFor="target-calories"
                      className="block text-sm font-medium mb-2"
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
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      min="500"
                      max="5000"
                      title="Target calories for the day"
                      placeholder="2000"
                    />
                  </div>
                  {/* Meal Types */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Meal Types
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {mealTypes.map((mealType) => (
                        <label
                          key={mealType.meal_type_id}
                          className="flex items-center"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMealTypes.includes(mealType.name)}
                            onChange={() => handleMealTypeToggle(mealType.name)}
                            className="mr-2"
                          />
                          <span className="text-sm">{mealType.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Use User Ingredients */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={useUserIngredients}
                        onChange={(e) =>
                          setUseUserIngredients(e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">
                        Prioritize dishes I can make with my ingredients
                      </span>
                    </label>
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
                    <h3 className="font-semibold mb-4">Recommended Dishes</h3>
                    {recommendedDishes.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No recommendations found. Try adjusting your filters.
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {recommendedDishes.map((dish) => (
                          <RecommendationCard
                            key={dish.dish_id}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">
                Add "{selectedDish.name}" to Plan
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="meal-type-select"
                  className="block text-sm font-medium mb-2"
                >
                  Select Meal Type
                </label>
                <select
                  id="meal-type-select"
                  value={selectedMealTypeForAdd || ""}
                  onChange={(e) =>
                    setSelectedMealTypeForAdd(Number(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  title="Select meal type for this dish"
                >
                  <option value="">Choose a meal type...</option>
                  {mealTypes.map((mealType) => (
                    <option
                      key={mealType.meal_type_id}
                      value={mealType.meal_type_id}
                    >
                      {mealType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (selectedMealTypeForAdd) {
                      addDishToPlan(
                        selectedDish.dish_id,
                        selectedMealTypeForAdd,
                        selectedDate
                      );
                    }
                  }}
                  disabled={!selectedMealTypeForAdd}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded transition-colors"
                >
                  Add to Plan
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedDish(null);
                    setSelectedMealTypeForAdd(null);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors"
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
