import { useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN_SECTIONS } from "../../data/adminSections";
import { changeAdminPassword } from "../../data/adminAuthStore";

export default function AdminDashboardPage() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState(null);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordSaving(true);
    setPasswordNotice(null);

    try {
      await changeAdminPassword(passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordNotice({
        type: "success",
        message: "Пароль администратора обновлен.",
      });
    } catch (error) {
      setPasswordNotice({
        type: "error",
        message: error.message || "Не удалось обновить пароль.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] py-[40px] lg:py-[56px]">
      <div className="container-custom space-y-8">
        <section className="rounded-[32px] bg-[#1F2B7B] px-6 py-8 text-white shadow-[0_20px_50px_rgba(22,34,108,0.18)] lg:px-8">
          <p className="text-sm uppercase tracking-[0.28em] text-white/70">
            Панель администратора
          </p>
          <h1 className="mt-3 text-[34px] font-semibold leading-tight lg:text-[48px]">
            Разделы управления сайтом
          </h1>
          <p className="mt-4 max-w-[900px] text-[15px] leading-[1.7] text-white/78 lg:text-[17px]">
            Выберите нужный раздел. У каждого блока сайта теперь своя отдельная
            страница управления.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.id}
              to={section.to}
              className="group rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(22,34,108,0.14)]"
            >
              <div className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">
                Раздел
              </div>
              <h2 className="mt-3 text-[26px] font-semibold text-[#1C2561]">
                {section.title}
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#4A5676]">
                {section.description}
              </p>
              <div className="mt-6 text-sm font-semibold text-[#F61114] transition group-hover:translate-x-1">
                Открыть →
              </div>
            </Link>
          ))}
        </div>

        <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(22,34,108,0.08)] lg:p-8">
          <div className="max-w-[860px]">
            <p className="text-sm uppercase tracking-[0.24em] text-[#6C7485]">
              Безопасность
            </p>
            <h2 className="mt-2 text-[28px] font-semibold text-[#1C2561]">
              Сменить пароль
            </h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-[#4A5676]">
              Пароль обновляется сразу на сервере. После сохранения используйте
              новый пароль для следующих входов.
            </p>
          </div>

          {passwordNotice ? (
            <div
              className={`mt-5 rounded-[18px] px-5 py-4 text-sm ${
                passwordNotice.type === "error"
                  ? "border border-[#F1C9CC] bg-[#FFF1F2] text-[#A32024]"
                  : "border border-[#C7E1CF] bg-[#EDF9F1] text-[#24613A]"
              }`}
            >
              {passwordNotice.message}
            </div>
          ) : null}

          <form
            onSubmit={handlePasswordSubmit}
            className="mt-6 grid gap-4 lg:grid-cols-3"
          >
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
              className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
              placeholder="Текущий пароль"
              autoComplete="current-password"
              required
            />
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
              className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
              placeholder="Новый пароль"
              autoComplete="new-password"
              required
            />
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              className="w-full rounded-[14px] border border-[#D8DEEA] bg-white px-4 py-3 outline-none transition focus:border-[#1C2561]"
              placeholder="Повторите новый пароль"
              autoComplete="new-password"
              required
            />
            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-full bg-[#1C2561] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#141b4c] disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-3 lg:w-fit"
            >
              {passwordSaving ? "Сохранение..." : "Обновить пароль"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
