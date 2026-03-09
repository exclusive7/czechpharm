import { Link } from "react-router-dom";
import { useState } from "react";
import locationIcon from "../../assets/vacansyimages/Mask group (6).svg";
import dateIcon from "../../assets/vacansyimages/Mask group (7).svg";

const vacancies = [
  {
    id: 1,
    title: "Медицинский представитель",
    location: "Ташкент, Узбекистан",
    date: "23.10.2023",
    slug: "medical-representative",
  },
  {
    id: 2,
    title: "Продакт менеджер",
    location: "Ташкент, Узбекистан",
    date: "23.10.2023",
    slug: "product-manager",
  },
  {
    id: 3,
    title: "Офис менеджер",
    location: "Ташкент, Узбекистан",
    date: "23.10.2023",
    slug: "office-manager",
  },
  {
    id: 4,
    title: "Офис менеджер-2",
    location: "Ташкент, Узбекистан",
    date: "23.10.2023",
    slug: "office-manager-2",
  },
  {
    id: 5,
    title: "HR менеджер",
    location: "Ташкент, Узбекистан",
    date: "23.10.2023",
    slug: "hr-manager",
  },
];

export default function VacanciesList() {
  const [visible, setVisible] = useState(4);

  const handleLoadMore = () => {
    setVisible((prev) => prev + 2);
  };

  return (
    <section className="pb-[70px] lg:pb-[90px] pt-[50px] lg:pt-[72px] bg-[#F8F9FC]">
      <div className="container-custom">

        <div className="flex flex-col gap-[25px] lg:gap-[45px]">

          {vacancies.slice(0, visible).map((item) => (

            <Link
              key={item.id}
              to={`/vacancies/${item.slug}`}
              className="
              bg-white
              rounded-[12px]
              border border-[#D9DDE7]
              p-[20px]
              lg:py-[30px]
              lg:pl-[30px]
              hover:shadow-xl
              hover:-translate-y-1
              transition
              duration-300
              "
            >

              {/* TITLE */}
              <h3 className="
              text-[18px]
              lg:text-[24px]
              font-bold
              text-black/80
              leading-[150%]
              mb-[16px]
              lg:mb-[24px]
              ">
                {item.title}
              </h3>


              {/* INFO */}
              <div className="
              flex
              flex-col
              sm:flex-row
              sm:justify-between
              sm:items-center
              gap-[12px]
              ">

                {/* LOCATION */}
                <div className="flex items-center gap-[8px] text-black/70 text-[14px] lg:text-[16px]">

                  <img
                    src={locationIcon}
                    alt=""
                    className="w-[28px] lg:w-[40px]"
                  />

                  {item.location}

                </div>


                {/* DATE */}
                <div className="flex items-center gap-[8px] text-black/80 text-[14px] lg:text-[16px]">

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


        {/* LOAD MORE */}
        {visible < vacancies.length && (

          <div className="flex justify-center mt-[50px] lg:mt-[60px]">

            <button
              onClick={handleLoadMore}
              className="
              text-[#1C2561]
              font-bold
              flex
              items-center
              gap-[10px]
              cursor-pointer
              hover:gap-[16px]
              transition
              duration-300
              "
            >
              Показать больше
              <span className="text-[22px]">↓</span>
            </button>

          </div>

        )}

      </div>
    </section>
  );
}

