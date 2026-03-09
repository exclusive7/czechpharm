import { useState, useEffect } from "react";
import heroBg from "../../assets/images/Group 18.png";
import waveLines from "../../assets/images/BG-lines.svg";
import bottleCapsules from "../../assets/images/Frame.svg";
import ctaSvg from "../../assets/images/BTN-round-konsultacia.svg";
import moreInfoBtn from "../../assets/images/BTN.svg";

export default function Hero() {
  const [showMore, setShowMore] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.3);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative bg-[#1A6FB9] overflow-hidden">

      {/* PARALLAX BACKGROUND */}
      <div
        className="hidden lg:block absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
          transform: `translateY(${offset}px)`
        }}
      />

      {/* GRADIENT GLOW */}
      <div className="absolute w-[700px] h-[700px] bg-blue-400/20 blur-[120px] rounded-full top-[-200px] right-[-200px]"></div>

      <div className="min-h-[700px] lg:min-h-[1300px] relative">

        {/* WAVE LINES */}
        <img
          src={waveLines}
          alt=""
          className="hidden lg:block absolute left-0 top-[234px] w-[1583px] z-10"
        />

        {/* LEFT TEXT */}
        <div className="relative z-40 text-white text-center pt-[200px] lg:max-w-[540px] lg:pt-[170px] lg:pl-[190px] lg:text-left">

          <h1 className="text-[28px] font-bold leading-[36px] lg:text-[64px] lg:leading-[72px]">
            С НАС <br /> НАЧИНАЕТСЯ
          </h1>

          <h2 className="text-[26px] italic font-light mt-1 lg:text-[64px] lg:leading-[68px]">
            ЗДОРОВЬЕ
          </h2>

        </div>

        {/* CTA BUTTON */}
        <img
          src={ctaSvg}
          alt=""
          className="absolute z-30 left-[85px] top-[80px] w-[120px] lg:left-[219px] lg:top-[450px] lg:w-[150px] animate-pulse hover:scale-110 transition"
        />

        {/* GLASS MORPHISM CIRCLE */}
        <div className="absolute w-[260px] h-[260px] left-[20px] top-[20px] backdrop-blur-lg bg-white/10 border border-white/20 rounded-full z-10 lg:left-auto lg:right-[10px] lg:w-[550px] lg:h-[550px]"></div>

        {/* FLOATING PRODUCT */}
        <img
          src={bottleCapsules}
          alt=""
          className="hidden lg:block absolute right-[30px] top-[70px] w-[490px] z-30 animate-float"
        />

        {/* RIGHT TEXT */}
        <div className="hidden lg:block absolute right-[40px] top-[520px] w-[360px] text-white text-[16px] leading-[22px] z-30">

          <div className="w-[350px] h-[2px] bg-[#F61114] mb-4"></div>

          Стратегией компании является внедрение специалистами в практику
          лекарственных средств, рекомендованных международными стандартами

        </div>

        {/* ABOUT SECTION */}
        <div className="relative mt-[120px] px-[16px] lg:absolute lg:top-[900px] lg:left-[128px] lg:flex lg:gap-[160px]">

          <div className="max-w-[560px]">

            <h3 className="font-bold text-[14px] lg:text-[18px] text-black leading-[27px]">
              Фармацевтическая компания Чехфарм Альянс
            </h3>

            <p className="text-[14px] text-black/70 leading-[24px] mb-2 lg:mb-6 lg:text-[16px]">
              основана в 2009 году в городе Прага, Чехия.
            </p>

            <p className="text-[14px] leading-[24px] text-black/70 lg:text-[18px]">
              Основатели компании{" "}
              <span className="font-bold text-black">
                первоочередной задачей ставят обеспечение населения
                лекарственными препаратами высокого качества по доступной цене
              </span>
              , а также обеспечение инновационными молекулами для лечения различных патологий.
            </p>

            {showMore && (
              <p className="text-[14px] lg:text-[16px] text-black/70 leading-[24px] mt-4">
                Компания активно сотрудничает с международными фармацевтическими
                организациями и внедряет инновационные разработки.
                Компания активно сотрудничает с международными фармацевтическими
                организациями и внедряет инновационные разработки.
              </p>
            )}

          </div>

          {/* TITLE */}
          <div className="mt-[40px] lg:mt-0">

            <h2 className="text-[28px] lg:text-[48px] italic font-light text-[#16226C] uppercase">
              ПРО
            </h2>

            <h1 className="text-[28px] lg:text-[48px] font-bold text-[#16226C] leading-tight">
              CZECHFARM
            </h1>

            <h1 className="text-[28px] lg:text-[48px] font-bold text-[#F61114] leading-tight">
              ALLIANCE
            </h1>

          </div>

        </div>

        {/* MORE BUTTON */}
        <div className="relative mt-[40px] px-[16px] lg:absolute lg:top-[1220px] lg:left-[128px]">

          <button onClick={() => setShowMore(!showMore)}>

            <img
              src={moreInfoBtn}
              alt=""
              className="w-[140px] lg:w-[220px] transition duration-300 hover:scale-110"
            />

          </button>

        </div>

      </div>
    </section>
  );
}

