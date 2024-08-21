import { useNavigate, Navigate } from "react-router-dom";

const Logout = ({ onLogout }) => {
  let navigate = useNavigate();
  // let csrfToken = null;
  // const getCsrfToken = async () => {
  //   const request = await fetch("http://127.0.0.1:8000/csrftoken/", {
  //     method: "GET",
  //     credentials: "include",
  //   });
  //   let result = await request.json();
  //   csrfToken = result.csrf;
  //   return csrfToken;
  // };
  // const handleLogout = async () => {
  //   const token = localStorage.getItem("token");
  //   console.log(token);
  //   if (token) {
  //     const response = await fetch("http://127.0.0.1:8000/sign_out", {
  //       method: "POST",
  //       headers: {
  //         "X-CSRFToken": await getCsrfToken(),
  //         Authorization: `Token ${token}`,
  //       },
  //     });
  //     if (response.ok) {
  //       localStorage.removeItem("token");
  //       console.log("token removed successfully");
  //       navigate("/");
  //       window.location.reload();
  //     }
  //   }
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };
  // };

  return (
    <>
      <button onClick={handleLogout}>Logout</button>

      <h1>LOG OUT PAGE</h1>
    </>
  );
};

export default Logout;
