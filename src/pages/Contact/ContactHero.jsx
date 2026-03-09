import heroBg from "../../assets/contactimages/BG4.png"
import waveLines from "../../assets/contactimages/BG-lines.svg"

export default function ContactHero() {
  return (
    <section
      className="relative h-[180px] lg:h-[330px] bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-[#1C2561]/20"></div>
      {/* WAVE LINES */}
      <img
        src={waveLines}
        alt=""
        className="absolute left-0 top-0 w-[900px] lg:w-[1583px] z-20"
      />

      {/* TITLE */}
      <div className="container-custom h-full flex items-center">
        <h1 className="
        absolute
        text-white
        font-bold
        tracking-wide
        
        text-[24px]
        left-1/2
        -translate-x-1/2
        top-[20px]

        lg:text-[48px]
        lg:left-[120px]
        lg:translate-x-0
        lg:top-[106px]
        ">
          Контакты
        </h1>
      </div>
    </section>
  )
}