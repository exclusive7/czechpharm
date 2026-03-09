import { useState } from "react";
import img1 from "../../assets/libraryimages/books-and-stethoscope_1150-18056 1.png";
import img2 from "../../assets/libraryimages/portrait-of-a-doctor_144627-39401 1.png";
import img3 from "../../assets/libraryimages/stacked-books-pencil-and-stethoscope-on-white-surface_23-2147941812 1.png";
import searchIcon from "../../assets/libraryimages/Search.svg";
import findBtn from "../../assets/libraryimages/BTN (2).svg";
import pdfIcon from "../../assets/libraryimages/free-icon-pdf-3997608 1.svg";
import pdf1 from "../../assets/libraryimages/Gulmira_Ilyasova_CV.pdf";

const articles = [
  {
    id: 1,
    image: img3,
    title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ. БЕСПЛОДИЕ. МКБ",
    pdf: pdf1,
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: 2,
    image: img2,
    title: "МЕТАБОЛИЧЕСКИЙ СИНДРОМ. ЖКТ",
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: 3,
    image: img1,
    title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ",
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: 4,
    image: img3,
    title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ",
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: 5,
    image: img2,
    title: "МЕТАБОЛИЧЕСКИЙ СИНДРОМ",
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: 6,
    image: img1,
    title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ",
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: 7,
    image: img3,
    title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ",
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: 8,
    image: img2,
    title: "МЕТАБОЛИЧЕСКИЙ СИНДРОМ",
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
  {
    id: 9,
    image: img1,
    title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ",
    text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
  },
];

export default function LibraryCards() {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(6);

  const filteredArticles = articles.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisible((prev) => prev + 3);
  };

  return (
    <section className="pt-[80px] lg:pt-[120px] pb-[120px] lg:pb-[180px]">
      <div className="container-custom">

        {/* TITLE */}
        <h2 className="text-[20px] lg:text-[24px] font-bold text-[#16226C] mb-[30px] lg:mb-[36px]">
          Поиск по библиотеке
        </h2>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-[20px] sm:gap-[30px] mb-[50px] lg:mb-[72px]">

          <div className="flex items-center gap-[10px] w-full bg-white px-[16px] py-[8px] rounded-[8px] shadow-sm">
            <img src={searchIcon} alt="" className="w-[18px] h-[18px]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full outline-none text-[14px]"
            />
          </div>

          <button onClick={() => setSearch(search)}>
            <img src={findBtn} alt="" className="w-[76px] hover:scale-105 transition" />
          </button>

        </div>

        {/* EMPTY */}
        {filteredArticles.length === 0 && (
          <div className="text-center text-gray-500 text-[18px] mt-[40px]">
            Ничего не найдено
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] lg:gap-[30px]">

          {filteredArticles.slice(0, visible).map((item) => (
            <div
              key={item.id}
              className="
              group
              bg-white
              rounded-[14px]
              overflow-hidden
              shadow-sm
              hover:shadow-2xl
              transition
              duration-500
              hover:-translate-y-2
              "
            >

              {/* IMAGE */}
              <div className="overflow-hidden relative">

                <img
                  src={item.image}
                  alt=""
                  className="w-full h-[220px] object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="
                absolute inset-0
                bg-gradient-to-t
                from-black/20
                to-transparent
                opacity-0
                group-hover:opacity-100
                transition
                "></div>

              </div>

              {/* CONTENT */}
              <div className="p-[20px] pt-[16px] border-t-[3px] border-[#F61114]">

                <div className="flex justify-between gap-[16px] items-start mb-[16px]">

                  <h3 className="text-[14px] lg:text-[16px] font-bold text-black/80 leading-[20px] uppercase">
                    {item.title}
                  </h3>

                  {item.pdf && (
                    <a href={item.pdf} target="_blank" rel="noopener noreferrer">

                      <img
                        src={pdfIcon}
                        alt="pdf"
                        className="
                        w-[36px]
                        h-[36px]
                        cursor-pointer
                        transition
                        duration-300
                        hover:scale-110
                        hover:rotate-6
                        "
                      />

                    </a>
                  )}

                </div>

                <p className="text-[13px] lg:text-[14px] text-black/70 leading-[22px]">
                  {item.text}
                </p>

              </div>

            </div>
          ))}
        </div>

        {/* LOAD MORE */}
        {visible < articles.length && (
          <div className="flex justify-center mt-[60px] lg:mt-[72px]">

            <button
              onClick={handleLoadMore}
              className="
              text-[#1C2561]
              font-bold
              flex
              items-center
              gap-[16px]
              hover:gap-[22px]
              transition-all
              duration-300
              "
            >
              Показать больше
              <span className="text-[24px]">↓</span>
            </button>

          </div>
        )}

      </div>
    </section>
  );
}

