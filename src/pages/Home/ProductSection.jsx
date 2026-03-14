import { useState } from "react";
import moreInfoBtn from "../../assets/images/BTN.svg";
const images = import.meta.glob("../../assets/medicines/*", { eager: true });

const getImage = (name) => {
  return images[`../../assets/medicines/${name}`]?.default;
};

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
          image: getImage("Hemotan.svg"),
          description: "Описание препарата Немотан.",
        },
        {
          id: 102,
          name: "Элстекар",
          image: getImage("image 15.png"),
          description: "Описание препарата Элстекар.",
        },
        {
          id: 103,
          name: "Мелатонин",
          image: getImage("Pack.png"),
          description: "Описание препарата Мелатонин.",
        },
        {
          id: 104,
          name: "Кардон О2",
          image: getImage("image 12.png"),
          description: "Описание препарата Кардон О2.",
        },
        {
          id: 105,
          name: "L-Arginin",
          image: getImage("image 16.png"),
          description: "Описание препарата L-Arginin.",
        },
        {
          id: 106,
          name: "Эллезиум",
          image: getImage("Mask group (25).png"),
          description: "Описание препарата Эллезиум.",
        },
        {
          id: 107,
          name: "Cholesterol Control",
          image: getImage("image 14.png"),
          description: "Описание препарата Cholesterol Control.",
        },
        {
          id: 108,
          name: "Канталин микро",
          image: getImage("Mask group (26).png"),
          description: "Описание препарата Канталин микро.",
        },
      ],
    },
    {
      id: 2,
      title:
        "НЕЙРО-ДЕГЕНЕРАТИВНЫЕ ЗАБОЛЕВАНИЯ ОПОРНО-ДВИГАТЕЛЬНОГО АППАРАТА.СТЕОПОРОЗ",
      medicines: [
        {
          id: 201,
          name: "Арткюр",
          image: getImage("Pack (1).png"),
          description: "Описание препарата Арткюр.",
        },
        {
          id: 202,
          name: "Макстио",
          image: getImage("Mask group (9).png"),
          description: "Описание препарата Макстио.",
        },
        {
          id: 203,
          name: "Регапен 75мг, 150мг, 300мг",
          image: getImage("image 18.png"),
          description: "Описание препарата Регапен.",
        },
        {
          id: 204,
          name: "Атокса",
          image: getImage("Mask group (10).png"),
          description: "Описание препарата Атокса.",
        },
        {
          id: 205,
          name: "Глюкофлекс",
          image: getImage("Mask group (11).png"),
          description: "Описание препарата Глюкофлекс.",
        },
        {
          id: 206,
          name: "Тикотен",
          image: getImage("Mask group (12).png"),
          description: "Описание препарата Тикотен.",
        },
        {
          id: 207,
          name: "Дексирен",
          image: getImage("Mask group (13).png"),
          description: "Описание препарата Дексирен.",
        },
        {
          id: 208,
          name: "Даблпласт",
          image: getImage("Mask group (14).png"),
          description: "Описание препарата Даблпласт.",
        },
        {
          id: 209,
          name: "Ланикзол",
          image: getImage("Mask group (15).png"),
          description: "Описание препарата Ланикзол.",
        },
      ],
    },
    {
      id: 3,
      title: "МЕТАБОЛИЧЕСКИЙ СИНДРОМ. ЖКТ. НИЗКОРОСЛОСТЬ",
      medicines: [
        {
          id: 301,
          name: "Соматоп",
          image: getImage("Mask group (16).png"),
          description: "Описание препарата Соматоп.",
        },
        {
          id: 302,
          name: "Миотир",
          image: getImage("Mask group (17).png"),
          description: "Описание препарата Миотир.",
        },
        {
          id: 303,
          name: "Гепариген",
          image: getImage("Mask group (18).png"),
          description: "Описание препарата Гепариген.",
        },
        {
          id: 304,
          name: "Контрифорт",
          image: getImage("Mask group (19).png"),
          description: "Описание препарата Контрифорт.",
        },
      ],
    },
    {
      id: 4,
      title: "ЭРЕКТИЛЬНАЯ ДИСФУНКЦИЯ. БЕСПЛОДИЕ. МКБ",
      medicines: [
        {
          id: 401,
          name: "Зидена",
          image: getImage("Mask group (20).png"),
          description: "Описание препарата Зидена.",
        },
        {
          id: 402,
          name: "Дуинум",
          image: getImage("Mask group (21).png"),
          description: "Описание препарата Дуинум.",
        },
        {
          id: 403,
          name: "Фоллитоп",
          image: getImage("Mask group (22).png"),
          description: "Описание препарата Фоллитоп.",
        },
        {
          id: 404,
          name: "Бевласин",
          image: getImage("Mask group (23).png"),
          description: "Описание препарата Бевласин.",
        },
        {
          id: 405,
          name: "Реналоф",
          image: getImage("Mask group (24).png"),
          description: "Описание препарата Реналоф.",
        },
      ],
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
                className="w-full flex items-center justify-between py-[24px] hover:bg-gray-50 transition"
              >
                <span className="text-[14px] lg:text-[18px] text-[#1C2561] font-bold text-left">
                  {item.title}
                </span>

                <span className="text-[18px] lg:text-[24px] font-bold text-[#1C2561]">
                  {openId === item.id ? "−" : "+"}
                </span>
              </button>

              {/* CONTENT */}
              {openId === item.id && (

                <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[120px] items-start pb-[40px] pt-[10px]">

                  {/* MEDICINES */}
                  <div className="w-full lg:w-[320px] space-y-2">

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
                            src={med.image}
                            className="w-[180px] lg:w-[373px] mx-auto lg:mx-0 object-contain transition duration-300 hover:scale-105"
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

          <button onClick={handleLoadMore} className="mt-[72px]">

            <img
              src={moreInfoBtn}
              alt="Показать больше"
              className="w-[180px] lg:w-[220px] cursor-pointer transition duration-300 hover:scale-105"
            />

          </button>

        )}

      </div>
    </section>
  );
}