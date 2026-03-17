import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, login } = useAdminAuth();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const redirectPath = "/admin/manage";

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await login(formState);
      navigate(redirectPath, { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Не удалось выполнить вход.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-4 py-10">
      <section className="w-full max-w-[520px] rounded-[32px] bg-white p-8 shadow-[0_22px_60px_rgba(22,34,108,0.12)] lg:p-10">
        <p className="text-sm uppercase tracking-[0.26em] text-[#6C7485]">
          Админ-панель
        </p>
        <h1 className="mt-3 text-[34px] font-semibold leading-tight text-[#1C2561]">
          Вход в управление сайтом
        </h1>
        <p className="mt-4 text-[15px] leading-[1.7] text-[#4A5676]">
          Войдите по логину и паролю. После входа откроются разделы управления
          каталогом, библиотекой и вакансиями.
        </p>

        {error ? (
          <div className="mt-6 rounded-[18px] border border-[#F1C9CC] bg-[#FFF1F2] px-5 py-4 text-sm text-[#A32024]">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
              Логин
            </span>
            <input
              type="text"
              value={formState.email}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
              placeholder="Введите логин"
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#1C2561]">
              Пароль
            </span>
            <input
              type="password"
              value={formState.password}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
              placeholder="Введите пароль"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={saving || loading}
            className="w-full rounded-full bg-[#1C2561] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#141b4c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className="mt-6 text-sm text-[#4A5676]">
          <Link to="/" className="font-semibold text-[#1C2561] hover:underline">
            Вернуться на сайт
          </Link>
        </div>
      </section>
    </main>
  );
}
