import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./App.css";
// import Login from './pages/Login'
import Login from "./pages/Login";
import GetFoods from "./pages/GetFoods";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import User from "./pages/User"
// import Tracker from "./Tracker";
import TermsAndConditions from "./pages/Terms";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Tracker from "./Tracker";
import Navbar from "./components/Navbar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Get Foods", href: "/getFoods", current: false },
  { name: "Calorie Tracker", href: "#", current: false },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const authenticate = async () => {
        const response = await fetch("http://127.0.0.1:8000/test_token",{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        })
        if(response.ok){
          console.log(response)
          setIsAuthenticated(true)
        }
      }
      // console.log("Token - ", token);
      authenticate()
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
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/getFoods"
          element={isAuthenticated ? <GetFoods /> : <Navigate to="/Signup" />}
        />
        <Route path="/Signup" element={<Signup onSignup={handleLogin} />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/Tracker" element={<Tracker />} />
        <Route path="/User" element={<User />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/Tracker" element={<Tracker />} />
      </Routes>
    </Router>
  );
}

export default App;
