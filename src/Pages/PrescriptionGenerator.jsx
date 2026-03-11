import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MinusCircle, PlusCircle, ReceiptText } from "lucide-react";
import { doctorNames } from "../data/doctors";
import { clearAdminSession, getAdminSession, savePrescription } from "../services/api";

function createMedicineRow() {
  return {
    id: crypto.randomUUID(),
    name: "",
    morning: "",
    afternoon: "",
    night: "",
    duration: "",
  };
}

function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inputClassName(hasError = false, extraClassName = "") {
  return `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
  } ${extraClassName}`.trim();
}

function validatePrescription(formData) {
  const errors = {};

  if (!String(formData.doctorName ?? "").trim()) {
    errors.doctorName = "Doctor name is required.";
  }

  if (!String(formData.patientName ?? "").trim()) {
    errors.patientName = "Patient name is required.";
  }

  if (!String(formData.diagnosis ?? "").trim()) {
    errors.diagnosis = "Diagnosis is required.";
  }

  const hasValidMedicine = formData.medicines.some(
    (medicine) => String(medicine.name ?? "").trim() || String(medicine.duration ?? "").trim(),
  );

  if (!hasValidMedicine) {
    errors.medicines = "Add at least one medicine entry.";
  }

  return errors;
}

function Toast({ toast }) {
  if (!toast) {
    return null;
  }

  const toneClasses = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className={`fixed right-4 top-28 z-50 rounded-2xl border px-4 py-3 text-sm shadow-lg ${toneClasses[toast.type]}`}>
      {toast.message}
    </div>
  );
}

export default function PrescriptionGenerator() {
  const navigate = useNavigate();
  const session = useMemo(() => getAdminSession(), []);
  const token = session?.token ?? "";
  const [formData, setFormData] = useState({
    doctorName: doctorNames[0] ?? "",
    patientName: "",
    age: "",
    gender: "",
    date: getTodayDateValue(),
    diagnosis: "",
    medicines: [createMedicineRow()],
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleMedicineChange = (id, field, value) => {
    setFormData((current) => ({
      ...current,
      medicines: current.medicines.map((medicine) =>
        medicine.id === id ? { ...medicine, [field]: value } : medicine,
      ),
    }));
    setFieldErrors((current) => {
      if (!current.medicines) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors.medicines;
      return nextErrors;
    });
  };

  const handleAddMedicine = () => {
    setFormData((current) => ({
      ...current,
      medicines: [...current.medicines, createMedicineRow()],
    }));
  };

  const handleRemoveMedicine = (id) => {
    setFormData((current) => ({
      ...current,
      medicines:
        current.medicines.length > 1
          ? current.medicines.filter((medicine) => medicine.id !== id)
          : current.medicines,
    }));
  };

  const handleSubmit = async () => {
    const validationErrors = validatePrescription(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setToast({
        type: "error",
        message: "Complete the required prescription fields before generating the PDF.",
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const payload = {
      doctorName: formData.doctorName,
      patientName: formData.patientName,
      age: formData.age,
      gender: formData.gender,
      date: formData.date,
      diagnosis: formData.diagnosis,
      medicines: formData.medicines
        .filter((medicine) => String(medicine.name).trim() || String(medicine.duration).trim())
        .map((medicine) => ({
          name: medicine.name,
          morning: medicine.morning,
          afternoon: medicine.afternoon,
          night: medicine.night,
          duration: medicine.duration,
        })),
      notes: formData.notes,
    };

    try {
      await savePrescription(payload, token);
      const { generatePrescriptionPDF } = await import("../utils/generateAppointmentPDF");
      await generatePrescriptionPDF(payload);
      setToast({
        type: "success",
        message: "Prescription saved and PDF downloaded successfully.",
      });
    } catch (error) {
      const message = error.message || "Unable to generate the prescription.";

      if (error.errors && Object.keys(error.errors).length > 0) {
        const mappedErrors = {};
        Object.entries(error.errors).forEach(([key, value]) => {
          if (key === "doctor_name") {
            mappedErrors.doctorName = value;
            return;
          }

          if (key === "patient_name") {
            mappedErrors.patientName = value;
            return;
          }

          mappedErrors[key] = value;
        });
        setFieldErrors(mappedErrors);
      }

      if (message.toLowerCase().includes("unauthorized")) {
        clearAdminSession();
        navigate("/admin/login", { replace: true });
        return;
      }

      setToast({
        type: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 px-4 pb-16 pt-36 sm:px-6 lg:pt-52">
      <Toast toast={toast} />

      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Prescription</p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold text-slate-900">
              <ReceiptText className="text-cyan-600" size={28} />
              Direct Prescription Generator
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a prescription without booking an appointment and export it as a PDF.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Doctor Name</span>
              <input
                list="doctor-options"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className={inputClassName(Boolean(fieldErrors.doctorName))}
                placeholder="Select or enter doctor name"
              />
              <datalist id="doctor-options">
                {doctorNames.map((doctorName) => (
                  <option key={doctorName} value={doctorName} />
                ))}
              </datalist>
              {fieldErrors.doctorName ? (
                <span className="mt-1 block text-xs text-red-600">{fieldErrors.doctorName}</span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Patient Name</span>
              <input
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className={inputClassName(Boolean(fieldErrors.patientName))}
                placeholder="Enter patient name"
              />
              {fieldErrors.patientName ? (
                <span className="mt-1 block text-xs text-red-600">{fieldErrors.patientName}</span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Age</span>
              <input
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={inputClassName()}
                placeholder="Example: 34"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Gender</span>
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
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Date</span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClassName()}
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Diagnosis</span>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                className={inputClassName(Boolean(fieldErrors.diagnosis), "min-h-28 resize-y")}
                placeholder="Primary diagnosis or medical impression"
              />
              {fieldErrors.diagnosis ? (
                <span className="mt-1 block text-xs text-red-600">{fieldErrors.diagnosis}</span>
              ) : null}
            </label>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Medicines</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add one or more medicine rows with dosage timing and duration.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMedicine}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                <PlusCircle size={16} />
                Add Medicine
              </button>
            </div>

            {fieldErrors.medicines ? (
              <p className="mt-3 text-xs text-red-600">{fieldErrors.medicines}</p>
            ) : null}

            <div className="mt-5 space-y-4">
              {formData.medicines.map((medicine, index) => (
                <div key={medicine.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">Medicine {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(medicine.id)}
                      disabled={formData.medicines.length === 1}
                      className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MinusCircle size={14} />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
                    <input
                      value={medicine.name}
                      onChange={(event) => handleMedicineChange(medicine.id, "name", event.target.value)}
                      className={inputClassName()}
                      placeholder="Medicine name"
                    />
                    <input
                      value={medicine.morning}
                      onChange={(event) => handleMedicineChange(medicine.id, "morning", event.target.value)}
                      className={inputClassName()}
                      placeholder="Morning"
                    />
                    <input
                      value={medicine.afternoon}
                      onChange={(event) => handleMedicineChange(medicine.id, "afternoon", event.target.value)}
                      className={inputClassName()}
                      placeholder="Afternoon"
                    />
                    <input
                      value={medicine.night}
                      onChange={(event) => handleMedicineChange(medicine.id, "night", event.target.value)}
                      className={inputClassName()}
                      placeholder="Night"
                    />
                    <input
                      value={medicine.duration}
                      onChange={(event) => handleMedicineChange(medicine.id, "duration", event.target.value)}
                      className={inputClassName()}
                      placeholder="Duration"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className="mt-8 block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Notes</span>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={inputClassName(false, "min-h-28 resize-y")}
              placeholder="Additional instructions, diet advice, or review notes"
            />
          </label>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-600"
            >
              {isSubmitting ? "Generating..." : "Save Prescription & Download PDF"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
