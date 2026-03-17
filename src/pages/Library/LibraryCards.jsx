import { useState } from "react";
import searchIcon from "../../assets/libraryimages/Search.svg";
import findBtn from "../../assets/libraryimages/BTN (2).svg";
import pdfIcon from "../../assets/libraryimages/free-icon-pdf-3997608 1.svg";
import { resolveLibraryAsset } from "../../data/libraryStore";
import { useLibraryItems } from "../../hooks/useLibraryItems";

export default function LibraryCards() {
  const { libraryItems, loading, error } = useLibraryItems();
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(6);

  const filteredArticles = libraryItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisible((prev) => prev + 3);
  };

  return (
    <section className="pb-[120px] pt-[80px] lg:pb-[180px] lg:pt-[120px]">
      <div className="container-custom">
        <h2 className="mb-[30px] text-[20px] font-bold text-[#16226C] lg:mb-[36px] lg:text-[24px]">
          Поиск по библиотеке
        </h2>

        <div className="mb-[50px] flex flex-col gap-[20px] sm:flex-row sm:items-center sm:gap-[30px] lg:mb-[72px]">
          <div className="flex w-full items-center gap-[10px] rounded-[8px] bg-white px-[16px] py-[8px] shadow-sm">
            <img src={searchIcon} alt="" className="h-[18px] w-[18px]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск..."
              className="w-full text-[14px] outline-none"
            />
          </div>

          <button type="button" onClick={() => setSearch(search)}>
            <img
              src={findBtn}
              alt=""
              className="w-[76px] transition hover:scale-105"
            />
          </button>
        </div>

        {loading ? (
          <div className="rounded-[18px] bg-white px-5 py-4 text-sm text-[#4A5676]">
            Загрузка библиотеки...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[18px] border border-[#F1C9CC] bg-[#FFF1F2] px-5 py-4 text-sm text-[#A32024]">
            {error}
          </div>
        ) : null}

        {!loading && !error && filteredArticles.length === 0 ? (
          <div className="mt-[40px] text-center text-[18px] text-gray-500">
            Ничего не найдено
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
          {filteredArticles.slice(0, visible).map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-[14px] bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={resolveLibraryAsset(item.image)}
                  alt={item.title}
                  className="h-[220px] w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>

              <div className="border-t-[3px] border-[#F61114] p-[20px] pt-[16px]">
                <div className="mb-[16px] flex items-start justify-between gap-[16px]">
                  <h3 className="text-[14px] font-bold uppercase leading-[20px] text-black/80 lg:text-[16px]">
                    {item.title}
                  </h3>

                  {item.pdf ? (
                    <a
                      href={resolveLibraryAsset(item.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={pdfIcon}
                        alt="pdf"
                        className="h-[36px] w-[36px] cursor-pointer transition duration-300 hover:rotate-6 hover:scale-110"
                      />
                    </a>
                  ) : null}
                </div>

                <p className="text-[13px] leading-[22px] text-black/70 lg:text-[14px]">
                  {item.text || "Описание не заполнено."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {visible < filteredArticles.length ? (
          <div className="mt-[60px] flex justify-center lg:mt-[72px]">
            <button
              type="button"
              onClick={handleLoadMore}
              className="flex items-center gap-[16px] font-bold text-[#1C2561] transition-all duration-300 hover:gap-[22px]"
            >
              Показать больше
              <span className="text-[24px]">↓</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
