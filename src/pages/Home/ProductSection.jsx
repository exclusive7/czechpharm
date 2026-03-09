import { useState } from "react";
import moreInfoBtn from "../../assets/images/BTN.svg";
import nemotanImg from "../../assets/images/Hemotan.svg";

export default function ProductsSection() {
  const [openId, setOpenId] = useState(null);
  const [activeMedicine, setActiveMedicine] = useState(null);

  const productsData = [
    {
      id: 1,
      title: "ОНМК. ХНИК. СОСУДИСТЫЕ ЗАБОЛЕВАНИЯ. ИБС",
      medicines: [
        {
          id: 101,
          name: "Немотан",
        },
        {
          id: 102,
          name: "Элстекар",
        },
        {
          id: 103,
          name: "Медотон",
        },
        {
          id: 104,
          name: "Немотан",
        },
        {
          id: 105,
          name: "Немотан",
        },
        {
          id: 106,
          name: "Немотан",
        },
        {
          id: 107,
          name: "Немотан",
        },
        {
          id: 108,
          name: "Немотан",
        },
      ],
      image: nemotanImg,
    },
    {
      id: 2,
      title: "ОНМК. ХНИК. СОСУДИСТЫЕ ЗАБОЛЕВАНИЯ. ИБС",
      medicines: [
        {
          id: 201,
          name: "Немотан",
        },
        {
          id: 202,
          name: "Элстекар",
        },
        {
          id: 203,
          name: "Медотон",
        },
        {
          id: 204,
          name: "Немотан",
        },
        {
          id: 205,
          name: "Немотан",
        },
        {
          id: 206,
          name: "Немотан",
        },
        {
          id: 207,
          name: "Немотан",
        },
        {
          id: 208,
          name: "Немотан",
        },
      ],
      image: nemotanImg,
    },
    {
      id: 3,
      title: "ОНМК. ХНИК. СОСУДИСТЫЕ ЗАБОЛЕВАНИЯ. ИБС",
      medicines: [
        {
          id: 301,
          name: "Немотан",
        },
        {
          id: 302,
          name: "Элстекар",
          description: "Описание препарата Элстекар.",
        },
        {
          id: 303,
          name: "Медотон",
        },
        {
          id: 304,
          name: "Немотан",
        },
        {
          id: 305,
          name: "Немотан",
        },
        {
          id: 306,
          name: "Немотан",
        },
        {
          id: 307,
          name: "Немотан",
        },
        {
          id: 308,
          name: "Немотан",
        },
      ],
      image: nemotanImg,
    },
    {
      id: 4,
      title: "ОНМК. ХНИК. СОСУДИСТЫЕ ЗАБОЛЕВАНИЯ. ИБС",
      medicines: [
        {
          id: 401,
          name: "Немотан",
          description:
            "Описание препарата Немотан. Эффективен при сосудистых заболеваниях.",
        },
        {
          id: 402,
          name: "Элстекар",
          description: "Описание препарата Элстекар.",
        },
        {
          id: 403,
          name: "Медотон",
          description: "Описание препарата Медотон.",
        },
        {
          id: 404,
          name: "Немотан",
        },
        {
          id: 405,
          name: "Немотан",
        },
        {
          id: 406,
          name: "Немотан",
        },
        {
          id: 407,
          name: "Немотан",
        },
        {
          id: 408,
          name: "Немотан",
        },
      ],
      image: nemotanImg,
    },
  ];

  const [visible, setVisible] = useState(2);

  const handleLoadMore = () => {
    setVisible((prev) => prev + 3);
  };


  return (
    <section className="py-[80px] lg:py-[140px]">
      <div className="container-custom">

        {/* TITLE */}
        <div className="mb-[56px]">
          <h2 className="text-[28px] lg:text-[48px] text-[#1C2561] uppercase italic">
            ПРЕПАРАТЫ
          </h2>
          <h1 className="text-[28px] lg:text-[48px] font-bold text-[#1C2561]">
            CZECHFARM <span className="text-[#F61114]">ALLIANCE</span>
          </h1>
        </div>

        {/* ACCORDION */}
        <div className="border-t border-[#CACBD7]">

          {productsData.slice(0, visible).map((item) => (

            <div key={item.id} className="border-b border-[#CACBD7]">

              {/* HEADER */}
              <button
                onClick={() => {
                  const isOpen = openId === item.id;
                  setOpenId(isOpen ? null : item.id);
                  setActiveMedicine(!isOpen ? item.medicines[0]?.id : null);
                }}
                className="
                w-full
                flex
                items-center
                justify-between
                py-[24px]
                hover:bg-gray-50
                transition
                "
              >

                <span className="text-[16px] lg:text-[18px] text-[#1C2561] font-bold text-left">
                  {item.title}
                </span>

                <span className="text-[24px] font-bold text-[#1C2561]">
                  {openId === item.id ? "−" : "+"}
                </span>

              </button>

              {/* CONTENT */}
              {openId === item.id && (

                <div className="
                flex
                flex-col
                lg:flex-row
                gap-[30px]
                lg:gap-[120px]
                items-start
                pb-[40px]
                pt-[10px]
                ">

                  {/* MEDICINES */}
                  <div className="
                  w-full
                  lg:w-[320px]
                  space-y-2
                  ">

                    {item.medicines.map((med) => (

                      <div
                        key={med.id}
                        onClick={() => setActiveMedicine(med.id)}
                        className={`
                        cursor-pointer
                        pl-4
                        py-3
                        border-l-4
                        transition-all
                        duration-200
                        hover:bg-gray-50

                        ${
                          activeMedicine === med.id
                            ? "border-[#F61114] font-bold text-[#1C2561]"
                            : "border-transparent text-black/70"
                        }
                        `}
                      >
                        {med.name}
                      </div>

                    ))}

                  </div>

                  {/* INFO */}
                  <div className="flex-1 w-full">

                    {item.medicines.map((med) =>
                      activeMedicine === med.id ? (

                        <div key={med.id} className="animate-fadeIn">

                          <p className="text-[14px] text-black/70 leading-[22px] mb-6">
                            {med.description}
                          </p>

                          <img
                            src={item.image}
                            className="
                            w-[180px]
                            lg:w-[373px]
                            mx-auto
                            lg:mx-0
                            object-contain
                            transition
                            duration-300
                            hover:scale-105
                            "
                          />

                        </div>

                      ) : null
                    )}

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

        {/* LOAD MORE */}
        {visible < productsData.length && (

          <button
            onClick={handleLoadMore}
            className="mt-[72px]"
          >

            <img
              src={moreInfoBtn}
              alt="Показать больше"
              className="
              w-[200px]
              lg:w-[220px]
              cursor-pointer
              transition
              duration-300
              hover:scale-105
              "
            />

          </button>

        )}

      </div>
    </section>
  );
}

