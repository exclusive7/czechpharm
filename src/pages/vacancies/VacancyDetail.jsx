import { useParams } from "react-router-dom";
import locationIcon from "../../assets/vacansyimages/Mask group (6).svg";
import dateIcon from "../../assets/vacansyimages/Mask group (7).svg";
import timeIcon from "../../assets/vacansyimages/Mask group (8).png";
import Breadcrumb from "../../components/Breadcrumb";
import { useVacancies } from "../../hooks/useVacancies";

function VacancyList({ title, items }) {
  if (!items.length) {
    return null;
  }

  return (
    <>
      <h3 className="mb-[18px] font-bold text-black/70 lg:mb-[24px]">{title}</h3>
      <ul className="mb-[30px] space-y-[10px] text-[12px] leading-[22px] text-black/70 lg:mb-[36px] lg:space-y-[12px] lg:text-[15px] lg:leading-[24px]">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="flex items-start gap-[12px]">
            <span className="mt-[10px] h-[1px] w-[20px] bg-[#F61114] lg:w-[24px]" />
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function VacancyDetail() {
  const { slug } = useParams();
  const { vacancies, loading, error } = useVacancies();
  const vacancy = vacancies.find((item) => item.slug === slug);

  if (loading) {
    return (
      <div className="container-custom py-[80px] text-sm text-[#4A5676]">
        Загрузка вакансии...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-[80px] text-sm text-[#A32024]">
        {error}
      </div>
    );
  }

  if (!vacancy) {
    return <div className="p-20 text-center text-xl">Вакансия не найдена</div>;
  }

  return (
    <section className="bg-[#F8F9FC] py-[60px] lg:py-[120px]">
      <div className="container-custom">
        <Breadcrumb
          items={[
            { label: "Вакансии", link: "/vacancies" },
            { label: vacancy.title },
          ]}
        />

        <div className="mt-[40px] lg:mt-[72px]">
          <h1 className="mb-[30px] text-[24px] font-bold leading-[140%] sm:text-[28px] lg:mb-[36px] lg:text-[36px]">
            {vacancy.title}
          </h1>

          <div className="mb-[40px] flex flex-col gap-[16px] text-[14px] text-black/70 sm:flex-row sm:flex-wrap sm:gap-[30px] lg:mb-[56px] lg:items-center lg:justify-between lg:text-[16px]">
            <div className="flex items-center gap-[8px] text-black/80">
              <img src={locationIcon} alt="" className="w-[28px] lg:w-[40px]" />
              {vacancy.location}
            </div>

            <div className="flex items-center gap-[8px] text-black">
              <img src={timeIcon} alt="" className="w-[28px] lg:w-[40px]" />
              {vacancy.type}
            </div>

            <div className="flex items-center gap-[8px] text-[#16226C]">
              <img src={dateIcon} alt="" className="w-[28px] lg:w-[40px]" />
              <span className="font-bold text-[#1C2561]">{vacancy.date}</span>
            </div>
          </div>

          <p className="mb-[40px] text-[14px] leading-[24px] text-black/80 lg:mb-[56px] lg:text-[16px] lg:leading-[26px]">
            {vacancy.description || "Описание вакансии не заполнено."}
          </p>

          <VacancyList
            title="Функциональные обязанности"
            items={vacancy.responsibilities}
          />
          <VacancyList
            title="Требования к кандидату"
            items={vacancy.requirements}
          />
          <VacancyList title="Условия" items={vacancy.conditions} />

          {vacancy.closingNote ? (
            <p className="mb-[20px] text-[14px] leading-[150%] text-black/70 lg:mb-[36px] lg:text-[18px]">
              {vacancy.closingNote}
            </p>
          ) : null}

          {vacancy.applyUrl ? (
            <p className="text-[14px] font-bold leading-[150%] text-black/70 lg:text-[18px]">
              Резюме отправлять по ссылке
              <a
                href={vacancy.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-1 font-bold text-[#1C2561] hover:underline"
              >
                {vacancy.applyLabel || vacancy.applyUrl}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
