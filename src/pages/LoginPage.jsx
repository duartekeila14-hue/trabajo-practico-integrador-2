import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "../hooks/useForm.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { form, handleInputChange } = useForm({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let responseData = null;
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("isLogged", "true");
        navigate("/home");
        return;
      }

      if (response.status === 400) {
        const validationErrors = responseData?.errors;
        setError(
          Array.isArray(validationErrors)
            ? validationErrors.map((item) => item.msg || item.message).filter(Boolean).join(". ")
            : responseData?.message || "Los datos ingresados no son validos.",
        );
      } else if (response.status === 401) {
        setError("Usuario o contrasena incorrectos.");
      } else if (response.status === 403) {
        setError("No tenes permisos para iniciar sesion.");
      } else if (response.status === 500) {
        setError("Ocurrio un error interno en el servidor.");
      } else {
        setError(responseData?.message || "No se pudo iniciar sesion.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-9">
        <h1 className="text-3xl font-bold text-slate-900">Iniciar sesion</h1>
        <p className="mt-2 text-slate-500">Ingresa tus credenciales para continuar.</p>

        {error && (
          <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700">
            Usuario
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              name="username"
              type="text"
              value={form.username}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Contrasena
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              name="password"
              type="password"
              value={form.password}
              onChange={handleInputChange}
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          No tienes cuenta?{" "}
          <Link className="font-semibold text-indigo-600 hover:text-indigo-800" to="/register">
            Registrate
          </Link>
        </p>
      </section>
    </main>
  );
};