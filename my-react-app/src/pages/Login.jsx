import React, { useState, useEffect } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  let csrfToken = null;
  const getCsrfToken = async () => {
    const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
      method: "GET",
      credentials: "include",
    });
    let result = await request.json();
    csrfToken = result.csrf;
    return csrfToken;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/log_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": await getCsrfToken(),
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      console.log(token);
      localStorage.setItem("token", token);
      console.log(data);
      window.location.reload();
    }
  };

  return (
    <>
      <form action="">
        <input
          type="text"
          onChange={handleUsername}
          placeholder="enter username"
          required
        />
        <input
          type="password"
          onChange={handlePassword}
          placeholder="enter password"
          required
        />
        <button onClick={handleLogin}>Submit</button>
      </form>
      <div>
        <h2>Login Page</h2>
      </div>
    </>
  );
};

export default Login;
