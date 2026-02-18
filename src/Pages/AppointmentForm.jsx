import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function AppointmentForm() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    contact: "",
    address: "",
    doctor: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Medical Appointment Form", 20, 20);

    doc.setFontSize(12);
    doc.text(`First Name: ${formData.firstName}`, 20, 40);
    doc.text(`Last Name: ${formData.lastName}`, 20, 50);
    doc.text(`Date of Birth: ${formData.dob}`, 20, 60);
    doc.text(`Gender: ${formData.gender}`, 20, 70);
    doc.text(`Contact Number: ${formData.contact}`, 20, 80);
    doc.text(`Address: ${formData.address}`, 20, 90);
    doc.text(`Doctor: ${formData.doctor}`, 20, 100);
    doc.text(`Message: ${formData.message}`, 20, 110);

    doc.save("appointment-form.pdf");
  };

  return (
    <div className="bg-white rounded-xl p-40 shadow-xl max-w-3xl mx-auto">

      <h3 className="text-2xl font-semibold mb-4">
        Book An Appointment
      </h3>

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
          name="dob"
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
          type="number"
          name="contact"
          placeholder="Contact Number"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none"
        />

        <select
          name="doctor"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none"
        >
          <option value="">Choose Doctor</option>
          <option>Dr. Michael Brian</option>
          <option>Dr. Sarah Khan</option>
          <option>Dr. John Smith</option>
        </select>

        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none md:col-span-2"
        />

        <textarea
          name="message"
          placeholder="Message"
          onChange={handleChange}
          className="p-3 bg-gray-100 rounded-md outline-none md:col-span-2"
        ></textarea>

      </div>

      <button
        onClick={generatePDF}
        className="w-full mt-8 bg-blue-900 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 hover:scale-[1.02] transition"
      >
        Generate PDF & Download
      </button>

    </div>
  );
}
