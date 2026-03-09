import { useState } from "react";
import contactImg from "../../assets/images/doctor-working-laptop_1098-19721 1.png";
import consultBtn from "../../assets/images/BTN-round-konsultacia.svg";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Email regex validation
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязательно";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Fake API request (2 sec)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        question: "",
      });

      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    }, 2000);
  };

  return (
    <section className="py-[80px] lg:py-[180px]">
      <div className="container-custom">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row gap-[30px] lg:justify-between mb-[40px] lg:mb-[56px]">
          <div>
            <h2 className="text-[28px] lg:text-[48px] italic text-[#1C2561] uppercase">
              ФОРМА <span className="font-bold not-italic">ОБРАТНОЙ</span>
            </h2>

            <h2 className="text-[28px] lg:text-[48px] font-bold text-[#F61114] uppercase">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] lg:gap-[220px] items-start">
          {/* FORM */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-[20px] lg:space-y-[24px]">
              {/* NAME */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Имя"
                  className="placeholder:text-[#A5A5A5] w-full lg:w-[540px] h-[44px] px-4 rounded-[6px] border border-[#A5A5A5] bg-white focus:outline-none focus:border-[#1C2561]"
                />

                {errors.name && (
                  <p className="text-red-500 text-[14px] mt-1">{errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  className="placeholder:text-[#A5A5A5] w-full lg:w-[540px] h-[44px] px-4 rounded-[6px] border border-[#A5A5A5] bg-white focus:outline-none focus:border-[#1C2561]"
                />

                {errors.email && (
                  <p className="text-red-500 text-[14px] mt-1">{errors.email}</p>
                )}
              </div>

              {/* QUESTION */}
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Ваш вопрос"
                rows="4"
                className="placeholder:text-[#A5A5A5] w-full lg:w-[540px] px-4 py-3 rounded-[6px] border border-[#A5A5A5] bg-white resize-none focus:outline-none focus:border-[#1C2561]"
              />

              {/* BUTTON */}
              <div className="mt-[30px] lg:mt-[48px] flex justify-center lg:justify-start">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-[40px] h-[40px] border-4 border-[#1C2561] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img
                      src={consultBtn}
                      alt="Заказать консультацию"
                      className="w-[130px] lg:w-[150px] cursor-pointer transition duration-300 hover:scale-105"
                    />
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* IMAGE */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={contactImg}
              alt="doctor"
              className="w-full max-w-[360px] lg:max-w-[445px] h-auto object-cover rounded-[12px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}