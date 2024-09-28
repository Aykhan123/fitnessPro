import React, { useState, useEffect, useRef } from "react";

export default function AddFood({ onAddFood }) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
      const csrfToken = await getCsrfToken();

      const response = await fetch("http://127.0.0.1:8000/fatsecret_request", {
        method: "POST",
        headers: { "X-CSRFToken": csrfToken },
        credentials: "include",
        body: JSON.stringify(query),
      });
      const data = await response.json();
      console.log(data);
      // Assuming the API returns a list of food items
      const fetchedFoods = data.foods.food || []; // Assuming `data.foods.food` contains an array
      // console.log(fetchedFoods, query);

      // Filter results to include only those that start with the query
      const filteredSuggestions = fetchedFoods.filter((food) =>
        food.food_name.toLowerCase().startsWith(query.toLowerCase())
      );

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching food suggestions:", error);
    }
    setIsLoading(false);
  };

  const inputRef = useRef(null);

  const getCsrfToken = async () => {
    const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
      method: "GET",
      credentials: "include",
    });
    const result = await request.json();
    return result.csrf;
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const query = e.target.value;
    setFoodName(query);
    fetchFoodSuggestions(query); // Fetch suggestions based on user input
  };

  // Handle when a food suggestion is clicked
  const handleSuggestionClick = (suggestion) => {
    const caloriesPart = suggestion.food_description.split("|")[0];
    const calories = caloriesPart.match(/Calories: (\d+)/)[1];
    console.log(foodName, foodName.trim());
    onAddFood(suggestion.food_name, calories); // Pass the selected suggestion to the parent
    setFoodName(""); // Clear the input field
    setSuggestions([]); // Clear suggestions
  };

  const handleAddFood = () => {
    console.log(foodName, foodName.trim());
    if (foodName.trim()) {
      onAddFood(foodName, cal); // Pass the food name back to parent
      setFoodName(""); // Clear input field
      setSuggestions([]); // Clear suggestions
    }
  };

  return (
    <section
      className="bg-white p-6 rounded-lg shadow-md relative"
      ref={inputRef}
    >
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
          {suggestions.map((suggestion, index) => {
            const delimiter = "|";
            const caloriesPart = suggestion.food_description.includes(delimiter)
              ? suggestion.food_description.split("|")[0]
              : "";
            const calories = caloriesPart.match(/Calories: (\d+)/)[1];
            return (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.food_name} ({calories} kcal)
              </li>
            );
          })}
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
