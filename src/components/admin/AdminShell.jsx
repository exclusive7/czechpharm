import { Link, NavLink } from "react-router-dom";
import { ADMIN_SECTIONS } from "../../data/adminSections";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminShell({
  title,
  description,
  actions,
  children,
}) {
  const { logout } = useAdminAuth();

  return (
    <main className="min-h-screen bg-[#F4F7FB] py-[40px] lg:py-[56px]">
      <div className="container-custom space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#4A5676]">
          <Link
            to="/admin/manage"
            className="font-semibold text-[#1C2561] hover:underline"
          >
            Все разделы
          </Link>
          <span>/</span>
          <span>{title}</span>
        </div>

        <section className="rounded-[32px] bg-[#1F2B7B] px-6 py-8 text-white shadow-[0_20px_50px_rgba(22,34,108,0.18)] lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[860px]">
              <p className="text-sm uppercase tracking-[0.28em] text-white/70">
                Панель администратора
              </p>
              <h1 className="mt-3 text-[34px] font-semibold leading-tight lg:text-[48px]">
                {title}
              </h1>
              {description ? (
                <p className="mt-4 text-[15px] leading-[1.7] text-white/78 lg:text-[17px]">
                  {description}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {actions}
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#1F2B7B]"
              >
                Выйти
              </button>
            </div>
          </div>
        </section>

        <nav className="flex flex-wrap gap-3">
          {ADMIN_SECTIONS.map((section) => (
            <NavLink
              key={section.id}
              to={section.to}
              className={({ isActive }) =>
                `rounded-full border px-5 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-[#1C2561] bg-[#1C2561] text-white"
                    : "border-[#D8DEEA] bg-white text-[#1C2561] hover:border-[#1C2561]"
                }`
              }
            >
              {section.title}
            </NavLink>
          ))}
        </nav>

        {children}
      </div>
    </main>
  );
}
