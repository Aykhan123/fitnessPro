import React, { useState, useEffect } from "react";

export default function AddFood({ onAddFood }) {
  const [foodName, setFoodName] = useState("");
  const [suggestions, setSuggestions] = useState(["food", "foood"]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch food suggestions from an API
  const fetchFoodSuggestions = async (query) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      // Example fetch call (replace with your actual API)
      const response = await fetch(
        `https://api.example.com/foods?search=${query}`
      );
      const data = await response.json();
      // Assuming the API returns a list of food items
      setSuggestions(data.items || []);
    } catch (error) {
      console.error("Error fetching food suggestions:", error);
    }
    setIsLoading(false);
  };

  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const query = e.target.value;
    setFoodName(query);
    fetchFoodSuggestions(query); // Fetch suggestions based on user input
  };

  // Handle when a food suggestion is clicked
  const handleSuggestionClick = (suggestion) => {
    onAddFood(suggestion.name); // Pass the selected suggestion to the parent
    setFoodName(""); // Clear the input field
    setSuggestions([]); // Clear suggestions
  };

  const handleAddFood = () => {
    if (foodName.trim()) {
      onAddFood(foodName); // Pass the food name back to parent
      setFoodName(""); // Clear input field
      setSuggestions([]); // Clear suggestions
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md relative">
      <h2 className="text-xl font-semibold mb-4">Add Food</h2>
      <input
        type="text"
        value={foodName}
        onChange={handleInputChange}
        placeholder="Search for food..."
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
      {isLoading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name} ({suggestion.calories} kcal)
            </li>
          ))}
        </ul>
      )}
      <button
        className="w-full mt-4 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-500"
        onClick={handleAddFood}
      >
        Add to Tracker
      </button>
    </section>
  );
}
