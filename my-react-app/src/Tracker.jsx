import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Tracker.css";

function Tracker() {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [foodSearch, setFoodSearch] = useState("");
  const [foodData, setFoodData] = useState([]);
  const [foodIdSearch, setFoodIdSearch] = useState([]);
  const inputRef = useRef(null);

  let csrfToken = null;
  const getCsrfToken = async () => {
    const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
      method: "GET",
      credentials: "include",
    });
    let result = await request.json();
    csrfToken = result.csrf;
    return csrfToken;
  };

  const handleFoodSearch = async () => {
    fetch("http://127.0.0.1:8000/fatsecret_request", {
      method: "POST",
      headers: {
        "X-CSRFToken": await getCsrfToken(),
      },
      credentials: "include",
      body: JSON.stringify(foodSearch),
    })
      .then((response) => response.json())
      .then((data) => setFoodData(data.foods.food));
  };

  const handleFoodIdSearch = async (food_id) => {
    fetch("http://127.0.0.1:8000/fatsecret_get", {
      method: "POST",
      headers: {
        "X-CSRFToken": await getCsrfToken(),
      },
      credentials: "include",
      body: JSON.stringify(food_id),
    })
      .then((response) => response.json())
      .then((data) => setFoodIdSearch(data.food.servings.serving[0]));
    console.log(foodIdSearch);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (foodName && calories) {
      console.log("Yes");
      setFoodList([...foodList, { foodName, calories }]);
      setFoodName("");
      setCalories("");
      setSuggestions([]);
    }
  };

  const handleFoodNameChange = (e) => {
    const value = e.target.value;
    setFoodName(value);
    if (value.length === 0) {
      setSuggestions([]);
    } else {
      setFoodSearch(value);
      console.log(value);
      setSuggestions(
        foodData
          .filter((item) =>
            item.food_name.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 20) // Limit number of suggestions displayed
      );
    }
  };

  const handleSuggestionClick = async (food_id) => {
    setFoodName(suggestions.find((item) => item.food_id === food_id).food_name);
    setSuggestions([]);
    await handleFoodIdSearch(food_id);
    setCalories(foodIdSearch.calories);
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

  useEffect(() => {
    console.log("Food Name:", foodName);
    console.log("Selected Food ID:", foodIdSearch);
    console.log("Calories:", calories);

    if (foodName.length > 1) {
      handleFoodSearch();
      console.log(foodData);
    }
  }, [foodName, foodIdSearch]);

  return (
    <div className="calorie-tracker">
      <header>
        <h1>Calorie Tracker</h1>
      </header>

      <main>
        <section className="add-food">
          <h2>Add Food Item</h2>
          <form onSubmit={handleSubmit}>
            <div
              className="form-group autocomplete"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <label htmlFor="food-name">Food Name:</label>
              <input
                type="text"
                id="food-name"
                placeholder="Enter food name"
                value={foodName}
                onChange={handleFoodNameChange}
              />
              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.food_id)}
                    >
                      {suggestion.food_name}
                      {suggestion.brand_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
              className="form-group"
            >
              <label htmlFor="calories">Calories:</label>
              <input
                type="number"
                id="calories"
                placeholder="Enter calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <button type="submit">Add</button>
          </form>
        </section>

        <section className="food-list">
          <h2>Food List</h2>
          <ul>
            {foodList.length === 0 ? (
              <li>No food items added yet</li>
            ) : (
              foodList.map((item, index) => (
                <li key={index}>
                  {item.foodName} - {item.calories} calories
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="summary">
          <h2>Summary</h2>
          <p>
            Total Calories:{" "}
            {foodList.reduce((total, item) => total + Number(item.calories), 0)}
          </p>
        </section>
      </main>
    </div>
  );
}

export default Tracker;
