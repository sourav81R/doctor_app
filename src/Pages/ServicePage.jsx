import { useEffect, useState } from "react";
import Footer from "./Footer";

export default function ServicePage() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setShow(true);
        }, 0);

        return () => window.clearTimeout(timer);
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
        <div className="overflow-x-hidden">
            <div className="flex h-[280px] w-full items-center justify-center overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 px-4 pt-24 sm:h-[350px] sm:pt-30">
                <div
                    className={`text-center transition-all duration-1000 ease-out ${
                        show ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-95 opacity-0"
                    }`}
                >
                    <h1 className="text-3xl font-bold text-blue-600 sm:text-4xl md:text-5xl">
                        Our Best Services
                    </h1>

                    <p className="mt-4 text-base sm:text-lg">
                        <span className="font-semibold">Home</span> - Services
                    </p>
                </div>
            </div>

            <section className="bg-gray-100 py-16 sm:py-20">
                <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
                    {[
                        {
                            title: "Family Health Solutions",
                            body: "Professional family healthcare solutions with expert doctors.",
                            image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
                            classes: "bg-white text-gray-900",
                            button: "bg-blue-600 text-white",
                        },
                        {
                            title: "Eye Care Solutions",
                            body: "Advanced eye testing and treatment for better vision care.",
                            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
                            classes: "bg-blue-700 text-white",
                            button: "bg-white text-blue-700",
                        },
                        {
                            title: "Children's Health",
                            body: "Special pediatric care with experienced child specialists.",
                            image: "https://images.unsplash.com/photo-1584515933487-779824d29309",
                            classes: "bg-blue-500 text-white",
                            button: "bg-white text-blue-700",
                        },
                        {
                            title: "Dental Surgery",
                            body: "Modern dental surgery and oral healthcare treatment.",
                            image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
                            classes: "bg-white text-gray-900",
                            button: "bg-blue-600 text-white",
                        },
                    ].map((card) => (
                        <div
                            key={card.title}
                            className={`overflow-hidden p-6 shadow-lg transition-all duration-700 hover:scale-[1.02] hover:shadow-xl ${card.classes} ${
                                show ? "translate-y-0 scale-100 opacity-100" : "translate-y-12 scale-95 opacity-0"
                            }`}
                        >
                            <img
                                src={card.image}
                                alt={card.title}
                                className="h-60 w-full object-cover"
                            />
                            <h2 className="mt-4 text-xl font-semibold">{card.title}</h2>
                            <p className="mt-2">{card.body}</p>
                            <button className={`mt-4 px-4 py-2 ${card.button}`}>Read More</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="overflow-hidden bg-gradient-to-r from-blue-50 to-blue-300 py-16 sm:py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div
                        className={`mb-14 text-center transition-all duration-700 ${
                            show ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
                        }`}
                    >
                        <p className="text-lg">We Are</p>
                        <h2 className="text-3xl font-bold">Offering Reliable Services</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {services.map((service, index) => (
                            <div
                                key={service.title}
                                className={`grid overflow-hidden bg-white shadow-lg sm:grid-cols-2 ${
                                    show ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-95 opacity-0"
                                }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={service.img}
                                        alt={service.title}
                                        className="h-full min-h-[220px] w-full object-cover transition duration-500 hover:scale-110"
                                    />
                                </div>

                                <div className="flex flex-col justify-center p-6">
                                    <h3 className="text-lg font-semibold">{service.title}</h3>

                                    <p className="mt-2 text-sm text-gray-600">
                                        Professional medical treatment with expert doctors and
                                        advanced technology.
                                    </p>

                                    <button className="mt-4 font-semibold text-blue-600 hover:underline">
                                        Read More
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
