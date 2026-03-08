import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import doctorLogo from "../assets/Doctor.jpeg";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
];

const contactItems = [
  { icon: Phone, label: "+880123456789" },
  { icon: Mail, label: "mukti@gmail.com" },
  { icon: MapPin, label: "New York 100" },
];

export default function MedicalNavbar() {
  const [open, setOpen] = useState(false);

  const brandMark = (
    <div className="group flex items-center gap-3">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/5 transition duration-300 group-hover:scale-[1.03] group-hover:shadow-lg">
        <img
          src={doctorLogo}
          alt="Mukti"
          className="h-12 w-auto object-contain"
        />
      </div>
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      <div className="fixed left-0 top-0 z-50 w-full shadow-md">
        <div className="hidden border-b border-black/5 bg-gray-100 lg:block">
          <div className="flex w-full items-center justify-between gap-6 px-4 py-4 xl:px-8">
            <h1 className="flex items-center">{brandMark}</h1>

            <div className="flex flex-wrap items-center justify-end gap-3 text-sm xl:gap-4">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                  >
                    <span className="rounded-full bg-gray-100 p-1.5 text-slate-600 transition duration-300 group-hover:scale-110">
                      <Icon size={14} />
                    </span>
                    <span className="font-medium tracking-[0.01em]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <nav className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
            <NavLink to="/" className="flex items-center lg:hidden">
              {brandMark}
            </NavLink>

            <div className="hidden lg:block">
              <ul className="flex items-center gap-3 font-medium">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group relative inline-flex items-center rounded-full px-5 py-2.5 text-sm tracking-[0.08em] uppercase transition duration-300 ${
                          isActive
                            ? "bg-white/14 text-yellow-300 shadow-lg shadow-black/10"
                            : "text-white/90 hover:-translate-y-0.5 hover:bg-white/10 hover:text-yellow-300"
                        }`
                      }
                    >
                      <span>{item.name}</span>
                      <span className="absolute inset-x-5 bottom-1 h-px origin-left scale-x-0 bg-yellow-300 transition duration-300 group-hover:scale-x-100" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <NavLink
                to="/contact"
                className="inline-flex items-center rounded-full bg-blue-400 px-5 py-2.5 text-sm font-semibold tracking-[0.08em] uppercase shadow-lg shadow-blue-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-300 hover:shadow-xl"
              >
                Make Appointment
              </NavLink>
            </div>

            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg shadow-blue-950/10 transition duration-300 hover:bg-white/15 lg:hidden"
              onClick={() => setOpen((current) => !current)}
              aria-label="Toggle navigation menu"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
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
              <span className="flex items-center">{brandMark}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 transition duration-300 hover:bg-white/15"
              >
                <X size={26} />
              </button>
            </div>

            <div className="mb-8 space-y-3">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <span className="rounded-full bg-white/10 p-2">
                      <Icon size={16} />
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <ul className="flex flex-col gap-3 text-lg">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center rounded-2xl px-4 py-3 transition duration-300 ${
                        isActive
                          ? "bg-white/14 text-yellow-300"
                          : "text-white/90 hover:bg-white/10 hover:text-yellow-300"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-10 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-center font-semibold shadow-md transition duration-300 hover:scale-[1.03]"
            >
              Make Appointment
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}
