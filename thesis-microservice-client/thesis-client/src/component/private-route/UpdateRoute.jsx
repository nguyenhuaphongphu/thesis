import { Outlet, Navigate } from "react-router-dom";

export default function UpdateRoute() {
  const user = JSON.parse(localStorage.getItem("user")) || [];

  function isAuth() {
    if (user.roles?.includes("ROLE_UPDATER")) {
      return true;
    } else {
      false;
    }
  }
  const auth = isAuth();
  return auth ? <Outlet /> : <Navigate to="/login" />;
}
