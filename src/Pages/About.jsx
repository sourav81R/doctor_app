import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function About() {

const [openIndex, setOpenIndex] = useState(null);

const toggleFAQ = (index) => {
  setOpenIndex(openIndex === index ? null : index);
};



  return (
    <>
      {/* ================= SECTION 1 : HERO ================= */}
      <section
        className="pt-30 relative w-full min-h-[70vh] flex items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1580281657521-6c8f9c9c8f7f')",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Sets The Standard For <br />
                High Quality Care And <br />
                Patient Safety!!
              </h1>

              <p className="mt-6 text-gray-200 max-w-lg">
                Our doctors include highly qualified practitioners who come
                from a range of backgrounds and bring a diversity of skills.
                Besides, our staff have exceptional people skills.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/doctors"
                  className="px-6 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-md hover:bg-yellow-300 transition"
                >
                  Find A Doctor
                </Link>

                <Link
                  to="/core-values"
                  className="px-6 py-3 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-blue-900 transition"
                >
                  Our Core Values
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center text-sm text-gray-200">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/departments" className="hover:text-yellow-400">
              Departments
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2 ================= */}
      <section className="bg-white py-20 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Caring For The Health <br />
              And Well Being Of You <br />
              And Your Family.
            </h2>

            <p className="mt-6 text-gray-700 font-medium">
              We provide all aspects of medical practice for your family,
              including general check-ups or assisting with injuries.
            </p>

            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              We will work with you to develop individualised care plans,
              including management of chronic diseases. If we cannot assist,
              we can provide referrals or advice about the type you require.
              We treat all enquiries in confidence.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link
                to="/doctors"
                className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition"
              >
                Find A Doctor →
              </Link>

              <div>
                <p className="font-semibold text-gray-900">John Winston</p>
                <p className="text-sm text-sky-500">Pediatrician</p>
              </div>
            </div>
          </div>

          {/* Image with YouTube Button */}
          <div className="relative w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1550831107-1553da8c8464"
              alt="Doctor"
              className="w-full h-full object-cover"
            />

            {/* Watch Presentation Button */}
            <a
              href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-6 flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              <span className="bg-white text-blue-600 p-2 rounded">
                ▶
              </span>
              <span className="font-semibold text-sm">
                Watch Our Presentation!
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3 : OVERLAP ================= */}
      <section className="relative bg-sky-500 text-white py-24">
        {/* Overlapping Image */}
        <div className="absolute -top-20 left-6 md:left-24 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1606813902914-06fda4e3c47b"
            alt="Doctor"
            className="w-72 rounded-xl shadow-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Sets The Standard For <br />
            High Quality Care And <br />
            Patient Safety!!
          </h2>

          <div>
            <p className="mb-4 text-white/90">
              Our doctors include highly qualified male and female
              practitioners who come from a range of backgrounds and bring
              a diversity of skills.
            </p>

            <p className="mb-8 text-white/90">
              Our administration and support staff all have exceptional
              people skills and are trained to assist you with all medical
              enquiries.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/core-values"
                className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-sky-600 transition"
              >
                Our Core Values →
              </Link>

              <Link
                to="/about"
                className="px-6 py-3 bg-white text-sky-600 rounded-md hover:bg-yellow-300 hover:text-gray-900 transition"
              >
                More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ================= SECTION 4 : CORE FEATURES ================= */}
      <section className="relative bg-sky-600 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Medical Advices & Check Ups",
                icon: "🩺",
                link: "/services",
              },
              {
                title: "Trusted Medical Treatment",
                icon: "🎓",
                link: "/treatments",
              },
              {
                title: "Emergency Help Available",
                icon: "🚑",
                link: "/emergency",
              },
              {
                title: "Medical Research",
                icon: "💊",
                link: "/research",
              },
              {
                title: "Only Qualified Doctors",
                icon: "👨‍⚕️",
                link: "/doctors",
              },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group border border-white/30 rounded-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="text-4xl mb-6 transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-lg leading-snug">
                  {item.title}
                </h3>

                <div className="mt-6 text-xl opacity-70 group-hover:opacity-100 transition">
                  ↓
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <p className="text-center text-white/80 mt-10 text-sm sm:text-base">
            Connecting with the world to improve health globally.{" "}
            <a
              href="/doctors"
              className="text-yellow-300 underline underline-offset-4 hover:text-yellow-400 transition font-medium"
            >
              Explore Our Doctors
            </a>
          </p>
        </div>
      </section>

{/* Helping Patients Section */}
<section className="w-full bg-white py-16 px-4">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    
    {/* LEFT SIDE */}
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-8">
        Helping Patients From <br />
        <span className="text-blue-600">Around The Globe!!</span>
      </h2>

      {/* World Map Image */}
      <div className="relative w-full">
        <img
          src="/images/world-map.png"   /* change path if needed */
          alt="World Map"
          className="w-full h-auto object-contain"
        />

        {/* Location Dots */}
        <span className="absolute top-[45%] left-[20%] w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
          +
        </span>

        <span className="absolute top-[55%] left-[45%] w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
          +
        </span>

        <span className="absolute top-[40%] left-[70%] w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
          +
        </span>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
      

      <p>
        We will work with you to develop individualised care plans,
        including management of chronic diseases. If we cannot assist,
        we can provide referrals or advice about the type of practitioner
        you require. We treat all enquiries sensitively and in the
        strictest confidence.
      </p>

      {/* Blue Divider Line */}
      <div className="w-full h-0.5 bg-blue-500 mt-6"></div>
    </div>

  </div>
</section>



<section className="w-full bg-white py-16 px-4">
  {/* <div className="max-w-7xl mx-auto"> */}

  
{/* FAQ SECTION – FULL WIDTH BELOW */}
<div className="mt-10 space-y-5">

  {/* FAQ 1 */}
  <div className="border-b border-gray-200 pb-4">
    <button
      onClick={() => toggleFAQ(0)}
      className="w-full flex items-start gap-4 text-left"
    >
      <span className="text-blue-700 text-lg font-bold leading-none">
        {openIndex === 0 ? "−" : "+"}
      </span>

      <span className="text-blue-900 font-medium">
        Which Plan Is Right For Me?
      </span>
    </button>

    {openIndex === 0 && (
      <p className="mt-3 ml-7 text-gray-600 leading-relaxed">
        Our staff strives to make each interaction with patients clear,
    concise, and inviting. Support the important work of Medicsh
    Hospital by making a much-needed donation today. We will work
    with you to develop individualised care plans, including
    management of chronic diseases.
      </p>
    )}
  </div>

  {/* FAQ 2 */}
  <div className="border-b border-gray-200 pb-4">
    <button
      onClick={() => toggleFAQ(1)}
      className="w-full flex items-start gap-4 text-left"
    >
      <span className="text-blue-700 text-lg font-bold leading-none">
        {openIndex === 1 ? "−" : "+"}
      </span>

      <span className="text-blue-900 font-medium">
        Do I Have To Commit To A Contract?
      </span>
    </button>

    {openIndex === 1 && (
      <p className="mt-3 ml-7 text-gray-600">
        Our staff strives to make each interaction with patients clear, concise, and inviting. Support the important work of Medicsh Hospital by making a much-needed donation today. We will work with you to develop individualised care plans, including management of chronic diseases.
      </p>
    )}
  </div>

  {/* FAQ 3 */}
  <div className="border-b border-gray-200 pb-4">
    <button
      onClick={() => toggleFAQ(2)}
      className="w-full flex items-start gap-4 text-left"
    >
      <span className="text-blue-700 text-lg font-bold leading-none">
        {openIndex === 2 ? "−" : "+"}
      </span>

      <span className="text-blue-900 font-medium">
        What Payment Methods Are Available?
      </span>
    </button>

    {openIndex === 2 && (
      <p className="mt-3 ml-7 text-gray-600">
      Our staff strives to make each interaction with patients clear, concise, and inviting. Support the important work of Medicsh Hospital by making a much-needed donation today. We will work with you to develop individualised care plans, including management of chronic diseases.
      </p>
    )}
  </div>

</div>
</section>


<div className="mt-6">
  <button
    type="button"
    onClick={() => alert("Thank you for your support!")}
    className="
      ml-6
      inline-flex items-center gap-3
      bg-sky-500
      text-white
      px-6 py-3
      rounded-md
      font-medium
      shadow-md
      hover:bg-blue-900
      transition-all duration-300
      cursor-pointer
    "
  >
    Make A Gift

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-5 h-5 text-white"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
      2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.44
      C11.09 5.01 12.76 4 14.5 4
      17 4 19 6 19 8.5
      c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </button>
</div>
<Footer/>
    </>
  );
}