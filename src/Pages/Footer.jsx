import React from "react";
import { FaPhoneAlt, FaFacebookF, FaInstagram, FaTwitter, FaArrowRight } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#1f2e4d] text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">

                {/* Footer Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Quick Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Contact</h3>
                        <p className="text-sm mb-4">
                            If you have any questions or need help, feel free to contact with our team.
                        </p>

                        <p className="flex items-center gap-3 text-cyan-400 text-lg font-semibold mb-3">
                            <FaPhoneAlt /> 01061245741
                        </p>

                        <p className="text-sm mb-3">
                            2307 Beverley Rd Brooklyn, New York 11226 United States.
                        </p>

                        <button className="text-cyan-400 hover:text-white transition">
                            — Get Directions
                        </button>
                    </div>

                    {/* Departments */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Departments</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-cyan-400 cursor-pointer">Neurology Clinic</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Pathology Clinic</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Laboratory Analysis</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Pediatric Clinic</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Cardiac Clinic</li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-cyan-400 cursor-pointer">About Us</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Our Clinic</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Our Doctors</li>
                            <li className="hover:text-cyan-400 cursor-pointer">News & Media</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Appointments</li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Help</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-cyan-400 cursor-pointer">Help & FAQs</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Contacts</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Careers</li>
                            <li className="hover:text-cyan-400 cursor-pointer">Site Map</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Newsletter</h3>

                        <div className="flex bg-[#2d3e66] rounded-md overflow-hidden mb-4">
                            <input
                                type="email"
                                placeholder="Your Email Address"
                                className="bg-transparent px-4 py-2 outline-none text-sm w-full"
                            />
                            <button className="bg-cyan-400 px-4 flex items-center justify-center hover:bg-cyan-500 transition">
                                <FaArrowRight className="text-white" />
                            </button>
                        </div>

                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="accent-cyan-400" />
                            i accept the privacy and terms
                        </label>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-600 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-sm">
                        © 2021 Medisch By <span className="text-cyan-400">Zytheme.Com</span>. All Rights Reserved.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4">
                        {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, index) => (
                            <div
                                key={index}
                                className="bg-[#2d3e66] p-3 rounded-md cursor-pointer 
                transition hover:bg-cyan-400 hover:text-white"
                            >
                                <Icon />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
}
