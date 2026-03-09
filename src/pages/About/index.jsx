import { Link } from "react-router-dom"
import AboutHero from "./AboutHero";
import AboutBrand from "./AboutBrand";
import CompanyValues from "./CompanyValues"
import AboutHighlight from "./AboutHighlight"
import AboutMedicines from "./AboutMedicines"
import AboutStrategy from "./AboutStrategy"
import AboutTeam from "./AboutTeam"

import arrowIcon from "../../assets/aboutimeges/Arrow 1.png"

export default function About() {
  return (
    <>
      
      <AboutHero />
      {/* Breadcrumb */}
      <div className="container-custom pt-[64px] flex items-center gap-3 text-[14px]">

        <Link to="/" className="text-black/70 hover:text-[#1C2561]">
          Главная
        </Link>

        <img
          src={arrowIcon}
          alt="arrow"
          className="w-[24px]"
        />

        <span className="text-black/70 font-bold">
          Про компанию
        </span>

      </div>
      <AboutBrand />
      <CompanyValues />
      <AboutHighlight />
      <AboutMedicines />
      <AboutStrategy />
      <AboutTeam />
    </>
  );
}
