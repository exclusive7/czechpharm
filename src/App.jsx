import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
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
  );
}
