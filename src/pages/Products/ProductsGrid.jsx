import { useState } from "react";
import cornerShape from "../../assets/productimages/Group 214.svg";
import { resolveProductImage } from "../../data/productsStore";

export default function ProductsGrid({
  products,
  loading = false,
  error = "",
  search = "",
  letter = "",
  category = "",
}) {
  const [activeId, setActiveId] = useState(null);
  const filterSignature = `${search}::${letter}::${category}`;
  const [viewState, setViewState] = useState({
    filterSignature,
    page: 1,
    perPage: 8,
  });

  const page = viewState.filterSignature === filterSignature ? viewState.page : 1;
  const perPage = viewState.filterSignature === filterSignature ? viewState.perPage : 8;

  const handleShowMore = () => {
    setViewState({
      filterSignature,
      page,
      perPage: perPage + 8,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      !search || product.name.toLowerCase().includes(search.toLowerCase());
    const matchLetter = !letter || product.name.startsWith(letter);
    const matchCategory =
      !category || category === "all" || product.category === category;

    return matchSearch && matchLetter && matchCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);

  return (
    <div className="px-[16px]">
      {loading ? (
        <div className="mb-[24px] rounded-[16px] bg-[#F3F7FB] px-5 py-4 text-sm text-[#4A5676]">
          Загрузка препаратов...
        </div>
      ) : null}

      {error ? (
        <div className="mb-[24px] rounded-[16px] border border-[#F1C9CC] bg-[#FFF1F2] px-5 py-4 text-sm text-[#A32024]">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-[20px]">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => {
            const productImage = resolveProductImage(product.image);

            return (
              <div
                key={product.id}
                onClick={() => setActiveId(product.id)}
                className={`relative cursor-pointer rounded-[14px] bg-white pb-[70px] pl-[32px] pr-[30px] pt-[32px] transition ${
                  activeId === product.id
                    ? "border border-[#8D91AF] shadow-[2px_2px_20px_rgba(0,0,0,0.25)]"
                    : "border border-[#E3E7EF]"
                }`}
              >
                <div className="mb-[10px] flex h-[200px] w-[255px] items-center justify-center lg:mb-[20px] lg:h-[255px]">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#F3F7FB] text-sm text-[#6C7485]">
                      Нет изображения
                    </div>
                  )}
                </div>

                <h3 className="mb-[16px] text-[20px] font-bold leading-[160%] text-[#16226C] lg:text-[24px]">
                  {product.name}
                </h3>

                <div className="max-w-[255px] text-[12px] leading-[160%] text-black/70">
                  {product.desc.map((item, index) => (
                    <p key={`${product.id}-${index}`}>
                      {item.label}
                      {item.label && item.value ? ":" : ""}{" "}
                      <span className="font-bold text-black">{item.value}</span>
                    </p>
                  ))}
                </div>

                {activeId === product.id ? (
                  <img
                    src={cornerShape}
                    alt=""
                    className="absolute bottom-0 right-0 w-[120px]"
                  />
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="mt-[40px] text-[18px] text-gray-400">Препараты не найдены</div>
        )}
      </div>

      {perPage < filteredProducts.length ? (
        <div className="mt-[40px] text-center">
          <button
            onClick={handleShowMore}
            className="text-[12px] font-bold text-[#1C2561] transition hover:text-red-600 lg:text-[16px]"
          >
            Показать еще
          </button>
        </div>
      ) : null}

      {totalPages > 0 ? (
        <div className="mt-[36px] flex items-center justify-center gap-[18px]">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
            <button
              key={item}
              onClick={() =>
                setViewState({
                  filterSignature,
                  page: item,
                  perPage,
                })
              }
              className={`flex h-[25px] w-[25px] items-center justify-center rounded-full text-[12px] font-bold lg:h-[35px] lg:w-[35px] ${
                page === item ? "bg-red-600 text-white" : "text-[#97A2A9]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
