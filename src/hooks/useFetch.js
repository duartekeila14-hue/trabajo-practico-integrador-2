import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) {
      return;
    }

    fetchData(url, setData, setIsLoading, setError);
  }, [url]);

  return { data, isLoading, error };
};

const fetchData = async (url, setData, setIsLoading, setError) => {
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch(url, { credentials: "include" });
    let responseData = null;

    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No hay una sesion activa.");
      }
      if (response.status === 403) {
        throw new Error("No tenes permisos para realizar esta accion.");
      }
      if (response.status === 500) {
        throw new Error("Ocurrio un error interno en el servidor.");
      }
      throw new Error(responseData?.message || "No se pudieron obtener los datos.");
    }

    setData(responseData);
  } catch (requestError) {
    setError(
      requestError instanceof Error
        ? requestError.message
        : "No se pudo conectar con el servidor.",
    );
  } finally {
    setIsLoading(false);
  }
};