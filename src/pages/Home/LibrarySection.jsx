import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef, useState } from "react";
import moreInfoBtn from "../../assets/images/BTN.svg";
import pdfIcon from "../../assets/images/free-icon-pdf-3997608 1.svg";
import { resolveLibraryAsset } from "../../data/libraryStore";
import { useLibraryItems } from "../../hooks/useLibraryItems";

export default function LibrarySection() {
  const { libraryItems } = useLibraryItems();
  const cards = libraryItems.slice(0, 6);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const elements = sectionRef.current.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [cards.length]);

  return (
    <section
      ref={sectionRef}
      className="pb-[100px] pt-[80px] lg:pb-[180px] lg:pt-[150px]"
    >
      <div className="container-custom">
        <div className="mb-[40px] flex flex-col gap-[30px] lg:mb-[56px] lg:flex-row lg:justify-between">
          <p className="max-w-[475px] text-[14px] leading-[22px] text-black/70 lg:text-[16px]">
            Наша компания постоянно развивается и делится полезной
            профессиональной литературой, статьями и материалами для врачей и
            партнеров.
          </p>

          <div>
            <h3 className="text-[28px] italic uppercase text-[#1C2561] lg:text-[48px]">
              НАША
            </h3>
            <h2 className="text-[28px] font-bold uppercase text-[#F61114] lg:text-[48px]">
              БИБЛИОТЕКА
            </h2>
          </div>
        </div>

        <div className="hidden grid-cols-3 gap-[40px] lg:grid">
          {cards.slice(0, visible).map((card) => (
            <div
              key={card.id}
              className="group reveal rounded-[14px] bg-white p-[20px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
            >
              <div className="mb-[24px] max-w-[348px] rounded-[12px]">
                <img
                  src={resolveLibraryAsset(card.image)}
                  alt={card.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110 lg:w-[350px]"
                />
              </div>

              <div className="border-t-[3px] border-[#F61114] pt-[12px]">
                <div className="mb-3 flex items-start gap-[24px]">
                  <h3 className="max-w-[85%] text-[16px] font-bold uppercase leading-[20px] text-black/80">
                    {card.title}
                  </h3>

                  {card.pdf ? (
                    <a
                      href={resolveLibraryAsset(card.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1C2561]"
                    >
                      <img
                        src={pdfIcon}
                        alt="Открыть PDF"
                        className="h-[40px] w-[40px] cursor-pointer transition duration-300 hover:scale-105"
                      />
                    </a>
                  ) : null}
                </div>

                <p className="max-w-full text-[14px] leading-[22px] text-black/70 lg:max-w-[348px]">
                  {card.text || "Описание не заполнено."}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[40px] lg:hidden">
          <Swiper spaceBetween={20} slidesPerView={1.2}>
            {cards.map((card) => (
              <SwiperSlide key={card.id}>
                <div className="rounded-[12px] bg-white p-[16px] shadow">
                  <div className="mb-[20px] overflow-hidden rounded-[12px]">
                    <img
                      src={resolveLibraryAsset(card.image)}
                      alt={card.title}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </div>

                  <div className="border-t-[3px] border-[#F61114] pt-[12px]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-[14px] font-bold uppercase">
                        {card.title}
                      </h3>

                      {card.pdf ? (
                        <a
                          href={resolveLibraryAsset(card.pdf)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={pdfIcon} alt="PDF" className="w-[36px]" />
                        </a>
                      ) : null}
                    </div>

                    <p className="text-[13px] text-black/70">
                      {card.text || "Описание не заполнено."}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {visible < cards.length ? (
          <button type="button" onClick={() => setVisible((prev) => prev + 3)} className="mt-[72px]">
            <img
              src={moreInfoBtn}
              alt="Показать больше"
              className="w-[220px] cursor-pointer transition duration-300 hover:scale-105"
            />
          </button>
        ) : null}
      </div>
    </section>
  );
}
