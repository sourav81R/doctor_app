import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
];

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users", {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Unable to load admin data");
      }

      const result = await response.json();
      setUsers(result);
    };

    loadData().catch((error) => {
      if (error.name !== "AbortError") {
        console.log(error);
      }
    });

    return () => controller.abort();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100 pt-35">
      <aside className="w-64 bg-white p-6 shadow-lg transition-all duration-300">
        <h1 className="mb-10 text-2xl font-bold text-blue-600">Appoitnment...</h1>

        <nav className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition duration-300 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border p-3 shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 md:w-96"
        />

        <h2 className="mb-6 mt-6 text-2xl font-semibold">Sales Information</h2>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {["Customer", "Invoice ID", "Start Date", "End Date"].map((item) => (
            <input
              key={item}
              placeholder={item}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-lg border p-3 transition duration-300 focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">City</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transform border-t transition duration-300 hover:scale-[1.01] hover:bg-blue-50"
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
