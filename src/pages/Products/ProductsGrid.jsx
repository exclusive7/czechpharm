import { useState, useEffect } from "react";
import nemotan from "../../assets/productimages/Mask group.png";
import elstar from "../../assets/productimages/Mask group (1).png";
import melatonin from "../../assets/productimages/Mask group (2).png";
import kardion from "../../assets/productimages/Mask group (3).png";
import arginin from "../../assets/productimages/Mask group (4).png";
import elpezum from "../../assets/productimages/Mask group (5).png";
import cholesterol from "../../assets/productimages/Mask group (6).png";
import kaptalin from "../../assets/productimages/Mask group (7).png";
import cornerShape from "../../assets/productimages/Group 214.svg";
const images = import.meta.glob("../../assets/medicines/*", { eager: true });

const getImage = (name) => {
  return images[`../../assets/medicines/${name}`]?.default;
};

const products = [
  {
    id: 1,
    name: "Venoplast",
    category: "new",
    image: getImage("Mask group (27).png"),
    desc: [
      { label: "Действующее вещество:", value: "Нимодипин" },
      { label: "Страна производитель:", value: "Кипр" },
      { label: "Дозировка:", value: "30 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "По 1 таблетке 2–3 раза в день" },
    ],
  },
  {
    id: 2,
    name: "Нервогил",
    category: "new",
    image: getImage("Mask group (28).png"),
    desc: [
      { label: "Действующее вещество:", value: "Левокарнитин" },
      { label: "Страна производитель:", value: "Корея" },
      { label: "Дозировка:", value: "1 г/5 мл" },
      { label: "Производитель:", value: "MEDROAD" },
      { label: "Форма выпуска:", value: " инъекции 5 мл №10" },
      { label: "Применение:", value: "1-2 инъекций в день 10-14 дней" },
    ],
  },
  {
    id: 3,
    name: "Babyplast",
    category: "new",
    image: getImage("Mask group (29).png"),
    desc: [
      { label: "Действующее вещество:", value: "Мелатонин" },
      { label: "Страна производитель:", value: "С.Ш.А" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Растворимые Таблетки № 30" },
      { label: "Применение:", value: " По 1 таблетке под язык за 30-40 минут до сна" },
    ],
  },
  {
    id: 4,
    name: "Diaplast пластырь",
    category: "new",
    image: getImage("Mask group (30).png"),
    desc: [
      { label: "Действующее вещество:", value: "Мелатонин" },
      { label: "Страна производитель:", value: "С.Ш.А" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "Windmill Health Products " },
      { label: "Форма выпуска:", value: "Растворимые таблетки № 30" },
      { label: "Применение:", value: "По 1 таблетке под язык за 30-40 минут до сна" },
    ],
  },
  {
    id: 5,
    name: "Немотан",
    category: "vascular",
    image: getImage("Hemotan.svg"),
    desc: [
      { label: "Действующее вещество:", value: "Нимодипин" },
      { label: "Страна производитель:", value: "Кипр" },
      { label: "Дозировка:", value: "30 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "По 1 таблетке 2–3 раза в день" },
    ],
  },
  {
    id: 6,
    name: "Эльстар",
    category: "vascular",
    image: getImage("image 15.png"),
    desc: [
      { label: "Действующее вещество:", value: "Левокарнитин" },
      { label: "Страна производитель:", value: "Корея" },
      { label: "Дозировка:", value: "1 г/5 мл" },
      { label: "Производитель:", value: "MEDROAD" },
      { label: "Форма выпуска:", value: "инъекции 5 мл №10" },
      { label: "Применение:", value: " 1-2 инъекций в день 10-14 дней" },
    ],
  },
  {
    id: 7,
    name: "Мелатонин",
    category: "vascular",
    image: getImage("Pack.png"),
    desc: [
      { label: "Действующее вещество:", value: "Мелатонин" },
      { label: "Страна производитель:", value: "С.Ш.А" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Растворимые Таблетки № 30" },
      { label: "Применение:", value: " По 1 таблетке под язык за 30-40 минут до сна" },
    ],
  },
  {
    id: 8,
    name: "Кардон O2",
    category: "vascular",
    image: getImage("image 12.png"),
    desc: [
      { label: "Действующее вещество:", value: "Мельдоний" },
      { label: "Страна производитель:", value: "Узбекистан по заказу «ALLIANCE CZECHFARM S.R.O» " },
      { label: "Дозировка:", value: "500 мг 5мл" },
      { label: "Производитель:", value: "Bayan" },
      { label: "Форма выпуска:", value: " Инъекции 5мл N 10" },
      { label: "Применение:", value: "1-2 инъекций 10-14 дней" },
    ],
  },
  {
    id: 9,
    name: "L-Arginin",
    category: "vascular",
    image: getImage("image 16.png"),
    desc: [
      { label: "Действующее вещество:", value: "L-Аргинин" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "500 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Капсулы № 30" },
      { label: "Применение:", value: "По 1 капсуле 2 раза в день" },
    ],
  },
  {
    id: 10,
    name: "Эллезиум",
    category: "vascular",
    image: getImage("Mask group (25).png"),
    desc: [
      { label: "Действующее вещество:", value: " Л лизин, Эсцин" },
      { label: "Страна производитель:", value: "Грузия" },
      { label: "Дозировка:", value: " Л лизин-0.12 мг, Эсцин - 0.88 мг" },
      { label: "Производитель:", value: "Биополюс" },
      { label: "Форма выпуска:", value: " Инъекции 5мл №10" },
      { label: "Применение:", value: "По 1-2 инъекций в день 5-10 дней" },
    ],
  },
  {
    id: 11,
    name: "Cholesterol Control",
    category: "vascular",
    image: getImage("image 14.png"),
    desc: [
      { label: "Действующее вещество:", value: "Поликозанол" },
      { label: "Растительный стерол:", value: "Экстракт Чеснока" },
      { label: "Страна производитель:", value: "С.Ш.А" },
      { label: "Дозировка:", value: "Поликозанол 2,5 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: " каплеты № 60" },
      { label: "Применение:", value: "По 1 каплете 2 раза в день" },
    ],
  },
  {
    id: 12,
    name: "Канталин микро",
    category: "vascular",
    image: getImage("Mask group (26).png"),
    desc: [
      { label: "Действующее вещество:", value: "Диосмин, Гесперидин" },
      { label: "Страна производитель:", value: "Кипр" },
      { label: "Дозировка:", value: "450 мг, 500 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Микронизированные таблетки № 64" },
      { label: "Применение:", value: "По 1 таблетки 2 раза в день" },
    ],
  },
  {
    id: 13,
    name: "Арткюр",
    category: "neuro",
    image: getImage("Pack (1).png"),
    desc: [
      { label: "Действующее вещество:", value: "Олеогель" },
      { label: "Страна производитель:", value: "Турция" },
      { label: "Дозировка:", value: "1 патч однократно наклеить в проекции грыжи на 24 часа" },
      { label: "Производитель:", value: "M.T Sag’lik" },
      { label: "Форма выпуска:", value: "В упаковке 1 патч" },
    ],
  },
  {
    id: 14,
    name: "Макстио",
    category: "neuro",
    image: getImage("Mask group (9).png"),
    desc: [
      { label: "Действующее вещество:", value: "Тиоколхикозид" },
      { label: "Страна производитель:", value: "Турция" },
      { label: "Дозировка:", value: "4мг/2мл" },
      { label: "Производитель:", value: "Deva Holding A.S" },
      { label: "Форма выпуска:", value: "Инъекции 2мл N 6" },
      { label: "Применение:", value: "По 1-2 инъекций в день 6 дней" },
    ],
  },
  {
    id: 15,
    name: "Регапен 75мг, 150мг, 300мг",
    category: "neuro",
    image: getImage("image 18.png"),
    desc: [
      { label: "Действующее вещество:", value: " Прегабалин 75мг,150мг, 300мг" },
      { label: "Страна производитель:", value: "Турция" },
      { label: "Дозировка:", value: "Начальная доза 75мг, 150мг, можно увеличить до 300мг" },
      { label: "Производитель:", value: "ILAC" },
      { label: "Форма выпуска:", value: "Упаковка капсулы №28" },
      { label: "Применение:", value: " максимальная суточная доза до 600мг" },
    ],
  },
  {
    id: 16,
    name: "Атокса",
    category: "neuro",
    image: getImage("Mask group (10).png"),
    desc: [
      { label: "Действующее вещество:", value: "Теноксикам" },
      { label: "Страна производитель:", value: "Грузия" },
      { label: "Дозировка:", value: "20 мг" },
      { label: "Производитель:", value: "Биополюс" },
      { label: "Форма выпуска:", value: " Инъекция N 1" },
      { label: "Применение:", value: "1 инъекции 1 раз в день 5-7 дней" },
    ],
  },
  {
    id: 17,
    name: "Глюкофлекс",
    category: "neuro",
    image: getImage("Mask group (11).png"),
    desc: [
      { label: "Действующее вещество:", value: "Глюкозамин, Гидрохлорид 1500 мг, Хондроитин сульфат 1200 мг, Кальций (Citrimal) 800 мг, Витамин Д3 200 МЕ, Магний 300 мг, Цинк 12 мг, Медь 1,5 мг, Марганец 4 мг, Бор 1,5 мг, Витамин С 60 мг, Витамин К 20 мкг" },
      { label: "Страна производитель:", value: "США" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Каплеты № 30" },
      { label: "Применение:", value: " По 1-2 каплеты в день 4-6 месяцев" },
    ],
  },
  {
    id: 18,
    name: "Тикотен",
    category: "neuro",
    image: getImage("Mask group (12).png"),
    desc: [
      { label: "Действующее вещество:", value: "Теноксикам" },
      { label: "Страна производитель:", value: "Турция" },
      { label: "Дозировка:", value: "20 мг" },
      { label: "Производитель:", value: "Deva Holding A.S" },
      { label: "Форма выпуска:", value: "Инъекция № 1" },
      { label: "Применение:", value: " По 1 инъекции 1 раз в день 5-7 дней" },
    ],
  },
  {
    id: 19,
    name: "Дексирен",
    category: "neuro",
    image: getImage("Mask group (13).png"),
    desc: [
      { label: "Действующее вещество:", value: "Декскетопрофен" },
      { label: "Страна производитель:", value: "Турция" },
      { label: "Дозировка:", value: "25 мг" },
      { label: "Производитель:", value: "ILAC" },
      { label: "Форма выпуска:", value: "Капсулы № 20" },
      { label: "Применение:", value: "По 1 таблетке 2 раза в день" },
    ],
  },
  {
    id: 20,
    name: "Даблпласт",
    category: "neuro",
    image: getImage("Mask group (14).png"),
    desc: [
      { label: "Действующее вещество:", value: "Дементолизированное ментоловое масло ( Л-ментол), Эвкалиптовое масло, Винилилбутиловый эфир" },
      { label: "Страна производитель:", value: "Корея" },
      { label: "Производитель:", value: "Wooshin Labbotach" },
      { label: "Форма выпуска:", value: "Гидрогельный пластырь N 3" },
      { label: "Применение:", value: "Наклеить на болевую поверхность" },
    ],
  },
  {
    id: 21,
    name: "Ланикзол",
    category: "neuro",
    image: getImage("Mask group (15).png"),
    desc: [
      { label: "Действующее вещество:", value: "Золедроновая кислота" },
      { label: "Страна производитель:", value: "Турция" },
      { label: "Дозировка:", value: "5мг 100 мл" },
      { label: "Производитель:", value: "Platin Kimya" },
      { label: "Форма выпуска:", value: "Инъекции 100 мл № 1" },
      { label: "Применение:", value: "1 инъекция один раз в год" },
    ],
  },
  {
    id: 22,
    name: "Соматоп",
    category: "metabolic",
    image: getImage("Mask group (16).png"),
    desc: [
      { label: "Действующее вещество:", value: "Соматотропин" },
      { label: "Страна производитель:", value: "Корея" },
      { label: "Дозировка:", value: "4МЕ" },
      { label: "Производитель:", value: "DONG-A ST CO.LTD" },
      { label: "Форма выпуска:", value: "1 флакон соматотропина 4 МЕ и 1 мл флакон вода для иньекции" },
      { label: "Применение:", value: "3 месяца" },
    ],
  },
  {
    id: 23,
    name: "Миотир",
    category: "metabolic",
    image: getImage("Mask group (17).png"),
    desc: [
      { label: "Действующее вещество:", value: "Миоинозитол 1000 мг, Фолиевая кислота 100мкг" },
      { label: "Страна производитель:", value: "США" },
      { label: "Производитель:", value: "Windmill Health Product " },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "1кап 2 раза в день 1 месяц" },
    ],
  },
  {
    id: 24,
    name: "Гепариген",
    category: "metabolic",
    image: getImage("Mask group (18).png"),
    desc: [
      { label: "Действующее вещество:", value: "Лорнитина Ласпартат 100 мг" },
      { label: "Страна производитель:", value: "КОРЕЯ" },
      { label: "Дозировка:", value: "В среднем по 1 ампулы в/в капли 10 дней" },
      { label: "Производитель:", value: "Dai Han Pharm CO. Ltd" },
      { label: "Форма выпуска:", value: " Иньекции 5 мл в ампуле N 10 ампул" },
    ],
  },
  {
    id: 25,
    name: "Контрифорт",
    category: "metabolic",
    image: getImage("Mask group (19).png"),
    desc: [
      { label: "Действующее вещество:", value: "Апротинин 10000 Eg" },
      { label: "Страна производитель:", value: "Грузия" },
      { label: "Дозировка:", value: " По 2 мл 10000 Eg" },
      { label: "Производитель:", value: "БИОПОЛЮС" },
      { label: "Форма выпуска:", value: " Инъекции 2 мл N 10 с растворителем" },
    ],
  },
  {
    id: 26,
    name: "Зидена",
    category: "erectile",
    image: getImage("Mask group (20).png"),
    desc: [
      { label: "Действующее вещество:", value: "Зидена (уденафил) - оригинальный препарат для эректирной дисфункции у мужчин." },
      { label: "Страна производитель:", value: "Корея" },
      { label: "Дозировка:", value: "200 мг" },
      { label: "Производитель:", value: "DONG-A ST CO.LTD" },
      { label: "Форма выпуска:", value: "Таблетки №2" },
      { label: "Применение:", value: "½ по таб за 15-30 минут до полового акта" },
      { label: "Время действие:", value: "24 часа" },
    ],
  },
  {
    id: 27,
    name: "Дуинум",
    category: "erectile",
    image: getImage("Mask group (21).png"),
    desc: [
      { label: "Действующее вещество:", value: "Кломифена цитрат" },
      { label: "Страна производитель:", value: "Кипр" },
      { label: "Дозировка:", value: "50 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "у женщин по 1 таблетке в день, 5 дней; у мужчин по ½ таб в день" },
    ],
  },
  {
    id: 28,
    name: "Фоллитоп",
    category: "erectile",
    image: getImage("Mask group (22).png"),
    desc: [
      { label: "Действующее вещество:", value: "Фоллитропин 75МЕ, 150МЕ" },
      { label: "Страна производитель:", value: "Корея" },
      { label: "Производитель:", value: "Dong-A S.T Co. L.T.D" },
      { label: "Форма выпуска:", value: "Готовые шприцы в упаковке №1" },
      { label: "Применение:", value: "В среднем через день 1 шприц п/к или в/м" },
    ],
  },
  {
    id: 29,
    name: "Бевласин",
    category: "erectile",
    image: getImage("Mask group (23).png"),
    desc: [
      { label: "Действующее вещество:", value: "Солифенацин сукцинат" },
      { label: "Страна производитель:", value: "Турция" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "ILAC" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "По 1 таблетке в день" },
    ],
  },
  {
    id: 30,
    name: "Реналоф",
    category: "erectile",
    image: getImage("Mask group (24).png"),
    desc: [
      { label: "Действующее вещество:", value: "Agropinon repens extract " },
      { label: "Страна производитель:", value: "Испания" },
      { label: "Дозировка:", value: "325 мг" },
      { label: "Производитель:", value: "Catalisis" },
      { label: "Форма выпуска:", value: "Капсулы №90" },
      { label: "Применение:", value: "По 1 капсуле 3 раза в день" },
    ],
  },
];

export default function ProductsGrid({
  search = "",
  letter = "",
  category = "",
}) {
  const [activeId, setActiveId] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  useEffect(() => {
    setPage(1);
    setPerPage(8);
  }, [search, letter, category]);

  const handleShowMore = () => {
    setPerPage((prev) => prev + 8);
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());

    const matchLetter = !letter || p.name.startsWith(letter);

    const matchCategory =
      !category || category === "all" || p.category === category;

    return matchSearch && matchLetter && matchCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="px-[16px]">
      <div className="flex flex-wrap gap-[20px]">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`relative bg-white rounded-[14px] pt-[32px] pl-[32px] pb-[70px] pr-[30px] cursor-pointer transition
              ${
                activeId === p.id
                  ? "border border-[#8D91AF] shadow-[2px_2px_20px_rgba(0,0,0,0.25)]"
                  : "border border-[#E3E7EF]"
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-[255px] h-[200px] lg:h-[255px] mb-[10px] lg:mb-[20px] object-contain"
              />

              <h3 className="text-[#16226C] font-bold text-[20px] lg:text-[24px] leading-[160%] mb-[16px]">
                {p.name}
              </h3>

              <div className="text-[12px] text-black/70 leading-[160%] max-w-[255px]">
                {p.desc.map((item, i) => (
                  <p key={i}>
                    {item.label}{" "}
                    <span className="font-bold text-black">{item.value}</span>
                  </p>
                ))}
              </div>

              {activeId === p.id && (
                <img
                  src={cornerShape}
                  alt=""
                  className="absolute bottom-0 right-0 w-[120px]"
                />
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-[18px] mt-[40px]">
            Препарат не найден
          </div>
        )}
      </div>{" "}
      {/* SHOW MORE */}
      {perPage < filteredProducts.length && (
        <div className="text-center mt-[40px]">
          <button
            onClick={handleShowMore}
            className="text-[#1C2561] font-bold text-[12px] lg:text-[16px] hover:text-red-600 transition"
          >
            Показать больше ↓
          </button>
        </div>
      )}
      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-[18px] mt-[36px]">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-[25px] h-[25px] lg:w-[35px] lg:h-[35px] flex items-center justify-center rounded-full text-[12px] font-bold
          ${page === p ? "bg-red-600 text-white" : "text-[#97A2A9]"}`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
