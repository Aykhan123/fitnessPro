import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import GetUser from "../components/GetUser";
import GetImage from "../components/GetImage";

export default function Profile() {
  const [view, setView] = useState("overview");
  const [uploadedImage, setUploadedImage] = useState("");
  const [base64String, setBase64String] = useState("");
  const [fetchedImage, setFetchedImage] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
  );

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
