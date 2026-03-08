export const doctors = {
  "Dr. Saptarghya Mandal": {
    degree: "MBBS; MCK, WBUHS",
    specialization: "MD Internal Medicine (PGIMER, Chandigarh)",
    fellowship: "Fellowship in Diabetology",
    regNo: "PMC 62271",
    phone: "+91 9041441402",
    email: "dr.medmate@gmail.com",
    clinic: "Dr Medmate Complete Care",
  },
  "Dr. Example Doctor": {
    degree: "MBBS, MS",
    specialization: "General Surgery",
    fellowship: "",
    regNo: "REG12345",
    phone: "+91 9999999999",
    email: "example@gmail.com",
    clinic: "Mukti Medical",
  },
};

export const doctorNames = Object.keys(doctors);

export function getDoctorByName(name) {
  const doctorName = doctors[name] ? name : doctorNames[0];
  return {
    name: doctorName,
    ...doctors[doctorName],
  };
}
