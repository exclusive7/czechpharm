import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function RequireAdminAuth() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-4">
        <div className="rounded-[24px] bg-white px-6 py-5 text-sm text-[#4A5676] shadow-[0_18px_45px_rgba(22,34,108,0.08)]">
          Проверяем доступ к админ-панели...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/manage/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
