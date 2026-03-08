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
        <div className="overflow-x-hidden">
            <div className="bg-gray-100 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-12 text-center">
                        <p className="text-lg text-gray-500">Meet Our</p>
                        <h2 className="text-3xl font-bold">Mukti Professional Doctors</h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
                        {doctors.map((doc) => (
                            <div
                                key={doc.name}
                                className="group overflow-hidden rounded-md bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={doc.img}
                                        alt={doc.name}
                                        className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white">
                                    <h3 className="text-lg font-semibold">{doc.name}</h3>
                                    <p className="text-sm">{doc.role}</p>
                                    <div className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 bg-cyan-500"></div>
                                </div>

                                <div className="p-4 text-sm text-gray-600">
                                    <p>
                                        <span className="font-semibold">Phone:</span> 658 222 127 964
                                    </p>
                                    <p>
                                        <span className="font-semibold">Email:</span> admin@gmail.com
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button className="rounded-md bg-blue-600 px-6 py-3 text-white transition duration-300 hover:scale-105 hover:bg-blue-700">
                            View All Doctors
                        </button>
                    </div>
                </div>
            </div>

            <AppointmentSection />
        </div>
    );
}
