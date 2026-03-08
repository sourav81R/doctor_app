import { jsPDF } from "jspdf";
import { getDoctorByName } from "../data/doctors";

const logoModules = import.meta.glob("../assets/Prescription_logo.png", {
  eager: true,
  import: "default",
});

const logoImageSrc = Object.values(logoModules)[0] ?? null;
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
  ink: [16, 16, 16],
  accent: [171, 136, 95],
  watermark: [230, 220, 210],
};

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

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

function fitTextToWidth(doc, text, maxWidth, font = "courier", style = "bold", startSize = 12, minSize = 7) {
  const safeText = String(text ?? "").trim();
  let fontSize = startSize;

  doc.setFont(font, style);
  doc.setFontSize(fontSize);

  while (fontSize > minSize && doc.getTextWidth(safeText) > maxWidth) {
    fontSize -= 0.4;
    doc.setFontSize(fontSize);
  }

  return { text: safeText, fontSize };
}

function truncateTextToWidth(doc, text, maxWidth) {
  const safeText = String(text ?? "").trim();
  if (!safeText) {
    return "";
  }

  if (doc.getTextWidth(safeText) <= maxWidth) {
    return safeText;
  }

  let candidate = safeText;
  while (candidate.length > 0) {
    const shortened = `${candidate.trimEnd()}...`;
    if (doc.getTextWidth(shortened) <= maxWidth) {
      return shortened;
    }

    candidate = candidate.slice(0, -1);
  }

  return "";
}

async function loadImageDataUrl(src, options = {}) {
  if (!src) {
    return null;
  }

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d");
      if (!context) {
        resolve(null);
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = options.alpha ?? 1;
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawParallelCorner(doc, corner) {
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(1.1);

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
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([0.7, 1.2], 0);
  doc.line(x1, y, x2, y);
  doc.setLineDashPattern([], 0);
}

function drawFieldLine(doc, label, value, x, y, width, options = {}) {
  const {
    align = "left",
    fontSize = 8.6,
    lineYOffset = 0.7,
    valueOffset = 0.7,
    gap = 3.2,
    inputPadding = 5.5,
  } = options;

  doc.setFont("courier", "bold");
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORS.ink);
  doc.text(`${label}:`, x, y);

  const textWidth = doc.getTextWidth(`${label}:`);
  const lineStart = x + textWidth + gap;
  const lineEnd = width;
  drawDottedLine(doc, lineStart, y + lineYOffset, lineEnd);

  if (!hasValue(value)) {
    return;
  }

  const maxWidth = lineEnd - lineStart - 1.5;
  const safeValue = truncateTextToWidth(doc, value, maxWidth);
  doc.setFont("courier", "bold");
  doc.setFontSize(fontSize);
  const textWidthValue = doc.getTextWidth(safeValue);

  if (align === "right") {
    const rectX = lineEnd - textWidthValue - 1.8;
    doc.setFillColor(...COLORS.page);
    doc.rect(rectX, y - 2.8, textWidthValue + 2.2, 4.2, "F");
    doc.text(safeValue, lineEnd - 0.6, y + valueOffset, { align: "right" });
    return;
  }

  const textStart = lineStart + inputPadding;
  doc.setFillColor(...COLORS.page);
  doc.rect(textStart - 0.8, y - 2.8, textWidthValue + 2.4, 4.2, "F");
  doc.text(safeValue, textStart, y + valueOffset);
}

function drawHistoryItem(doc, label, x, y, checked) {
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.32);
  doc.circle(x, y - 0.8, 1.8);

  if (checked) {
    doc.setLineWidth(0.4);
    doc.line(x - 0.9, y - 0.9, x - 0.2, y - 0.1);
    doc.line(x - 0.2, y - 0.1, x + 1.1, y - 1.5);
  }

  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.ink);
  doc.text(label, x + 5, y);
}

function drawWrappedValue(doc, value, x, y, width, options = {}) {
  if (!hasValue(value)) {
    return y;
  }

  const {
    fontSize = 8.2,
    maxLines,
    lineHeight = 3.9,
  } = options;

  doc.setFont("courier", "bold");
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORS.ink);

  const lines = doc.splitTextToSize(String(value).trim(), width);
  const visibleLines = maxLines ? lines.slice(0, maxLines) : lines;
  doc.text(visibleLines, x, y);
  return y + visibleLines.length * lineHeight;
}

function drawWatermark(doc, watermarkLogo) {
  if (watermarkLogo) {
    doc.addImage(watermarkLogo, "PNG", 38, 126, 128, 50.8, undefined, "FAST", 318);
    return;
  }

  doc.setTextColor(...COLORS.watermark);
  doc.setFont("times", "italic");
  doc.setFontSize(64);
  doc.text("DR. MEDMATE", 55, 190, { angle: 44 });
}

function drawHeader(doc, doctor, headerLogo) {
  drawParallelCorner(doc, "top-left");

  doc.setTextColor(...COLORS.ink);
  doc.setFont("times", "normal");
  const fittedDoctorName = fitTextToWidth(doc, doctor.name, 74, "times", "normal", 19, 13);
  doc.setFont("times", "normal");
  doc.setFontSize(fittedDoctorName.fontSize);
  doc.text(fittedDoctorName.text, 52, 16, { align: "center" });

  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.45);
  doc.line(26, 19.5, 78, 19.5);

  doc.setFont("courier", "bold");
  doc.setFontSize(8.1);
  doc.text((doctor.degree || "").toUpperCase(), 52, 24, { align: "center" });

  const specializationLines = doc.splitTextToSize((doctor.specialization || "").toUpperCase(), 62);
  doc.text(specializationLines, 52, 28, { align: "center" });

  let currentY = 28 + specializationLines.length * 4.2;

  if (hasValue(doctor.fellowship)) {
    doc.text(String(doctor.fellowship), 52, currentY, { align: "center" });
    currentY += 4.2;
  }

  doc.text(`Reg. No. ${doctor.regNo || ""}`, 52, currentY, { align: "center" });

  if (headerLogo) {
    doc.addImage(headerLogo, "PNG", 124, 4, 74, 29.4, undefined, "FAST");
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("DR MEDMATE", 166, 16, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(doctor.phone || "", 166, 23, { align: "center" });
    doc.text(doctor.email || "", 166, 29, { align: "center" });
  }

  drawDottedLine(doc, 10, 43, 196);
}

function drawPatientDetails(doc, formData, patientName, ageSex) {
  const printedDate = formatDate(formData.appointmentDate || new Date(), formatDate(new Date()));

  drawFieldLine(doc, "Date", printedDate, 4, 55, 45, { gap: 3.6 });
  doc.setFont("courier", "bold");
  doc.setFontSize(8.4);
  doc.text("||", 48.5, 55);
  drawFieldLine(doc, "Name", patientName, 53, 55, 149, { gap: 3.8 });
  doc.text("||", 149.5, 55);
  drawFieldLine(doc, "Age/Sex", ageSex, 153, 55, 198, { align: "right", gap: 3.6 });

  drawFieldLine(doc, "GCS", formData.gcs, 0.8, 67, 52, { gap: 3.4 });
  drawFieldLine(doc, "BP", formData.bp, 55, 67, 109, { gap: 3.4 });
  drawFieldLine(doc, "PR", formData.pr, 116, 67, 159, { gap: 3.4 });
  drawFieldLine(doc, "RR", formData.rr, 166, 67, 202, { gap: 3.4 });

  drawFieldLine(doc, "RBS", formData.rbs, 0.8, 79, 52, { gap: 3.4 });
  drawFieldLine(doc, "Height", formData.height, 54, 79, 95, { gap: 3.4 });
  drawFieldLine(doc, "Weight", formData.weight, 100, 79, 147, { gap: 3.4 });
  drawFieldLine(doc, "SpO2", formData.spo2, 153, 79, 204, { gap: 3.4 });
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
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.4);
  doc.roundedRect(156, 81, 45, 78, 6, 6);

  doc.setTextColor(...COLORS.ink);
  doc.setFont("courier", "bold");
  doc.setFontSize(7.9);
  doc.text("Maternal History:", 159, 89);

  doc.text("LMP:", 159, 108);
  doc.text("POG:", 159, 115);
  doc.text("EDD:", 159, 122);
  doc.text("Allergy:", 159, 135);
  doc.text("Comments:", 159, 148);

  if (hasValue(formData.lmp)) {
    doc.text(formatDate(formData.lmp), 171, 108);
  }

  if (hasValue(formData.pog)) {
    doc.text(String(formData.pog), 171, 115);
  }

  if (hasValue(formData.edd)) {
    doc.text(formatDate(formData.edd), 171, 122);
  }

  if (hasValue(formData.allergy)) {
    drawWrappedValue(doc, formData.allergy, 159, 140, 33, { fontSize: 7.3, maxLines: 3, lineHeight: 3.2 });
  }

  if (hasValue(formData.comments)) {
    drawWrappedValue(doc, formData.comments, 159, 153, 33, { fontSize: 7.3, maxLines: 4, lineHeight: 3.2 });
  }
}

function drawSupplementalDetails(doc, formData) {
  drawWatermark(doc, formData.watermarkLogo);

  let bodyY = 170;

  if (hasValue(formData.contactNumber)) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8.6);
    doc.setTextColor(...COLORS.ink);
    doc.text("Contact:", 10, bodyY);
    doc.text(String(formData.contactNumber), 10, bodyY + 5);
    bodyY += 15;
  }

  if (hasValue(formData.address)) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8.6);
    doc.text("Address:", 10, bodyY);
    bodyY = drawWrappedValue(doc, formData.address, 10, bodyY + 5, 50, {
      fontSize: 8,
      maxLines: 3,
      lineHeight: 3.8,
    }) + 4;
  }

  if (hasValue(formData.message)) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8.6);
    doc.text("Notes:", 68, 170);
    drawWrappedValue(doc, formData.message, 68, 175, 76, {
      fontSize: 8,
      maxLines: 6,
      lineHeight: 3.8,
    });
  }
}

function drawTemplate(doc, doctor, formData, patientName, ageSex, headerLogo, watermarkLogo) {
  doc.setFillColor(...COLORS.page);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  drawHeader(doc, doctor, headerLogo);
  drawPatientDetails(doc, formData, patientName, ageSex);
  drawHistorySection(doc, formData);
  drawMaternalBox(doc, formData);
  drawSupplementalDetails(doc, { ...formData, watermarkLogo });
  drawParallelCorner(doc, "bottom-right");
}

export async function generateAppointmentPDF(formData) {
  const doc = new jsPDF("p", "mm", "a4");
  const doctor = getDoctorByName(formData.doctorName);
  const patientName = getPatientName(formData);
  const age = calculateAge(formData.dateOfBirth);
  const ageSex = [age, formData.gender].filter(Boolean).join(" / ");

  const [headerLogo, watermarkLogo] = await Promise.all([
    loadImageDataUrl(logoImageSrc),
    loadImageDataUrl(logoImageSrc, { alpha: 0.11 }),
  ]);

  drawTemplate(doc, doctor, formData, patientName, ageSex, headerLogo, watermarkLogo);
  doc.save(getFileName(formData.firstName, formData.lastName));
}
