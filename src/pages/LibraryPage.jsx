import { Link } from "react-router-dom"
import LibraryHero from "./Library/LibraryHero"
import LibraryCards from "./Library/LibraryCards"
import arrowIcon from "../assets/libraryimages/Arrow 1.png"

export default function LibraryPage() {
  return (
    <>

      <LibraryHero />
      
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
          Библиотека
        </span>

      </div>

      <LibraryCards/>

    </>
  )
}