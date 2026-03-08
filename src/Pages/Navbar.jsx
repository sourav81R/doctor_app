import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import doctorLogo from "../assets/Doctor.jpeg";

export default function MedicalNavbar() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Contact", path: "/contact" },
    ];

    const brandMark = (
        <>
            <img
                src={doctorLogo}
                alt="Mukti logo"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-200"
            />
            <span>MUKTI</span>
        </>
    );

    return (
        <div className="overflow-x-hidden">
            <div className="fixed left-0 top-0 z-50 w-full shadow-md">
                <div className="hidden items-center justify-between gap-4 bg-gray-100 px-6 py-4 lg:flex">
                    <h1 className="flex items-center gap-3 text-4xl font-bold text-blue-600">{brandMark}</h1>

                    <div className="flex flex-wrap items-center justify-end gap-4 text-sm xl:gap-8">
                        <p>+880123456789</p>
                        <p>mukti@gmail.com</p>
                        <p>New York 100</p>
                    </div>
                </div>

                <nav className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
                        <NavLink to="/" className="flex items-center gap-3 text-2xl font-bold tracking-wide lg:hidden">
                            {brandMark}
                        </NavLink>

                        <ul className="hidden gap-8 font-medium lg:flex">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `transition duration-300 hover:text-yellow-300 ${
                                            isActive ? "text-yellow-300" : ""
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </ul>

                        <div className="hidden lg:flex items-center gap-4">
                            <NavLink
                                to="/contact"
                                className="rounded-full bg-blue-400 px-4 py-2 text-sm font-medium transition hover:bg-blue-300"
                            >
                                Make Appointment
                            </NavLink>
                        </div>

                        <button
                            type="button"
                            className="lg:hidden"
                            onClick={() => setOpen((current) => !current)}
                            aria-label="Toggle navigation menu"
                        >
                            {open ? <X size={30} /> : <Menu size={30} />}
                        </button>
                    </div>

                    <div
                        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 lg:hidden ${
                            open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                        }`}
                        onClick={() => setOpen(false)}
                    />

                    <div
                        className={`fixed right-0 top-0 z-50 h-full w-[85vw] max-w-[320px] bg-blue-700 px-6 py-8 transition-transform duration-500 lg:hidden ${
                            open ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        <div className="mb-10 flex items-center justify-between">
                            <span className="flex items-center gap-3 text-xl font-bold tracking-wide">{brandMark}</span>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close navigation menu"
                            >
                                <X size={30} />
                            </button>
                        </div>

                        <ul className="flex flex-col gap-6 text-lg">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `transition ${isActive ? "text-yellow-300" : ""}`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </ul>

                        <NavLink
                            to="/contact"
                            onClick={() => setOpen(false)}
                            className="mt-10 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-center font-semibold shadow-md transition hover:scale-105"
                        >
                            Make Appointment
                        </NavLink>
                    </div>
                </nav>
            </div>
        </div>
    );
}
