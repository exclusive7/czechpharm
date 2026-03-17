import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import LibraryPage from "./pages/LibraryPage";
import VacanciesPage from "./pages/VacanciesPage";
import VacancyDetail from "./pages/vacancies/VacancyDetail";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import RequireAdminAuth from "./components/admin/RequireAdminAuth";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProductsAdminPage from "./pages/admin/ProductsAdminPage";
import LibraryAdminPage from "./pages/admin/LibraryAdminPage";
import VacanciesAdminPage from "./pages/admin/VacanciesAdminPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route
            path="/admin/catalog"
            element={<Navigate to="/" replace />}
          />
          <Route
            path="/admin/products"
            element={<Navigate to="/" replace />}
          />
          <Route
            path="/admin/library"
            element={<Navigate to="/" replace />}
          />
          <Route
            path="/admin/vacancies"
            element={<Navigate to="/" replace />}
          />
          <Route path="/admin/manage/login" element={<AdminLoginPage />} />
          <Route element={<RequireAdminAuth />}>
            <Route path="/admin/manage" element={<AdminDashboardPage />} />
            <Route path="/admin/manage/catalog" element={<ProductsAdminPage />} />
            <Route path="/admin/manage/library" element={<LibraryAdminPage />} />
            <Route path="/admin/manage/vacancies" element={<VacanciesAdminPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category" element={<Products />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/vacancies" element={<VacanciesPage />} />
            <Route path="/vacancies/:slug" element={<VacancyDetail />} />
            <Route path="/contacts" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
