import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Redirect to home if not authenticated
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;
