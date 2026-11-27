import { useFetch } from "../hooks/useFetch.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const HomePage = () => {
  const { data, isLoading, error } = useFetch(`${API_URL}/api/articles`);

  const articles = Array.isArray(data)
    ? data
    : Array.isArray(data?.articles)
      ? data.articles
      : Array.isArray(data?.data)
        ? data.data
        : [];

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Mi blog
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Articulos publicados</h1>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-slate-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Cargando articulos...
        </div>
      )}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No hay articulos publicados.
        </div>
      )}

      {!isLoading && !error && articles.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">{article.title}</h2>
              <p className="mt-3 text-slate-600">
                {article.excerpt || article.summary || article.description || "Sin resumen"}
              </p>
              <p className="mt-5 text-sm font-medium text-indigo-700">
                Por {article.author?.alias || article.author?.username || "Autor desconocido"}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};