import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Modal from "react-modal";

ChartJS.register(ArcElement, Tooltip, Legend);

Modal.setAppElement("#root");

const NutritionPieChart = () => {
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
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal for selecting values
  const [nutritionalData, setNutritionData] = useState({});
  const [totalNutrition, setTotalNutrition] = useState(0);

  const getCsrfToken = async () => {
    const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
      method: "GET",
      credentials: "include",
    });
    const result = await request.json();
    return result.csrf;
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

          const total = Object.values(data).reduce(
            (acc, value) => acc + value,
            0
          );
          setTotalNutrition(total);
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

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Pie Chart */}
      <div className="flex-1 min-w-[200px]">
        <h2 className="text-xl font-semibold mb-4">Nutrition Chart</h2>
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

      {/* Nutritional Values */}
      <div className="flex-1 min-w-[200px]">
        <button
          onClick={() => setModalIsOpen(true)}
          className="btn btn-primary"
        >
          Select Nutritional Values
        </button>
        <ul className="list-disc pl-4 mt-4">
          {selectedNutrients.length > 0 ? (
            selectedNutrients.map((nutrient) => (
              <li key={nutrient} className="mb-2">
                <strong>
                  {options.find((option) => option.value === nutrient).label}:
                </strong>{" "}
                {nutritionalData[nutrient]?.toFixed(2)} {units[nutrient]}
              </li>
            ))
          ) : (
            <li>No nutrients selected</li>
          )}
        </ul>
      </div>

      {/* Modal to select nutritional values */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Select Nutritional Values"
        style={{
          content: {
            width: "300px",
            height: "400px",
            margin: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <h2>Select Nutritional Values</h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {options.map((option) => (
            <div
              key={option.value}
              className="form-group"
              style={{ marginBottom: "5px" }}
            >
              <input
                type="checkbox"
                id={option.value}
                value={option.value}
                checked={selectedNutrients.includes(option.value)}
                onChange={handleChecklistChange}
                style={{ marginRight: "10px" }}
              />
              <label htmlFor={option.value}>{option.label}</label>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setModalIsOpen(false)}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default NutritionPieChart;
