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
        <div>
            <section className="bg-gray-100 py-20 font-[Poppins]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-lg text-gray-600 mb-2">
                        We Offer Specialized
                    </p>


                    <h2 className="text-3xl md:text-4xl font-bold mb-14">
                        Orthopedics To Meet Your Needs
                    </h2>


                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 text-left rounded-xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition duration-300 group"
                            >
                                <div className="mb-6 group-hover:scale-110 transition duration-300">
                                    {item.icon}
                                </div>


                                <h3 className="text-lg font-semibold mb-3 group-hover:text-blue-600 transition">
                                    {item.title}
                                </h3>


                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {item.desc}
                                </p>


                                <button className="font-semibold text-black group-hover:text-blue-600 transition">
                                    Read More »
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Departments/>
        </div>
    );
}