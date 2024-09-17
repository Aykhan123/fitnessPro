import React from "react";
import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Footer from "../components/Footer";
import AddFood from "../components/AddFood";
import FoodTracker from "../components/FoodTracker";
import NutritionPieChart from "../components/PieChart";
export default function HomePage() {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caloriesConsumed, setCaloriesConsumed] = useState(1200); // Example value
  const [calorieGoal, setCalorieGoal] = useState(2000); // Example value
  const [foodItems, setFoodItems] = useState([]); // New state for food items

  const progressPercentage = calorieGoal
    ? (caloriesConsumed / calorieGoal) * 100
    : 0;
  useEffect(() => {
    // Logic to check if the user is a first-time user, this can be an API call or checking localStorage
    const firstTime = true; // Replace with actual logic to check first-time user
    if (firstTime) {
      setIsFirstTimeUser(true);
      setIsModalOpen(true);
    }
  }, []);

  const handleCalorieGoal = (e) => {
    setCalorieGoal(e.target.value);
  };

  const saveCalorieGoal = () => {
    if (calorieGoal) {
      setIsModalOpen(false); // Close the modal after setting the goal
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Update the user's profile to indicate that they've completed the first-time setup
  };

  const handleAddFood = (foodName) => {
    // Add the food item to the foodItems list or update accordingly
    setFoodItems((prevItems) => [
      ...prevItems,
      { name: foodName, calories: 100 },
    ]); // Example with 100 calories per food
  };

  const handleDeleteFood = () => {
    setFoodItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col mt-3">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Progress Bar Section */}
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

          {/* Add Food Section (Now a component) */}
          <AddFood onAddFood={handleAddFood} />

          {/* Pie Chart Placeholder */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            {/* <h2 className="text-xl font-semibold mb-4">Nutrient Breakdown</h2> */}
            <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center">
              {/* <p className="text-gray-500">Pie chart will go here</p> */}
              <div className="w-full h-full p-4">
                <NutritionPieChart />
              </div>
            </div>
          </section>

          <FoodTracker foodItems={foodItems} onDeleteFood={handleDeleteFood} />

          {/* Additional Ideas */}
          <section className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">
                  Logged 300 kcal from Chicken Breast
                </span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">
                  Added a new goal: 50g of protein
                </span>
                <span className="text-sm text-gray-500">1 day ago</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
      {isFirstTimeUser && (
        <Transition appear show={isModalOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                      Set Your Goals
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Welcome to FitnessPro! Let's set your fitness goals to
                        get started.
                      </p>
                      {/* Add form inputs for setting goals here */}
                      <form>
                        <div className="mt-4">
                          <label
                            htmlFor="calories"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Daily Calorie Goal
                          </label>
                          <input
                            type="number"
                            onChange={handleCalorieGoal}
                            name="calories"
                            id="calories"
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="e.g. 2000"
                          />
                        </div>
                      </form>

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={saveCalorieGoal}
                        >
                          Save Goals
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
