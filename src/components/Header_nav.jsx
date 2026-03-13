import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import burgerIcon from "../assets/icons/Nav.svg";
import searchIcon from "../assets/icons/Search.svg";
import arrowDown from "../assets/icons/Group 182.svg";
import logo from "../assets/icons/Logo-transpBG.svg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  return (
    <header className="relative bg-white py-[16px] lg:py-[24px]">
      <div className="container-custom flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-[40px] lg:gap-[94px]">
          {/* Logo */}
          <img src={logo} alt="logo" className="h-[40px] lg:h-[56px]" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-[36px] text-[16px] font-bold text-[#16226C]">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `border-t-[3px] ${
                  isActive ? "border-[#F61114]" : "border-transparent"
                }`
              }
            >
              Про компанию
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `border-t-[3px] ${
                  isActive ? "border-[#F61114]" : "border-transparent"
                }`
              }
            >
              Препараты
            </NavLink>

            <NavLink
              to="/contacts"
              className={({ isActive }) =>
                `border-t-[3px] ${
                  isActive ? "border-[#F61114]" : "border-transparent"
                }`
              }
            >
              Контакты
            </NavLink>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-[16px] lg:gap-[32px]">
          {/* Search */}
          <div className="relative flex items-center gap-[5px] cursor-pointer">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center justify-center"
            >
              <img src={searchIcon} className="w-[20px] h-[20px]" />
            </button>
            <div className="hidden lg:flex items-center gap-[5px] ml-[10px]">
              <input
                type="text"
                className="outline-none w-[80px] text-sm border-b border-[#1C2561]/20"
              />
            </div>
            {searchOpen && (
              <div className="absolute right-0 top-[40px] w-[220px] bg-white shadow-md p-[12px] rounded-md lg:hidden z-50">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full border-b border-[#1C2561]/20 outline-none text-sm"
                />
              </div>
            )}
          </div>

          {/* Language */}
          <div className="flex items-center gap-[4px] text-[#16226C] text-[12px] lg:text-sm font-medium">
            <span>RU</span>
            <img src={arrowDown} className="w-[16px] lg:w-[20px]" />
          </div>

          {/* Burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="">
            <img src={burgerIcon} className="w-[32px] h-[32px]" />
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="
    absolute
    right-[20px]
    top-[100%]
    w-[280px]
    lg:w-[320px]
    bg-white
    shadow-xl
    z-50
    p-[24px]
    flex
    flex-col
    gap-[20px]
    text-[#16226C]
    font-bold
    "
          >
            {/* MOBILE ONLY */}
            <div className="flex flex-col gap-[20px] lg:hidden">
              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Про компанию
              </NavLink>

              <NavLink
                to="/products"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Препараты
              </NavLink>

              <NavLink
                to="/contacts"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Контакты
              </NavLink>

              <NavLink
                to="/library"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Библиотека
              </NavLink>

              <NavLink
                to="/partners"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Партнеры
              </NavLink>

              <NavLink
                to="/vacancies"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Вакансии
              </NavLink>
            </div>

            {/* DESKTOP ONLY */}
            <div className="hidden lg:flex flex-col gap-[20px]">
              <NavLink
                to="/library"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Библиотека
              </NavLink>

              <NavLink
                to="/partners"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Партнеры
              </NavLink>

              <NavLink
                to="/vacancies"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-l-[3px] pl-[10px] ${
                    isActive
                      ? "border-[#F61114] text-[#16226C]"
                      : "border-transparent"
                  }`
                }
              >
                Вакансии
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
