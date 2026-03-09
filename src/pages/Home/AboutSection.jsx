import { useState, useEffect } from "react";
import worldImg from "../../assets/images/Mask group.svg";
import capsuleCircleImg from "../../assets/images/Mask group1.svg";
import doctorCircleImg from "../../assets/images/Mask group2.svg";

function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
}

export default function AboutSection() {
  const partners = useCounter(50);
  const medicines = useCounter(70);
  const employees = useCounter(100);

  return (
    <section className="relative pt-[140px] lg:pt-[250px] pb-[80px] lg:pb-[140px]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[80px] lg:gap-[24px] text-[#1C2561] relative">
          {/* LEFT CARD */}
          <div
            className="relative flex flex-col items-center lg:items-start text-center transition
duration-300
hover:-translate-y-2
hover:shadow-xl lg:text-left"
          >
            <div className="w-[200px] lg:w-[328px] h-[3px] bg-[#F61114] mb-[24px]"></div>

            <div className="flex flex-col lg:flex-row items-center gap-3 relative z-30">
              <h2 className="text-[36px] lg:text-[48px] font-bold">
                {partners}+
              </h2>

              <p className="text-[14px] text-black/70 leading-[20px] max-w-[220px]">
                партнеров в странах ЕС, США, Турции и{" "}
                <span className="text-[#1C2561]">Южной</span> Кореи
              </p>
            </div>

            <img
              src={capsuleCircleImg}
              alt=""
              className="
              mt-[20px]
              w-[160px] h-[160px]
              lg:absolute
              lg:top-[40px]
              lg:left-[0px]
              lg:w-[250px]
              lg:h-[250px]
              float
              rounded-full object-cover
              z-10
              "
            />
          </div>

          {/* CENTER CARD */}
          <div
            className="relative flex flex-col items-center transition
duration-300
hover:-translate-y-2
hover:shadow-xl text-center"
          >
            <div className="w-[200px] lg:w-[328px] h-[3px] bg-[#F61114] mb-[24px]"></div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 relative z-30">
              <h2 className="text-[36px] lg:text-[48px] font-bold">
                {medicines}+
              </h2>

              <p className="text-[14px] text-black/70 leading-[20px] max-w-[220px]">
                лекарственных средств в различных областях применения
              </p>
            </div>

            <img
              src={worldImg}
              alt=""
              className="
              mt-[20px]
              w-[160px] h-[160px]
              lg:absolute
              lg:-top-[240px]
              lg:left-[40px]
              lg:w-[250px]
              lg:h-[250px]
              float
              rounded-full object-cover
              "
            />
          </div>

          {/* RIGHT CARD */}
          <div
            className="relative flex flex-col items-center lg:items-end text-center transition
duration-300
hover:-translate-y-2
hover:shadow-xl lg:text-right"
          >
            <div className="w-[200px] lg:w-[328px] h-[3px] bg-[#F61114] mb-[24px]"></div>

            <div className="flex flex-col lg:flex-row items-center lg:justify-end gap-3 relative z-30">
              <h2 className="text-[36px] lg:text-[48px] font-bold">
                {employees}+
              </h2>

              <p className="text-[14px] text-black/70 leading-[20px] max-w-[220px]">
                высококвалифицированных сотрудников
              </p>
            </div>

            <img
              src={doctorCircleImg}
              alt=""
              className="
              mt-[20px]
              w-[160px] h-[160px]
              lg:absolute
              lg:top-[60px]
              lg:right-[40px]
              lg:w-[250px]
              lg:h-[250px]
              float
              rounded-full object-cover
              z-10
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
