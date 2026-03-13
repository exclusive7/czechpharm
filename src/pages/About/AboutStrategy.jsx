import { useState } from "react"
import strategyImg from "../../assets/aboutimeges/medical-stethoscope-on-computer-keyboard_93675-14577 1.png"
import moreInfoBtn from "../../assets/images/BTN.svg"

export default function AboutStrategy() {

  const [showMore, setShowMore] = useState(false)

  return (
    <section className="py-[80px] lg:py-[120px]">
      <div className="container-custom px-4 grid grid-cols-1 lg:grid-cols-2 gap-[60px] lg:gap-[280px] items-start">

        {/* LEFT TEXT */}
        <div className="max-w-full lg:max-w-[380px]">

          <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-black/70 font-bold leading-[150%] mb-[24px]">
            Маркетинговая стратегия компании{" "}
            <span className="text-black/70 font-normal">
              направлена на комплексный подход к процессу продвижения различных групп препаратов
              в таких терапевтических направлениях как
            </span>{" "}
            Неврология, Урология, Гинекология, Эндокринология и Онкология
          </p>

          {/* SLIDE TEXT */}
          <div
            className={`
              overflow-hidden
              transition-all
              duration-500
              ease-in-out
              ${showMore ? "max-h-[300px] opacity-100 mb-[40px] lg:mb-[72px]" : "max-h-0 opacity-0"}
            `}
          >
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-black/70 leading-[150%]">
              Компания активно развивает партнерские отношения с международными
              фармацевтическими производителями и внедряет современные методы
              продвижения лекарственных средств. Основной целью является
              обеспечение медицинских учреждений и пациентов качественными
              препаратами, соответствующими международным стандартам.
            </p>
          </div>

          {/* BUTTON */}
          <button onClick={() => setShowMore(!showMore)}>
            <img
              src={moreInfoBtn}
              alt="Больше информации"
              className="w-[180px] lg:w-[220px] cursor-pointer transition duration-300 hover:scale-105"
            />
          </button>

        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={strategyImg}
            alt=""
            className="w-full max-w-[350px] sm:max-w-[420px] lg:w-[445px] rounded-[10px] object-cover"
          />
        </div>

      </div>
    </section>
  )
}