import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/productimages/Search.svg";
import findBtn from "../../assets/productimages/BTN (2).svg";
import capsulemed1 from "../../assets/productimages/Image (4).svg";

export default function ProductsSidebar({
  categories,
  products,
  search,
  setSearch,
  setLetter,
  setOpenSidebar
}) {
  const filters = categories.map((item, index) => ({
    id: index + 1,
    title: item.title,
    value: item.value,
    items:
      item.value === "all"
        ? []
        : products
            .filter((product) => product.category === item.value)
            .map((product) => product.name),
  }));

  const [openId, setOpenId] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);

  const navigate = useNavigate();

  const searchRef = useRef(null);

  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  useEffect(() => {
    if (openSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [openSearch]);

  /* swipe close */

  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;

    if (distance > 80) {
      setOpenSidebar(false);
    }
  };

  const filteredFilters = filters
    .map((f) => ({
      ...f,
      items: f.items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(
      (f) =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.items.length > 0
    );

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative bg-[#EBF3F9] w-[260px] lg:w-[480px] h-screen overflow-y-auto scroll-hide lg:h-full pt-[30px] px-4 lg:pr-[49px] lg:pl-[130px]"
    >

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setOpenSidebar(false)}
        className="lg:hidden absolute top-[15px] right-[15px] text-[22px]"
      >
        ✕
      </button>

      {/* SEARCH */}
      <h3 className="text-[#16226C] text-[20px] lg:text-[24px] leading-[160%] font-bold mb-[36px]">
        Поиск
      </h3>

      <div className="mb-[20px] relative">

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:flex items-center gap-[10px]">

          <img src={searchIcon} className="w-[24px]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-[#1C256133] bg-transparent outline-none text-[14px]"
          />

          <img
            src={findBtn}
            alt="Найти"
            className="w-[76px] cursor-pointer hover:scale-105 transition"
          />

        </div>

        {/* MOBILE ICON */}
        <div className="lg:hidden flex items-center">

          <button onClick={() => setOpenSearch(!openSearch)}>
            <img src={searchIcon} className="w-[22px]" />
          </button>

        </div>

        {/* MOBILE SEARCH DROPDOWN */}
        <div
          className={`lg:hidden absolute top-[40px] left-0 bg-[#EBF3F9] rounded-md shadow-md overflow-hidden transition-all duration-300
          ${openSearch ? "w-[140px] p-[10px] opacity-100" : "w-0 p-0 opacity-0"}`}
        >

          <div className="flex items-center gap-[10px]">

            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[100px] border-b border-[#1C256133] bg-transparent outline-none text-[14px]"
            />

          </div>

        </div>

      </div>

      {/* ALPHABET */}
      <div className="flex flex-wrap gap-[4px] text-[12px] text-[#CACBD7] leading-[160%] mb-[40px]">

        {"А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Э Ю Я"
          .split(" ")
          .map((l) => (
            <button
              key={l}
              onClick={() => setLetter(l)}
              className="hover:text-[#16226C] transition"
            >
              {l}
            </button>
          ))}

      </div>

      {/* FILTER TITLE */}
      <h3 className="text-[#16226C] text-[20px] lg:text-[24px] leading-[160%] font-bold mb-[36px] flex items-center gap-[10px]">
        Фильтр

        {openId && (
          <span className="bg-red-600 text-white text-[10px] px-[6px] py-[2px] rounded-full">
            активно
          </span>
        )}

      </h3>

      {/* FILTER LIST */}

      <div className="border-t border-[#CACBD7]">

        {filteredFilters.map((f) => (

          <div key={f.id} className="border-b border-[#CACBD7] py-[20px]">

            <div className="flex justify-between items-center gap-[10px]">

              <p
                onClick={() => {
                  navigate(`/products/${f.value}`);
                  setOpenId(openId === f.id ? null : f.id);
                }}
                className={`text-[12px]
                ${
                  openId === f.id
                    ? "text-[#1C2561] font-bold border-l-[2px] border-[#F61114] pl-[8px]"
                    : "text-[#666666]"
                }`}
              >
                {f.title}
              </p>

              <button
                onClick={() => {
                  navigate(`/products/${f.value}`);
                  setOpenId(openId === f.id ? null : f.id);
                }}
                className="text-[14px] text-[#1C2561] font-extrabold"
              >
                {openId === f.id ? "−" : "+"}
              </button>

            </div>

            {openId === f.id && f.items.length > 0 && (

              <div className="pl-[14px] pt-[10px] text-[13px] text-[#6C7485] space-y-[6px]">

                {f.items.map((i) => (
                  <div key={i}>{i}</div>
                ))}

              </div>

            )}

          </div>

        ))}

      </div>

      {/* capsule */}

      <img
        src={capsulemed1}
        alt=""
        className="hidden lg:block absolute top-[670px] -left-[15px] w-[101px]"
      />

      {/* gradient bottom */}

      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-[#EBF3F9] to-transparent"></div>

    </div>
  );
}
