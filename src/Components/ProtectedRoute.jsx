import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken } from "../services/api";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
