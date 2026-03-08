import { useEffect, useState } from "react";
import AppointmentBookingForm from "../Components/AppointmentBookingForm";
import Footer from "./Footer";

function Contact() {
  const [shows, setShows] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShows(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="flex h-[280px] w-full items-center justify-center overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 px-4 pt-24 sm:h-[350px] sm:pt-30">
        <div
          className={`text-center transition-all duration-1000 ease-out ${
            shows ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600">Contact Us</h1>

          <p className="mt-4 text-lg">
            <span className="font-semibold">Home</span> - Services
          </p>
        </div>
      </div>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 md:gap-8">
          {[
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
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-white p-6 text-center shadow-sm sm:p-8">
              <div className="bg-blue-600 text-white px-4 py-3 rounded-xl inline-block mb-4 text-sm font-semibold">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div
            className={`text-white transition-all duration-700 ${
              shows ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            }`}
          >
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
              className={`w-full max-w-xs transition-all duration-1000 delay-300 sm:max-w-sm ${
                shows ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            />
          </div>

          <div className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl sm:p-8 md:p-10">
            <AppointmentBookingForm />
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
        ></iframe>
      </section>

      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #d1d5db;
            padding: 12px 16px;
            border-radius: 6px;
            outline: none;
          }

          .input:focus {
            border-color: #3b82f6;
          }
        `}
      </style>

      <Footer />
    </>
  );
}

export default Contact;
