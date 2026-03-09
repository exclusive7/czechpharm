import mailIcon from "../../assets/contactimages/Mask group (8).svg";
import phoneIcon from "../../assets/contactimages/Mask group (9).svg";
import locationIcon from "../../assets/contactimages/Mask group (6).svg";

export default function ContactInfo() {
  return (
    <section className="py-[48px] lg:py-[72px]">
      <div className="container-custom flex flex-col lg:flex-row gap-[40px] lg:gap-[220px]">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-[16px] lg:text-[24px] font-bold leading-[160%] text-[#1C2561] mb-[24px] lg:mb-[36px]">
            Контакты
          </h2>

          {/* EMAIL */}
          <a
            href="mailto:czechfarmalliance@chzfarm.org"
            className="flex items-center gap-[16px] lg:gap-[24px] mb-[20px] lg:mb-[24px]"
          >
            <img src={mailIcon} alt="" className="w-[20px] lg:w-[40px]" />

            <span className="text-[12px] lg:text-[16px] text-black/70 leading-[160%]">
              czechfarmalliance@chzfarm.org
            </span>
          </a>

          {/* PHONE */}
          <a
            href="tel:+998946609796"
            className="flex items-center gap-[16px] lg:gap-[24px]"
          >
            <img src={phoneIcon} alt="" className="w-[20px] lg:w-[40px]" />

            <span className="text-[12px] lg:text-[16px] text-black/70 leading-[160%]">
              +998 94 660-97-96, 78 129-20-02
            </span>
          </a>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <h2 className="text-[16px] lg:text-[24px] font-bold leading-[160%] text-[#1C2561] mb-[24px] lg:mb-[36px]">
            Адрес
          </h2>

          <a
            href="https://maps.google.com/?q=Ташкент Мирабадский район С.Барака 62"
            target="_blank"
            className="flex items-start gap-[16px] lg:gap-[24px]"
          >
            <img src={locationIcon} alt="" className="w-[20px] lg:w-[40px]" />

            <p className="text-[12px] lg:text-[16px] text-black/70 leading-[160%] max-w-[328px]">
              100060, Узбекистан, г. Ташкент, Мирабадский район, ул. С.Барака,
              62
            </p>
          </a>
        </div>

      </div>
    </section>
  );
}