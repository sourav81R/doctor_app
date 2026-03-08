import { useState } from "react";
import Footer from "../Pages/Footer";

export default function AppointmentSection() {
    const departments = [
        "General Medicine (Physician)",
        "General Surgery",
        "Paediatrics",
        "ENT",
        "Obstetrics & Gynecology",
        "Gastroenterology",
        "Neurology",
        "Nephrology",
        "Cardiology",
        "Endocrinology",
        "Pulmonology",
        "Rheumatology",
        "Ophthalmology",
        "Dermatology",
        "Orthopaedics",
        "Psychiatry",
        "Dietician",
    ];
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);

    return (
        <div className="overflow-x-hidden">
            <div className="grid md:grid-cols-2">
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white sm:p-8 lg:p-12">
                    <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
                        24 Hours <br /> Opening Our Services
                    </h2>

                    <div className="space-y-4 text-xs sm:text-sm">
                        {[
                            ["Saturday", "8:00 am-10:00 pm"],
                            ["Sunday", "6:00 am-8:00 pm"],
                            ["Monday", "6:00 am-2:00 pm"],
                            ["Tuesday", "7:00 am-9:00 pm"],
                            ["Wednesday", "10:00 am-12:00 pm"],
                            ["Thursday", "2:00 am-6:00 pm"],
                            ["Friday", "Closed"],
                        ].map((day) => (
                            <div
                                key={day[0]}
                                className="flex items-center justify-between gap-4 border-b border-white/30 pb-2"
                            >
                                <span>{day[0]}</span>
                                <span className="text-right">{day[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative bg-gradient-to-r from-blue-400 to-blue-600 p-6 text-white sm:p-8 lg:p-12">
                    <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
                        Make An <br /> Appointment Now
                    </h2>

                    <form className="space-y-5">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full border border-white/40 bg-transparent px-4 py-3 placeholder-white outline-none transition focus:border-white"
                        />

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDepartmentOpen((current) => !current)}
                                className="flex w-full items-center justify-between border border-white/40 bg-transparent px-4 py-3 text-left text-white outline-none transition focus:border-white"
                            >
                                <span className={selectedDepartment ? "text-white" : "text-white/80"}>
                                    {selectedDepartment || "Select Departments"}
                                </span>
                                <span className={`text-sm transition ${isDepartmentOpen ? "rotate-180" : ""}`}>
                                    ▼
                                </span>
                            </button>

                            {isDepartmentOpen && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-md bg-white text-black shadow-xl">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedDepartment("");
                                            setIsDepartmentOpen(false);
                                        }}
                                        className="block w-full border-b border-gray-200 px-4 py-3 text-left font-medium text-blue-700 hover:bg-blue-50"
                                    >
                                        Select Departments
                                    </button>

                                    {departments.map((department) => (
                                        <button
                                            key={department}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDepartment(department);
                                                setIsDepartmentOpen(false);
                                            }}
                                            className="block w-full px-4 py-3 text-left transition hover:bg-blue-50"
                                        >
                                            {department}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="w-full border border-white/40 bg-transparent px-4 py-3 placeholder-white outline-none transition focus:border-white"
                        />

                        <input
                            type="date"
                            className="w-full border border-white/40 bg-transparent px-4 py-3 text-white outline-none"
                        />

                        <button className="bg-white px-6 py-3 font-semibold text-blue-600 transition duration-300 hover:scale-105 hover:bg-blue-700 hover:text-white">
                            Appointment Now
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}
