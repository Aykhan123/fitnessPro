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
import User from "./pages/User"
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
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

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <ul>
              <Link to="/">Home Page</Link>
            </ul>
            {!isAuthenticated ? (
              <>
                <ul>
                  <Link to="/Login">Login</Link>
                </ul>
                <ul>
                  <Link to="/Signup">Sign Up</Link>
                </ul>
              </>
            ) : (
              <>
              <ul>
                <Link to="/User">User</Link>
              </ul>
                <ul>
                  <Link to="/getFoods">Get Foods</Link>
                </ul>
                <ul>
                  <Link to="/Logout">Log out</Link>
                </ul>
              </>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/getFoods"
            element={isAuthenticated ? <GetFoods /> : <Navigate to="/Login" />}
          />
          <Route path="/Signup" element={<Signup onSignup={handleLogin} />} />
          <Route path="/Logout" element={<Logout onLogout={logout} />} />
          <Route path="/User" element={<User/>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
