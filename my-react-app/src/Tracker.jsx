import React from "react";
import { useState, useEffect, useRef } from "react";
import "./Tracker.css";

function Tracker() {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

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
      // Placeholder for autocomplete logic
      const mockSuggestions = ["Apple", "Apricot", "Appetizer"];
      setSuggestions(
        mockSuggestions
          .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 3)
      );
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFoodName(suggestion);
    setSuggestions([]);
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

  return (
    <div className="calorie-tracker">
      <header>
        <h1>Calorie Tracker</h1>
      </header>

      <main>
        <section className="add-food">
          <h2>Add Food Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group autocomplete">
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
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
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
                justifyContent: "space-between",
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

/*
style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
*/
