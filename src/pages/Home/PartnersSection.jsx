import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

import "swiper/css"

import partner1 from "../../assets/images/Partner1.png"
import partner2 from "../../assets/images/Partner2.png"
import partner3 from "../../assets/images/Partner3.png"
import partner4 from "../../assets/images/Partner4.png"
import partner5 from "../../assets/images/Partner5.png"

export default function PartnersSection() {

const partners = [
partner1,
partner2,
partner3,
partner4,
partner5,
]

return (

<section className="py-[100px] lg:py-[180px] bg-[#EBF3F9]">

<div className="container-custom text-center">

<h3 className="text-[28px] lg:text-[48px] italic text-[#1C2561] uppercase">
НАШИ <span className="font-bold not-italic">ПАРТНЕРЫ</span>
</h3>

<p className="mt-[24px] lg:mt-[36px] text-[14px] lg:text-[16px] text-black max-w-[600px] mx-auto leading-[22px]">
Партнерами компании являются крупнейшие фармацевтические корпорации стран ЕС, США, Турции и Южной Кореи
</p>

<div className="mt-[60px]">

<Swiper
modules={[Autoplay]}
spaceBetween={40}
slidesPerView={2.2}
loop={true}
speed={4000}
autoplay={{
delay: 0,
disableOnInteraction: false,
}}

breakpoints={{
640: {
slidesPerView: 3
},
1024: {
slidesPerView: 5
}
}}
>

{partners.map((logo,index)=>(

<SwiperSlide key={index}>

<div className="
flex
justify-center
items-center
grayscale
opacity-70
hover:grayscale-0
hover:opacity-100
transition
duration-500
">

<img
src={logo}
alt="partner"
className="h-[40px] lg:h-[50px] object-contain"
loading="lazy"
/>

</div>

</SwiperSlide>

))}

</Swiper>

</div>

</div>

</section>

)

}