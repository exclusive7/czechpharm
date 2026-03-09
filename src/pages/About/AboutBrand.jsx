import brandImg1 from "../../assets/aboutimeges/scientist-in-med-suit-working-with-machine_645730-176 1.png"
import brandImg2 from "../../assets/aboutimeges/biochemistry-doctor-analyzing-virus-infection-developing-pharmaceutical-treatment_482257-6527 1.png"

export default function AboutBrand() {
  return (
    <section className="py-[80px] lg:py-[120px] bg-white">
      <div className="container-custom grid grid-cols-1 gap-[60px] lg:grid-cols-2 lg:gap-[220px]">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center lg:items-start">

          {/* IMAGE */}
          <img
            src={brandImg1}
            alt="factory"
            className="w-full lg:w-[440px] rounded-[12px] mb-[40px] lg:mb-[90px]"
          />

          {/* TEXT */}
          <p className="text-[#6B6F8A] leading-[24px] lg:leading-[26px] text-[14px] lg:text-[16px] max-w-[482px]">
            <span className="font-semibold text-black/70">
              Чехфарм альянс является одной из быстроразвивающихся компаний на рынке,
            </span>{" "}
            
            ориентирована на поиск лучших терапевтических решений для
            улучшения качества жизни нашего населения.
            <br />
            <br />
            Стратегией компании является внедрение специалистами в практику
            лекарственных средств, рекомендованных международными стандартами.
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-center lg:items-end">

          {/* TITLE */}
          <h2 className="text-[28px] lg:text-[48px] italic font-light text-[#1C2561] mb-[56px] text-end pr-[50px]">
            ПРО <span className="text-[#1C2561] not-italic font-bold">БРЕНД</span>
          </h2>

          {/* TEXT */}
          <p className="text-[#6B6F8A] leading-[24px] lg:leading-[26px] text-[16px] lg:text-[16px] mb-[40px] max-w-[403px] mb-[118px]">
            <span className="font-semibold text-[#1C2561]">
              Фармацевтическая компания Чехфарм Альянс
            </span>{" "}
            основана в 2009 году в городе Прага, Чехия.
            <br />
            <br />
            Основатели компании <span className="font-semibold text-[#1C2561]">первоочередной задачей ставят обеспечение
            населения лекарственными препаратами высокого качества по
            доступной цене,</span> а также обеспечение инновационными молекулами
            для лечения различных патологий.
          </p>

          {/* IMAGE */}
          <img
            src={brandImg2}
            alt="lab"
            className="w-full lg:w-[420px] rounded-[12px]"
          />

        </div>

      </div>
    </section>
  )
}