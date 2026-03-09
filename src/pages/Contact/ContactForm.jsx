import { useState } from "react"
import formImg from "../../assets/contactimages/doctor-working-laptop_1098-19721 1.png"
import plusIcon from "../../assets/contactimages/BTN-round-konsultacia.svg"

export default function ContactForm() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: ""
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validate = () => {

    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязательно"
    }

    return newErrors
  }

  const handleSubmit = (e) => {

    e.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setSuccess(true)

    setFormData({
      name: "",
      email: "",
      question: ""
    })

    setTimeout(() => {
      setSuccess(false)
    }, 4000)
  }

  return (
    <section className="py-[60px] md:py-[100px] lg:py-[180px]">
      <div className="container-custom">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mb-[40px] lg:mb-[56px]">

          <div>
            <h2 className="text-[28px] sm:text-[32px] lg:text-[48px] italic text-[#1C2561] uppercase">
              ФОРМА <span className="font-bold not-italic">ОБРАТНОЙ</span>
            </h2>

            <h2 className="text-[28px] sm:text-[32px] lg:text-[48px] font-bold text-[#F61114] uppercase">
              СВЯЗИ
            </h2>
          </div>

          <p className="text-[14px] lg:text-[16px] text-black/70 max-w-[443px] leading-[20px]">
            С удовольствием проконсультируем Вас по любым интересующим вопросам
          </p>

        </div>


        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-[30px] p-[20px] bg-green-100 text-green-700 rounded-lg text-center animate-pulse">
            Спасибо! Мы скоро свяжемся с вами
          </div>
        )}


        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] lg:gap-[220px] items-start">

          {/* FORM */}
          <div>

            <form onSubmit={handleSubmit} className="space-y-[20px] lg:space-y-[24px]">

              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Имя"
                  className="placeholder:text-[#A5A5A5] w-full lg:w-[540px] 
                  h-[40px] lg:h-[44px] 
                  text-[14px] lg:text-[16px] 
                  px-3 lg:px-4 
                  rounded-[6px] border border-[#A5A5A5] bg-white 
                  focus:outline-none focus:border-[#1C2561]"
                />

                {errors.name && (
                  <p className="text-red-500 text-[13px] lg:text-[14px] mt-1">
                    {errors.name}
                  </p>
                )}
              </div>


              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  className="placeholder:text-[#A5A5A5] w-full lg:w-[540px] 
                  h-[40px] lg:h-[44px] 
                  text-[14px] lg:text-[16px] 
                  px-3 lg:px-4 
                  rounded-[6px] border border-[#A5A5A5] bg-white 
                  focus:outline-none focus:border-[#1C2561]"
                />

                {errors.email && (
                  <p className="text-red-500 text-[13px] lg:text-[14px] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>


              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Ваш вопрос"
                rows="4"
                className="placeholder:text-[#A5A5A5] w-full lg:w-[540px] 
                text-[14px] lg:text-[16px] 
                px-3 lg:px-4 
                py-2 lg:py-3 
                rounded-[6px] border border-[#A5A5A5] bg-white 
                resize-none focus:outline-none focus:border-[#1C2561]"
              />


              {/* BUTTON */}
              <div className="mt-[30px] lg:mt-[48px] flex justify-center lg:justify-start">
                <button type="submit">
                  <img
                    src={plusIcon}
                    alt="Заказать консультацию"
                    className="w-[130px] lg:w-[150px] cursor-pointer transition duration-300 hover:scale-105"
                  />
                </button>
              </div>

            </form>

          </div>


          {/* IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={formImg}
              alt=""
              className="w-full max-w-[445px] h-auto lg:h-[489px] object-cover rounded-[12px]"
            />
          </div>

        </div>

      </div>
    </section>
  )
}

