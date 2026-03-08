import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import medmateLogo from "../assets/medmate-logo.svg";
import Footer from "./Footer";

const HISTORY_ITEMS = [
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

const PAIN_COLORS = [
  [30, 174, 218],
  [44, 188, 160],
  [69, 190, 88],
  [134, 191, 63],
  [241, 200, 55],
  [246, 169, 39],
  [244, 140, 30],
  [241, 111, 26],
  [239, 82, 31],
  [232, 54, 35],
  [222, 17, 26],
];

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB");
}

function calculateAge(value) {
  if (!value) {
    return "";
  }

  const dob = new Date(value);

  if (Number.isNaN(dob.getTime())) {
    return "";
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
}

function drawTopLeftDecoration(doc) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.4);
  doc.line(7, 8, 47, 8);
  doc.line(7, 12, 47, 12);
  doc.line(16, 2, 16, 38);
  doc.line(20, 2, 20, 38);
}

function drawBottomRightDecoration(doc, pageWidth, pageHeight) {
  const x = pageWidth - 6;
  const y = pageHeight - 10;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.4);
  doc.line(x, y, x - 48, y);
  doc.line(x, y - 4, x - 48, y - 4);
  doc.line(x - 10, y + 8, x - 10, y - 36);
  doc.line(x - 14, y + 8, x - 14, y - 36);
}

function drawLabelLine(doc, label, value, x, y, labelWidth, lineWidth) {
  doc.setTextColor(28, 28, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(label, x, y);

  const lineStart = x + labelWidth;
  const baseline = y + 1;
  doc.setLineWidth(0.2);
  doc.line(lineStart, baseline, lineStart + lineWidth, baseline);

  if (value) {
    doc.text(value, lineStart + 1.5, y - 0.6);
  }
}

async function loadImageDataUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas context is unavailable"));
        return;
      }

      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error("Unable to load logo image"));
    image.src = url;
  });
}

function drawPainScale(doc, pageHeight) {
  const startX = 22;
  const circleY = pageHeight - 34;
  const tickY = circleY + 21;
  const barY = tickY + 8;
  const segmentWidth = 32;

  PAIN_COLORS.forEach((color, index) => {
    const x = startX + index * 11.3;
    doc.setFillColor(...color);
    doc.setDrawColor(170, 170, 170);
    doc.setLineWidth(0.35);
    doc.circle(x, circleY, 4.1, "FD");

    doc.setTextColor(22, 22, 22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(String(index), x - 1.2, circleY + 11.5);

    doc.setDrawColor(80, 80, 80);
    doc.setLineWidth(0.25);
    doc.line(x, tickY - 2, x, tickY + 4);
  });

  doc.setDrawColor(80, 80, 80);
  doc.line(startX, tickY, startX + 113, tickY);

  doc.setFillColor(...PAIN_COLORS[0]);
  doc.rect(startX, barY, segmentWidth, 4, "F");
  doc.setFillColor(...PAIN_COLORS[4]);
  doc.rect(startX + segmentWidth, barY, segmentWidth, 4, "F");
  doc.setFillColor(...PAIN_COLORS[7]);
  doc.rect(startX + segmentWidth * 2, barY, segmentWidth, 4, "F");
  doc.setFillColor(...PAIN_COLORS[10]);
  doc.rect(startX + segmentWidth * 3, barY, 17, 4, "F");

  doc.setDrawColor(85, 85, 85);
  doc.rect(startX, barY, segmentWidth, 10);
  doc.rect(startX + segmentWidth, barY, segmentWidth, 10);
  doc.rect(startX + segmentWidth * 2, barY, segmentWidth, 10);
  doc.rect(startX + segmentWidth * 3, barY, 17, 10);

  doc.setTextColor(35, 35, 35);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("NO PAIN", startX - 3, barY + 8);
  doc.text("MILD", startX + 14, barY + 8);
  doc.text("MODERATE", startX + 49, barY + 8);
  doc.text("SEVERE", startX + 94, barY + 8);
}

function Contact() {
  const [shows, setShows] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    contact: "",
    address: "",
    doctor: "",
    message: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShows(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const patientName = `${formData.firstName} ${formData.lastName}`.trim();
    const formattedDate = formatDate(formData.dob);
    const age = calculateAge(formData.dob);
    const ageSex = [age ? `${age} Y` : "", formData.gender].filter(Boolean).join(" / ");
    const fileName = patientName
      ? `${patientName.toLowerCase().replace(/\s+/g, "-")}-appointment.pdf`
      : "appointment-form.pdf";

    doc.setFillColor(250, 249, 246);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    drawTopLeftDecoration(doc);
    drawBottomRightDecoration(doc, pageWidth, pageHeight);

    doc.setTextColor(32, 32, 32);
    doc.setFont("times", "normal");
    doc.setFontSize(22);
    doc.text("Dr . Saptarghya Mandal", 57, 15.5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("MBBS; MCK, WBUHS", 57, 22.5, { align: "center" });
    doc.text("MD - INTERNAL MEDICINE", 57, 28.5, { align: "center" });
    doc.text("(PGIMER, CHANDIGARH)", 57, 34.5, { align: "center" });
    doc.text("Fellowship in Diabetology", 57, 40.5, { align: "center" });
    doc.text("Reg. No. PMC 62271", 57, 46.5, { align: "center" });
    doc.setDrawColor(173, 125, 74);
    doc.setLineWidth(0.6);
    doc.setLineDashPattern([0.8, 0.8], 0);
    doc.line(24, 18.3, 90, 18.3);
    doc.setLineDashPattern([], 0);

    const logoDataUrl = await loadImageDataUrl(medmateLogo);
    doc.addImage(logoDataUrl, "PNG", 129, 5, 66, 30);

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("+91 9041441402", 162, 31, { align: "center" });
    doc.text("dr.medmate@gmail.com", 162, 37, { align: "center" });

    doc.setLineDashPattern([1.2, 0.9], 0);
    doc.setLineWidth(0.5);
    doc.line(10, 48, pageWidth - 10, 48);
    doc.setLineDashPattern([], 0);

    drawLabelLine(doc, "Date:", formattedDate, 10, 61, 12, 28);
    drawLabelLine(doc, "Name:", patientName, 58, 61, 14, 72);
    drawLabelLine(doc, "Age / Sex:", ageSex, 152, 61, 18, 30);

    drawLabelLine(doc, "GCS:", "", 10, 73, 10, 38);
    drawLabelLine(doc, "BP:", "", 62, 73, 8, 46);
    drawLabelLine(doc, "PR:", "", 120, 73, 8, 42);
    drawLabelLine(doc, "RR:", "", 170, 73, 8, 22);

    drawLabelLine(doc, "RBS:", "", 10, 85, 10, 40);
    drawLabelLine(doc, "Height:", "", 58, 85, 14, 32);
    drawLabelLine(doc, "Weight:", "", 104, 85, 16, 26);
    drawLabelLine(doc, "SpO2:", "", 140, 85, 12, 42);

    doc.setTextColor(26, 26, 26);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Past History:", 10, 98);

    let historyY = 106;
    HISTORY_ITEMS.forEach((item) => {
      doc.setLineWidth(0.3);
      doc.circle(12.5, historyY - 1.3, 1.8);
      doc.text(item, 16, historyY);
      historyY += 6.5;
    });

    doc.setLineDashPattern([1.2, 0.9], 0);
    doc.line(10, 168, 145, 168);
    doc.setLineDashPattern([], 0);

    doc.setDrawColor(173, 125, 74);
    doc.setLineWidth(0.4);
    doc.roundedRect(150, 87, 42, 84, 6, 6);

    doc.setTextColor(28, 28, 28);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Maternal History:", 153, 96);
    doc.text("LMP:", 153, 114);
    doc.text("POG:", 153, 122);
    doc.text("EDD:", 153, 130);
    doc.text("Allergy:", 153, 142);
    doc.text("Comments:", 153, 154);

    const commentLines = [
      formData.doctor ? `Doctor: ${formData.doctor}` : "",
      formData.contact ? `Phone: ${formData.contact}` : "",
      formData.address ? `Address: ${formData.address}` : "",
      formData.message ? `Note: ${formData.message}` : "",
    ].filter(Boolean);

    if (commentLines.length > 0) {
      doc.setFontSize(8);
      doc.text(doc.splitTextToSize(commentLines.join(" | "), 34).slice(0, 6), 153, 160);
    }

    doc.setTextColor(230, 222, 212);
    doc.setFont("times", "italic");
    doc.setFontSize(76);
    doc.text("DR.", 26, 226, { angle: 35 });

    doc.setTextColor(236, 229, 220);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(44);
    doc.text("MEDMATE", 72, 198, { angle: 35 });

    doc.setTextColor(238, 233, 226);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(22);
    doc.text("Complete Care", 116, 221, { angle: 35 });

    drawPainScale(doc, pageHeight);

    doc.save(fileName);
  };

  return (
    <>
      <div className="flex h-[280px] w-full items-center justify-center overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 px-4 pt-24 sm:h-[350px] sm:pt-30">
        <div
          className={`text-center transition-all duration-1000 ease-out ${
            shows ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600">Contact Us</h1>

          <p className="mt-4 text-lg">
            <span className="font-semibold">Home</span> - Services
          </p>
        </div>
      </div>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-3 md:gap-8">
          {[
            {
              icon: "LOC",
              title: "Office Location",
              text: "2972 Westheimer Rd.\nSanta Ana, Illinois\n85486",
            },
            {
              icon: "MAIL",
              title: "Company Email",
              text: "info@example.com\ncontact@example.com",
            },
            {
              icon: "CALL",
              title: "Contact Us",
              text: "+000 111 555 999\n+000 111 555 888",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-white p-6 text-center shadow-sm sm:p-8">
              <div className="bg-blue-600 text-white px-4 py-3 rounded-xl inline-block mb-4 text-sm font-semibold">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div
            className={`text-white transition-all duration-700 ${
              shows ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            }`}
          >
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              Helping Patients From <br /> Around The Globe!!
            </h2>

            <p className="mb-8 text-lg opacity-90">
              Our staff strives to make each interaction with patients clear,
              concise, and inviting.
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <button className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:scale-105">
                Make A Gift
              </button>

              <button className="rounded-lg border border-white px-6 py-3 transition hover:bg-white hover:text-blue-700">
                Help And FAQs
              </button>
            </div>

            <img
              src="https://cdn-icons-png.flaticon.com/512/44/44786.png"
              alt="map"
              className={`w-full max-w-xs transition-all duration-1000 delay-300 sm:max-w-sm ${
                shows ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            />
          </div>

          <div className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl sm:p-8 md:p-10">
            <h3 className="text-2xl font-semibold mb-4">Book An Appointment</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="First Name"
                onChange={handleChange}
                className="p-3 bg-gray-100 rounded-md outline-none"
              />

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Last Name"
                onChange={handleChange}
                className="p-3 bg-gray-100 rounded-md outline-none"
              />

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="p-3 bg-gray-100 rounded-md outline-none"
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-3 bg-gray-100 rounded-md outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="tel"
                name="contact"
                value={formData.contact}
                placeholder="Contact Number"
                onChange={handleChange}
                className="p-3 bg-gray-100 rounded-md outline-none"
              />

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="p-3 bg-gray-100 rounded-md outline-none"
              >
                <option value="">Choose Doctor</option>
                <option value="Dr. Michael Brian">Dr. Michael Brian</option>
                <option value="Dr. Sarah Khan">Dr. Sarah Khan</option>
                <option value="Dr. John Smith">Dr. John Smith</option>
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
                rows="4"
              />
            </div>

            <button
              onClick={generatePDF}
              className="w-full mt-8 bg-blue-900 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 hover:scale-[1.02] transition"
            >
              Generate PDF And Download
            </button>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <iframe
          title="location-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26771.151045558596!2d88.4096454982805!3d22.654082383728486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89e6c605d82ff%3A0x1f6779d05c4879ee!2sDum%20Dum%2C%20Kolkata%2C%20West%20Bengal!5e1!3m2!1sen!2sin!4v1770742753581!5m2!1sen!2sin"
          width="100%"
          height="450"
          loading="lazy"
        ></iframe>
      </section>

      <style>
        {`
          .input {
            width: 100%;
            border: 1px solid #d1d5db;
            padding: 12px 16px;
            border-radius: 6px;
            outline: none;
          }

          .input:focus {
            border-color: #3b82f6;
          }
        `}
      </style>

      <Footer />
    </>
  );
}

export default Contact;
