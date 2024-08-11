import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Home.css";
import { Link } from "react-router-dom";
import FeatureSection from "../components/FeaturesSection";
import Hero from "../components/LandingPage";
import Testimonial from "../components/Testimonials";
import Footer from "../components/Footer";

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

  const testimonials = [
    {
      quote: "Love this app. It keeps me on track with my nutritional goals.",
      author: "Annette B.",
    },
    {
      quote:
        "Not only are the tools super helpful, the customer service is insanely awesome!",
      author: "Laura K.",
    },
    {
      quote:
        "Helped me get moving on my goals and tracking my weight loss and bodybuilding.",
      author: "Jason L.",
    },
    {
      quote:
        "Good for tracking calories and macros with a huge database of food.",
      author: "Iain M.",
    },
    {
      quote: "Friendly, easy-to-use app that keeps me accountable.",
      author: "Dinah L.",
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleDotClick = (index) => {
    setCurrentTestimonial(index);
  };

  return (
    <>
      <Hero />
      <FeatureSection />
      <Testimonial />
      <Footer />
    </>
  );
}

export default Home;
