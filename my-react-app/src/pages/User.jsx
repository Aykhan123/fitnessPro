// import React, { useEffect, useState } from "react";
// import { Pie, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";
// import Modal from "react-modal";
// import "bootstrap/dist/css/bootstrap.min.css";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale
// );

// Modal.setAppElement("#root");

// const User = () => {
//   const units = {
//     calcium: "mg",
//     calories: "kcal",
//     carbohydrate: "g",
//     cholesterol: "mg",
//     fat: "g",
//     fiber: "g",
//     iron: "mg",
//     monounsaturated_fat: "g",
//     polyunsaturated_fat: "g",
//     potassium: "mg",
//     protein: "g",
//     saturated_fat: "g",
//     sodium: "mg",
//     sugar: "g",
//     vitamin_a: "IU",
//     vitamin_c: "mg",
//   };

//   const options = Object.keys(units).map((key) => ({
//     label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
//     value: key,
//   }));

//   const activityLevels = [
//     { value: "sedentary", label: "Sedentary (little or no exercise)" },
//     {
//       value: "light",
//       label: "Lightly active (light exercise/sports 1-3 days/week)",
//     },
//     {
//       value: "moderate",
//       label: "Moderately active (moderate exercise/sports 3-5 days/week)",
//     },
//     { value: "active", label: "Active (hard exercise/sports 6-7 days a week)" },
//     {
//       value: "very_active",
//       label: "Very active (very hard exercise/sports & a physical job)",
//     },
//   ];

//   const [selectedNutrients, setSelectedNutrients] = useState([
//     "calories",
//     "protein",
//     "sugar",
//     "sodium",
//   ]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [formModalIsOpen, setFormModalIsOpen] = useState(false);

//   const [nutritionalData, setNutritionData] = useState({});
//   let csrfToken = null;

//   const getCsrfToken = async () => {
//     const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
//       method: "GET",
//       credentials: "include",
//     });
//     let result = await request.json();
//     csrfToken = result.csrf;
//     return csrfToken;
//   };

//   const [uploadedImage, setUploadedImage] = useState("");
//   const [base64String, setBase64String] = useState("");

//   const [formData, setFormData] = useState({
//     gender: "",
//     age: "",
//     weight: "",
//     height: "",
//     activity_level: "",
//     target_weight: "",
//   });
//   const [recommendedCalories, setRecommendedCalories] = useState("");
//   const [maintainWeight, setMaintainWeight] = useState("");
//   const [recommendedProtein, setRecommendedProtein] = useState("");

//   const calculateCalories = async () => {
//     console.log(formData);
//     const token = localStorage.getItem("token");
//     const response = await fetch(
//       "http://127.0.0.1:8000/calculate_recommendation",
//       {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//           "X-CSRFToken": await getCsrfToken(),
//         },
//         body: JSON.stringify({
//           gender: formData.gender,
//           age: formData.age,
//           weight: formData.weight,
//           height: formData.height,
//           activity_level: formData.activity_level,
//           target_weight: formData.target_weight,
//         }),
//       }
//     );
//     if (response.ok) {
//       const data = await response.json();
//       // setRecommendedCalories(data.recommended_calories);
//       // setRecommendedProtein(data.recommended_protein);
//       // setMaintainWeight(data.maintain);
//       // console.log(data.recommended_calories)
//       // console.log(data.recommended_protein)/
//       setFormModalIsOpen(false);
//       setFormData({
//         gender: "",
//         age: "",
//         weight: "",
//         height: "",
//         activity_level: "",
//         target_weight: "",
//       });
//     }
//   };

//   useEffect(() => {
//     const get_data = async () => {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://127.0.0.1:8000/get_recommendation", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//           "X-CSRFToken": await getCsrfToken(),
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setRecommendedCalories(Math.round(data.recommended_calories));
//         setRecommendedProtein(data.recommended_protein);
//         setMaintainWeight(Math.round(data.maintain_weight));
//         console.log(maintainWeight, recommendedProtein, recommendedProtein);
//       }
//     };
//     get_data();
//   }, []);

//   const onImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       let img = e.target.files[0];
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result;
//         setBase64String(base64String);
//       };

//       reader.readAsDataURL(img);
//       setUploadedImage({
//         img,
//       });
//     }
//   };

//   const postImage = async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch("http://127.0.0.1:8000/post_image", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//         "X-CSRFToken": await getCsrfToken(),
//       },
//       body: JSON.stringify({
//         pictureName: uploadedImage.img.name,
//         image: base64String,
//       }),
//     });
//     if (response.ok) {
//       window.location.reload();
//     }
//   };

//   const deleteImage = async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch("http://127.0.0.1:8000/delete_image", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//         "X-CSRFToken": await getCsrfToken(),
//       },
//     });
//     if (response.ok) {
//       window.location.reload();
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           "http://127.0.0.1:8000/get_nutrition_data",
//           {
//             method: "POST",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Token ${token}`,
//               "X-CSRFToken": await getCsrfToken(),
//             },
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           console.log(data);
//           setNutritionData(data);
//         } else {
//           console.error("Failed to fetch nutritional data");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChecklistChange = (e) => {
//     const value = e.target.value;
//     setSelectedNutrients((prev) => {
//       if (prev.includes(value)) {
//         return prev.filter((item) => item !== value);
//       } else {
//         return [...prev, value];
//       }
//     });
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const chartData = {
//     labels: selectedNutrients.map(
//       (nutrient) => options.find((option) => option.value === nutrient).label
//     ),
//     datasets: [
//       {
//         label: "Daily Intake",
//         data: selectedNutrients.map(
//           (nutrient) => nutritionalData[nutrient] || 0
//         ),
//         backgroundColor: selectedNutrients.map(
//           () =>
//             `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
//               Math.random() * 255
//             )}, ${Math.floor(Math.random() * 255)}, 0.5)`
//         ),
//         borderColor: selectedNutrients.map(
//           () =>
//             `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
//               Math.random() * 255
//             )}, ${Math.floor(Math.random() * 255)}, 1)`
//         ),
//         borderWidth: 1,
//       },
//     ],
//   };

//   const totalNutrition = Object.values(nutritionalData).reduce(
//     (acc, value) => acc + value,
//     0
//   );

//   const goal = 2000;
//   const progress = (totalNutrition / goal) * 100;

//   return (
//     <>
//       <div>
//         <button onClick={postImage}>Submit Picture</button>
//         <input type="file" name="myImage" onChange={onImageChange} />
//       </div>
//       <div>
//         <button onClick={deleteImage}>DELETE IMAGE BUTTON</button>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <h1>Nutrition Tracker</h1>

//         <button onClick={() => setFormModalIsOpen(true)}>
//           Open User Information Form
//         </button>

//         {/* Commented out progress bar and weekly graph sections */}
//         {/* <div style={{ width: "80%", marginBottom: "20px" }}>
//         <h2>Progress Towards Daily Goal</h2>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <div style={{ flexGrow: 1 }}>
//             <div
//               style={{
//                 width: "100%",
//                 height: "30px",
//                 backgroundColor: "#e9ecef",
//                 borderRadius: "5px",
//                 overflow: "hidden",
//                 position: "relative",
//               }}
//             >
//               <div
//                 style={{
//                   width: `${progress}%`,
//                   height: "100%",
//                   backgroundColor: "lightgreen",
//                   borderRadius: "5px 0 0 5px",
//                   transition: "width 0.5s",
//                 }}
//               ></div>
//             </div>
//           </div>
//           <div
//             style={{
//               marginLeft: "10px",
//               fontWeight: "bold",
//               color: "lightgreen",
//             }}
//           >
//             {`${progress.toFixed(2)}%`}
//           </div>
//         </div>
//       </div> */}

//         {/* Commented out weekly graph section */}
//         {/* <div style={{ width: "80%", marginBottom: "20px" }}>
//         <h2>Weekly Progress</h2>
//         <Bar
//           data={weeklyData}
//           options={{
//             responsive: true,
//             scales: {
//               y: {
//                 beginAtZero: true,
//                 max: 100,
//                 title: {
//                   display: true,
//                   text: "Percentage of Daily Goal Met",
//                 },
//               },
//             },
//           }}
//         />
//       </div> */}

//         <div>
//           <h1>Users Goal For Daily Calorie Consumption:{recommendedCalories}</h1>
//           <h1>Users Goal For Daily Protein Recommendation:{recommendedProtein}</h1>
//           <h1>Users Goal To Maintain Current Weight:{maintainWeight}</h1>
//         </div>

//         <button onClick={() => setModalIsOpen(true)}>
//           Select Nutritional Values
//         </button>
//         <div style={{ display: "flex", width: "80%" }}>
//           <div style={{ flex: 2 }}>
//             <h2>Nutrition Chart</h2>
//             <Pie
//               data={chartData}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: "top",
//                   },
//                   tooltip: {
//                     callbacks: {
//                       label: function (context) {
//                         const percentage = (
//                           (context.raw / totalNutrition) *
//                           100
//                         ).toFixed(2);
//                         return `${context.label}: ${percentage}% (${
//                           context.raw
//                         }${
//                           units[context.label.toLowerCase().replace(/ /g, "_")]
//                         })`;
//                       },
//                     },
//                   },
//                 },
//               }}
//             />
//           </div>

//           <div style={{ flex: 1, marginLeft: "20px" }}>
//             <h2>Selected Nutrition Values</h2>
//             <ul style={{ listStyleType: "none", padding: 0 }}>
//               {selectedNutrients.length > 0 ? (
//                 selectedNutrients.map((nutrient) => (
//                   <li key={nutrient} style={{ marginBottom: "10px" }}>
//                     <strong>
//                       {
//                         options.find((option) => option.value === nutrient)
//                           .label
//                       }
//                       :
//                     </strong>{" "}
//                     {nutritionalData[nutrient]?.toFixed(2)} {units[nutrient]}
//                   </li>
//                 ))
//               ) : (
//                 <li>No nutrients selected</li>
//               )}
//             </ul>
//           </div>
//         </div>

//         <Modal
//           isOpen={modalIsOpen}
//           onRequestClose={() => setModalIsOpen(false)}
//           contentLabel="Select Nutritional Values"
//           style={{
//             content: {
//               width: "300px",
//               height: "400px",
//               margin: "auto",
//               padding: "20px",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "space-between",
//             },
//           }}
//         >
//           <h2>Select Nutritional Values</h2>
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             {options.map((option) => (
//               <div
//                 key={option.value}
//                 className="form-group"
//                 style={{ marginBottom: "5px" }}
//               >
//                 <input
//                   type="checkbox"
//                   id={option.value}
//                   value={option.value}
//                   checked={selectedNutrients.includes(option.value)}
//                   onChange={handleChecklistChange}
//                   style={{ marginRight: "10px" }}
//                 />
//                 <label htmlFor={option.value}>{option.label}</label>
//               </div>
//             ))}
//           </div>

//           <button
//             className="btn btn-primary"
//             onClick={() => setModalIsOpen(false)}
//           >
//             Close
//           </button>
//         </Modal>

//         <Modal
//           isOpen={formModalIsOpen}
//           onRequestClose={() => setFormModalIsOpen(false)}
//           contentLabel="User Information Modal"
//           style={{
//             content: {
//               width: "300px",
//               height: "400px",
//               margin: "auto",
//               padding: "20px",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "space-between",
//             },
//           }}
//         >
//           <h2 style={{ marginBottom: "10px" }}>User Information</h2>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: "10px" }}
//           >
//             <div className="form-group">
//               {/* <label>Gender</label> */}
//               <select
//                 className="form-control"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleFormChange}
//               >
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <input
//                 type="text"
//                 className="form-control"
//                 name="age"
//                 placeholder="Age"
//                 value={formData.age}
//                 onChange={handleFormChange}
//               />
//             </div>

//             <div className="form-group">
//               <input
//                 type="text"
//                 className="form-control"
//                 name="weight"
//                 placeholder="Weight (lbs)"
//                 value={formData.weight}
//                 onChange={handleFormChange}
//               />
//             </div>

//             <div className="form-group">
//               <input
//                 type="text"
//                 className="form-control"
//                 name="height"
//                 placeholder="Height (inches)"
//                 value={formData.height}
//                 onChange={handleFormChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Activity Level</label>
//               <select
//                 className="form-control"
//                 name="activity_level"
//                 value={formData.activity_level}
//                 onChange={handleFormChange}
//               >
//                 <option value="">Select Activity Level</option>
//                 {activityLevels.map((level) => (
//                   <option key={level.value} value={level.value}>
//                     {level.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <input
//                 type="text"
//                 className="form-control"
//                 name="target_weight"
//                 placeholder="Target Weight (lbs)"
//                 value={formData.target_weight}
//                 onChange={handleFormChange}
//               />
//             </div>
//           </div>

//           <button className="btn btn-primary" onClick={calculateCalories}>
//             Calculate
//           </button>

//           <button
//             style={{ margin: "10px" }}
//             className="btn btn-primary"
//             onClick={() => {
//               setFormModalIsOpen(false);
//             }}
//           >
//             Close
//           </button>
//         </Modal>
//       </div>
//     </>
//   );
// };

// export default User;
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "bootstrap/dist/css/bootstrap.min.css";

// Set up the modal root element
Modal.setAppElement("#root");

const User = () => {
  const [formModalIsOpen, setFormModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    activity_level: "",
    target_weight: "",
  });
  const [recommendedCalories, setRecommendedCalories] = useState();
  const [maintainWeight, setMaintainWeight] = useState();
  const [recommendedProtein, setRecommendedProtein] = useState();

  const getCsrfToken = async () => {
    const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
      method: "GET",
      credentials: "include",
    });
    const result = await request.json();
    return result.csrf;
  };

  const calculateCalories = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/calculate_recommendation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        "X-CSRFToken": await getCsrfToken(),
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      setRecommendedCalories(Math.round(data.recommended_calories));
      setRecommendedProtein(data.recommended_protein);
      setMaintainWeight(Math.round(data.maintain));
      setFormModalIsOpen(false);
      setFormData({
        gender: "",
        age: "",
        weight: "",
        height: "",
        activity_level: "",
        target_weight: "",
      });
    } else {
      console.error("Error calculating recommendations:", response.statusText);
    }
  };
  useEffect(() => {
        const get_data = async () => {
          const token = localStorage.getItem("token");
          const response = await fetch("http://127.0.0.1:8000/get_recommendation", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
              "X-CSRFToken": await getCsrfToken(),
            },
          });
          if (response.ok) {
            const data = await response.json();
            setRecommendedCalories(Math.round(data.recommended_calories));
            setRecommendedProtein(data.recommended_protein);
            setMaintainWeight(Math.round(data.maintain_weight));
            console.log(maintainWeight, recommendedProtein, recommendedProtein);
          }
        };
        get_data();
      }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "light", label: "Lightly active (light exercise/sports 1-3 days/week)" },
    { value: "moderate", label: "Moderately active (moderate exercise/sports 3-5 days/week)" },
    { value: "active", label: "Active (hard exercise/sports 6-7 days a week)" },
    { value: "very_active", label: "Very active (very hard exercise/sports & a physical job)" },
  ];

  return (
    <>
      <button
  onClick={() => setFormModalIsOpen(true)}
  style={{
    backgroundColor: "white",
    color: "green",
    border: "1px solid black",
    borderRadius: "5px",
    cursor: "pointer",
    width: "300px", 
  }}
>
  Open User Information Form
</button>

      <Modal
        isOpen={formModalIsOpen}
        onRequestClose={() => setFormModalIsOpen(false)}
        contentLabel="User Information Modal"
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
        <h2 style={{ marginBottom: "10px" }}>User Information</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="form-group">
            <select
              className="form-control"
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="weight"
              placeholder="Weight (lbs)"
              value={formData.weight}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="height"
              placeholder="Height (inches)"
              value={formData.height}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select
              className="form-control"
              name="activity_level"
              value={formData.activity_level}
              onChange={handleFormChange}
            >
              <option value="">Select Activity Level</option>
              {activityLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="target_weight"
              placeholder="Target Weight (lbs)"
              value={formData.target_weight}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={calculateCalories}>
          Calculate
        </button>

        <button
          style={{ margin: "10px" }}
          className="btn btn-primary"
          onClick={() => setFormModalIsOpen(false)}
        >
          Close
        </button>
      </Modal>

      <div>
        <h1>Users Goal For Daily Calorie Consumption: {recommendedCalories}</h1>
        <h1>Users Goal For Daily Protein Recommendation: {recommendedProtein}</h1>
        <h1>Users Goal To Maintain Current Weight: {maintainWeight}</h1>
      </div>
    </>
  );
};

export default User