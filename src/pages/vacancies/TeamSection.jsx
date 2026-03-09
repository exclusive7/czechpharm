import teamImg from "../../assets/vacansyimages/i-would-like-to-ask-a-question_637285-9144 1.png"

export default function TeamSection() {
  return (
    <section className="pt-[60px] md:pt-[90px] pb-[100px] lg:pb-[150px] bg-gradient-to-b from-white to-[#F8F9FC]">
      <div className="container-custom flex flex-col lg:flex-row gap-[40px] lg:gap-[175px] items-center">

        {/* LEFT IMAGE */}
        <div className="w-full max-w-[488px] overflow-hidden rounded-[12px]">

          <img
            src={teamImg}
            alt="team"
            className="
            rounded-[12px]
            w-full
            object-cover
            transition
            duration-500
            hover:scale-105
            "
          />

        </div>


        {/* RIGHT CONTENT */}
        <div className="max-w-[447px] text-center lg:text-left animate-fadeIn">

          <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] text-[#1C2561] italic leading-[120%] uppercase">
            НАША <span className="font-bold not-italic">КОМАНДА</span>
          </h2>

          <p className="mt-[30px] lg:mt-[56px] text-[14px] lg:text-[16px] leading-[150%] text-black/70">
            <span className="font-bold">
              Штат компании состоит из высококвалифицированных сотрудников
              и насчитывает более чем 100 человек
            </span>
          </p>

          <p className="mt-[20px] lg:mt-[30px] text-[14px] lg:text-[16px] leading-[24px] lg:leading-[26px] text-black/70">
            Уделяя повышенное внимание компетентности своих сотрудников,
            компания периодически организует тренинги с привлечением
            специалистов международного класса. Регулярно проводится
            аттестация сотрудников.
          </p>

        </div>

      </div>
    </section>
  )
}

