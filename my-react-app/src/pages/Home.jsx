import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import { Link } from "react-router-dom";
function Home() {
  const [backgroundImage, setBackgroundImage] = useState("");
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

  const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  console.log(unsplashAccessKey);
  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await axios.get(
          "https://api.unsplash.com/photos/random",
          {
            params: {
              query: "healthy food",
              client_id: unsplashAccessKey, // Replace with your Unsplash access key
            },
          }
        );
        setBackgroundImage(response.data.urls.regular);
      } catch (error) {
        console.error("Error fetching the background image", error);
      }
    };

    fetchBackgroundImage();
  }, []);
  return (
    <div className="container">
      {/* Hero Section */}
      <header
        className="hero d-flex justify-content-center align-items-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="text-center">
          <h1>Track Your Calories</h1>
          <p className="lead">
            Stay healthy and fit by tracking your daily calorie intake.
          </p>
          <Link to="/Signup" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="sectionContainer">
        <div className="row text-center">
          <div className="col-md-4">
            <i className="features-icon fas fa-apple-alt"></i>
            <h3>Easy to Use</h3>
            <p>Simple and intuitive interface to track your calories easily.</p>
          </div>
          <div className="col-md-4">
            <i className="features-icon fas fa-chart-line"></i>
            <h3>Detailed Reports</h3>
            <p>Get detailed reports on your calorie intake and progress.</p>
          </div>
          <div className="col-md-4">
            <i className="features-icon fas fa-heart"></i>
            <h3>Health Tips</h3>
            <p>
              Receive health tips and recommendations tailored to your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-light text-center">
        <p>&copy; 2024 Calorie Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
