import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Login from './pages/Login'
import Login from './pages/Login'
import GetFoods from './pages/GetFoods'
import Home from './pages/Home'
import Signup from './pages/Signup'
import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
function App() {
  // const [foodSearch, setFoodSearch] = useState('')
  // const [foodData, setFoodData] = useState([])
  // const [foodIdSearch, setFoodIdSearch] = useState([])



  // const handleFoodSearchChange = (e) => {
  //   setFoodSearch(e.target.value)
  // }

  // let csrfToken = null
  // const getCsrfToken = async () => {
  //   const request = await fetch('http://127.0.0.1:8000/csrftoken/', {
  //     method: 'GET',
  //     credentials: 'include',
  //   })
  //   let result = await request.json()
  //   csrfToken = result.csrf
  //   return csrfToken
  // }

  // const handleFoodSearch = async () => {
  //   fetch('http://127.0.0.1:8000/fatsecret_request', {
  //     method: 'POST',
  //     headers: {
  //       'X-CSRFToken': await getCsrfToken(),
  //     },
  //     credentials: 'include',
  //     body: JSON.stringify(foodSearch),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => setFoodData(data.foods.food))
  // };
  // console.log(foodData)

  // const handleFoodIdSearch = async (food_id) => {
  //   console.log()
  //   fetch('http://127.0.0.1:8000/fatsecret_get', {
  //     method: 'POST',
  //     headers: {
  //       'X-CSRFToken': await getCsrfToken(),
  //     },
  //     credentials: 'include',
  //     body: JSON.stringify(food_id),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => setFoodIdSearch(data.food.servings.serving[0]))
  // }
  // console.log(foodIdSearch)



  return (
    <Router>
      <div>
        {/* {foodData.map((food) => (
          <div key={food.food_id}>
            <h3 onClick={() => handleFoodIdSearch(food.food_id)}>{food.food_name}</h3>
            <p>{food.food_description}</p>
            <p>{food.food_type}</p>
            <p>{food.food_id}</p>
          </div>
        ))}

        <ul>
          <li>Calcium: {foodIdSearch.calcium}g</li>
          <li>Calories: {foodIdSearch.calories}g</li>
          <li>Carbohydrate: {foodIdSearch.carbohydrate}g</li>
          <li>Cholesterol: {foodIdSearch.cholesterol}g</li>
          <li>Fat: {foodIdSearch.fat}g</li>
          <li>Fiber: {foodIdSearch.fiber}g</li>
          <li>Iron: {foodIdSearch.iron}g</li>
          <li>Monounsaturated Fat: {foodIdSearch.monounsaturated_fat}g</li>
          <li>Number of Units: {foodIdSearch.number_of_units}g</li>
          <li>Polyunsaturated Fat: {foodIdSearch.polyunsaturated_fat}g</li>
          <li>Potassium: {foodIdSearch.potassium}g</li>
          <li>Protein: {foodIdSearch.protein}g</li>
          <li>Saturated Fat: {foodIdSearch.saturated_fat}g</li>
          <li>Serving Description: {foodIdSearch.serving_description}g</li>
          <li>Serving ID: {foodIdSearch.serving_id}g</li>
          <li>Sodium: {foodIdSearch.sodium}g</li>
          <li>Sugar: {foodIdSearch.sugar}g</li>
          <li>Vitamin A: {foodIdSearch.vitamin_a}g</li>
          <li>Vitamin C: {foodIdSearch.vitamin_c}g</li>
        </ul>

        <form>
          <input type="text" onChange={handleFoodSearchChange} placeholder="Search Foods" />
        </form>
        <button onClick={handleFoodSearch}>Submit</button> */}

        <nav>
          <ul>
            <li><Link to="/Login">Login</Link></li>
            <li><Link to="/getFoods">GetFood</Link></li>
            <li><Link to="/">Home Page</Link></li>
            <li><Link to="/Signup">Sign Up</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/getFoods' element={<GetFoods />} />
          <Route path='/Signup' element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App
