import aboutImg from "../../assets/aboutimeges/BG-lines (1).svg";
import aboutBg from "../../assets/aboutimeges/BG.png";

export default function AboutHero() {
  return (
    <section
      className="relative h-[180px] lg:h-[330px] bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${aboutBg})` }}
    >

      <div className="absolute inset-0 bg-[#1C2561]/20"></div>
      {/* Wave Lines */}
      <img
        src={aboutImg}
        alt="wave"
        className="absolute left-0 top-0 w-[900px] lg:w-[1583px] z-20"
      />

      {/* TITLE */}
      <h1
        className="
        absolute
        text-white
        font-bold
        tracking-wide
        
        text-[24px]
        left-1/2
        -translate-x-1/2
        top-[10px]

        lg:text-[48px]
        lg:left-[120px]
        lg:translate-x-0
        lg:top-[106px]
        "
      >
        ПРО КОМПАНИЮ
      </h1>
    </section>
  );
}