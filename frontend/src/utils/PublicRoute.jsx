import { useEffect, useState } from "react";
import { verifyToken } from "./Auth";
import { Navigate } from "react-router-dom";
import Loader from "../Loader";

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await verifyToken();
      setIsAuthenticated(valid);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <Loader/>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
