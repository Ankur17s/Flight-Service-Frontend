import { Navigate, Outlet } from "react-router-dom";
import { hasAuthToken } from "../common/auth/authStorage";

export function ProtectedRoute() {
  return hasAuthToken() ? <Outlet /> : <Navigate to="/login" replace />;
}
