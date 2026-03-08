import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { doctorNames } from "../data/doctors";
import {
  createInitialAppointmentFormData,
  HISTORY_OPTIONS,
} from "../utils/appointmentFormConfig";

function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-800">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function inputClassName(extraClassName = "") {
  return `w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${extraClassName}`.trim();
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4">
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function OptionalSection({ title, description, children }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <summary className="cursor-pointer list-none rounded-xl transition hover:bg-slate-50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-full bg-slate-100 p-1.5 text-slate-500 transition group-open:rotate-180">
              <ChevronDown size={16} />
            </span>
            <div>
              <h4 className="text-base font-semibold text-slate-900">{title}</h4>
              {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
            </div>
          </div>
          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Optional
            </span>
            <p className="mt-2 text-right text-xs text-slate-400">Click to expand</p>
          </div>
        </div>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export default function AppointmentBookingForm({ title = "Book An Appointment" }) {
  const [formData, setFormData] = useState(() => createInitialAppointmentFormData(doctorNames));
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleHistoryChange = (event) => {
    const { name, checked } = event.target;
    setFormData((current) => ({
      ...current,
      medicalHistory: {
        ...current.medicalHistory,
        [name]: checked,
      },
    }));
  };

  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const { generateAppointmentPDF } = await import("../utils/generateAppointmentPDF");
      await generateAppointmentPDF(formData);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Unable to generate the appointment PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">
          Fill the basic details first. Open the optional sections only when you want those values printed in the PDF.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-600">
        Start with patient name, appointment date, gender, and doctor. Everything else is optional.
      </div>

      <Section title="Patient Details" description="Basic details shown at the top of the PDF.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First Name">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="Enter first name"
              onChange={handleChange}
              className={inputClassName()}
            />
          </Field>

          <Field label="Last Name">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Enter last name"
              onChange={handleChange}
              className={inputClassName()}
            />
          </Field>

          <Field label="Appointment Date">
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className={inputClassName()}
            />
          </Field>

          <Field label="Date of Birth">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={inputClassName()}
            />
          </Field>

          <Field label="Gender">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClassName()}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Field>

          <Field label="Doctor">
            <select
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className={inputClassName()}
            >
              {doctorNames.map((doctorName) => (
                <option key={doctorName} value={doctorName}>
                  {doctorName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Contact Number">
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              placeholder="Phone number"
              onChange={handleChange}
              className={inputClassName()}
            />
          </Field>

          <Field label="Address" className="md:col-span-2">
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="Street, area, city"
              onChange={handleChange}
              className={inputClassName()}
            />
          </Field>

          <Field
            label="Reason / Note"
            hint="This is used as the main comment on the PDF if you do not fill the Comments field below."
            className="md:col-span-2"
          >
            <textarea
              name="message"
              value={formData.message}
              placeholder="Short note about the appointment"
              onChange={handleChange}
              className={inputClassName("min-h-28 resize-y")}
            />
          </Field>
        </div>
      </Section>

      <OptionalSection
        title="Vitals"
        description="Fill only the values you want printed on the template."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="GCS">
            <input type="text" name="gcs" value={formData.gcs} placeholder="Example: 15/15" onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="BP">
            <input type="text" name="bp" value={formData.bp} placeholder="Example: 120/80" onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="PR">
            <input type="text" name="pr" value={formData.pr} placeholder="Pulse rate" onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="RR">
            <input type="text" name="rr" value={formData.rr} placeholder="Respiratory rate" onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="RBS">
            <input type="text" name="rbs" value={formData.rbs} placeholder="Random blood sugar" onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="Height">
            <input type="text" name="height" value={formData.height} placeholder="Example: 170 cm" onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="Weight">
            <input type="text" name="weight" value={formData.weight} placeholder="Example: 70 kg" onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="SpO2">
            <input type="text" name="spo2" value={formData.spo2} placeholder="Example: 98%" onChange={handleChange} className={inputClassName()} />
          </Field>
        </div>
      </OptionalSection>

      <OptionalSection
        title="Past History"
        description="Select the conditions that should be marked on the template."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HISTORY_OPTIONS.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <input
                type="checkbox"
                name={item}
                checked={Boolean(formData.medicalHistory[item])}
                onChange={handleHistoryChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </OptionalSection>

      <OptionalSection
        title="Maternal History"
        description="Use this section only when these details are relevant."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="LMP">
            <input type="date" name="lmp" value={formData.lmp} onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="POG">
            <input type="text" name="pog" value={formData.pog} placeholder="Period of gestation" onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="EDD">
            <input type="date" name="edd" value={formData.edd} onChange={handleChange} className={inputClassName()} />
          </Field>
          <Field label="Allergy" className="md:col-span-3">
            <textarea
              name="allergy"
              value={formData.allergy}
              placeholder="Drug or food allergies"
              onChange={handleChange}
              className={inputClassName("min-h-24 resize-y")}
            />
          </Field>
          <Field
            label="Comments"
            hint="This prints inside the template comments box."
            className="md:col-span-3"
          >
            <textarea
              name="comments"
              value={formData.comments}
              placeholder="Any additional comments"
              onChange={handleChange}
              className={inputClassName("min-h-28 resize-y")}
            />
          </Field>
        </div>
      </OptionalSection>

      <button
        onClick={handleGeneratePdf}
        disabled={isGeneratingPdf}
        className="w-full rounded-xl bg-blue-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-wait disabled:bg-blue-700"
      >
        {isGeneratingPdf ? "Preparing PDF..." : "Generate PDF and Download"}
      </button>
    </div>
  );
}
