import { useEffect, useState } from "react"
import bgImage from "../../assets/images/Screen-5.png"
import logo from "../../assets/icons/Logo-transpBG.svg"
import capsule1 from "../../assets/images/Pill2.svg"
import capsule2 from "../../assets/images/Pill.svg"
import capsule3 from "../../assets/images/Pill1.svg"
import capsule4 from "../../assets/images/Pill3.svg"

export default function ProductionSection() {

  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {

    const handleMouseMove = (e) => {

      const x = (window.innerWidth / 2 - e.clientX) / 30
      const y = (window.innerHeight / 2 - e.clientY) / 30

      setPosition({ x, y })

    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => window.removeEventListener("mousemove", handleMouseMove)

  }, [])

  return (
    <section className="relative w-full min-h-[420px] lg:min-h-[531px] overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* GRADIENT GLOW */}
      <div className="
      absolute
      w-[600px]
      h-[600px]
      bg-blue-400/20
      blur-[120px]
      rounded-full
      top-[-200px]
      left-[100px]
      "></div>


      {/* GLASS CIRCLE */}
      <div
        className="
        absolute
        left-1/2
        -translate-x-1/2
        top-1/2
        -translate-y-1/2

        lg:left-[113px]
        lg:-translate-x-0

        w-[260px]
        h-[260px]
        lg:w-[412px]
        lg:h-[412px]

        bg-white/40
        backdrop-blur-xl
        rounded-full

        flex
        flex-col
        items-center
        justify-center
        text-center

        p-[20px]
        lg:p-[40px]

        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        z-20
        "
      >

        <img
          src={logo}
          alt="logo"
          className="
          w-[100px]
          lg:w-[160px]
          mb-4
          lg:mb-6
          transition
          duration-300
          hover:scale-110
          "
        />

        <p className="text-[#1C2561] text-[14px] lg:text-[18px] font-semibold leading-[20px] lg:leading-[26px]">
          Компания Чехфарм
          <br />
          на заводах производителя
          <br />
          имеет свои производственные
          <br />
          площадки
        </p>

      </div>


      {/* CAPSULES */}

      <img
        src={capsule1}
        alt=""
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
        className="
        absolute
        top-[20px]
        left-[10px]
        w-[60px]
        lg:top-[10px]
        lg:left-[113px]
        lg:w-[100px]
        z-10
        animate-float
        "
      />

      <img
        src={capsule2}
        alt=""
        style={{
          transform: `translate(${position.x * -1}px, ${position.y}px)`
        }}
        className="
        absolute
        bottom-[10px]
        left-[20px]
        w-[50px]
        lg:left-[91px]
        lg:w-[80px]
        z-10
        animate-float
        "
      />

      <img
        src={capsule3}
        alt=""
        style={{
          transform: `translate(${position.x}px, ${position.y * -1}px)`
        }}
        className="
        hidden
        lg:block
        absolute
        bottom-[-90px]
        right-[20px]
        w-[100px]
        z-10
        animate-float
        "
      />

      <img
        src={capsule4}
        alt=""
        style={{
          transform: `translate(${position.x * -1}px, ${position.y * -1}px)`
        }}
        className="
        hidden
        lg:block
        absolute
        bottom-0
        translate-y-1/2
        left-[466px]
        w-[82px]
        animate-float
        "
      />

    </section>
  )
}

