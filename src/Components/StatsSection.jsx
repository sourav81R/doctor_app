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
    <div className="overflow-x-hidden">
      <div ref={ref} className="mt-2 bg-blue-600 py-16 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 text-center sm:grid-cols-2 sm:px-6 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.text} className="flex flex-col items-center gap-3">
              {item.icon}

              <h2 className="text-3xl font-bold sm:text-4xl">
                {inView && <CountUp end={item.number} duration={3} />}+
              </h2>

              <p className="text-sm sm:text-base">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <DoctorsSection />
    </div>
  );
}
