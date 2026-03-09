import libraryImg from "../../assets/libraryimages/BG-lines.svg";
import libraryBg from "../../assets/libraryimages/BG2.png";


export default function LibraryHero() {
  return (
    <section
          className="relative h-[180px] lg:h-[330px] bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${libraryBg})` }}
        >
          <div className="absolute inset-0 bg-[#1C2561]/20"></div>
    
          {/* wave */}
          <img
            src={libraryImg}
            alt=""
            className="absolute left-0 top-0 w-[900px] lg:w-[1583px] z-20"
          />
    
          {/* title */}
          <div className="container-custom h-full flex items-center">
            <h1 className="
        absolute
        text-white
        font-bold
        tracking-wide
        
        text-[24px]
        left-1/2
        -translate-x-1/2
        top-[20px]

        lg:text-[48px]
        lg:left-[120px]
        lg:translate-x-0
        lg:top-[106px]
        ">
              Библиотека
            </h1>
          </div>
    
        </section>
  )
}