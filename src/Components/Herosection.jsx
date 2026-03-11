import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import pic from "../assets/bg.jpg";
import doctor from "../assets/group.png";
import LazySection from "./LazySection";

const Specialization = lazy(() => import("./Specialized"));

function HeroSection() {
    return (
        <div className="overflow-x-hidden">
            <section
                className="flex min-h-[85vh] w-full items-center overflow-hidden bg-cover bg-center pt-24 font-[Poppins] sm:pt-28"
                style={{
                    backgroundImage: `url(${pic})`,
                }}
            >
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center">
                    <div className="max-w-xl text-center lg:text-left">
                        <p className="mb-3 text-base font-semibold tracking-wide text-gray-800 sm:text-lg">
                            Best Medical Clinic
                        </p>

                        <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                            <span className="text-blue-600 transition duration-300 hover:text-blue-700">
                                Bringing Health
                            </span>{" "}
                            To Life For The Whole Family...
                        </h1>

                        <p className="mt-5 max-w-lg text-base text-gray-700 sm:text-lg">
                            Choose an in-clinic visit or book a teleconsultation with the same care team.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/abc?type=clinic"
                                className="inline-flex w-full justify-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-xl transition duration-300 hover:scale-[1.02] hover:bg-blue-800 sm:w-auto sm:px-8"
                            >
                                Book Clinic Appointment
                            </Link>
                            <Link
                                to="/abc?type=teleconsultation"
                                className="inline-flex w-full justify-center rounded-xl border border-cyan-300 bg-cyan-100 px-6 py-3 font-semibold text-cyan-950 shadow-lg transition duration-300 hover:scale-[1.02] hover:bg-cyan-200 sm:w-auto sm:px-8"
                            >
                                Book Teleconsultation
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <img
                            src={doctor}
                            alt="doctor"
                            decoding="async"
                            fetchPriority="high"
                            className="w-full max-w-[280px] bg-transparent object-cover drop-shadow-2xl transition duration-500 hover:scale-105 sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px]"
                        />
                    </div>
                </div>
            </section>

            <LazySection minHeight={1800}>
                <Suspense
                    fallback={
                        <section className="bg-gray-100 py-16 sm:py-20">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                                <div className="h-80 animate-pulse rounded-3xl bg-white/70 shadow-sm" />
                            </div>
                        </section>
                    }
                >
                    <Specialization />
                </Suspense>
            </LazySection>
        </div>
    );
}

export default HeroSection;
