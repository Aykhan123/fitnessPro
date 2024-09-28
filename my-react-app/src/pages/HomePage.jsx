import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Footer from "../components/Footer";
import AddFood from "../components/AddFood";
import FoodTracker from "../components/FoodTracker";
import NutritionPieChart from "../components/PieChart";

export default function HomePage() {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState(false); // Second modal state
  const [caloriesConsumed, setCaloriesConsumed] = useState(1200); // Example value
  const [calorieGoal, setCalorieGoal] = useState(2000); // Example value
  const [recommendedCalories, setRecommendedCalories] = useState(null); // Store recommended calories
  const [foodItems, setFoodItems] = useState([]); // New state for food items
  const [nextId, setNextId] = useState(1);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    activity_level: "",
    target_weight: "",
  });

  const progressPercentage = calorieGoal
    ? (caloriesConsumed / calorieGoal) * 100
    : 0;

  useEffect(() => {
    // Check if user is a first-time user
    const firstTime = true; // Replace with actual logic
    if (firstTime) {
      setIsFirstTimeUser(true);
      setIsModalOpen(true);
    }
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const saveCalorieGoal = async () => {
    if (Object.values(formData).every((field) => field.trim() !== "")) {
      const token = localStorage.getItem("token");

      // Fetch CSRF token
      const getCsrfToken = async () => {
        const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
          method: "GET",
          credentials: "include",
        });
        const result = await request.json();
        return result.csrf;
      };

      // Post user data and get recommendations
      const response = await fetch(
        "http://127.0.0.1:8000/calculate_recommendation",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
            "X-CSRFToken": await getCsrfToken(),
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // setCalorieGoal(Math.round(data.recommended_calories));
        setRecommendedCalories(Math.round(data.recommended_calories));

        // Close the first modal and open the second modal
        setIsModalOpen(false);
        setIsRecommendationModalOpen(true); // Open the recommendation modal
      }
    }
  };

  // Save Recommended Calories As Goal

  const saveRecommendedCalories = () => {
    setCalorieGoal(recommendedCalories);
  };

  // Fetch calorie recommendations in the second modal
  useEffect(() => {
    const fetchRecommendation = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/get_recommendation", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // setRecommendedCalories(Math.round(data.recommended_calories));
      } else {
        console.error("Error fetching recommendations:", response.statusText);
      }
    };

    if (isRecommendationModalOpen) {
      fetchRecommendation(); // Fetch the recommendation only when the second modal opens
    }
  }, [isRecommendationModalOpen]);

  const handleAddFood = (foodName, calories) => {
    // Add the food item to the foodItems list or update accordingly
    setFoodItems((prevItems) => [
      { id: nextId, name: foodName, calories: calories },
      ...prevItems,
    ]);

    setNextId(nextId + 1);
  };

  const handleDeleteFood = (id) => {
    setFoodItems((prevItems) => prevItems.filter((food) => food.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col mt-3">
      <main className="container mx-auto px-4 py-8 flex-grow mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Daily Calorie Progress
            </h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    {caloriesConsumed} / {calorieGoal} kcal
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: progressPercentage }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {caloriesConsumed} calories consumed out of {calorieGoal}
              </p>
            </div>
          </section>

          <AddFood onAddFood={handleAddFood} />

          <section className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-full h-full p-4">
                <NutritionPieChart />
              </div>
            </div>
          </section>

          <FoodTracker foodItems={foodItems} onDeleteFood={handleDeleteFood} />
        </div>
      </main>

      {/* First Modal for User Information */}
      {isFirstTimeUser && (
        <Transition appear show={isModalOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsModalOpen(false)}
          >
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Enter Your Information
                    </Dialog.Title>
                    <div className="mt-2">
                      <form>
                        {/* Form fields for gender, age, weight, height, etc. */}
                        <div className="mt-4">
                          <label
                            htmlFor="gender"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Gender
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="age"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Age
                          </label>
                          <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="weight"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Weight (lbs)
                          </label>
                          <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="height"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Height (inches)
                          </label>
                          <input
                            type="number"
                            id="height"
                            name="height"
                            value={formData.height}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="activity_level"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Activity Level
                          </label>
                          <select
                            id="activity_level"
                            name="activity_level"
                            value={formData.activity_level}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Select Activity Level</option>
                            <option value="sedentary">Sedentary</option>
                            <option value="light">Lightly Active</option>
                            <option value="moderate">Moderately Active</option>
                            <option value="active">Active</option>
                          </select>
                        </div>

                        <div className="mt-4">
                          <label
                            htmlFor="target_weight"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Target Weight (lbs)
                          </label>
                          <input
                            type="number"
                            id="target_weight"
                            name="target_weight"
                            value={formData.target_weight}
                            onChange={handleFormChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </form>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={saveCalorieGoal}
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Goal
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* Second Modal for Calorie Recommendation */}
      <Transition appear show={isRecommendationModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsRecommendationModalOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Calorie Recommendation:
                  </Dialog.Title>
                  <div className="mt-2">
                    {recommendedCalories !== null ? (
                      <p className="text-lg">
                        Your recommended daily calorie intake is:{" "}
                        <strong>{recommendedCalories} kcal</strong>
                      </p>
                    ) : (
                      <p>Loading recommendations...</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center mt-4">
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRecommendationModalOpen(false),
                            saveRecommendedCalories();
                        }}
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Recommendation As Goal
                      </button>
                    </div>
                    <div
                      className="my-4 text-center"
                      style={{ paddingTop: "10px" }}
                    >
                      <strong>OR</strong>
                    </div>

                    {/* Input Form for Setting Own Goal */}
                    <div className="mt-1 flex justify-center w-full">
                      <label htmlFor="ownGoal" className="sr-only">
                        Set Your Own Goal (calories)
                      </label>
                      <input
                        type="number"
                        id="ownGoal"
                        className="block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Set A Personal Goal"
                      />
                    </div>
                    <div className="mt-4">
                      {" "}
                      {/* Add margin top for spacing */}
                      <button
                        type="button"
                        onClick={() => setIsRecommendationModalOpen(false)}
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Set Your Own Goal
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Footer />
    </div>
  );
}
