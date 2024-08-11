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
      setIsAuthenticated(true);
      console.log("Token - ", token);
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
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
      </Routes>
    </Router>
  );
}

export default App;
