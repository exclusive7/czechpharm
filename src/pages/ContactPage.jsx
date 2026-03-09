import ContactHero from "./Contact/ContactHero";
import ContactInfo from "./Contact/ContactInfo";
import ContactForm from "./Contact/ContactForm";
import MapSection from "./Contact/ContactMap";
import Breadcrumb from "../components/Breadcrumb";

export default function ContactPage() {
  return (
    <div>
      <ContactHero />

      <div className="container-custom pt-[64px]">
        <Breadcrumb items={[{ label: "Контакты" }]} />
      </div>

      <ContactInfo />
      <MapSection />
      <ContactForm />
    </div>
  );
}
