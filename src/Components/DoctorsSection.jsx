import React from "react";
import AppointmentSection from "./AppointmentSection";

const doctors = [
    {
        name: "Dr. Jason Kovalsky",
        role: "Cardiologist",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Patricia Mcneel",
        role: "Pediatrist",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "William Khanna",
        role: "Throat Specialist",
        img: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
        name: "Eric Patterson",
        role: "Therapy",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
];

export default function DoctorsSection() {
    return (
        <div>

            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Heading */}
                    <div className="text-center mb-12">
                        <p className="text-gray-500 text-lg">Meet Our</p>
                        <h2 className="text-3xl font-bold">
                            Mukti Professional Doctors
                        </h2>
                    </div>

                    {/* Doctor Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {doctors.map((doc, index) => (
                            <div
                                key={index}
                                className="group bg-white shadow-md rounded-md overflow-hidden 
              transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="overflow-hidden">
                                    <img
                                        src={doc.img}
                                        alt={doc.name}
                                        className="w-full h-64 object-cover transition duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Name Section */}
                                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 relative">
                                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                                    <p className="text-sm">{doc.role}</p>

                                    {/* Small Triangle */}
                                    <div className="absolute left-6 -bottom-2 w-4 h-4 bg-cyan-500 rotate-45"></div>
                                </div>

                                {/* Contact */}
                                <div className="p-4 text-sm text-gray-600">
                                    <p>
                                        <span className="font-semibold">Phone :</span> 658 222 127 964
                                    </p>
                                    <p>
                                        <span className="font-semibold">Email :</span> admin@gmail.com
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Button */}
                    <div className="text-center mt-12">
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-md 
          transition duration-300 hover:bg-blue-700 hover:scale-105">
                            View All Doctors »
                        </button>
                    </div>

                </div>
            </div>
            <AppointmentSection />
        </div>
    );
}
