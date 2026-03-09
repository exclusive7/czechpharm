import { Link } from "react-router-dom";
import arrow from "../assets/productimages/Arrow 1.png";

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="flex items-center gap-[6px] text-[12px] sm:text-[14px] text-black/70 overflow-x-auto whitespace-nowrap breadcrumb-scroll">

      {/* HOME */}
      <Link
        to="/"
        className="text-black/70 hover:text-[#1C2561] transition whitespace-nowrap"
      >
        Главная
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-[6px] sm:gap-[10px]">

          <img
            src={arrow}
            alt="arrow"
            className="w-[16px] sm:w-[20px] lg:w-[24px]"
          />

          {item.link ? (
            <Link
              to={item.link}
              className="text-black/70 font-bold hover:text-[#1C2561] transition max-w-[180px] truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-black/70 font-bold truncate lg:whitespace-normal lg:overflow-visible">
              {item.label}
            </span>
          )}

        </div>
      ))}
    </div>
  );
}