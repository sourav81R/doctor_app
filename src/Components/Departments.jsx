import React, { useState } from "react";
import {
  FaPills,
  FaUserNurse,
  FaDna,
  FaBrain,
  FaHeart,
  FaFlask,
  FaMicroscope,
  FaTooth,
  FaSyringe,
  FaCheck,
} from "react-icons/fa";

import StatsSection from "./StatsSection";

const Departments = () => {

  // ✅ Department Data
  const departments = [
    {
      title: "Pharmacy",
      icon: FaPills,
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
      description: "High quality pharmacy services and medicine support.",
    },
    {
      title: "Nursing",
      icon: FaUserNurse,
      image:
        "https://images.unsplash.com/photo-1584516150909-c43483ee7939",
      description: "Professional nursing staff with 24/7 patient support.",
    },
    {
      title: "DNA Lab",
      icon: FaDna,
      image:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67",
      description: "Advanced DNA and genetic testing facilities.",
    },
    {
      title: "Neurology",
      icon: FaBrain,
      image:
        "https://images.unsplash.com/photo-1559757175-7f0bb3c9e3f0",
      description: "Expert brain and nervous system treatments.",
    },
    {
      title: "Cardiology",
      icon: FaHeart,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
      description: "Complete heart care and emergency cardiology services.",
    },
  ];

  // ✅ Selected Department State
  const [activeDept, setActiveDept] = useState(departments[0]);

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-10">
          <h3 className="text-gray-500 text-lg">We Are The</h3>
          <h2 className="text-3xl font-bold">
            Best Our Departments Centers
          </h2>
        </div>

        {/* ✅ Icon Section */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {departments.map((dept, index) => {
            const Icon = dept.icon;

            return (
              <div
                key={index}
                onClick={() => setActiveDept(dept)}
                className={`p-5 rounded-lg shadow-md cursor-pointer
                transition-all duration-300 transform
                hover:scale-110
                ${
                  activeDept.title === dept.title
                    ? "bg-blue-500 text-white scale-110"
                    : "bg-white"
                }`}
              >
                <Icon size={30} />
              </div>
            );
          })}
        </div>

        {/* ✅ Animated Content Section */}
        <div
          key={activeDept.title}
          className="bg-white shadow-lg rounded-lg grid md:grid-cols-2 gap-6 p-6 items-center
          transition-all duration-500 ease-in-out
          animate-fade"
        >
          {/* Left Content */}
          <div className="transform transition duration-500 translate-x-0 opacity-100">
            <h3 className="text-2xl font-semibold mb-4">
              {activeDept.title}
            </h3>

            <p className="text-gray-600 mb-4">
              {activeDept.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 text-gray-700 mb-6">
              {[
                "Qualified Doctors",
                "24x7 Emergency",
                "Outdoor Checkup",
                "Affordable Billing",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <FaCheck className="text-blue-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button className="bg-blue-600 text-white px-6 py-2 rounded-md
            transition duration-300 hover:bg-blue-700 hover:scale-105">
              Appointment Now »
            </button>
          </div>

          {/* Right Image */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={activeDept.image}
              alt="doctor"
              className="w-full h-full object-cover
              transition-transform duration-500 hover:scale-110"
            />
          </div>
        </div>
      </div>

      <StatsSection />
    </div>
  );
};

export default Departments;
