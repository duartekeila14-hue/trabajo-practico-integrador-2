import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "../hooks/useForm.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { form, handleInputChange, handleReset } = useForm({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setValidationErrors([]);
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
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
        handleReset();
        setSuccess("Registro exitoso. Ya podes iniciar sesion.");
        navigate("/login");
        return;
      }

      if (response.status === 400) {
        const errors = Array.isArray(responseData?.errors) ? responseData.errors : [];
        setValidationErrors(errors);
        setError(
          errors.length === 0
            ? responseData?.message || "Los datos del registro no son validos."
            : "",
        );
      } else if (response.status === 401) {
        setError("Necesitas iniciar sesion para realizar esta accion.");
      } else if (response.status === 403) {
        setError("No tenes permisos para registrarte.");
      } else if (response.status === 500) {
        setError("Ocurrio un error interno en el servidor.");
      } else {
        setError(responseData?.message || "No se pudo completar el registro.");
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
        <h1 className="text-3xl font-bold text-slate-900">Crear cuenta</h1>
        <p className="mt-2 text-slate-500">Completa tus datos para registrarte.</p>

        {error && (
          <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}
        {validationErrors.length > 0 && (
          <ul className="mt-5 list-disc space-y-1 rounded-lg border border-red-200 bg-red-50 p-3 pl-8 text-sm text-red-700">
            {validationErrors.map((item, index) => (
              <li key={`${item.param || item.field || "error"}-${index}`}>
                {item.msg || item.message || "Dato invalido"}
              </li>
            ))}
          </ul>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {[
            { label: "Usuario", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Contrasena", name: "password", type: "password" },
            { label: "Nombre de perfil", name: "name", type: "text" },
          ].map((field) => (
            <label key={field.name} className="block text-sm font-semibold text-slate-700">
              {field.label}
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleInputChange}
                required
              />
            </label>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Ya tienes cuenta?{" "}
          <Link className="font-semibold text-indigo-600 hover:text-indigo-800" to="/login">
            Inicia sesion
          </Link>
        </p>
      </section>
    </main>
  );
};