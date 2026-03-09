export default function ContactMap() {
  return (
    <section className="py-40px] lg:py-[72px]">
      <div className="container-custom">

        <div className="rounded-[12px] shadow-sm overflow-hidden">

          <iframe
            src="https://www.google.com/maps?q=41.2995,69.2401&z=16&output=embed"
            className="w-full h-[250px] md:h-[350px] lg:h-[420px]"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>

        </div>

      </div>
    </section>
  )
}