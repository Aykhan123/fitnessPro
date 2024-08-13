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
import "bootstrap/dist/css/bootstrap.min.css";

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

  const [uploadedImage, setUploadedImage] = useState("");
  const [base64String, setBase64String] = useState("");

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setBase64String(base64String);
      };

      reader.readAsDataURL(img);
      setUploadedImage({
        img,
      });
    }
  };

  const postImage = async () => {
    const token = "3c1148337d673b3567a6d486590f90407d88600d";
    const response = await fetch("http://127.0.0.1:8000/post_image", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        "X-CSRFToken": await getCsrfToken(),
      },
      body: JSON.stringify({
        pictureName: uploadedImage.img.name,
        image: base64String,
      }),
    });
    if (response.ok) {
      window.location.reload();
    }
  };

  const deleteImage = async () => {
    const token = "3c1148337d673b3567a6d486590f90407d88600d";
    const response = await fetch("http://127.0.0.1:8000/delete_image", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        "X-CSRFToken": await getCsrfToken(),
      },
    });
    if(response.ok){
      window.location.reload()
    }
  }

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
          console.log(data);
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

  // Assuming a fixed goal for demonstration purposes
  const goal = 2000; // Adjust as needed
  const progress = (totalNutrition / goal) * 100;

  // Commenting out weekly data and progress bar sections
  /*
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
  */

  return (
    <>
      <div>
        <button onClick={postImage}>Submit Picture</button>
        <input type="file" name="myImage" onChange={onImageChange} />
      </div>
      <div>
        <button onClick={deleteImage}>DELETE IMAGE BUTTON</button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Nutrition Tracker</h1>

        {/* Commenting out progress bar section */}
        {/* <div style={{ width: "80%", marginBottom: "20px" }}>
        <h2>Progress Towards Daily Goal</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flexGrow: 1 }}>
            <div
              style={{
                width: "100%",
                height: "30px",
                backgroundColor: "#e9ecef",
                borderRadius: "5px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "lightgreen",
                  borderRadius: "5px 0 0 5px",
                  transition: "width 0.5s",
                }}
              ></div>
            </div>
          </div>
          <div
            style={{
              marginLeft: "10px",
              fontWeight: "bold",
              color: "lightgreen",
            }}
          >
            {`${progress.toFixed(2)}%`}
          </div>
        </div>
      </div> */}

        {/* Commenting out weekly graph section */}
        {/* <div style={{ width: "80%", marginBottom: "20px" }}>
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
      </div> */}

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
                        return `${context.label}: ${percentage}% (${
                          context.raw
                        }${
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
                      {
                        options.find((option) => option.value === nutrient)
                          .label
                      }
                      :
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
    </>
  );
};

export default User;
