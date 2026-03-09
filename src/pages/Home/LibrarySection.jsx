import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";
import { useEffect, useRef } from "react";
import libraryImg1 from "../../assets/images/stacked-books-pencil-and-stethoscope-on-white-surface_23-2147941812 1.png";
import libraryImg2 from "../../assets/images/portrait-of-a-doctor_144627-39401 1.png";
import libraryImg3 from "../../assets/images/books-and-stethoscope_1150-18056 1.png";
import moreInfoBtn from "../../assets/images/BTN.svg";
import pdfIcon from "../../assets/images/free-icon-pdf-3997608 1.svg";
import pdf1 from "../../assets/images/Gulmira_Ilyasova_CV.pdf";

export default function LibrarySection() {
  const cards = [
    {
      id: 1,
      title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ. БЕСПЛОДИЕ. МКБ",
      pdf: pdf1,
      text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
      image: libraryImg1,
    },
    {
      id: 2,
      title: "МЕТАБОЛИЧЕСКИЙ СИНДРОМ. ЖКТ. НИЗКОРОСЛОСТЬ",
      text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
      image: libraryImg2,
    },
    {
      id: 3,
      title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ. БЕСПЛОДИЕ. МКБ",
      text: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore.",
      image: libraryImg3,
    },
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const elements = sectionRef.current.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const [visible, setVisible] = useState(3);

  const handleLoadMore = () => {
    setVisible((prev) => prev + 3);
  };

  return (
    <section
      ref={sectionRef}
      className="pt-[80px] pb-[100px] lg:pt-[150px] lg:pb-[180px]"
    >
      <div className="container-custom">
        {/* TOP HEADER */}
        <div className="flex flex-col lg:flex-row gap-[30px] lg:justify-between mb-[40px] lg:mb-[56px]">
          <p className="max-w-[475px] text-black/70 leading-[22px] text-[14px] lg:text-[16px]">
            Наша компания постоянно развивается и находится в поиске современных
            решений и технологий. Поэтому делимся с Вами тем, что читаем сами:
            полезной литературой, статьями, интересными фактами
          </p>

          <div className="">
            <h3 className="text-[28px] lg:text-[48px] text-[#1C2561] italic uppercase">
              НАША
            </h3>
            <h2 className="text-[28px] lg:text-[48px] font-bold text-[#F61114] uppercase">
              БИБЛИОТЕКА
            </h2>
          </div>
        </div>

        {/* CARDS */}
        {/* DESKTOP GRID */}
        <div className="hidden lg:grid grid-cols-3 gap-[40px]">
          {cards.slice(0, visible).map((card) => (
            <div
              key={card.id}
              className="
  group reveal
  bg-white
  rounded-[14px]
  p-[20px]
  transition-all
  duration-300
  hover:-translate-y-2
  hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]
"
            >
              {/* IMAGE */}
              <div className="rounded-[12px] mb-[24px] max-w-[348px]">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="
  w-full
  lg:w-[350px]
  object-cover
  transition-transform
  duration-500
  group-hover:scale-110
"
                />
              </div>

              {/* CONTENT */}
              <div className="pt-[12px] border-t-[3px] border-[#F61114]">
                <div className="flex gap-[24px] items-start mb-3">
                  <h3 className="text-[16px] font-bold text-black/80 leading-[20px] uppercase max-w-[85%]">
                    {card.title}
                  </h3>

                  <a
                    href={card.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1C2561]"
                  >
                    <img
                      src={pdfIcon}
                      alt="В библиотеку"
                      className="w-[40px] h-[40px] cursor-pointer transition duration-300 hover:scale-105"
                    />
                  </a>
                </div>

                <p className="text-[14px] text-black/70 leading-[22px] max-w-full lg:max-w-[348px]">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE SWIPER */}
        <div className="lg:hidden mt-[40px]">
          <Swiper spaceBetween={20} slidesPerView={1.2}>
            {cards.map((card) => (
              <SwiperSlide key={card.id}>
                <div className="bg-white rounded-[12px] p-[16px] shadow">
                  <div className="overflow-hidden rounded-[12px] mb-[20px]">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </div>

                  <div className="border-t-[3px] border-[#F61114] pt-[12px]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-[14px] font-bold uppercase">
                        {card.title}
                      </h3>

                      <a href={card.pdf} target="_blank">
                        <img src={pdfIcon} className="w-[36px]" />
                      </a>
                    </div>

                    <p className="text-[13px] text-black/70">{card.text}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* BUTTON */}
        {visible < cards.length && (
          <button onClick={handleLoadMore} className="mt-[72px]">
            <img
              src={moreInfoBtn}
              alt="Показать больше"
              className="w-[220px] cursor-pointer transition duration-300 hover:scale-105"
            />
          </button>
        )}
      </div>
    </section>
  );
}
