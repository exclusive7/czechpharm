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

const products = [
  {
    id: 1,
    name: "Venoplast",
    category: "new",
    image: kaptalin,
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
    name: "Nervorin",
    category: "new",
    image: elpezum,
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
    id: 3,
    name: "Babyplast",
    category: "new",
    image: melatonin,
    desc: [
      { label: "Действующее вещество:", value: "Мелатонин" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "1 таблетка перед сном" },
    ],
  },
  {
    id: 4,
    name: "Diaplast пластырь",
    category: "new",
    image: kardion,
    desc: [
      { label: "Действующее вещество:", value: "Мельдоний" },
      { label: "Страна производитель:", value: "Латвия" },
      { label: "Дозировка:", value: "500 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Капсулы № 30" },
      { label: "Применение:", value: "1–2 капсулы в день" },
    ],
  },
  {
    id: 5,
    name: "Немотан",
    category: "vascular",
    image: nemotan,
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
    image: elstar,
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
    id: 7,
    name: "Мелатонин",
    category: "vascular",
    image: melatonin,
    desc: [
      { label: "Действующее вещество:", value: "Мелатонин" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "1 таблетка перед сном" },
    ],
  },
  {
    id: 8,
    name: "Кардон O2",
    category: "vascular",
    image: kardion,
    desc: [
      { label: "Действующее вещество:", value: "Мельдоний" },
      { label: "Страна производитель:", value: "Латвия" },
      { label: "Дозировка:", value: "500 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Капсулы № 30" },
      { label: "Применение:", value: "1–2 капсулы в день" },
    ],
  },
  {
    id: 9,
    name: "L-Arginin",
    category: "vascular",
    image: arginin,
    desc: [
      { label: "Действующее вещество:", value: "L-Аргинин" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "1000 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Капсулы № 60" },
      { label: "Применение:", value: "2 раза в день" },
    ],
  },
  {
    id: 10,
    name: "Элпезум",
    category: "vascular",
    image: elpezum,
    desc: [
      { label: "Действующее вещество:", value: "Эзомепразол" },
      { label: "Страна производитель:", value: "Германия" },
      { label: "Дозировка:", value: "40 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Капсулы № 30" },
      { label: "Применение:", value: "1 капсула в день" },
    ],
  },
  {
    id: 11,
    name: "Cholesterol Control",
    category: "vascular",
    image: cholesterol,
    desc: [
      { label: "Действующее вещество:", value: "Фитостеролы" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "500 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Капсулы № 60" },
      { label: "Применение:", value: "2 раза в день" },
    ],
  },
  {
    id: 12,
    name: "Капталин микро",
    category: "vascular",
    image: kaptalin,
    desc: [
      { label: "Действующее вещество:", value: "Каптоприл" },
      { label: "Страна производитель:", value: "Польша" },
      { label: "Дозировка:", value: "25 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "2 раза в день" },
    ],
  },
  {
    id: 13,
    name: "Артзор",
    category: "neuro",
    image: nemotan,
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
    id: 14,
    name: "Макстио",
    category: "neuro",
    image: elstar,
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
    id: 15,
    name: "Регапеп 75мг, 150мг, 300мг",
    category: "neuro",
    image: melatonin,
    desc: [
      { label: "Действующее вещество:", value: "Мелатонин" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "1 таблетка перед сном" },
    ],
  },
  {
    id: 16,
    name: "Атокса",
    category: "neuro",
    image: kardion,
    desc: [
      { label: "Действующее вещество:", value: "Мельдоний" },
      { label: "Страна производитель:", value: "Латвия" },
      { label: "Дозировка:", value: "500 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Капсулы № 30" },
      { label: "Применение:", value: "1–2 капсулы в день" },
    ],
  },
  {
    id: 17,
    name: "Глюкофлекс",
    category: "neuro",
    image: arginin,
    desc: [
      { label: "Действующее вещество:", value: "L-Аргинин" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "1000 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Капсулы № 60" },
      { label: "Применение:", value: "2 раза в день" },
    ],
  },
  {
    id: 18,
    name: "Тикотен",
    category: "neuro",
    image: elpezum,
    desc: [
      { label: "Действующее вещество:", value: "Эзомепразол" },
      { label: "Страна производитель:", value: "Германия" },
      { label: "Дозировка:", value: "40 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Капсулы № 30" },
      { label: "Применение:", value: "1 капсула в день" },
    ],
  },
  {
    id: 19,
    name: "Декспрен",
    category: "neuro",
    image: cholesterol,
    desc: [
      { label: "Действующее вещество:", value: "Фитостеролы" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "500 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Капсулы № 60" },
      { label: "Применение:", value: "2 раза в день" },
    ],
  },
  {
    id: 20,
    name: "Даблапласт",
    category: "neuro",
    image: kaptalin,
    desc: [
      { label: "Действующее вещество:", value: "Каптоприл" },
      { label: "Страна производитель:", value: "Польша" },
      { label: "Дозировка:", value: "25 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "2 раза в день" },
    ],
  },
  {
    id: 21,
    name: "Ланжизол",
    category: "neuro",
    image: kaptalin,
    desc: [
      { label: "Действующее вещество:", value: "Каптоприл" },
      { label: "Страна производитель:", value: "Польша" },
      { label: "Дозировка:", value: "25 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "2 раза в день" },
    ],
  },
  {
    id: 22,
    name: "Соматоп",
    category: "metabolic",
    image: elpezum,
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
    id: 23,
    name: "Миотир",
    category: "metabolic",
    image: kaptalin,
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
    id: 24,
    name: "Гепариген",
    category: "metabolic",
    image: melatonin,
    desc: [
      { label: "Действующее вещество:", value: "Мелатонин" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "1 таблетка перед сном" },
    ],
  },
  {
    id: 25,
    name: "Контрифорт",
    category: "metabolic",
    image: kardion,
    desc: [
      { label: "Действующее вещество:", value: "Мельдоний" },
      { label: "Страна производитель:", value: "Латвия" },
      { label: "Дозировка:", value: "500 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Капсулы № 30" },
      { label: "Применение:", value: "1–2 капсулы в день" },
    ],
  },
  {
    id: 26,
    name: "Зидена",
    category: "erectile",
    image: kaptalin,
    desc: [
      { label: "Действующее вещество:", value: "Каптоприл" },
      { label: "Страна производитель:", value: "Польша" },
      { label: "Дозировка:", value: "25 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "2 раза в день" },
    ],
  },
  {
    id: 27,
    name: "Дуинум",
    category: "erectile",
    image: elpezum,
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
    id: 28,
    name: "Фоллитоп",
    category: "erectile",
    image: kaptalin,
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
    id: 29,
    name: "Бевласин",
    category: "erectile",
    image: melatonin,
    desc: [
      { label: "Действующее вещество:", value: "Мелатонин" },
      { label: "Страна производитель:", value: "США" },
      { label: "Дозировка:", value: "5 мг" },
      { label: "Производитель:", value: "Windmill Health Products" },
      { label: "Форма выпуска:", value: "Таблетки № 30" },
      { label: "Применение:", value: "1 таблетка перед сном" },
    ],
  },
  {
    id: 30,
    name: "Реналоф",
    category: "erectile",
    image: kardion,
    desc: [
      { label: "Действующее вещество:", value: "Мельдоний" },
      { label: "Страна производитель:", value: "Латвия" },
      { label: "Дозировка:", value: "500 мг" },
      { label: "Производитель:", value: "Medochemie L.T.D" },
      { label: "Форма выпуска:", value: "Капсулы № 30" },
      { label: "Применение:", value: "1–2 капсулы в день" },
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

              <div className="text-[12px] text-black/70 leading-[160%]">
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
