import { jsPDF } from "jspdf";
import { getDoctorByName } from "../data/doctors";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
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

const COLORS = {
  page: [248, 247, 245],
  ink: [18, 18, 18],
  brand: [166, 121, 77],
  frame: [171, 136, 95],
  watermark: [236, 228, 219],
};

function formatDate(value, fallback = "") {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) {
    return "";
  }

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return "";
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? `${age}` : "";
}

function getPatientName(formData) {
  return [formData.firstName, formData.lastName].filter(Boolean).join(" ").trim();
}

function getFileName(firstName, lastName) {
  const slug = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");

  return `appointment_${slug || "patient"}.pdf`;
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function drawParallelCorner(doc, corner) {
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(1.3);

  if (corner === "top-left") {
    doc.line(4, 1, 4, 42);
    doc.line(8, 1, 8, 42);
    doc.line(0, 6, 43, 6);
    doc.line(0, 10, 43, 10);
    return;
  }

  doc.line(200, 255, 200, 296);
  doc.line(204, 255, 204, 296);
  doc.line(159, 286, 210, 286);
  doc.line(159, 290, 210, 290);
}

function drawDottedLine(doc, x1, y, x2) {
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.35);
  doc.setLineDashPattern([0.7, 1.3], 0);
  doc.line(x1, y, x2, y);
  doc.setLineDashPattern([], 0);
}

function drawFieldLine(doc, label, value, x, y, width, align = "left") {
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.ink);
  doc.text(`${label}:`, x, y);

  const textWidth = doc.getTextWidth(`${label}:`);
  const lineStart = x + textWidth + 2;
  const lineEnd = x + width;
  drawDottedLine(doc, lineStart, y + 0.5, lineEnd);

  if (!hasValue(value)) {
    return;
  }

  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);

  if (align === "right") {
    doc.text(String(value), lineEnd - 1, y, { align: "right" });
    return;
  }

  doc.text(String(value), lineStart + 1, y);
}

function drawHistoryItem(doc, label, x, y, checked) {
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.35);
  doc.circle(x, y - 0.8, 1.8);

  if (checked) {
    doc.setLineWidth(0.45);
    doc.line(x - 0.8, y - 0.6, x - 0.15, y + 0.15);
    doc.line(x - 0.15, y + 0.15, x + 1.1, y - 1.2);
  }

  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.ink);
  doc.text(label, x + 3.5, y);
}

function drawWrappedValue(doc, value, x, y, width, lineHeight = 4.1) {
  if (!hasValue(value)) {
    return y;
  }

  const lines = doc.splitTextToSize(String(value), width);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function drawWatermark(doc) {
  doc.setTextColor(...COLORS.watermark);
  doc.setFont("times", "italic");
  doc.setFontSize(64);
  doc.text("DR. MEDMATE", 58, 192, { angle: 48 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(22);
  doc.text("Complete Care", 82, 211, { angle: 48 });
}

function drawHeader(doc, doctor) {
  drawParallelCorner(doc, "top-left");

  doc.setTextColor(...COLORS.ink);
  doc.setFont("times", "normal");
  doc.setFontSize(20);
  doc.text(doctor.name, 48, 14, { align: "center" });

  doc.setDrawColor(...COLORS.frame);
  doc.setLineWidth(0.5);
  doc.line(23, 18, 74, 18);

  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.text((doctor.degree || "").toUpperCase(), 48, 22, { align: "center" });

  const specializationLines = doc.splitTextToSize((doctor.specialization || "").toUpperCase(), 62);
  doc.text(specializationLines, 48, 26, { align: "center" });

  let currentY = 26 + specializationLines.length * 4.2;

  if (hasValue(doctor.fellowship)) {
    doc.setFont("courier", "normal");
    doc.text(String(doctor.fellowship), 48, currentY, { align: "center" });
    currentY += 4.2;
  }

  doc.setFont("courier", "bold");
  doc.text(`Reg. No. ${doctor.regNo || ""}`, 48, currentY, { align: "center" });

  doc.setTextColor(...COLORS.brand);
  doc.setFont("times", "italic");
  doc.setFontSize(32);
  doc.text("Dr.", 132, 16);

  doc.setTextColor(...COLORS.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("MEDMATE", 166, 17, { align: "center" });

  doc.setTextColor(...COLORS.brand);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(doctor.clinic || "Complete Care", 166, 23, { align: "center" });

  doc.setTextColor(...COLORS.ink);
  doc.setFont("courier", "bold");
  doc.setFontSize(9.5);
  doc.text(doctor.phone || "", 194, 30, { align: "right" });
  doc.text(doctor.email || "", 194, 36, { align: "right" });

  drawDottedLine(doc, 10, 43, 195);
}

function drawPatientDetails(doc, formData, patientName, ageSex) {
  const printedDate = formatDate(formData.appointmentDate || new Date());

  drawFieldLine(doc, "Date", printedDate, 4, 55, 44);
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.text("||", 48.5, 55);
  drawFieldLine(doc, "Name", patientName, 53, 55, 149);
  doc.text("||", 149.5, 55);
  drawFieldLine(doc, "Age/Sex", ageSex, 153, 55, 198, "right");

  drawFieldLine(doc, "GCS", formData.gcs, 0.5, 67, 51);
  drawFieldLine(doc, "BP", formData.bp, 55, 67, 109);
  drawFieldLine(doc, "PR", formData.pr, 116, 67, 159);
  drawFieldLine(doc, "RR", formData.rr, 166, 67, 202);

  drawFieldLine(doc, "RBS", formData.rbs, 0.5, 79, 51);
  drawFieldLine(doc, "Height", formData.height, 54, 79, 93);
  drawFieldLine(doc, "Weight", formData.weight, 100, 79, 145);
  drawFieldLine(doc, "SpO2", formData.spo2, 153, 79, 204);
}

function drawHistorySection(doc, formData) {
  doc.setFont("courier", "bold");
  doc.setFontSize(8.8);
  doc.setTextColor(...COLORS.ink);
  doc.text("Past History:", 4, 91);

  let currentY = 98;
  HISTORY_ITEMS.forEach((label) => {
    drawHistoryItem(doc, label, 6.5, currentY, Boolean(formData.medicalHistory?.[label]));
    currentY += 6.8;
  });

  drawDottedLine(doc, 10, 161, 151);
}

function drawMaternalBox(doc, formData) {
  doc.setDrawColor(...COLORS.frame);
  doc.setLineWidth(0.45);
  doc.roundedRect(156, 81, 45, 78, 6, 6);

  doc.setTextColor(...COLORS.ink);
  doc.setFont("courier", "bold");
  doc.setFontSize(8.3);
  doc.text("Maternal History:", 159, 89);

  doc.setFont("courier", "normal");
  doc.setFontSize(8.2);
  doc.text("LMP:", 159, 108);
  doc.text("POG:", 159, 115);
  doc.text("EDD:", 159, 122);
  doc.text("Allergy:", 159, 135);
  doc.text("Comments:", 159, 148);

  if (hasValue(formData.lmp)) {
    doc.text(String(formData.lmp), 171, 108);
  }

  if (hasValue(formData.pog)) {
    doc.text(String(formData.pog), 171, 115);
  }

  if (hasValue(formData.edd)) {
    doc.text(String(formData.edd), 171, 122);
  }

  if (hasValue(formData.allergy)) {
    const allergyLines = doc.splitTextToSize(String(formData.allergy), 33);
    doc.text(allergyLines, 159, 140);
  }

  const commentsText = formData.comments || formData.message;
  if (hasValue(commentsText)) {
    const commentLines = doc.splitTextToSize(String(commentsText), 33);
    doc.text(commentLines, 159, 153);
  }
}

function drawPrescriptionBody(doc, formData) {
  drawWatermark(doc);

  let bodyY = 170;

  if (hasValue(formData.address)) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8.4);
    doc.setTextColor(...COLORS.ink);
    doc.text("Address:", 10, bodyY);
    bodyY = drawWrappedValue(doc, formData.address, 10, bodyY + 5, 138, 4.2) + 4;
  }

  if (hasValue(formData.contactNumber)) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8.4);
    doc.text("Contact:", 10, bodyY);
    doc.setFont("courier", "normal");
    doc.text(String(formData.contactNumber), 28, bodyY);
    bodyY += 8;
  }

  if (hasValue(formData.message)) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8.4);
    doc.text("Notes:", 10, bodyY);
    drawWrappedValue(doc, formData.message, 10, bodyY + 5, 138, 4.2);
  }
}

function drawTemplate(doc, doctor, formData, patientName, ageSex) {
  doc.setFillColor(...COLORS.page);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  drawHeader(doc, doctor);
  drawPatientDetails(doc, formData, patientName, ageSex);
  drawHistorySection(doc, formData);
  drawMaternalBox(doc, formData);
  drawPrescriptionBody(doc, formData);
  drawParallelCorner(doc, "bottom-right");
}

export async function generateAppointmentPDF(formData) {
  const doc = new jsPDF("p", "mm", "a4");
  const doctor = getDoctorByName(formData.doctorName);
  const patientName = getPatientName(formData);
  const age = calculateAge(formData.dateOfBirth);
  const ageSex = [age, formData.gender].filter(Boolean).join(" / ");

  drawTemplate(doc, doctor, formData, patientName, ageSex);
  doc.save(getFileName(formData.firstName, formData.lastName));
}
