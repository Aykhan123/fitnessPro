import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Tracker from "./Tracker.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
