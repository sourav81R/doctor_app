import React, { useEffect, useState } from "react";
import axios from "axios";
import { LayoutDashboard, FlaskConical, CalendarCheck, Pill, MessageSquare, CreditCard, Settings } from "lucide-react";

export default function Admin() {

    const [data, setData] = useState([]);
    const [myfilter, setmyfilter] = useState([])

    useEffect(() => {
        let ignore = false;

        const loadData = async () => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/users");

            if (ignore) {
                return;
            }

            setData(res.data);
            setmyfilter(res.data);
        };

        loadData().catch((err) => console.log(err));

        return () => {
            ignore = true;
        };
    }, []);

    const handelchnage = (value) => {
        const result = myfilter.filter((user) =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );

        setData(result);
    }

    return (
        <div className="flex bg-gray-100 min-h-screen pt-35">

            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6 transition-all duration-300">

                <h1 className="text-2xl font-bold mb-10 text-blue-600">Appoitnment...</h1>

                <nav className="space-y-4">

                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
              hover:bg-blue-50 hover:text-blue-600
              transform hover:scale-105 transition duration-300"
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </div>
                    ))}

                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full md:w-96 p-3 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-400
          transition duration-300"

                />

                {/* Title */}
                <h2 className="text-2xl font-semibold mt-6 mb-6">
                    Sales Information
                </h2>

                {/* Filters */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    {["Customer", "Invoice ID", "Start Date", "End Date"].map((item) => (
                        <input
                            key={item}
                            placeholder={item}
                            className="p-3 border rounded-lg
              focus:ring-2 focus:ring-blue-400
              transition duration-300"
                            onChange={(e) => handelchnage(e.target.value)}
                        />
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Customer</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">City</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-blue-50
                  transition duration-300 transform hover:scale-[1.01]"
                                >
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4 text-gray-600">{user.address.city}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </main>
        </div>
    );
}


// Sidebar Menu
const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    //   { name: "Lab Test", icon: <FlaskConical size={18} /> },
    //   { name: "Appointment", icon: <CalendarCheck size={18} /> },
    //   { name: "Medicine Order", icon: <Pill size={18} /> },
    //   { name: "Message", icon: <MessageSquare size={18} /> },
    //   { name: "Payment", icon: <CreditCard size={18} /> },
    //   { name: "Settings", icon: <Settings size={18} /> },
];
