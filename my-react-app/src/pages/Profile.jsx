import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import GetUser from "../components/GetUser";
import GetImage from "../components/GetImage";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from 'react-router-dom';
import PFP from "../assets/PFP.jpg";

export default function Profile() {
  const [view, setView] = useState("overview");
  const [uploadedImage, setUploadedImage] = useState("");
  const [base64String, setBase64String] = useState("");
  const [fetchedImage, setFetchedImage] = useState(PFP);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [recommendedCalories, setRecommendedCalories] = useState(null);
  const [userCalorieGoal, setUserCalorieGoal] = useState("");
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    activity_level: "",
    target_weight: "",
  });

  const navigate = useNavigate();
  // See calorie recommendations - will take you to second modal

  const saveCalorieGoal = async () => {
    if (Object.values(formData).every((field) => field.trim() !== "")) {
      const token = localStorage.getItem("token");

      // Post user data and get recommendations
      const response = await fetch(
        "http://127.0.0.1:8000/calculate_recommendation",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
            "X-CSRFToken": await getCsrfToken(),
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecommendedCalories(Math.round(data.recommended_calories));

        // Close the first modal and open the second modal
        setIsModalOpen(false);
        setIsRecommendationModalOpen(true); // Open the recommendation modal
      }
    }
  };

  // Save recommended calories to db
  const saveRecommendedCalories = async () => {
    // setCalorieGoal(recommendedCalories);
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/save_calorie_goal", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ recommended_calories: recommendedCalories }),
    });
    if(response.ok){
      navigate("/HomePage")
    }
  };

  // Set your own goal
  const setUserGoal = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/save_calorie_goal", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ recommended_calories: userCalorieGoal }),
    });
    if(response.ok){
      navigate("/HomePage")
    }
  };

  // Handle form change for user info

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const getCsrfToken = async () => {
    const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
      method: "GET",
      credentials: "include",
    });
    let result = await request.json();
    return result.csrf;
  };

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
    const token = localStorage.getItem("token");
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
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/delete_image", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
        "X-CSRFToken": await getCsrfToken(),
      },
    });
    if (response.ok) {
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const image = await GetImage();
      setFetchedImage(image);
    };
    fetchImage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col mt-5 pt-2">
      <div className="container mx-auto flex-grow px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          {/* Profile Sidebar */}
          <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-6 mb-6 lg:mb-0">
            <div className="flex flex-col items-center">
              <img
                className="h-24 w-24 rounded-full object-cover"
                src={fetchedImage}
                alt="Profile"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {/* John Doe */}
                <GetUser />
              </h2>
              {/* <p className="text-sm text-gray-600">john.doe@example.com</p> */}
            </div>
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleViewChange("overview")}
                    className={`w-full py-2 px-4 text-left rounded-lg transition-colors duration-300 ${
                      view === "overview"
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleViewChange("settings")}
                    className={`w-full py-2 px-4 text-left rounded-lg transition-colors duration-300 ${
                      view === "settings"
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-lg"
                  >
                    Activity
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-lg"
                  >
                    Log Out
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Profile Content */}
          <div className="w-full lg:w-3/4 bg-white rounded-lg shadow-lg p-6">
            {view === "overview" ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Calories Summary */}
                  <div className="bg-indigo-50 p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Daily Calories
                    </h4>
                    <p className="text-4xl font-bold text-green-600">1,800</p>
                    <p className="text-sm text-gray-600">of 2,200 kcal</p>
                  </div>
                  {/* Macros Summary */}
                  <div className="bg-indigo-50 p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Macros
                    </h4>
                    <p className="text-xl text-green-600">Protein: 100g</p>
                    <p className="text-xl text-green-600">Carbs: 200g</p>
                    <p className="text-xl text-green-600">Fats: 60g</p>
                  </div>
                  {/* Recent Activity */}
                  <div className="bg-indigo-50 p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Recent Activity
                    </h4>
                    <ul className="text-gray-600">
                      <li>- Breakfast: 400 kcal</li>
                      <li>- Lunch: 600 kcal</li>
                      <li>- Dinner: 800 kcal</li>
                      <li>- Snack: 100 kcal</li>
                    </ul>
                  </div>
                </div>
                {/* Additional Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Progress
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Weight Progress
                      </h4>
                      <p className="text-4xl font-bold text-green-600">75 kg</p>
                      <p className="text-sm text-gray-600">Goal: 70 kg</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Workout Sessions
                      </h4>
                      <p className="text-4xl font-bold text-green-600">5</p>
                      <p className="text-sm text-gray-600">This Week</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Settings
                </h3>
                <form>
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="Enter new username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="profile-picture"
                    >
                      Profile Picture
                    </label>
                    <input
                      onChange={onImageChange}
                      id="profile-picture"
                      type="file"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={postImage}
                    className="w-40 px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={deleteImage}
                    className="w-40 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Image
                  </button>
                  {/* Button to open the modal */}
                  {/* <button onClick={() => openModal}>
                    Change Your Calorie Goal
                  </button> */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="py-2 px-4 bg-indigo-600 text-white rounded-lg"
                  >
                    Change Your Calorie Goal
                  </button>
                  {/* User Info Modal */}
                  <Transition appear show={isModalOpen} as={React.Fragment}>
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={() => setIsModalOpen(false)}
                    >
                      <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                      </Transition.Child>

                      <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                          <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                              <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                              >
                                User Information
                              </Dialog.Title>
                              <div className="mt-2">
                                <form>
                                  {/* Form fields for gender, age, weight, height, etc. */}
                                  <div className="mt-4">
                                    <label
                                      htmlFor="gender"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Gender
                                    </label>
                                    <select
                                      id="gender"
                                      name="gender"
                                      value={formData.gender}
                                      onChange={handleFormChange}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                      <option value="">Select Gender</option>
                                      <option value="male">Male</option>
                                      <option value="female">Female</option>
                                    </select>
                                  </div>

                                  <div className="mt-4">
                                    <label
                                      htmlFor="age"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Age
                                    </label>
                                    <input
                                      type="number"
                                      id="age"
                                      name="age"
                                      value={formData.age}
                                      onChange={handleFormChange}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div className="mt-4">
                                    <label
                                      htmlFor="weight"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Weight (lbs)
                                    </label>
                                    <input
                                      type="number"
                                      id="weight"
                                      name="weight"
                                      value={formData.weight}
                                      onChange={handleFormChange}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div className="mt-4">
                                    <label
                                      htmlFor="height"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Height (inches)
                                    </label>
                                    <input
                                      type="number"
                                      id="height"
                                      name="height"
                                      value={formData.height}
                                      onChange={handleFormChange}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div className="mt-4">
                                    <label
                                      htmlFor="activity_level"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Activity Level
                                    </label>
                                    <select
                                      id="activity_level"
                                      name="activity_level"
                                      value={formData.activity_level}
                                      onChange={handleFormChange}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                      <option value="">
                                        Select Activity Level
                                      </option>
                                      <option value="sedentary">
                                        Sedentary
                                      </option>
                                      <option value="light">
                                        Lightly Active
                                      </option>
                                      <option value="moderate">
                                        Moderately Active
                                      </option>
                                      <option value="active">Active</option>
                                    </select>
                                  </div>

                                  <div className="mt-4">
                                    <label
                                      htmlFor="target_weight"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Target Weight (lbs)
                                    </label>
                                    <input
                                      type="number"
                                      id="target_weight"
                                      name="target_weight"
                                      value={formData.target_weight}
                                      onChange={handleFormChange}
                                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </form>
                              </div>
                              <div className="flex justify-end mt-4">
                                <button
                                  type="button"
                                  onClick={saveCalorieGoal}
                                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  See Recommendations
                                </button>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>

                  {/* Recommendation Modal */}
                  <Transition
                    appear
                    show={isRecommendationModalOpen}
                    as={React.Fragment}
                  >
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={() => setIsRecommendationModalOpen(false)}
                    >
                      <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                      </Transition.Child>

                      <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                          <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                              <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                              >
                                Calorie Recommendation:
                              </Dialog.Title>
                              <div className="mt-2">
                                {recommendedCalories !== null ? (
                                  <p className="text-lg">
                                    Your recommended daily calorie intake is:{" "}
                                    <strong>{recommendedCalories} kcal</strong>
                                  </p>
                                ) : (
                                  <p>Loading recommendations...</p>
                                )}
                              </div>
                              <div className="flex flex-col items-center mt-4">
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsRecommendationModalOpen(false),
                                        saveRecommendedCalories();
                                    }}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Save Recommendation As Goal
                                  </button>
                                </div>
                                <div
                                  className="my-4 text-center"
                                  style={{ paddingTop: "10px" }}
                                >
                                  <strong>OR</strong>
                                </div>

                                {/* Input Form for Setting Own Goal */}
                                <div className="mt-1 flex justify-center w-full">
                                  <label htmlFor="ownGoal" className="sr-only">
                                    Set Your Own Goal (calories)
                                  </label>
                                  <input
                                    type="number"
                                    id="ownGoal"
                                    className="block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Set A Personal Goal"
                                    onChange={(e) =>
                                      setUserCalorieGoal(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="mt-4">
                                  {" "}
                                  {/* Add margin top for spacing */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUserGoal(),
                                        setIsRecommendationModalOpen(false);
                                    }}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Set Your Own Goal
                                  </button>
                                </div>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer className="mt-3" />
    </div>
  );
}
