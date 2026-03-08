import { useState } from "react";
import {
  FaPills,
  FaUserNurse,
  FaDna,
  FaBrain,
  FaHeart,
  FaCheck,
} from "react-icons/fa";
import StatsSection from "./StatsSection";
import doctorsImage from "../assets/doctors.jpg";

const departments = [
  {
    title: "Pharmacy",
    icon: FaPills,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
    description: "High quality pharmacy services and medicine support.",
  },
  {
    title: "Nursing",
    icon: FaUserNurse,
    image: doctorsImage,
    description: "Professional nursing staff with 24/7 patient support.",
  },
  {
    title: "DNA Lab",
    icon: FaDna,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    description: "Advanced DNA and genetic testing facilities.",
  },
  {
    title: "Neurology",
    icon: FaBrain,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80",
    description: "Expert brain and nervous system treatments.",
  },
  {
    title: "Cardiology",
    icon: FaHeart,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80",
    description: "Complete heart care and emergency cardiology services.",
  },
];

const featureItems = [
  "Qualified Doctors",
  "24x7 Emergency",
  "Outdoor Checkup",
  "Affordable Billing",
];

const Departments = () => {
  const [activeDept, setActiveDept] = useState(departments[0]);

  return (
    <div className="overflow-x-hidden bg-gray-100 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h3 className="text-lg text-gray-500">We Are The</h3>
          <h2 className="text-3xl font-bold">Best Our Departments Centers</h2>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-4 sm:gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;

            return (
              <button
                key={dept.title}
                type="button"
                onClick={() => setActiveDept(dept)}
                className={`cursor-pointer rounded-lg p-4 shadow-md transition-all duration-300 hover:scale-105 ${
                  activeDept.title === dept.title ? "scale-105 bg-blue-500 text-white" : "bg-white"
                }`}
              >
                <Icon size={30} />
              </button>
            );
          })}
        </div>

        <div
          key={activeDept.title}
          className="grid gap-6 rounded-lg bg-white p-4 shadow-lg transition-all duration-500 ease-in-out sm:p-6 md:grid-cols-2 md:items-center"
        >
          <div>
            <h3 className="mb-4 text-2xl font-semibold">{activeDept.title}</h3>

            <p className="mb-4 text-gray-600">{activeDept.description}</p>

            <div className="mb-6 grid gap-3 text-gray-700 sm:grid-cols-2">
              {featureItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <FaCheck className="text-blue-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button className="rounded-md bg-blue-600 px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-blue-700">
              Appointment Now
            </button>
          </div>

          <div className="overflow-hidden rounded-lg">
            <img
              src={activeDept.image}
              alt={activeDept.title}
              decoding="async"
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              onError={(event) => {
                event.currentTarget.src = doctorsImage;
              }}
              className="h-full max-h-[320px] w-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        </div>
      </div>

      <StatsSection />
    </div>
  );
};

export default Departments;
