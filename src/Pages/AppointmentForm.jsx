import AppointmentBookingForm from "../Components/AppointmentBookingForm";

export default function AppointmentForm() {
  return (
    <section className="bg-slate-50 px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <AppointmentBookingForm />
        </div>
      </div>
    </section>
  );
}
