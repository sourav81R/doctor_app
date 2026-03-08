import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MedicalNavbar from "./Pages/Navbar";

const HomePage = lazy(() => import("./Components/Herosection"));
const AboutPage = lazy(() => import("./Pages/About"));
const ServicePage = lazy(() => import("./Pages/ServicePage"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const AdminPage = lazy(() => import("./Pages/Admin"));
const AppointmentFormPage = lazy(() => import("./Pages/AppointmentForm"));
const ErrorPage = lazy(() => import("./Pages/ErrorPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 pt-28 text-center text-sm text-slate-500 sm:pt-32">
      Loading page...
    </div>
  );
}


function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <BrowserRouter>
        <MedicalNavbar />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/myadmin" element={<AdminPage />} />
            <Route path="/abc" element={<AppointmentFormPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
