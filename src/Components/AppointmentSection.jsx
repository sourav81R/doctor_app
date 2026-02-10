import React from "react";
import Footer from "../Pages/Footer";

export default function AppointmentSection() {
    return (
        <div>

            <div className="grid md:grid-cols-2">

                {/* LEFT SIDE */}
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-white p-12">

                    <h2 className="text-3xl font-bold mb-8">
                        24 Hours <br /> Opening Our Services
                    </h2>

                    <div className="space-y-4 text-sm">

                        {[
                            ["Saturday", "8:00 am-10:00 pm"],
                            ["Sunday", "6:00 am-8:00 pm"],
                            ["Monday", "6:00 am-2:00 pm"],
                            ["Tuesday", "7:00 am-9:00 pm"],
                            ["Wednesday", "10:00 am-12:00 pm"],
                            ["Thursday", "2:00 am-6:00 pm"],
                            ["Friday", "Closed"],
                        ].map((day, index) => (
                            <div
                                key={index}
                                className="flex justify-between border-b border-white/30 pb-2"
                            >
                                <span>{day[0]}</span>
                                <span>{day[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="relative bg-gradient-to-r from-blue-400 to-blue-600 text-white p-12">

                    <h2 className="text-3xl font-bold mb-8">
                        Make An <br /> Appointment Now
                    </h2>

                    <form className="space-y-5">

                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full bg-transparent border border-white/40 px-4 py-3 
            placeholder-white outline-none focus:border-white transition"
                        />

                        <select
                            className="w-full bg-transparent border border-white/40 px-4 py-3 
            outline-none text-white"
                        >
                            <option className="text-black">Select Departments</option>
                            <option className="text-black">Cardiology</option>
                            <option className="text-black">Dental</option>
                            <option className="text-black">Neurology</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="w-full bg-transparent border border-white/40 px-4 py-3 
            placeholder-white outline-none focus:border-white transition"
                        />

                        <input
                            type="date"
                            className="w-full bg-transparent border border-white/40 px-4 py-3 
            outline-none text-white"
                        />

                        <button
                            className="bg-white text-blue-600 px-6 py-3 font-semibold 
            transition duration-300 hover:bg-blue-700 hover:text-white hover:scale-105"
                        >
                            Appointment Now »
                        </button>

                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
