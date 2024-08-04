import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
      <div className="mainContainer">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            Calorie Tracker
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Signup">
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/getFoods">
                      Get Foods
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Logout">
                      Log out
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Tracker">
                      Calorie Tracker
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
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
