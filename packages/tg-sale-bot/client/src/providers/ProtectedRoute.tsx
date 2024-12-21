import { getTokenFromStore } from "@utils/tokenHelper";
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getTokenFromStore(); // 从 Redux store 获取 token

  if (token) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
