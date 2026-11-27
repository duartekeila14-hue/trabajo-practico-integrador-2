import { Navigate, Outlet } from "react-router";
import { Navbar } from "../components/Navbar.jsx";

export const PrivateRoutes = () => {
  const isLogged = localStorage.getItem("isLogged") === "true";

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};