import { useParams } from "react-router-dom";
import { useState } from "react";
import ProductsHero from "./ProductsHero";
import Breadcrumb from "../../components/Breadcrumb";
import ProductsSidebar from "./ProductsSidebar";
import ProductsGrid from "./ProductsGrid";

export default function Products() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState("");
  const { category } = useParams();

  const categoryTitles = {
    all: "ВСЕ",
    new: "НОВИНКИ",
    vascular: "ОНМК. ХНИК. СОСУДИСТЫЕ ЗАБОЛЕВАНИЯ. ИБС",
    neuro:
      "НЕЙРО-ДЕГЕНЕРАТИВНЫЕ ЗАБОЛЕВАНИЯ ОПОРНО-ДВИГАТЕЛЬНОГО АППАРАТА. ОСТЕОПОРОЗ",
    metabolic: "МЕТАБОЛИЧЕСКИЙ СИНДРОМ. ЖКТ. НИЗКОРОСЛОСТЬ",
    erectile: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ. БЕСПЛОДИЕ. МКБ",
  };

  return (
    <>
      <ProductsHero />
      <div className="container-custom pt-[64px]">
        <Breadcrumb
          items={[
            { label: "Препараты", link: "/products" },
            ...(category ? [{ label: categoryTitles[category] }] : []),
          ]}
        />
      </div>

      <button
        onClick={() => setOpenSidebar(true)}
        className="lg:hidden flex items-center gap-[8px] border border-[#D7DEEA] rounded-[10px] px-[14px] py-[10px] text-[#1C2561] mt-[40px] ml-[12px] bg-white shadow-sm hover:shadow-md transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[18px]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#1C2561"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5h18M6 12h12M10 19h4"
          />
        </svg>

        <span className="text-[14px] font-semibold">Фильтр</span>
      </button>

      <section className="py-[40px] lg:py-[60px]">
        <div className="flex gap-[30px]">
          {/* SIDEBAR */}
          <div
            className={`
fixed top-0 left-0 z-50
transform transition-transform duration-300
${openSidebar ? "translate-x-0" : "-translate-x-full"}
lg:relative lg:translate-x-0
`}
          >
            <ProductsSidebar
              search={search}
              setSearch={setSearch}
              setLetter={setLetter}
              setOpenSidebar={setOpenSidebar}
            />
          </div>

          {/* PRODUCTS GRID */}

          <ProductsGrid search={search} letter={letter} category={category} />
        </div>
      </section>
    </>
  );
}
