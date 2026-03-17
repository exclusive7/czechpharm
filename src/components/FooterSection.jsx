import { Link } from "react-router-dom";

import footerBg from "../assets/images/Nav.svg";
import logo from "../assets/images/CzechFarm_logo_white.svg";

import globeIcon from "../assets/images/Site.svg";
import phoneIcon from "../assets/images/viber_icon 1.svg";
import telegramIcon from "../assets/images/telegram_icon 1.svg";
import facebookIcon from "../assets/images/telegram_icon 2.svg";
import linkedinIcon from "../assets/images/telegram_icon 3.svg";
import { useSiteContent } from "../hooks/useSiteContent";

export default function Footer() {
  const { siteContent } = useSiteContent();

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
              <Link to="/">
                <img
                  src={logo}
                  alt="Czechfarm"
                  className="w-[150px] lg:w-[200px]"
                />
              </Link>
            </div>

            {/* MENUS */}
            <div className="grid grid-cols-2 gap-[40px] lg:gap-[160px] text-[14px] lg:text-[16px] text-white font-bold text-center lg:text-left pt-[10px]">

              <ul className="space-y-3">

                <li>
                  <Link to="/about" className="hover:opacity-80 transition">
                    Про компанию
                  </Link>
                </li>

                <li>
                  <Link to="/products" className="hover:opacity-80 transition">
                    Препараты
                  </Link>
                </li>

                <li>
                  <Link to="/library" className="hover:opacity-80 transition">
                    Библиотека
                  </Link>
                </li>

                <li>
                  <Link to="/contacts" className="hover:opacity-80 transition">
                    Контакты
                  </Link>
                </li>

              </ul>

              <ul className="space-y-3">

                <li>
                  <Link to="/partners" className="hover:opacity-80 transition">
                    Партнеры
                  </Link>
                </li>

                <li>
                  <Link to="/vacancies" className="hover:opacity-80 transition">
                    Вакансии
                  </Link>
                </li>

                <li>
                  <Link to="/contacts" className="hover:opacity-80 transition">
                    Обратная связь
                  </Link>
                </li>

              </ul>

            </div>

          </div>

          {/* SOCIAL ICONS */}
          <div className="flex justify-center lg:justify-end w-full">

            <div className="flex gap-3">

              <a
                href={siteContent.footer.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[32px] h-[32px] lg:w-[38px] lg:h-[38px] bg-white/20 rounded-md flex items-center justify-center hover:bg-white/30 transition"
              >
                <img src={globeIcon} alt="" className="w-[16px] lg:w-[18px]" />
              </a>

              <a
                href={siteContent.footer.phoneUrl}
                className="w-[32px] h-[32px] lg:w-[38px] lg:h-[38px] bg-white/20 rounded-md flex items-center justify-center hover:bg-white/30 transition"
              >
                <img src={phoneIcon} alt="" className="w-[16px] lg:w-[18px]" />
              </a>

              <a
                href={siteContent.footer.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[32px] h-[32px] lg:w-[38px] lg:h-[38px] bg-white/20 rounded-md flex items-center justify-center hover:bg-white/30 transition"
              >
                <img src={telegramIcon} alt="" className="w-[16px] lg:w-[18px]" />
              </a>

              <a
                href={siteContent.footer.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[32px] h-[32px] lg:w-[38px] lg:h-[38px] bg-white/20 rounded-md flex items-center justify-center hover:bg-white/30 transition"
              >
                <img src={facebookIcon} alt="" className="w-[16px] lg:w-[18px]" />
              </a>

              <a
                href={siteContent.footer.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[32px] h-[32px] lg:w-[38px] lg:h-[38px] bg-white/20 rounded-md flex items-center justify-center hover:bg-white/30 transition"
              >
                <img src={linkedinIcon} alt="" className="w-[16px] lg:w-[18px]" />
              </a>

            </div>

          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-[40px] lg:mt-[56px] text-center text-[12px] lg:text-[16px] text-white">
          © {siteContent.footer.year} Czechfarmalliance
        </div>

      </div>
    </footer>
  );
}
