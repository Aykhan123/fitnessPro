import { useState } from "react";
import PFP from "../assets/PFP.jpg"

const GetImage = async () => {
  const [fetchedImage, setFetchedImage]= useState(PFP)
  const getCsrfToken = async () => {
    const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
      method: "GET",
      credentials: "include",
    });
    let result = await request.json();
    return result.csrf;
  };
  const token = localStorage.getItem("token");
  const response = await fetch("http://127.0.0.1:8000/get_image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
      "X-CSRFToken": await getCsrfToken(),
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data.data) {
      return `data:image/jpeg;base64,${data.data}`;
    }else{
      return fetchedImage
    }
  }
};

export default GetImage;
