import { Link } from "react-router-dom";
import { useState } from "react";
import locationIcon from "../../assets/vacansyimages/Mask group (6).svg";
import dateIcon from "../../assets/vacansyimages/Mask group (7).svg";
import { useVacancies } from "../../hooks/useVacancies";

export default function VacanciesList() {
  const { vacancies, loading, error } = useVacancies();
  const [visible, setVisible] = useState(4);

  return (
    <section className="bg-[#F8F9FC] pb-[70px] pt-[50px] lg:pb-[90px] lg:pt-[72px]">
      <div className="container-custom">
        {loading ? (
          <div className="rounded-[18px] bg-white px-5 py-4 text-sm text-[#4A5676]">
            Загрузка вакансий...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[18px] border border-[#F1C9CC] bg-[#FFF1F2] px-5 py-4 text-sm text-[#A32024]">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="flex flex-col gap-[25px] lg:gap-[45px]">
            {vacancies.slice(0, visible).map((item) => (
              <Link
                key={item.id}
                to={`/vacancies/${item.slug}`}
                className="rounded-[12px] border border-[#D9DDE7] bg-white p-[20px] transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:py-[30px] lg:pl-[30px]"
              >
                <h3 className="mb-[16px] text-[18px] font-bold leading-[150%] text-black/80 lg:mb-[24px] lg:text-[24px]">
                  {item.title}
                </h3>

                <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-[8px] text-[14px] text-black/70 lg:text-[16px]">
                    <img
                      src={locationIcon}
                      alt=""
                      className="w-[28px] lg:w-[40px]"
                    />
                    {item.location}
                  </div>

                  <div className="flex items-center gap-[8px] text-[14px] text-black/80 lg:text-[16px]">
                    <img
                      src={dateIcon}
                      alt=""
                      className="w-[28px] lg:w-[40px]"
                    />
                    {item.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {!loading && !error && vacancies.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[#D8DEEA] p-5 text-sm text-[#6C7485]">
            Вакансии пока не добавлены.
          </div>
        ) : null}

        {!loading && !error && visible < vacancies.length ? (
          <div className="mt-[50px] flex justify-center lg:mt-[60px]">
            <button
              type="button"
              onClick={() => setVisible((prev) => prev + 2)}
              className="flex cursor-pointer items-center gap-[10px] font-bold text-[#1C2561] transition duration-300 hover:gap-[16px]"
            >
              Показать больше
              <span className="text-[22px]">↓</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
