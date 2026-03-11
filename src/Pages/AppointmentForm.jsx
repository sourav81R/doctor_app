import AppointmentBookingForm from "../Components/AppointmentBookingForm";
import { useSearchParams } from "react-router-dom";

export default function AppointmentForm() {
  const [searchParams] = useSearchParams();
  const initialConsultationType =
    searchParams.get("type") === "teleconsultation" ? "teleconsultation" : "clinic";

  return (
    <section className="bg-slate-50 px-4 pb-16 pt-40 sm:px-6 sm:pt-44 lg:pt-52">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <AppointmentBookingForm initialConsultationType={initialConsultationType} />
        </div>
      </div>
    </section>
  );
}
