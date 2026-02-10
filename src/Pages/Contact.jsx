import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { Calendar, Clock } from "lucide-react";

export default function Contact() {
  const [shows, setShows] = useState(false);

  useEffect(() => {
    setShows(true); // trigger animation on page visit
  }, []);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <div className="w-full h-[350px] pt-30 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
        <div
          className={`text-center transition-all duration-1000 ease-out
            ${shows ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
            Contact Us
          </h1>

          <p className="mt-4 text-lg">
            <span className="font-semibold">Home</span> – Services
          </p>
        </div>
      </div>

      {/* ================= INFO CARDS ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "📍", title: "Office Location", text: "2972 Westheimer Rd.\nSanta Ana, Illinois\n85486" },
            { icon: "✉️", title: "Company Email", text: "info@example.com\ncontact@example.com" },
            { icon: "📞", title: "Contact Us", text: "+000 111 555 999\n+000 111 555 888" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-blue-600 text-white p-4 rounded-xl inline-block mb-4 text-xl">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-500 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div
            className={`text-white transition-all duration-700
          ${shows ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}
          >
            <h2 className="text-4xl font-bold mb-6">
              Helping Patients From <br /> Around The Globe!!
            </h2>

            <p className="mb-8 text-lg opacity-90">
              Our staff strives to make each interaction with patients clear,
              concise, and inviting.
            </p>

            <div className="flex gap-4 mb-10">
              <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
                Make A Gift ❤️
              </button>

              <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition">
                Help & Faqs
              </button>
            </div>

            {/* Map Image */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/44/44786.png"
              alt="map"
              className={`w-96 transition-all duration-1000 delay-300
            ${shows ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
            />
          </div>

          {/* RIGHT FORM */}
          <div
            className={`bg-white rounded-xl p-10 shadow-xl transition-all duration-700 delay-200
          ${shows ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"}`}
          >
            <h3 className="text-2xl font-semibold mb-4">
              Book An Appointment
            </h3>

            <p className="text-gray-500 mb-8">
              Please feel welcome to contact our staff with any general or
              medical enquiry.
            </p>

            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-4">

              <select className="p-3 bg-gray-100 rounded-md outline-none">
                <option>Bathology Clinic</option>
              </select>

              <select className="p-3 bg-gray-100 rounded-md outline-none">
                <option>Michael Brian</option>
              </select>

              <input
                type="text"
                placeholder="Name"
                className="p-3 bg-gray-100 rounded-md outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                className="p-3 bg-gray-100 rounded-md outline-none"
              />

              <input
                type="number"
                placeholder="Phone"
                className="p-3 bg-gray-100 rounded-md outline-none"
              />


              <div className="relative md:col-span-1">
                <input
                  type="text"
                  placeholder="Enter Adress"
                  className="p-3 bg-gray-100 rounded-md w-full outline-none"
                />
                {/* <Clock className="absolute right-3 top-3 text-gray-500" size={18} /> */}
              </div>
              <div className="relative md:col-span-1">
                <input
                  type="date"
                  className="p-3 bg-gray-100 rounded-md w-full outline-none"
                />
                {/* <Clock className="absolute right-3 top-3 text-gray-500" size={18} /> */}
              </div>

              <div className="relative md:col-span-1">
                <input
                  type="time"
                  className="p-3 bg-gray-100 rounded-md w-full outline-none"
                />
                {/* <Clock className="absolute right-3 top-3 text-gray-500" size={18} /> */}
              </div>

            </div>

            {/* Submit Button */}
            <button className="w-full mt-8 bg-blue-900 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 hover:scale-[1.02] transition">
              Make Appointment
            </button>
          </div>

        </div>
      </section>

      {/* ================= MAP + WORKING HOURS ================= */}
      <section className="relative w-full">
        {/* Google Map */}
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26771.151045558596!2d88.4096454982805!3d22.654082383728486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89e6c605d82ff%3A0x1f6779d05c4879ee!2sDum%20Dum%2C%20Kolkata%2C%20West%20Bengal!5e1!3m2!1sen!2sin!4v1770742753581!5m2!1sen!2sin" width="100%" height="450" loading="lazy"></iframe>

        {/* Overlay Card */}
        {/* <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="bg-blue-900 text-white rounded-xl shadow-xl w-full md:w-96 overflow-hidden">

            <div className="bg-yellow-500 px-6 py-4 font-semibold text-lg">
              Working Hour:
            </div>

            <div className="p-6 space-y-3 text-sm">
              <p className="flex justify-between">
                <span>Mon - Wed:</span><span>8:00AM - 7:00PM</span>
              </p>
              <p className="flex justify-between">
                <span>Thu:</span><span>8:00AM - 7:00PM</span>
              </p>
              <p className="flex justify-between">
                <span>Fri:</span><span>8:00AM - 7:00PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sat - Sun:</span><span>8:00AM - 7:00PM</span>
              </p>

              <hr className="border-blue-700 my-4" />

              <h4 className="font-semibold">Contact Info:</h4>
              <p>📧 info@yourmail.com</p>
              <p>📞 +1 (230) 456-155-23</p>
            </div>
          </div>
        </div> */}
      </section>

      {/* Tailwind input utility */}
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