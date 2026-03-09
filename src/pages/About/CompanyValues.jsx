import valueIcon1 from "../../assets/aboutimeges/Mask group3.svg"
import valueIcon2 from "../../assets/aboutimeges/Mask group4.svg"
import valueIcon3 from "../../assets/aboutimeges/Mask group5.svg"
import waveBg from "../../assets/aboutimeges/BG-lines (2).svg"

export default function CompanyValues() {
  return (
    <section className="relative py-[100px] lg:py-[180px] bg-[#EBF3F9]">

      {/* Background wave */}
      <img
        src={waveBg}
        alt=""
        className="absolute top-[350px] lg:top-[500px] left-0 w-full opacity-40"
      />

      <div className="container-custom relative z-10">

        {/* TITLE */}
        <div className="text-center mb-[50px] lg:mb-[80px]">
          <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] font-bold text-[#1C2561]">
            <span className="italic font-normal">ЦЕННОСТИ</span>{" "}
            <span className="text-[#F61114]">КОМПАНИИ</span>
          </h2>
        </div>

        {/* VALUES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[60px] sm:gap-[120px] lg:gap-[232px]">

          {/* ITEM 1 */}
          <div className="flex flex-col items-center text-center">
            <img src={valueIcon1} alt="" className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] mb-[20px] lg:mb-[24px]" />
            <p className="text-black/70 text-[16px] lg:text-[18px] font-bold leading-[150%]">
              высокие этические <br /> принципы
            </p>
          </div>

          {/* ITEM 2 */}
          <div className="flex flex-col items-center text-center">
            <img src={valueIcon2} alt="" className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] mb-[20px] lg:mb-[24px]" />
            <p className="text-black/70 text-[16px] lg:text-[18px] font-bold leading-[150%]">
              профессионализм <br /> и компетентность
            </p>
          </div>

          {/* ITEM 3 */}
          <div className="flex flex-col items-center text-center">
            <img src={valueIcon3} alt="" className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] mb-[20px] lg:mb-[24px]" />
            <p className="text-black/70 text-[16px] lg:text-[18px] font-bold leading-[150%]">
              командный дух, <br /> новаторство, лидерство
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}