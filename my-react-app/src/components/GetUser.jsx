import { useState, useEffect } from "react";

const GetUser = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const getCsrfToken = async () => {
          const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
            method: "GET",
            credentials: "include",
          });
          const result = await request.json();
          return result.csrf;
        };

        const csrfToken = await getCsrfToken();

        const response = await fetch("http://127.0.0.1:8000/get_username", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
            "X-CSRFToken": csrfToken,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.username);
        } else {
          console.error("Failed to fetch username");
        }
      }
    };

    fetchUser();
  }, []); 
  return <h3>{userName}</h3>;
};

export default GetUser;
