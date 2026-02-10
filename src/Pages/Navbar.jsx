import React, { useState } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import HeroSection from "../Components/Herosection";

export default function MedicalNavbar() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <div>

            <div className="w-full shadow-md fixed top-0 left-0 z-50">
                {/* Top Header */}
                <div className="bg-gray-100 px-6 py-4 hidden md:flex justify-between items-center">
                    <h1 className="text-blue-600 font-bold text-4xl">MUKTI</h1>

                    <div className="flex gap-8">
                        <p>📞 +880123456789</p>
                        <p>✉️ mukti@gmail.com</p>
                        <p>📍 New York 100</p>
                    </div>
                </div>

                {/* Navbar */}
                <nav className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
                    <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">

                        {/* Desktop Menu */}
                        <ul className="hidden lg:flex gap-8 font-medium">
                            {menuItems.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `transition duration-300 transform hover:scale-110 
              ${isActive ? "text-yellow-300" : "hover:text-yellow-300"}`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </ul>

                        {/* Right Icons */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center bg-blue-400 rounded-full px-4 py-1">

                                <NavLink to={"/contact"}>Make Appoitnment -</NavLink>
                            </div>


                        </div>

                        {/* Mobile Hamburger */}
                        <div className="lg:hidden">
                            {open ? (
                                <X size={32} onClick={() => setOpen(false)} />
                            ) : (
                                <Menu size={32} onClick={() => setOpen(true)} />
                            )}
                        </div>
                    </div>

                    {/* Mobile Sidebar */}
                    <div
                        className={`fixed top-0 right-0 h-full w-72 bg-blue-700 z-50 transform transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"
                            }`}
                    >
                        <div className="flex justify-end p-6">
                            <X size={32} onClick={() => setOpen(false)} />
                        </div>

                        <ul className="flex flex-col items-center gap-8 mt-10 text-lg">
                            {menuItems.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `${isActive ? "text-yellow-300" : ""}`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </ul>

                        {/* Mobile Button */}
                        <div className="mt-10 flex justify-center">
                            <NavLink
                                to="/contact"
                                onClick={() => setOpen(false)}
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 rounded-full font-semibold shadow-md hover:scale-110 hover:shadow-xl transition duration-300"
                            >
                                Make Appointment →
                            </NavLink>
                        </div>



                    </div>
                </nav>
            </div>
        </div>
    );
}
