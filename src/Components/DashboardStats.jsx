const cards = [
  {
    key: "total_appointments",
    label: "Total Appointments",
    accent: "from-blue-600 to-cyan-500",
  },
  {
    key: "today_appointments",
    label: "Today's Appointments",
    accent: "from-emerald-600 to-teal-500",
  },
  {
    key: "doctors_count",
    label: "Doctors Count",
    accent: "from-violet-600 to-purple-500",
  },
];

export default function DashboardStats({ stats, isLoading }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`rounded-3xl bg-gradient-to-r ${card.accent} p-6 text-white shadow-lg`}
        >
          <p className="text-sm font-medium text-white/80">{card.label}</p>
          <p className="mt-4 text-3xl font-bold">
            {isLoading ? "..." : stats?.[card.key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
