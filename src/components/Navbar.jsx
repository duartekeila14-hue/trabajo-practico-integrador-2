import { useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setIsLoading(true);
    setError("");

    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      setError("No se pudo contactar al servidor, pero se cerrara la sesion local.");
    } finally {
      localStorage.removeItem("isLogged");
      setIsLoading(false);
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="h-16 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/home"
            className="text-lg font-bold text-indigo-700"
          >
            Mi Blog
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Cerrando..." : "Cerrar sesion"}
          </button>
        </div>
      </nav>
      {error && (
        <div role="alert" className="bg-amber-50 px-4 py-2 text-center text-sm text-amber-700">
          {error}
        </div>
      )}
    </>
  );
};