import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setShow(true);
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);
    return (
        <div>
            <div className="w-full h-[350px] pt-30 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
                <div
                    className={`text-center transition-all duration-1000 ease-out
            ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
                        Page Not Found
                    </h1>

                    <p className="mt-4 text-lg">
                        <span className="font-semibold">Home</span> – Services
                    </p>
                </div>
            </div>


            <section className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
                <div
                    className={`bg-white shadow-xl rounded-xl p-10 text-center max-w-2xl w-full transition-all duration-700
        ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10"}`}
                >
                    {/* Image */}
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/6195/6195678.png"
                        alt="404"
                        className="w-72 mx-auto mb-6 animate-pulse"
                    />

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Oops! This Page Not Found
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-500 mb-6">
                        We are really sorry but the page you requested is missing :(
                    </p>

                    {/* Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold
          hover:bg-blue-700 hover:scale-105 transition duration-300 shadow-md"
                    >
                        Go Back To Home »
                    </button>
                </div>
            </section>
        </div>
    )
}

export default ErrorPage
