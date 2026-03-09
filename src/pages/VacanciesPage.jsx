import { Link } from "react-router-dom"
import arrowIcon from "../assets/vacansyimages/Arrow 1.png"
import VacanciesHero from "./vacancies/VacanciesHero"
import VacanciesList from "./vacancies/VacanciesList"
import TeamSection from "./vacancies/TeamSection"


export default function VacanciesPage() {
  return (
    <div>

      <VacanciesHero />

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
                Вакансии
              </span>
      
            </div>

            <VacanciesList />

            <TeamSection />
      


    </div>
  )
}