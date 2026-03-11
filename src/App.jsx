import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MedicalNavbar from "./Pages/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import { getAdminToken } from "./services/api";

const HomePage = lazy(() => import("./Components/Herosection"));
const AboutPage = lazy(() => import("./Pages/About"));
const ServicePage = lazy(() => import("./Pages/ServicePage"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const AppointmentFormPage = lazy(() => import("./Pages/AppointmentForm"));
const ErrorPage = lazy(() => import("./Pages/ErrorPage"));
const AdminLoginPage = lazy(() => import("./Pages/AdminLogin"));
const AdminDashboardPage = lazy(() => import("./Pages/AdminDashboard"));
const PrescriptionGeneratorPage = lazy(() => import("./Pages/PrescriptionGenerator"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 pt-28 text-center text-sm text-slate-500 sm:pt-32">
      Loading page...
    </div>
  );
}

function AdminEntryRedirect() {
  const hasToken = Boolean(getAdminToken());
  return <Navigate to={hasToken ? "/admin/dashboard" : "/admin/login"} replace />;
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
            <Route path="/abc" element={<AppointmentFormPage />} />
            <Route path="/admin" element={<AdminEntryRedirect />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/prescription" element={<Navigate to="/admin/prescription" replace />} />
            <Route path="/myadmin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/prescription" element={<PrescriptionGeneratorPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
