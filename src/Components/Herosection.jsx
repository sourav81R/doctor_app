import pic from "../assets/bg.jpg";
import doctor from "../assets/group.png"; // 👉 Add your side image here
import { Specialization } from "./Specialized";


function HeroSection() {
    return (
        <div>
            <section
                className="w-full min-h-[85vh] pt-20 bg-cover bg-center flex items-center font-[Poppins]"
                style={{
                    backgroundImage: `url(${pic})`,
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center">
                    {/* LEFT CONTENT */}
                    <div className="max-w-xl">
                        <p className="text-gray-800 font-semibold mb-3 text-lg tracking-wide">
                            Best Medical Clinic
                        </p>


                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                            <span className="text-blue-600 hover:text-blue-700 transition duration-300">
                                Bringing Health
                            </span>{" "}
                            To Life For The Whole Family...
                        </h1>


                        <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg font-semibold transform hover:scale-105 transition duration-300 shadow-xl">
                            Get Appointments →
                        </button>
                    </div>


                    {/* RIGHT SIDE IMAGE */}
                    <div className="flex justify-center lg:justify-end">
                        <img
                            // src={doctor}
                            alt="doctor"
                            className="w-[320px] md:w-[420px] lg:w-[480px] bg-transparent object-cover drop-shadow-2xl transform hover:scale-105 transition duration-500"
                        />
                    </div>
                </div>
            </section>
            <Specialization />
        </div>
    );
}

export default HeroSection