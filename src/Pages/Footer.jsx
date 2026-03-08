import { FaPhoneAlt, FaFacebookF, FaInstagram, FaTwitter, FaArrowRight } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#1f2e4d] pb-8 pt-16 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
                    <div>
                        <h3 className="mb-4 font-semibold text-white">Quick Contact</h3>
                        <p className="mb-4 text-sm">
                            If you have any questions or need help, feel free to contact with our team.
                        </p>

                        <p className="mb-3 flex items-center gap-3 text-lg font-semibold text-cyan-400">
                            <FaPhoneAlt /> 01061245741
                        </p>

                        <p className="mb-3 text-sm">
                            2307 Beverley Rd Brooklyn, New York 11226 United States.
                        </p>

                        <button className="transition hover:text-white">Get Directions</button>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white">Departments</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="cursor-pointer hover:text-cyan-400">Neurology Clinic</li>
                            <li className="cursor-pointer hover:text-cyan-400">Pathology Clinic</li>
                            <li className="cursor-pointer hover:text-cyan-400">Laboratory Analysis</li>
                            <li className="cursor-pointer hover:text-cyan-400">Pediatric Clinic</li>
                            <li className="cursor-pointer hover:text-cyan-400">Cardiac Clinic</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white">Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="cursor-pointer hover:text-cyan-400">About Us</li>
                            <li className="cursor-pointer hover:text-cyan-400">Our Clinic</li>
                            <li className="cursor-pointer hover:text-cyan-400">Our Doctors</li>
                            <li className="cursor-pointer hover:text-cyan-400">News &amp; Media</li>
                            <li className="cursor-pointer hover:text-cyan-400">Appointments</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white">Help</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="cursor-pointer hover:text-cyan-400">Help &amp; FAQs</li>
                            <li className="cursor-pointer hover:text-cyan-400">Contacts</li>
                            <li className="cursor-pointer hover:text-cyan-400">Careers</li>
                            <li className="cursor-pointer hover:text-cyan-400">Site Map</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white">Newsletter</h3>

                        <div className="mb-4 flex overflow-hidden rounded-md bg-[#2d3e66]">
                            <input
                                type="email"
                                placeholder="Your Email Address"
                                className="w-full bg-transparent px-4 py-2 text-sm outline-none"
                            />
                            <button className="flex items-center justify-center bg-cyan-400 px-4 transition hover:bg-cyan-500">
                                <FaArrowRight className="text-white" />
                            </button>
                        </div>

                        <label className="flex items-start gap-2 text-sm">
                            <input type="checkbox" className="mt-1 accent-cyan-400" />
                            <span>I accept the privacy and terms</span>
                        </label>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-600 pt-6 text-center md:flex-row md:text-left">
                    <p className="text-sm">
                        © 2021 Medisch By <span className="text-cyan-400">Zytheme.Com</span>. All Rights Reserved.
                    </p>

                    <div className="flex gap-4">
                        {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, index) => (
                            <div
                                key={index}
                                className="cursor-pointer rounded-md bg-[#2d3e66] p-3 transition hover:bg-cyan-400 hover:text-white"
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
