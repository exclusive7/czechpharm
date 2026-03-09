import footerBg from "../assets/images/Nav.svg";
import logo from "../assets/images/CzechFarm_logo_white.svg";

import globeIcon from "../assets/images/Site.svg";
import phoneIcon from "../assets/images/viber_icon 1.svg";
import telegramIcon from "../assets/images/telegram_icon 1.svg";
import facebookIcon from "../assets/images/telegram_icon 2.svg";
import linkedinIcon from "../assets/images/telegram_icon 3.svg";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-custom pt-[60px] lg:pt-[100px] pb-[40px] lg:pb-[56px]">

        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[132px]">

          {/* LEFT SIDE */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[40px] lg:gap-[36px]">

            {/* LOGO */}
            <div className="flex justify-center lg:justify-start">
              <img
                src={logo}
                alt="Czechfarm"
                className="w-[150px] lg:w-[200px]"
              />
            </div>

            {/* MENUS */}
            <div className="grid grid-cols-2 gap-[40px] lg:gap-[160px] text-[14px] lg:text-[16px] text-white font-bold text-center lg:text-left pt-[10px]">

              <ul className="space-y-3">
                <li className="cursor-pointer">Про компанию</li>
                <li className="cursor-pointer">Препараты</li>
                <li className="cursor-pointer">Библиотека</li>
                <li className="cursor-pointer">Партнеры</li>
              </ul>

              <ul className="space-y-3">
                <li className="cursor-pointer">Партнеры</li>
                <li className="cursor-pointer">Вакансии</li>
                <li className="cursor-pointer">Обратная связь</li>
              </ul>

            </div>

          </div>

          {/* SOCIAL ICONS */}
          <div className="flex justify-center lg:justify-end w-full">
            <div className="flex gap-3">

              {[globeIcon, phoneIcon, telegramIcon, facebookIcon, linkedinIcon].map(
                (icon, index) => (
                  <div
                    key={index}
                    className="
                    w-[32px] h-[32px] lg:w-[38px] lg:h-[38px]
                    bg-white/20 rounded-md
                    flex items-center justify-center
                    hover:bg-white/30
                    transition cursor-pointer
                    "
                  >
                    <img src={icon} alt="" className="w-[16px] lg:w-[18px]" />
                  </div>
                )
              )}

            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-[40px] lg:mt-[56px] text-center text-[12px] lg:text-[16px] text-white">
          © 2023 Czechfarmalliance
        </div>

      </div>
    </footer>
  );
}