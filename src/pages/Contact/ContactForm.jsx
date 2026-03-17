import { useState } from "react";
import formImg from "../../assets/contactimages/doctor-working-laptop_1098-19721 1.png";
import { submitContactRequest } from "../../data/contactSettingsStore";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    question: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Имя обязательно";
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      nextErrors.phone = "Укажите телефон или email";
      nextErrors.email = "Укажите телефон или email";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setSubmitError("");

    try {
      await submitContactRequest(formData);
      setSuccess(true);

      setFormData({
        name: "",
        phone: "",
        email: "",
        question: "",
      });

      window.setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (error) {
      setSubmitError(error.message || "Не удалось отправить форму");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-[60px] md:py-[100px] lg:py-[180px]">
      <div className="container-custom">
        <div className="mb-[40px] flex flex-col gap-6 lg:mb-[56px] lg:flex-row lg:justify-between">
          <div>
            <h2 className="text-[28px] uppercase italic text-[#1C2561] sm:text-[32px] lg:text-[48px]">
              ФОРМА <span className="font-bold not-italic">ОБРАТНОЙ</span>
            </h2>

            <h2 className="text-[28px] font-bold uppercase text-[#F61114] sm:text-[32px] lg:text-[48px]">
              СВЯЗИ
            </h2>
          </div>

          <p className="max-w-[443px] text-[14px] leading-[20px] text-black/70 lg:text-[16px]">
            С удовольствием проконсультируем Вас по любым интересующим вопросам
          </p>
        </div>

        {success ? (
          <div className="mb-[30px] rounded-lg bg-green-100 p-[20px] text-center text-green-700">
            Спасибо! Мы скоро свяжемся с вами
          </div>
        ) : null}

        {submitError ? (
          <div className="mb-[30px] rounded-lg bg-red-100 p-[20px] text-center text-red-700">
            {submitError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 items-start gap-[60px] lg:grid-cols-2 lg:gap-[220px]">
          <div>
            <form onSubmit={handleSubmit} className="space-y-[20px] lg:space-y-[24px]">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Имя"
                  className="h-[40px] w-full rounded-[6px] border border-[#A5A5A5] bg-white px-3 text-[14px] placeholder:text-[#A5A5A5] focus:border-[#1C2561] focus:outline-none lg:h-[44px] lg:w-[540px] lg:px-4 lg:text-[16px]"
                />

                {errors.name ? (
                  <p className="mt-1 text-[13px] text-red-500 lg:text-[14px]">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Телефон"
                  className="h-[40px] w-full rounded-[6px] border border-[#A5A5A5] bg-white px-3 text-[14px] placeholder:text-[#A5A5A5] focus:border-[#1C2561] focus:outline-none lg:h-[44px] lg:w-[540px] lg:px-4 lg:text-[16px]"
                />

                {errors.phone ? (
                  <p className="mt-1 text-[13px] text-red-500 lg:text-[14px]">
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  className="h-[40px] w-full rounded-[6px] border border-[#A5A5A5] bg-white px-3 text-[14px] placeholder:text-[#A5A5A5] focus:border-[#1C2561] focus:outline-none lg:h-[44px] lg:w-[540px] lg:px-4 lg:text-[16px]"
                />

                {errors.email ? (
                  <p className="mt-1 text-[13px] text-red-500 lg:text-[14px]">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Ваш вопрос"
                rows="4"
                className="w-full resize-none rounded-[6px] border border-[#A5A5A5] bg-white px-3 py-2 text-[14px] placeholder:text-[#A5A5A5] focus:border-[#1C2561] focus:outline-none lg:w-[540px] lg:px-4 lg:py-3 lg:text-[16px]"
              />

              <div className="mt-[30px] flex justify-center lg:mt-[48px] lg:justify-start">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-[#F61114] px-8 py-3 text-base font-semibold text-white transition ${
                    submitting
                      ? "cursor-not-allowed opacity-60"
                      : "hover:bg-[#d90f12]"
                  }`}
                >
                  {submitting ? "Отправка..." : "Отправить"}
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src={formImg}
              alt=""
              className="h-auto w-full max-w-[445px] rounded-[12px] object-cover lg:h-[489px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
