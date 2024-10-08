import React from "react";
import { FaTrash } from "react-icons/fa"; // For the delete icon

export default function FoodTracker({ foodItems, onDeleteFood }) {
  console.log(foodItems);
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Food Tracker</h2>
      {/* Wrapper div with a max height and overflow auto to enable scrolling */}
      <div className="max-h-64 overflow-y-auto p-1">
        {foodItems.length > 0 ? (
          <ul className="space-y-4">
            {foodItems.map((food) => (
              <li
                key={food.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
                <span className="text-gray-700">
                  {food.foodName} - {food.calories} kcal
                </span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDeleteFood(food.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No food items added yet.</p>
        )}
      </div>
    </section>
  );
}
