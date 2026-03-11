import { useEffect, useState } from "react";
import { ChevronDown, Hospital, Video } from "lucide-react";
import { doctorNames } from "../data/doctors";
import { createAppointment } from "../services/api";
import {
  CONSULTATION_PLATFORM_OPTIONS,
  HISTORY_OPTIONS,
  createInitialAppointmentFormData,
} from "../utils/appointmentFormConfig";

function Field({ label, hint, error, required = false, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-800">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function inputClassName(hasError = false, extraClassName = "") {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
  } ${extraClassName}`.trim();
}

function validateAppointmentForm(formData) {
  const errors = {};
  const patientName = [formData.firstName, formData.lastName].filter(Boolean).join(" ").trim();

  if (!patientName) {
    errors.firstName = "Patient first or last name is required.";
  }

  if (!String(formData.gender ?? "").trim()) {
    errors.gender = "Gender is required.";
  }

  if (!String(formData.contactNumber ?? "").trim()) {
    errors.contactNumber = "Phone number is required.";
  }

  if (!String(formData.doctorName ?? "").trim()) {
    errors.doctorName = "Doctor is required.";
  }

  if (!String(formData.appointmentDate ?? "").trim()) {
    errors.appointmentDate = "Appointment date is required.";
  }

  if (formData.consultationType === "teleconsultation" && !String(formData.consultationPlatform ?? "").trim()) {
    errors.consultationPlatform = "Choose a preferred teleconsultation platform.";
  }

  if (String(formData.email ?? "").trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(formData.email).trim())) {
      errors.email = "Enter a valid email address.";
    }
  }

  return errors;
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

function Toast({ feedback }) {
  if (!feedback) {
    return null;
  }

  const toneClasses = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <div
      className={`fixed right-4 top-24 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-lg ${toneClasses[feedback.type]}`}
    >
      {feedback.message}
    </div>
  );
}

function ConsultationTypeCard({
  value,
  currentValue,
  title,
  description,
  icon,
  accentClass,
  onChange,
}) {
  const isActive = currentValue === value;
  const IconComponent = icon;

  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-3xl border p-5 transition ${
        isActive
          ? `${accentClass} border-transparent shadow-lg`
          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
      }`}
    >
      <input
        type="radio"
        name="consultationType"
        value={value}
        checked={isActive}
        onChange={onChange}
        className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-2xl p-3 ${
              isActive ? "bg-white/90 text-slate-900" : "bg-slate-100 text-slate-600"
            }`}
          >
            <IconComponent size={20} />
          </span>
          <div>
            <p className={`text-base font-semibold ${isActive ? "text-slate-950" : "text-slate-900"}`}>
              {title}
            </p>
            <p className={`mt-1 text-sm ${isActive ? "text-slate-700" : "text-slate-500"}`}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </label>
  );
}

export default function AppointmentBookingForm({
  title = "Book An Appointment",
  initialConsultationType = "clinic",
}) {
  const [formData, setFormData] = useState(() =>
    createInitialAppointmentFormData(doctorNames, initialConsultationType),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFormData((current) => {
      const nextType =
        initialConsultationType === "teleconsultation" ? "teleconsultation" : "clinic";

      if (current.consultationType === nextType) {
        return current;
      }

      return {
        ...current,
        consultationType: nextType,
        consultationPlatform: nextType === "teleconsultation" ? "Google Meet" : "",
        consultationMessage: nextType === "teleconsultation" ? current.consultationMessage : "",
      };
    });
  }, [initialConsultationType]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => {
      const nextState = {
        ...current,
        [name]: value,
      };

      if (name === "consultationType" && value === "clinic") {
        nextState.consultationPlatform = "";
        nextState.consultationMessage = "";
      }

      if (
        name === "consultationType" &&
        value === "teleconsultation" &&
        !String(current.consultationPlatform ?? "").trim()
      ) {
        nextState.consultationPlatform = "Google Meet";
      }

      return nextState;
    });

    setFieldErrors((current) => {
      if (!current[name] && !(name === "firstName" && current.firstName)) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];

      if (name === "firstName" || name === "lastName") {
        delete nextErrors.firstName;
      }

      if (name === "consultationType") {
        delete nextErrors.consultationType;
        delete nextErrors.consultationPlatform;
      }

      return nextErrors;
    });
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

  const handleBookAppointment = async () => {
    setFeedback(null);
    const validationErrors = validateAppointmentForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setFeedback({
        type: "error",
        message: "Please fill the required appointment fields before submitting.",
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await createAppointment(formData);

      try {
        const { generateAppointmentPDF } = await import("../utils/generateAppointmentPDF");
        await generateAppointmentPDF(formData);
        setFeedback({
          type: "success",
          message: response.data?.message || "Appointment saved and PDF downloaded successfully.",
        });
      } catch (pdfError) {
        console.error(pdfError);
        setFeedback({
          type: "warning",
          message: "Appointment saved, but the PDF could not be generated.",
        });
      }
    } catch (submitError) {
      if (submitError.errors && Object.keys(submitError.errors).length > 0) {
        const mappedErrors = {};
        Object.entries(submitError.errors).forEach(([key, value]) => {
          if (key === "patient_name") {
            mappedErrors.firstName = value;
            return;
          }

          if (key === "phone") {
            mappedErrors.contactNumber = value;
            return;
          }

          if (key === "doctor") {
            mappedErrors.doctorName = value;
            return;
          }

          if (key === "appointment_date") {
            mappedErrors.appointmentDate = value;
            return;
          }

          if (key === "consultation_platform") {
            mappedErrors.consultationPlatform = value;
            return;
          }

          if (key === "consultation_type") {
            mappedErrors.consultationType = value;
            return;
          }

          mappedErrors[key] = value;
        });
        setFieldErrors(mappedErrors);
      }

      setFeedback({
        type: "error",
        message: submitError.message || "Unable to save the appointment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTeleconsultation = formData.consultationType === "teleconsultation";

  return (
    <div className="space-y-5">
      <Toast feedback={feedback} />

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">
          Fill the patient details first. After a successful submission, the appointment is saved to the backend and the PDF is downloaded.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-600">
        Patient name, gender, phone, doctor, and appointment date are required. Choose clinic visit or teleconsultation before submitting.
      </div>

      <Section
        title="Consultation Type"
        description="Book an in-person clinic visit or an online consultation from the same form."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ConsultationTypeCard
            value="clinic"
            currentValue={formData.consultationType}
            title="Visit Clinic"
            description="Book a standard in-person visit at the clinic."
            icon={Hospital}
            accentClass="bg-gradient-to-br from-slate-100 via-white to-slate-50"
            onChange={handleChange}
          />
          <ConsultationTypeCard
            value="teleconsultation"
            currentValue={formData.consultationType}
            title="Teleconsultation (Online)"
            description="Choose a remote consultation and share your preferred platform in advance."
            icon={Video}
            accentClass="bg-gradient-to-br from-cyan-200 via-sky-100 to-blue-200 ring-1 ring-cyan-300/70"
            onChange={handleChange}
          />
        </div>

        {fieldErrors.consultationType ? (
          <p className="mt-3 text-xs text-red-600">{fieldErrors.consultationType}</p>
        ) : null}

        {isTeleconsultation ? (
          <div className="mt-5 grid gap-4 rounded-3xl border border-cyan-200 bg-cyan-50/70 p-5 md:grid-cols-2">
            <Field
              label="Preferred Platform"
              error={fieldErrors.consultationPlatform}
              required
            >
              <select
                name="consultationPlatform"
                value={formData.consultationPlatform}
                onChange={handleChange}
                className={inputClassName(Boolean(fieldErrors.consultationPlatform))}
              >
                {CONSULTATION_PLATFORM_OPTIONS.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </Field>

            <div className="rounded-2xl border border-cyan-200 bg-white/80 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Teleconsultation note</p>
              <p className="mt-2">
                The selected platform is stored with the appointment so the admin team can prepare the session.
              </p>
            </div>

            <Field
              label="Symptoms or Concerns Before Consultation"
              hint="Optional. Share context before the online consultation."
              className="md:col-span-2"
            >
              <textarea
                name="consultationMessage"
                value={formData.consultationMessage}
                placeholder="Describe symptoms, follow-up concerns, or what you want to discuss."
                onChange={handleChange}
                className={inputClassName(false, "min-h-28 resize-y")}
              />
            </Field>
          </div>
        ) : null}
      </Section>

      <Section title="Patient Details" description="Core details sent to the backend and shown on the PDF.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First Name" error={fieldErrors.firstName} required>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="Enter first name"
              onChange={handleChange}
              className={inputClassName(Boolean(fieldErrors.firstName))}
            />
          </Field>

          <Field label="Last Name">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Enter last name"
              onChange={handleChange}
              className={inputClassName(Boolean(fieldErrors.firstName))}
            />
          </Field>

          <Field label="Appointment Date" error={fieldErrors.appointmentDate} required>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className={inputClassName(Boolean(fieldErrors.appointmentDate))}
            />
          </Field>

          <Field label="Appointment Time">
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
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

          <Field label="Gender" error={fieldErrors.gender} required>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClassName(Boolean(fieldErrors.gender))}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Field>

          <Field label="Doctor" error={fieldErrors.doctorName} required>
            <select
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className={inputClassName(Boolean(fieldErrors.doctorName))}
            >
              {doctorNames.map((doctorName) => (
                <option key={doctorName} value={doctorName}>
                  {doctorName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Contact Number" error={fieldErrors.contactNumber} required>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              placeholder="Phone number"
              onChange={handleChange}
              className={inputClassName(Boolean(fieldErrors.contactNumber))}
            />
          </Field>

          <Field label="Email" error={fieldErrors.email}>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Patient email"
              onChange={handleChange}
              className={inputClassName(Boolean(fieldErrors.email))}
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
            hint="General visit note stored with the appointment and shown on the PDF."
            className="md:col-span-2"
          >
            <textarea
              name="message"
              value={formData.message}
              placeholder="Short note about the appointment"
              onChange={handleChange}
              className={inputClassName(false, "min-h-28 resize-y")}
            />
          </Field>
        </div>
      </Section>

      <OptionalSection
        title="Vitals"
        description="Fill only the values you want printed and stored."
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
          <Field label="Temperature">
            <input type="text" name="temperature" value={formData.temperature} placeholder="Example: 98.6 F" onChange={handleChange} className={inputClassName()} />
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
        description="Select the conditions that should be saved and marked on the template."
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
              className={inputClassName(false, "min-h-24 resize-y")}
            />
          </Field>
          <Field
            label="Comments"
            hint="This prints inside the template comments box and is stored with the appointment."
            className="md:col-span-3"
          >
            <textarea
              name="comments"
              value={formData.comments}
              placeholder="Any additional comments"
              onChange={handleChange}
              className={inputClassName(false, "min-h-28 resize-y")}
            />
          </Field>
        </div>
      </OptionalSection>

      <button
        type="button"
        onClick={handleBookAppointment}
        disabled={isSubmitting}
        className={`w-full rounded-xl px-5 py-4 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 disabled:cursor-wait ${
          isTeleconsultation
            ? "bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-200 disabled:bg-cyan-400"
            : "bg-blue-900 hover:bg-blue-800 focus:ring-blue-200 disabled:bg-blue-700"
        }`}
      >
        {isSubmitting
          ? "Saving Appointment..."
          : isTeleconsultation
            ? "Book Teleconsultation & Download PDF"
            : "Book Appointment & Download PDF"}
      </button>
    </div>
  );
}
