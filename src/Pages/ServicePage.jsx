import { useEffect, useState } from "react";
import Footer from "./Footer";

export default function ServicePage() {
    const [shows, setShows] = useState(false);

    useEffect(() => {
        setShows(true); // trigger animation on page visit
    }, []);

    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    const services = [
        {
            title: "Laboratory Analysis",
            img: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b",
        },
        {
            title: "Gynaecological Clinic",
            img: "https://images.unsplash.com/photo-1584515933487-779824d29309",
        },
        {
            title: "Ophthalmology Clinic",
            img: "https://images.unsplash.com/photo-1579154204601-01588f351e67",
        },
        {
            title: "Laryngological Clinic",
            img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
        },
    ];

    return (

        <div>

            <div className="w-full h-[350px] pt-30 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
                <div
                    className={`text-center transition-all duration-1000 ease-out
            ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
                        Our Best Services
                    </h1>

                    <p className="mt-4 text-lg">
                        <span className="font-semibold">Home</span> – Services
                    </p>
                </div>
            </div>

            <section className="bg-gray-100 py-20">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">

                    {/* Card 1 */}
                    <div
                        className={`bg-white p-6 shadow-lg transition-all duration-700 delay-100 hover:scale-105 hover:shadow-xl transition
          ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
                            alt=""
                            className="w-full h-60 object-cover"
                        />
                        <h2 className="text-xl font-semibold mt-4">Family Health Solutions</h2>
                        <p className="text-gray-600 mt-2">
                            Professional family healthcare solutions with expert doctors.
                        </p>
                        <button className="mt-4 bg-blue-600 text-white px-4 py-2">
                            Read More »
                        </button>
                    </div>

                    {/* Card 2 */}
                    <div
                        className={`bg-blue-700 text-white p-6 shadow-lg transition-all duration-700 delay-100 hover:scale-105 hover:shadow-xl transition
          ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118"
                            alt=""
                            className="w-full h-60 object-cover"
                        />
                        <h2 className="text-xl font-semibold mt-4">Eye Care Solutions</h2>
                        <p className="mt-2">
                            Advanced eye testing and treatment for better vision care.
                        </p>
                        <button className="mt-4 bg-white text-blue-700 px-4 py-2">
                            Read More »
                        </button>
                    </div>

                    {/* Card 3 */}
                    <div
                        className={`bg-blue-500 text-white p-6 shadow-lg transition-all duration-700 delay-100 hover:scale-105 hover:shadow-xl transition
          ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1584515933487-779824d29309"
                            alt=""
                            className="w-full h-60 object-cover"
                        />
                        <h2 className="text-xl font-semibold mt-4">Children's Health</h2>
                        <p className="mt-2">
                            Special pediatric care with experienced child specialists.
                        </p>
                        <button className="mt-4 bg-white text-blue-700 px-4 py-2">
                            Read More »
                        </button>
                    </div>

                    {/* Card 4 */}
                    <div
                        className={`bg-white p-6 shadow-lg transition-all duration-700 delay-100 hover:scale-105 hover:shadow-xl transition
          ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db"
                            alt=""
                            className="w-full h-60 object-cover"
                        />
                        <h2 className="text-xl font-semibold mt-4">Dental Surgery</h2>
                        <p className="text-gray-600 mt-2">
                            Modern dental surgery and oral healthcare treatment.
                        </p>
                        <button className="mt-4 bg-blue-600 text-white px-4 py-2">
                            Read More »
                        </button>
                    </div>

                </div>
            </section>


            <section className="bg-gradient-to-r from-blue-50 to-blue-300 py-20 overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Title Animation */}
                    <div
                        className={`text-center mb-14 transition-all duration-700
          ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
                    >
                        <p className="text-lg">We Are</p>
                        <h2 className="text-3xl font-bold">Offering Reliable Services</h2>
                    </div>

                    {/* Services Grid */}
                    <div className="grid md:grid-cols-2 gap-6">

                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-2 bg-white shadow-lg overflow-hidden
              transition-all duration-700 
              ${show
                                        ? "opacity-100 translate-y-0 scale-100"
                                        : "opacity-0 translate-y-10 scale-95"
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                {/* Image */}
                                <div className="overflow-hidden">
                                    <img
                                        src={service.img}
                                        alt=""
                                        className="w-full h-full object-cover hover:scale-110 transition duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col justify-center">
                                    <h3 className="font-semibold text-lg">{service.title}</h3>

                                    <p className="text-gray-600 text-sm mt-2">
                                        Professional medical treatment with expert doctors and
                                        advanced technology.
                                    </p>

                                    <button className="mt-4 text-blue-600 font-semibold hover:underline">
                                        Read More »
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
