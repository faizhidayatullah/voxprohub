import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireRole({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === role ? <Outlet /> : <Navigate to="/" replace />;
}
