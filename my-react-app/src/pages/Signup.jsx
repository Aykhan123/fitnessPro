import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ onSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleMakeUser = async (e) => {
    e.preventDefault();
    const token = await getCsrfToken();

    const response = await fetch("http://127.0.0.1:8000/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const logIn = await fetch("http://127.0.0.1:8000/log_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": token,
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (logIn.ok) {
        const data = await logIn.json();
        const token = data.token;
        localStorage.setItem("token", token);
        navigate("/");
      } else {
        console.log("Failed to log in");
      }
    } else {
      console.log("Failed to create user");
    }
  };

  return (
    <>
      <form onSubmit={handleMakeUser}>
        <input
          onChange={handleUsername}
          placeholder="enter username"
          required
        />
        <input
          onChange={handlePassword}
          placeholder="enter password"
          type="password"
          required
        />
        <button>Submit</button>
      </form>
      <h1>THIS IS THE SIGN UP PAGE</h1>
    </>
  );
};

export default Signup;
