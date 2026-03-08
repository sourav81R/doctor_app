import pic from "../assets/bg.jpg";
import doctor from "../assets/group.png";
import { Specialization } from "./Specialized";

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

                        <button className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-xl transition duration-300 hover:scale-105 hover:bg-blue-700 sm:w-auto sm:px-10">
                            Get Appointments
                        </button>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <img
                            src={doctor}
                            alt="doctor"
                            className="w-full max-w-[280px] bg-transparent object-cover drop-shadow-2xl transition duration-500 hover:scale-105 sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px]"
                        />
                    </div>
                </div>
            </section>

            <Specialization />
        </div>
    );
}

export default HeroSection;
