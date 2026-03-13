import medicinesBg from "../../assets/aboutimeges/white-pill-container-on-blue-background_23-2148506747 1.png";
import capsulemed1 from "../../assets/aboutimeges/Image (4).svg";
import capsulemed2 from "../../assets/aboutimeges/Image (5).svg";
import capsulemed3 from "../../assets/aboutimeges/Image (6).svg";
import capsulemed4 from "../../assets/aboutimeges/Image (7).svg";
import capsulemed5 from "../../assets/aboutimeges/Image (8).svg";
import logo from "../../assets/aboutimeges/Logo-transpBG.svg";

export default function AboutMedicines() {
  return (
    <section>
      {/* TITLE */}
      <div className="container-custom">
        <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] text-[#1C2561] italic leading-[120%]">
          ПРЕПАРАТЫ
        </h2>

        <h1 className="text-[28px] sm:text-[36px] lg:text-[48px] font-bold text-[#1C2561] leading-[120%]">
          CZECHFARM <span className="text-[#F61114]">ALLIANCE</span>
        </h1>
      </div>

      <div
        className="relative bg-no-repeat bg-cover h-[700px] lg:h-[600px] mt-[48px]"
        style={{ backgroundImage: `url(${medicinesBg})` }}
      >
        {/* RIGHT CIRCLE */}
        <div
          className="
          absolute
          left-1/2 lg:left-auto
          -translate-x-1/2 lg:translate-x-0
          lg:right-[10px]
          top-[50%] lg:top-[290px]
          -translate-y-1/2
          w-[320px] sm:w-[420px] lg:w-[562px]
          h-[320px] sm:h-[420px] lg:h-[562px]
          bg-white/70 backdrop-blur-md
          rounded-full
          flex items-center justify-center
          p-[30px] sm:p-[40px] lg:p-[60px]
          text-center
        "
        >
          <p className="text-[#1C2561] text-[12px] sm:text-[15px] lg:text-[16px] leading-[150%]">
            На сегодняшний день портфолио <br />
            <b>«Czechfarm Alliance»</b> насчитывает <br />
            более 70 лекарственных средств в <br />
            различных областях применения, среди <br />
            которых такие препараты, как Зодак, <br />
            Фолитроп, Солтон, Метотан, L-Аргинин, <br />
            Нервинол, Дексирен, Регален и другие
          </p>
        </div>

        {/* FLOAT CAPSULES */}

        <img
          src={capsulemed1}
          alt=""
          className="absolute -top-[20px] left-[10px] lg:left-[5px] w-[40px] lg:w-[60px] animate-float"
        />

        <img
          src={capsulemed2}
          alt=""
          className="absolute -top-[20px] right-[40px] lg:right-[348px] w-[50px] lg:w-[70px] animate-float"
        />

        <img
          src={capsulemed3}
          alt=""
          className="absolute bottom-[60px] left-[40px] lg:left-[154px] w-[50px] lg:w-[70px] animate-float"
        />

        <img
          src={capsulemed4}
          alt=""
          className="hidden lg:block absolute top-[560px] left-[600px] w-[70px] animate-float"
        />

        <img
          src={capsulemed5}
          alt=""
          className="absolute bottom-[80px] right-[20px] lg:right-[40px] w-[50px] lg:w-[70px] animate-float"
        />

        <img
  src={logo}
  alt=""
  className="
  absolute
  left-[35%]
  top-[65%]
  lg:left-[120px]
  lg:top-[280px]
  -translate-y-1/2
  lg:translate-y-0
  w-[100px]
  lg:w-[153px]
"
/>
      </div>
    </section>
  );
}