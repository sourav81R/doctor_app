function EmptyState({ isLoading }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
      {isLoading ? "Loading appointments..." : "No appointments match the current filters."}
    </div>
  );
}

export default function AppointmentTable({
  appointments,
  doctors,
  filters,
  isLoading,
  page,
  totalPages,
  downloadingId,
  onFilterChange,
  onPageChange,
  onDownload,
  onView,
  onDelete,
}) {
  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr]">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onFilterChange("search", event.target.value)}
          placeholder="Search by patient name"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={filters.doctor}
          onChange={(event) => onFilterChange("doctor", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All doctors</option>
          {doctors.map((doctor) => (
            <option key={doctor} value={doctor}>
              {doctor}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(event) => onFilterChange("date", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {appointments.length === 0 ? (
        <EmptyState isLoading={isLoading} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-3">ID</th>
                <th className="px-3">Patient Name</th>
                <th className="px-3">Doctor</th>
                <th className="px-3">Phone</th>
                <th className="px-3">Date</th>
                <th className="px-3">Time</th>
                <th className="px-3">Notes</th>
                <th className="px-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="rounded-2xl bg-slate-50 text-sm text-slate-700">
                  <td className="rounded-l-2xl px-3 py-4 font-medium text-slate-500">
                    {appointment.id.slice(-6)}
                  </td>
                  <td className="px-3 py-4 font-semibold text-slate-900">{appointment.patient_name}</td>
                  <td className="px-3 py-4">{appointment.doctor || "-"}</td>
                  <td className="px-3 py-4">{appointment.phone || "-"}</td>
                  <td className="px-3 py-4">{appointment.appointment_date || "-"}</td>
                  <td className="px-3 py-4">{appointment.appointment_time || "-"}</td>
                  <td className="max-w-xs px-3 py-4 text-slate-500">
                    <span className="line-clamp-2">{appointment.notes || "-"}</span>
                  </td>
                  <td className="rounded-r-2xl px-3 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onDownload(appointment)}
                        disabled={downloadingId === appointment.id}
                        className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-60"
                      >
                        {downloadingId === appointment.id ? "Downloading..." : "Download PDF"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onView(appointment)}
                        className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(appointment)}
                        className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Page {page} of {Math.max(totalPages, 1)}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || isLoading}
            className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages || 1, page + 1))}
            disabled={page >= totalPages || totalPages === 0 || isLoading}
            className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
