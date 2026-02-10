import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { FaUserMd, FaUserInjured, FaHeartbeat, FaNotesMedical } from "react-icons/fa";
import DoctorsSection from "./DoctorsSection";

export default function StatsSection() {

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const stats = [
    {
      icon: <FaUserInjured size={40} />,
      number: 53,
      text: "Patients Every Day",
    },
    {
      icon: <FaUserMd size={40} />,
      number: 43,
      text: "Qualified Doctors",
    },
    {
      icon: <FaHeartbeat size={40} />,
      number: 25,
      text: "Years Experience",
    },
    {
      icon: <FaNotesMedical size={40} />,
      number: 38,
      text: "Diagnosis Verify",
    },
  ];

  return (
    <div>
      <div ref={ref} className="bg-blue-600 text-white py-16 mt-2">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-3">

              {item.icon}

              <h2 className="text-4xl font-bold">
                {inView && (
                  <CountUp end={item.number} duration={3} />
                )}
                +
              </h2>

              <p className="text-sm">{item.text}</p>

            </div>
          ))}

        </div>
      </div>
      <DoctorsSection/>
    </div>
  );
}
