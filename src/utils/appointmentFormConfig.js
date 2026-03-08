export const HISTORY_OPTIONS = [
  "Hypertension",
  "DM",
  "Hypothyroidism",
  "Hyperthyroidism",
  "CAD",
  "CVA",
  "Seizure",
  "TB",
  "TB Contact",
  "Surgery",
];

export function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createInitialAppointmentFormData(doctorNames) {
  return {
    firstName: "",
    lastName: "",
    appointmentDate: getTodayDateValue(),
    dateOfBirth: "",
    gender: "",
    gcs: "",
    bp: "",
    pr: "",
    rr: "",
    rbs: "",
    height: "",
    weight: "",
    spo2: "",
    medicalHistory: {},
    lmp: "",
    pog: "",
    edd: "",
    allergy: "",
    comments: "",
    contactNumber: "",
    address: "",
    doctorName: doctorNames[0] ?? "",
    message: "",
  };
}
