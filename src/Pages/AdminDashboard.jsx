import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppointmentTable from "../Components/AppointmentTable";
import DashboardStats from "../Components/DashboardStats";
import {
  clearAdminSession,
  deleteAppointment,
  getAdminSession,
  getAppointment,
  getAppointments,
} from "../services/api";

function Toast({ toast }) {
  if (!toast) {
    return null;
  }

  const toneClasses = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className={`fixed right-4 top-24 z-50 rounded-2xl border px-4 py-3 text-sm shadow-lg ${toneClasses[toast.type]}`}>
      {toast.message}
    </div>
  );
}

function DetailModal({ appointment, isLoading, onClose }) {
  if (!appointment && !isLoading) {
    return null;
  }

  const maternalHistory = appointment?.maternal_history ?? {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Appointment</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {isLoading ? "Loading details..." : appointment?.patient_name || "Appointment Details"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Fetching appointment details...
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Patient Name", appointment?.patient_name],
              ["Doctor", appointment?.doctor],
              ["Phone", appointment?.phone],
              ["Email", appointment?.email],
              ["Date", appointment?.appointment_date],
              ["Time", appointment?.appointment_time],
              ["Age", appointment?.age],
              ["Gender", appointment?.gender],
              ["Blood Pressure", appointment?.blood_pressure],
              ["Temperature", appointment?.temperature],
              ["Pulse", appointment?.pulse],
              ["Address", appointment?.address],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-medium text-slate-800">{value || "-"}</p>
              </div>
            ))}

            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Past History</p>
              <p className="mt-2 text-sm font-medium text-slate-800">
                {appointment?.past_history?.length ? appointment.past_history.join(", ") : "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Maternal History</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {["lmp", "pog", "edd", "allergy", "comments"].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    <span className="font-semibold capitalize">{item}:</span> {maternalHistory[item] || "-"}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Notes</p>
              <p className="mt-2 text-sm font-medium text-slate-800">{appointment?.notes || "-"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteModal({ appointment, isSubmitting, onClose, onConfirm }) {
  if (!appointment) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Delete Appointment</p>
        <h3 className="mt-3 text-2xl font-bold text-slate-900">Delete this appointment?</h3>
        <p className="mt-3 text-sm text-slate-500">
          This removes <span className="font-semibold text-slate-700">{appointment.patient_name}</span> from the admin dashboard.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-wait disabled:bg-red-400"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = useMemo(() => getAdminSession(), []);
  const token = session?.token ?? "";
  const [filters, setFilters] = useState({
    search: "",
    doctor: "",
    date: "",
    page: 1,
    limit: 10,
  });
  const [appointments, setAppointments] = useState([]);
  const [meta, setMeta] = useState({
    total_pages: 1,
    available_doctors: [],
    stats: {
      total_appointments: 0,
      today_appointments: 0,
      doctors_count: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getAppointments({
        token,
        search: filters.search,
        doctor: filters.doctor,
        date: filters.date,
        page: filters.page,
        limit: filters.limit,
      });

      setAppointments(response.data ?? []);
      setMeta(response.meta ?? {});
    } catch (loadError) {
      const message = loadError.message || "Unable to load appointments.";
      setError(message);
      if (message.toLowerCase().includes("unauthorized")) {
        clearAdminSession();
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters.date, filters.doctor, filters.limit, filters.page, filters.search, navigate, token]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  const handleView = async (appointment) => {
    setIsDetailLoading(true);
    setSelectedAppointment(appointment);

    try {
      const response = await getAppointment(appointment.id, token);
      setSelectedAppointment(response.data);
    } catch (viewError) {
      setToast({
        type: "error",
        message: viewError.message || "Unable to load appointment details.",
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAppointment(deleteTarget.id, token);
      setDeleteTarget(null);
      setToast({
        type: "success",
        message: "Appointment deleted successfully.",
      });

      if (appointments.length === 1 && filters.page > 1) {
        setFilters((current) => ({
          ...current,
          page: current.page - 1,
        }));
      } else {
        loadAppointments();
      }
    } catch (deleteError) {
      setToast({
        type: "error",
        message: deleteError.message || "Unable to delete appointment.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-28 sm:px-6">
      <Toast toast={toast} />
      <DetailModal
        appointment={selectedAppointment}
        isLoading={isDetailLoading}
        onClose={() => setSelectedAppointment(null)}
      />
      <DeleteModal
        appointment={deleteTarget}
        isSubmitting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Appointment Management</h1>
            <p className="mt-2 text-sm text-slate-500">
              Welcome back{session?.admin?.name ? `, ${session.admin.name}` : ""}. Review and manage patient bookings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              View Website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>

        <DashboardStats stats={meta.stats} isLoading={isLoading} />

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <AppointmentTable
          appointments={appointments}
          doctors={meta.available_doctors ?? []}
          filters={filters}
          isLoading={isLoading}
          page={filters.page}
          totalPages={meta.total_pages ?? 1}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onView={handleView}
          onDelete={setDeleteTarget}
        />
      </div>
    </section>
  );
}
