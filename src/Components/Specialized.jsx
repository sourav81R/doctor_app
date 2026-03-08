import { Activity, Ambulance, Hospital, UserRound } from "lucide-react";
import Departments from "./Departments";

export function Specialization() {
    const services = [
        {
            icon: <Activity size={40} className="text-blue-600" />,
            title: "Medical Treatment",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate optio animi?",
        },
        {
            icon: <Ambulance size={40} className="text-red-500" />,
            title: "Emergency Help",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate optio animi?",
        },
        {
            icon: <Hospital size={40} className="text-green-600" />,
            title: "Medical Professionals",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate optio animi?",
        },
        {
            icon: <UserRound size={40} className="text-purple-600" />,
            title: "Qualified Doctors",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate optio animi?",
        },
    ];

    return (
        <div className="overflow-x-hidden">
            <section className="bg-gray-100 py-16 font-[Poppins] sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
                    <p className="mb-2 text-base text-gray-600 sm:text-lg">We Offer Specialized</p>

                    <h2 className="mb-10 text-2xl font-bold sm:mb-14 sm:text-3xl md:text-4xl">
                        Orthopedics To Meet Your Needs
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
                        {services.map((item) => (
                            <div
                                key={item.title}
                                className="group rounded-xl bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-8"
                            >
                                <div className="mb-6 transition duration-300 group-hover:scale-110">
                                    {item.icon}
                                </div>

                                <h3 className="mb-3 text-lg font-semibold transition group-hover:text-blue-600">
                                    {item.title}
                                </h3>

                                <p className="mb-4 text-sm leading-relaxed text-gray-600">{item.desc}</p>

                                <button className="font-semibold text-black transition group-hover:text-blue-600">
                                    Read More
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Departments />
        </div>
    );
}
