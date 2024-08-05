import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import Modal from "react-modal";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

Modal.setAppElement("#root");

const User = () => {
  const units = {
    calcium: "mg",
    calories: "kcal",
    carbohydrate: "g",
    cholesterol: "mg",
    fat: "g",
    fiber: "g",
    iron: "mg",
    monounsaturated_fat: "g",
    polyunsaturated_fat: "g",
    potassium: "mg",
    protein: "g",
    saturated_fat: "g",
    sodium: "mg",
    sugar: "g",
    vitamin_a: "IU",
    vitamin_c: "mg",
  };

  const options = Object.keys(units).map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
    value: key,
  }));

  const [selectedNutrients, setSelectedNutrients] = useState([
    "calories",
    "protein",
    "sugar",
    "sodium",
  ]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [nutritionalData, setNutritionData] = useState({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://127.0.0.1:8000/get_nutrition_data",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
              "X-CSRFToken": await getCsrfToken(),
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setNutritionData(data);
        } else {
          console.error("Failed to fetch nutritional data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChecklistChange = (e) => {
    const value = e.target.value;
    setSelectedNutrients((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const chartData = {
    labels: selectedNutrients.map(
      (nutrient) => options.find((option) => option.value === nutrient).label
    ),
    datasets: [
      {
        label: "Daily Intake",
        data: selectedNutrients.map(
          (nutrient) => nutritionalData[nutrient] || 0
        ),
        backgroundColor: selectedNutrients.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 0.5)`
        ),
        borderColor: selectedNutrients.map(
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 1)`
        ),
        borderWidth: 1,
      },
    ],
  };

  const totalNutrition = Object.values(nutritionalData).reduce(
    (acc, value) => acc + value,
    0
  );

  const weeklyData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Weekly Progress",
        data: [90, 85, 75, 80, 70, 95, 100],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Nutrition Tracker</h1>

      <div style={{ width: "80%", marginBottom: "20px" }}>
        <h2>Weekly Progress</h2>
        <Bar
          data={weeklyData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "Percentage of Daily Goal Met",
                },
              },
            },
          }}
        />
      </div>

      <button onClick={() => setModalIsOpen(true)}>
        Select Nutritional Values
      </button>
      <div style={{ display: "flex", width: "80%" }}>
        <div style={{ flex: 2 }}>
          <h2>Nutrition Chart</h2>
          <Pie
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const percentage = (
                        (context.raw / totalNutrition) *
                        100
                      ).toFixed(2);
                      return `${context.label}: ${percentage}% (${context.raw}${
                        units[context.label.toLowerCase().replace(/ /g, "_")]
                      })`;
                    },
                  },
                },
              },
            }}
          />
        </div>

        <div style={{ flex: 1, marginLeft: "20px" }}>
          <h2>Selected Nutrition Values</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {selectedNutrients.length > 0 ? (
              selectedNutrients.map((nutrient) => (
                <li key={nutrient} style={{ marginBottom: "10px" }}>
                  <strong>
                    {options.find((option) => option.value === nutrient).label}:
                  </strong>{" "}
                  {nutritionalData[nutrient]} {units[nutrient]}
                </li>
              ))
            ) : (
              <li>No nutrients selected</li>
            )}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Select Nutritional Values"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            backgroundColor: "#333",
            color: "white",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "500px",
            margin: "auto",
          },
        }}
      >
        <h2>Select Nutritional Values</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {options.map((option) => (
            <li key={option.value} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedNutrients.includes(option.value)}
                  onChange={handleChecklistChange}
                  style={{ marginRight: "10px" }}
                />
                {option.label}
              </label>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setModalIsOpen(false)}
          style={{ marginTop: "10px" }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default User;
