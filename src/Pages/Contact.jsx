import AppointmentBookingForm from "../Components/AppointmentBookingForm";
import { useSearchParams } from "react-router-dom";
import Footer from "./Footer";

const contactCards = [
  {
    icon: "LOC",
    title: "Office Location",
    text: "2972 Westheimer Rd.\nSanta Ana, Illinois\n85486",
  },
  {
    icon: "MAIL",
    title: "Company Email",
    text: "info@example.com\ncontact@example.com",
  },
  {
    icon: "CALL",
    title: "Contact Us",
    text: "+000 111 555 999\n+000 111 555 888",
  },
];

function Contact() {
  const [searchParams] = useSearchParams();
  const initialConsultationType =
    searchParams.get("type") === "teleconsultation" ? "teleconsultation" : "clinic";

  return (
    <>
      <div className="flex h-[280px] w-full items-center justify-center overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 px-4 pt-24 sm:h-[350px] sm:pt-30">
        <div className="text-center transition-all duration-700 ease-out">
          <h1 className="text-4xl font-bold text-blue-600 md:text-5xl">Contact Us</h1>

          <p className="mt-4 text-lg">
            <span className="font-semibold">Home</span> - Contact
          </p>
        </div>
      </div>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 md:gap-8">
          {contactCards.map((item) => (
            <div key={item.title} className="rounded-xl bg-white p-6 text-center shadow-sm sm:p-8">
              <div className="mb-4 inline-block rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="whitespace-pre-line text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="text-white transition-all duration-700">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              Helping Patients From <br /> Around The Globe!!
            </h2>

            <p className="mb-8 text-lg opacity-90">
              Our staff strives to make each interaction with patients clear,
              concise, and inviting.
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <button className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105">
                Make A Gift
              </button>

              <button className="rounded-lg border border-white px-6 py-3 transition hover:bg-white hover:text-blue-700">
                Help And FAQs
              </button>
            </div>

            <img
              src="https://cdn-icons-png.flaticon.com/512/44/44786.png"
              alt="map"
              decoding="async"
              loading="lazy"
              className="w-full max-w-xs transition-all duration-700 sm:max-w-sm"
            />
          </div>

          <div className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl sm:p-8 md:p-10">
            <AppointmentBookingForm initialConsultationType={initialConsultationType} />
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <iframe
          title="location-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26771.151045558596!2d88.4096454982805!3d22.654082383728486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89e6c605d82ff%3A0x1f6779d05c4879ee!2sDum%20Dum%2C%20Kolkata%2C%20West%20Bengal!5e1!3m2!1sen!2sin!4v1770742753581!5m2!1sen!2sin"
          width="100%"
          height="450"
          loading="lazy"
        />
      </section>

      <Footer />
    </>
  );
}

export default Contact;
