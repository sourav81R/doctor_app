import { useState } from "react";
import { doctorNames } from "../data/doctors";
import { generateAppointmentPDF } from "../utils/generateAppointmentPDF";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: "",
    doctorName: doctorNames[0] ?? "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGeneratePdf = async () => {
    try {
      await generateAppointmentPDF(formData);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Unable to generate the appointment PDF.");
    }
  };

  return (
    <div className="bg-white rounded-xl p-40 shadow-xl max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Book An Appointment</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none"
        />

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none"
        />

        <select
          name="gender"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          placeholder="Contact Number"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none"
        />

        <select
          name="doctorName"
          value={formData.doctorName}
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none"
        >
          {doctorNames.map((doctorName) => (
            <option key={doctorName} value={doctorName}>
              {doctorName}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="address"
          value={formData.address}
          placeholder="Address"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none md:col-span-2"
        />

        <textarea
          name="message"
          value={formData.message}
          placeholder="Message"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none md:col-span-2"
        ></textarea>
      </div>

      <button
        onClick={handleGeneratePdf}
        className="w-full mt-8 bg-blue-900 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 hover:scale-[1.02] transition"
      >
        Generate PDF & Download
      </button>

    </div>
  );
}
