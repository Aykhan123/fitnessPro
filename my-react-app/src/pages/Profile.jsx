import Footer from "../components/Footer";
export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col mt-5 pt-2">
      <div className="container mx-auto flex-grow px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          {/* Profile Sidebar */}
          <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-6 mb-6 lg:mb-0">
            <div className="flex flex-col items-center">
              <img
                className="h-24 w-24 rounded-full object-cover"
                src="https://via.placeholder.com/150"
                alt="Profile"
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                John Doe
              </h2>
              <p className="text-sm text-gray-600">john.doe@example.com</p>
            </div>
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-indigo-600 font-medium">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-indigo-600">
                    Settings
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-indigo-600">
                    Activity
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-indigo-600">
                    Log Out
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Profile Content */}
          <div className="w-full lg:w-3/4 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Overview</h3>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Progress</h3>
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
          </div>
        </div>
      </div>
      {/* Footer or Additional Content */}
      <Footer className="mt-3" />
    </div>
  );
}
