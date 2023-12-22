import { Outlet, Navigate } from "react-router-dom";

export default function ManagerRoute() {
  const user = JSON.parse(localStorage.getItem("user")) || [];

  function isAuth() {
    if (user.roles?.includes("ROLE_MANAGER")) {
      return true;
    } else {
      false;
    }
  }
  const auth = isAuth();
  return auth ? <Outlet /> : <Navigate to="/login" />;
}
