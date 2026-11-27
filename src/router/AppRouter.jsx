import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { HomePage } from "../pages/HomePage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { PrivateRoutes } from "./PrivateRoutes.jsx";
import { PublicRoutes } from "./PublicRoutes.jsx";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/"
          element={
            localStorage.getItem("isLogged") === "true"
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="*"
          element={
            localStorage.getItem("isLogged") === "true"
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};