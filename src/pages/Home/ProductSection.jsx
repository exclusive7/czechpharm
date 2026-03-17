import { useState } from "react";
import { resolveProductImage } from "../../data/productsStore";
import { useProducts } from "../../hooks/useProducts";
import { useSiteContent } from "../../hooks/useSiteContent";
import { getCategoryTitle } from "../../data/siteContentStore";

export default function ProductsSection() {
  const [openId, setOpenId] = useState(null);
  const [activeMedicine, setActiveMedicine] = useState(null);

  const { products, loading, error } = useProducts();
  const { siteContent, loading: siteContentLoading, error: siteContentError } =
    useSiteContent();

  const productsData = siteContent.homeProducts.categoryValues
    .map((categoryValue, index) => {
      const categoryTitle =
        getCategoryTitle(categoryValue, siteContent.categories) || categoryValue;

      const medicines = products
        .filter((product) => product.category === categoryValue)
        .map((product) => ({
          id: product.id,
          name: product.name,
          image: resolveProductImage(product.image),
          description: product.summary || product.desc[0]?.value || "",
        }));

      return {
        id: index + 1,
        title: categoryTitle,
        medicines,
      };
    })
    .filter((item) => item.medicines.length > 0);
  return (
    <section className="py-[80px] lg:py-[140px]">
      <div className="container-custom">

        {/* TITLE */}
        <div className="mb-[56px]">
          <h2 className="text-[28px] lg:text-[48px] text-[#1C2561] uppercase italic">
            {siteContent.homeProducts.eyebrow}
          </h2>
          <h1 className="text-[28px] lg:text-[48px] font-bold text-[#1C2561]">
            {siteContent.homeProducts.titlePrimary}{" "}
            <span className="text-[#F61114]">
              {siteContent.homeProducts.titleAccent}
            </span>
          </h1>
        </div>

        {/* ACCORDION */}
        <div className="border-t border-[#CACBD7]">
          {loading ? (
            <div className="py-[24px] text-sm text-[#4A5676]">Загрузка препаратов...</div>
          ) : null}

          {siteContentLoading ? (
            <div className="py-[24px] text-sm text-[#4A5676]">
              Загрузка настроек блока...
            </div>
          ) : null}

          {error ? (
            <div className="py-[24px] text-sm text-[#A32024]">{error}</div>
          ) : null}

          {siteContentError ? (
            <div className="py-[24px] text-sm text-[#A32024]">{siteContentError}</div>
          ) : null}

          {productsData.map((item) => (

            <div key={item.id} className="border-b border-[#CACBD7]">

              {/* HEADER */}
              <button
                onClick={() => {
                  const isOpen = openId === item.id;
                  setOpenId(isOpen ? null : item.id);
                  setActiveMedicine(!isOpen ? item.medicines[0]?.id : null);
                }}
                className="w-full flex items-center justify-between py-[24px] hover:bg-gray-50 transition"
              >
                <span className="text-[14px] lg:text-[18px] text-[#1C2561] font-bold text-left">
                  {item.title}
                </span>

                <span className="text-[18px] lg:text-[24px] font-bold text-[#1C2561]">
                  {openId === item.id ? "−" : "+"}
                </span>
              </button>

              {/* CONTENT */}
              {openId === item.id && (

                <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[120px] items-start pb-[40px] pt-[10px]">

                  {/* MEDICINES */}
                  <div className="w-full lg:w-[320px] space-y-2">

                    {item.medicines.map((med) => (

                      <div
                        key={med.id}
                        onClick={() => setActiveMedicine(med.id)}
                        className={`
                        cursor-pointer
                        pl-4
                        py-3
                        border-l-4
                        transition-all
                        duration-200
                        hover:bg-gray-50
                        ${
                          activeMedicine === med.id
                            ? "border-[#F61114] font-bold text-[#1C2561]"
                            : "border-transparent text-black/70"
                        }
                        `}
                      >
                        {med.name}
                      </div>

                    ))}

                  </div>

                  {/* INFO */}
                  <div className="flex-1 w-full">

                    {item.medicines.map((med) =>
                      activeMedicine === med.id ? (

                        <div key={med.id} className="animate-fadeIn">

                          <p className="text-[14px] text-black/70 leading-[22px] mb-6">
                            {med.description}
                          </p>

                          {med.image ? (
                            <img
                              src={med.image}
                              className="w-[180px] lg:w-[373px] mx-auto lg:mx-0 object-contain transition duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-[180px] w-[180px] items-center justify-center rounded-[18px] bg-[#F3F7FB] text-sm text-[#6C7485] lg:h-[240px] lg:w-[373px]">
                              Нет изображения
                            </div>
                          )}

                        </div>

                      ) : null
                    )}

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
