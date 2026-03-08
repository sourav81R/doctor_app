import { useEffect, useRef, useState } from "react";
import { FaHeartbeat, FaNotesMedical, FaUserInjured, FaUserMd } from "react-icons/fa";
import DoctorsSection from "./DoctorsSection";

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

export default function StatsSection() {
  const sectionRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(
    () => typeof window !== "undefined" && typeof IntersectionObserver === "undefined",
  );
  const [counts, setCounts] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView) {
      return undefined;
    }

    let frameId;
    const duration = 2200;
    const animationStart = performance.now();

    const updateCounts = (now) => {
      const progress = Math.min((now - animationStart) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;

      setCounts(stats.map((item) => Math.round(item.number * easedProgress)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateCounts);
      }
    };

    frameId = window.requestAnimationFrame(updateCounts);

    return () => window.cancelAnimationFrame(frameId);
  }, [hasEnteredView]);

  return (
    <div className="overflow-x-hidden">
      <div ref={sectionRef} className="mt-2 bg-blue-600 py-16 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 text-center sm:grid-cols-2 sm:px-6 md:grid-cols-4">
          {stats.map((item, index) => (
            <div key={item.text} className="flex flex-col items-center gap-3">
              {item.icon}

              <h2 className="text-3xl font-bold sm:text-4xl">
                {counts[index]}+
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
