// import React, { useState, useEffect } from "react";
// import Modal from "react-modal";
// import "bootstrap/dist/css/bootstrap.min.css";

// Modal.setAppElement("#root");

// const UserInfoModal = () => {
//     const [formModalIsOpen, setFormModalIsOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     gender: "",
//     age: "",
//     weight: "",
//     height: "",
//     activity_level: "",
//     target_weight: "",
//   });
//   const [recommendedCalories, setRecommendedCalories] = useState();
//   const [maintainWeight, setMaintainWeight] = useState();
//   const [recommendedProtein, setRecommendedProtein] = useState();

//   const getCsrfToken = async () => {
//     const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
//       method: "GET",
//       credentials: "include",
//     });
//     const result = await request.json();
//     return result.csrf;
//   };

//   const calculateCalories = async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch("http://127.0.0.1:8000/calculate_recommendation", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//         "X-CSRFToken": await getCsrfToken(),
//       },
//       body: JSON.stringify(formData),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setRecommendedCalories(Math.round(data.recommended_calories));
//       setRecommendedProtein(data.recommended_protein);
//       setMaintainWeight(Math.round(data.maintain));
//       setFormModalIsOpen(false);
//       setFormData({
//         gender: "",
//         age: "",
//         weight: "",
//         height: "",
//         activity_level: "",
//         target_weight: "",
//       });
//     } else {
//       console.error("Error calculating recommendations:", response.statusText);
//     }
//   };
// //   useEffect(() => {
// //         const get_data = async () => {
// //           const token = localStorage.getItem("token");
// //           const response = await fetch("http://127.0.0.1:8000/get_recommendation", {
// //             method: "POST",
// //             credentials: "include",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Token ${token}`,
// //               "X-CSRFToken": await getCsrfToken(),
// //             },
// //           });
// //           if (response.ok) {
// //             const data = await response.json();
// //             setRecommendedCalories(Math.round(data.recommended_calories));
// //             setRecommendedProtein(data.recommended_protein);
// //             setMaintainWeight(Math.round(data.maintain_weight));
// //             console.log(maintainWeight, recommendedProtein, recommendedProtein);
// //           }
// //         };
// //         get_data();
// //       }, []);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const activityLevels = [
//     { value: "sedentary", label: "Sedentary (little or no exercise)" },
//     { value: "light", label: "Lightly active (light exercise/sports 1-3 days/week)" },
//     { value: "moderate", label: "Moderately active (moderate exercise/sports 3-5 days/week)" },
//     { value: "active", label: "Active (hard exercise/sports 6-7 days a week)" },
//     { value: "very_active", label: "Very active (very hard exercise/sports & a physical job)" },
//   ];

//   return (
//     <>
//       <button
//   onClick={() => setFormModalIsOpen(true)}
//   style={{
//     backgroundColor: "white",
//     color: "green",
//     border: "1px solid black",
//     borderRadius: "5px",
//     cursor: "pointer",
//     width: "300px", 
//   }}
// >
//   Open User Information Form
// </button>

//       <Modal
//         isOpen={formModalIsOpen}
//         onRequestClose={() => setFormModalIsOpen(false)}
//         contentLabel="User Information Modal"
//         style={{
//           content: {
//             width: "300px",
//             height: "400px",
//             margin: "auto",
//             padding: "20px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//           },
//         }}
//       >
//         <h2 style={{ marginBottom: "10px" }}>User Information</h2>
//         <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//           <div className="form-group">
//             <select
//               className="form-control"
//               name="gender"
//               value={formData.gender}
//               onChange={handleFormChange}
//             >
//               <option value="">Select Gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <input
//               type="text"
//               className="form-control"
//               name="age"
//               placeholder="Age"
//               value={formData.age}
//               onChange={handleFormChange}
//             />
//           </div>

//           <div className="form-group">
//             <input
//               type="text"
//               className="form-control"
//               name="weight"
//               placeholder="Weight (lbs)"
//               value={formData.weight}
//               onChange={handleFormChange}
//             />
//           </div>

//           <div className="form-group">
//             <input
//               type="text"
//               className="form-control"
//               name="height"
//               placeholder="Height (inches)"
//               value={formData.height}
//               onChange={handleFormChange}
//             />
//           </div>

//           <div className="form-group">
//             <label>Activity Level</label>
//             <select
//               className="form-control"
//               name="activity_level"
//               value={formData.activity_level}
//               onChange={handleFormChange}
//             >
//               <option value="">Select Activity Level</option>
//               {activityLevels.map((level) => (
//                 <option key={level.value} value={level.value}>
//                   {level.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="form-group">
//             <input
//               type="text"
//               className="form-control"
//               name="target_weight"
//               placeholder="Target Weight (lbs)"
//               value={formData.target_weight}
//               onChange={handleFormChange}
//             />
//           </div>
//         </div>

//         <button className="btn btn-primary" onClick={calculateCalories}>
//           Calculate
//         </button>

//         <button
//           style={{ margin: "10px" }}
//           className="btn btn-primary"
//           onClick={() => setFormModalIsOpen(false)}
//         >
//           Close
//         </button>
//       </Modal>

//       {/* <div>
//         <h1>Users Goal For Daily Calorie Consumption: {recommendedCalories}</h1>
//         <h1>Users Goal For Daily Protein Recommendation: {recommendedProtein}</h1>
//         <h1>Users Goal To Maintain Current Weight: {maintainWeight}</h1>
//       </div> */}
//     </>
//   );
// }

// export default UserInfoModal



// UserInfoModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "bootstrap/dist/css/bootstrap.min.css";

// Set up the modal root element
Modal.setAppElement("#root");

const UserInfoModal = ({ isOpen, onClose }) => {
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
      onClose(); // Close the modal on success
    } else {
      console.error("Error calculating recommendations:", response.statusText);
    }
  };

  useEffect(() => {
    const getData = async () => {
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
      }
    };
    getData();
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
        onClick={onClose}
      >
        Close
      </button>
    </Modal>
  );
};

export default UserInfoModal;
