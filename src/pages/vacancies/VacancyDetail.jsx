import { useParams } from "react-router-dom";
import locationIcon from "../../assets/vacansyimages/Mask group (6).svg";
import dateIcon from "../../assets/vacansyimages/Mask group (7).svg";
import timeIcon from "../../assets/vacansyimages/Mask group (8).png";
import Breadcrumb from "../../components/Breadcrumb";

const vacancies = {
  "medical-representative": {
    title: "Медицинский представитель",
    location: "Ташкент, Узбекистан",
    type: "Полная занятость",
    date: "23.10.2023",

    responsibilities: [
      "Проведение анализа рынка и конкурентов",
      "Составление маркетингового плана и его реализация",
      "Работа над стратегиями позиционирования товара",
      "Создание и совершенствование ассортиментной политики",
      "Разработка и совершенствование ценовой политики",
      "Контроль и планирование поставок продукции",
      "Прогнозирование будущих продаж",
      "Разработка стратегий продвижения товара",
      "Подготовка рекламных материалов",
      "Участие в конференциях и выставках",
      "Формирование бюджета",
    ],

    requirements: [
      "Высшее медицинское или фармацевтическое образование",
      "Опыт работы на аналогичной позиции",
      "Владение русским и узбекским языками",
      "Умение работать в команде",
      "Ответственность",
    ],

    conditions: [
      "График: 5/2 с 9:00-18:00",
      "Стабильная заработная плата",
      "Официальное трудоустройство",
      "Корпоративное обучение",
      "Дружный коллектив",
    ],
  },
  "product-manager": {
    title: "Продакт менеджер",
    location: "Ташкент, Узбекистан",
    type: "Полная занятость",
    date: "23.10.2023",

    responsibilities: [
      "Проведение анализа рынка и конкурентов",
      "Составление маркетингового плана и его реализация",
      "Работа над стратегиями позиционирования товара",
      "Создание и совершенствование ассортиментной политики",
      "Разработка и совершенствование ценовой политики",
      "Контроль и планирование поставок продукции",
      "Прогнозирование будущих продаж",
      "Разработка стратегий продвижения товара",
      "Подготовка рекламных материалов",
      "Участие в конференциях и выставках",
      "Формирование бюджета",
    ],

    requirements: [
      "Высшее медицинское или фармацевтическое образование",
      "Опыт работы на аналогичной позиции",
      "Владение русским и узбекским языками",
      "Умение работать в команде",
      "Ответственность",
    ],

    conditions: [
      "График: 5/2 с 9:00-18:00",
      "Стабильная заработная плата",
      "Официальное трудоустройство",
      "Корпоративное обучение",
      "Дружный коллектив",
    ],


  },

  "office-manager": {
    title: "Офис менеджер",
    location: "Ташкент, Узбекистан",
    type: "Полная занятость",
    date: "23.10.2023",

    responsibilities: [
      "Проведение анализа рынка и конкурентов",
      "Составление маркетингового плана и его реализация",
      "Работа над стратегиями позиционирования товара",
      "Создание и совершенствование ассортиментной политики",
      "Разработка и совершенствование ценовой политики",
      "Контроль и планирование поставок продукции",
      "Прогнозирование будущих продаж",
      "Разработка стратегий продвижения товара",
      "Подготовка рекламных материалов",
      "Участие в конференциях и выставках",
      "Формирование бюджета",
    ],

    requirements: [
      "Высшее медицинское или фармацевтическое образование",
      "Опыт работы на аналогичной позиции",
      "Владение русским и узбекским языками",
      "Умение работать в команде",
      "Ответственность",
    ],

    conditions: [
      "График: 5/2 с 9:00-18:00",
      "Стабильная заработная плата",
      "Официальное трудоустройство",
      "Корпоративное обучение",
      "Дружный коллектив",
    ],
  },

  "office-manager-2": {
    title: "Офис менеджер-2",
    location: "Ташкент, Узбекистан",
    type: "Полная занятость",
    date: "23.10.2023",

    responsibilities: [
      "Проведение анализа рынка и конкурентов",
      "Составление маркетингового плана и его реализация",
      "Работа над стратегиями позиционирования товара",
      "Создание и совершенствование ассортиментной политики",
      "Разработка и совершенствование ценовой политики",
      "Контроль и планирование поставок продукции",
      "Прогнозирование будущих продаж",
      "Разработка стратегий продвижения товара",
      "Подготовка рекламных материалов",
      "Участие в конференциях и выставках",
      "Формирование бюджета",
    ],

    requirements: [
      "Высшее медицинское или фармацевтическое образование",
      "Опыт работы на аналогичной позиции",
      "Владение русским и узбекским языками",
      "Умение работать в команде",
      "Ответственность",
    ],

    conditions: [
      "График: 5/2 с 9:00-18:00",
      "Стабильная заработная плата",
      "Официальное трудоустройство",
      "Корпоративное обучение",
      "Дружный коллектив",
    ],
  },

  "hr-manager": {
    title: "HR менеджер",
    location: "Ташкент, Узбекистан",
    type: "Полная занятость",
    date: "23.10.2023",

    responsibilities: [
      "Проведение анализа рынка и конкурентов",
      "Составление маркетингового плана и его реализация",
      "Работа над стратегиями позиционирования товара",
      "Создание и совершенствование ассортиментной политики",
      "Разработка и совершенствование ценовой политики",
      "Контроль и планирование поставок продукции",
      "Прогнозирование будущих продаж",
      "Разработка стратегий продвижения товара",
      "Подготовка рекламных материалов",
      "Участие в конференциях и выставках",
      "Формирование бюджета",
    ],

    requirements: [
      "Высшее медицинское или фармацевтическое образование",
      "Опыт работы на аналогичной позиции",
      "Владение русским и узбекским языками",
      "Умение работать в команде",
      "Ответственность",
    ],

    conditions: [
      "График: 5/2 с 9:00-18:00",
      "Стабильная заработная плата",
      "Официальное трудоустройство",
      "Корпоративное обучение",
      "Дружный коллектив",
    ],
  }
};



export default function VacancyDetail() {
  const { slug } = useParams();
  const vacancy = vacancies[slug];

  if (!vacancy) {
    return <div className="p-20 text-center text-xl">Вакансия не найдена</div>;
  }

  return (
    <section className="py-[60px] lg:py-[120px] bg-[#F8F9FC]">
      <div className="container-custom">

        <Breadcrumb
          items={[
            { label: "Вакансии", link: "/vacancies" },
            { label: vacancy.title },
          ]}
        />

        <div className="mt-[40px] lg:mt-[72px]">

          {/* TITLE */}
          <h1 className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold leading-[140%] mb-[30px] lg:mb-[36px]">
            {vacancy.title}
          </h1>


          {/* INFO ROW */}
          <div className="
          flex
          flex-col
          sm:flex-row
          sm:flex-wrap
          gap-[16px]
          sm:gap-[30px]
          lg:justify-between
          lg:items-center
          mb-[40px]
          lg:mb-[56px]
          text-[14px]
          lg:text-[16px]
          text-black/70
          ">

            <div className="flex items-center gap-[8px] text-black/80">
              <img src={locationIcon} className="w-[28px] lg:w-[40px]" />
              {vacancy.location}
            </div>

            <div className="flex items-center gap-[8px] text-black">
              <img src={timeIcon} className="w-[28px] lg:w-[40px]" />
              {vacancy.type}
            </div>

            <div className="flex items-center gap-[8px] text-[#16226C]">
              <img src={dateIcon} className="w-[28px] lg:w-[40px]" />
              <span className="text-[#1C2561] font-bold">{vacancy.date}</span>
            </div>

          </div>


          {/* DESCRIPTION */}
          <p className="text-[14px] lg:text-[16px] text-black/80 leading-[24px] lg:leading-[26px] mb-[40px] lg:mb-[56px]">
            <b>Компания CZECHFARM ALLIANCE</b> объявляет набор в свою
            динамично-развивающуюся компанию на должность{" "}
            <b className="uppercase">
              {vacancy.title}a с ВЫСОКООПЛАЧИВАЕМОЙ ЗП.
            </b>
          </p>


          {/* RESPONSIBILITIES */}
          {vacancy.responsibilities && (
            <>
              <h3 className="font-bold mb-[18px] lg:mb-[24px] text-black/70">
                Функциональные обязанности
              </h3>

              <ul className="space-y-[10px] lg:space-y-[12px] text-black/70 text-[12px] lg:text-[15px] leading-[22px] lg:leading-[24px] mb-[30px] lg:mb-[36px]">
                {vacancy.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-[12px]">
                    <span className="w-[20px] lg:w-[24px] h-[1px] bg-[#F61114] mt-[10px]"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}


          {/* REQUIREMENTS */}
          {vacancy.requirements && (
            <>
              <h3 className="font-bold mb-[18px] lg:mb-[24px] text-black/70">
                Требования к кандидату
              </h3>

              <ul className="space-y-[10px] lg:space-y-[12px] text-black/70 text-[12px] lg:text-[15px] leading-[22px] lg:leading-[24px] mb-[30px] lg:mb-[36px]">
                {vacancy.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-[12px]">
                    <span className="w-[20px] lg:w-[24px] h-[1px] bg-[#F61114] mt-[10px]"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}


          {/* CONDITIONS */}
          {vacancy.conditions && (
            <>
              <h3 className="font-bold mb-[18px] lg:mb-[24px] text-black/70">
                Условия
              </h3>

              <ul className="space-y-[10px] text-black/70 text-[12px] lg:text-[15px] mb-[40px] lg:mb-[56px]">
                {vacancy.conditions.map((item, index) => (
                  <li key={index} className="flex items-start gap-[12px]">
                    <span className="w-[20px] lg:w-[24px] h-[1px] bg-[#F61114] mt-[10px]"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}


          {/* FOOTER TEXT */}
          <p className="text-black/70 mb-[20px] lg:mb-[36px] text-[14px] lg:text-[18px] leading-[150%]">
            Рассматриваем только ОТВЕТСТВЕННЫХ, СЕРЬЁЗНЫХ кандидатов!
            Остальные вопросы во время собеседования.
          </p>

          <p className="text-black/70 font-bold text-[14px] lg:text-[18px] leading-[150%]">
            Резюме отправлять по телеграмм
            <a
              href="https://t.me/HR_CzechfarmAlliance"
              target="_blank"
              className="text-[#1C2561] font-bold ml-1 hover:underline"
            >
              @HR_CzechfarmAlliance
            </a>
          </p>

        </div>
      </div>
    </section>
  );
}

