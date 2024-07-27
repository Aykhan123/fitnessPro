import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import Login from './pages/Login'
import Login from "./pages/Login";
import GetFoods from "./pages/GetFoods";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import Tracker from "./Tracker";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      console.log(token);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home Page</Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/Login">Login</Link>
                </li>
                <li>
                  <Link to="/Signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/getFoods">Get Foods</Link>
                </li>
                <li>
                  <Link to="/Logout">Log out</Link>
                </li>
                <li>
                  <Link to="/Tracker">Calorie Tracker</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route
            path="/getFoods"
            element={isAuthenticated ? <GetFoods /> : <Navigate to="/login" />}
          />
          <Route path="/Signup" element={<Signup onSignup={handleLogin} />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Tracker" element={<Tracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
