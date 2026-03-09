import teamImg from "../../assets/aboutimeges/i-would-like-to-ask-a-question_637285-9144 1.png"

export default function AboutTeam() {
  return (
    <section className="pt-[60px] lg:pt-[80px] pb-[100px] lg:pb-[180px]">
      <div className="container-custom px-4 grid grid-cols-1 lg:grid-cols-2 gap-[60px] lg:gap-[175px] items-center">

        {/* LEFT IMAGE */}
        <div className="flex justify-center lg:justify-start">
          <img
            src={teamImg}
            alt="team"
            className="w-full max-w-[420px] lg:w-[488px] rounded-[10px] object-cover"
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="max-w-full lg:max-w-[447px]">

          <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] font-bold text-black/70 leading-[120%] mb-[32px] lg:mb-[56px]">
            <span className="italic font-normal">НАША</span>{" "}
            <span>КОМАНДА</span>
          </h2>

          <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-black/70 font-bold leading-[150%] mb-[16px]">
            Штат компании состоит из высококвалифицированных сотрудников и
            насчитывает более чем 100 человек
          </p>

          <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-black/70 font-normal leading-[150%]">
            Уделяя повышенное внимание компетенции своих сотрудников,
            компания периодически организует тренинги с привлечением
            специалистов международного класса. Регулярно проводится
            аттестация сотрудников.
          </p>

        </div>

      </div>
    </section>
  )
}