import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");

  // Se não estiver logado, redireciona para /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
