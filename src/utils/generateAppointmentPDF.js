import { getDoctorProfile } from "../data/doctors";

const logoImageSrc = new URL("../assets/Prescription_logo.png", import.meta.url).href;
const painScaleImageSrc = new URL("../assets/Prescription_bottom.png", import.meta.url).href;
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
const imageDataUrlCache = new Map();
let jsPdfPromise;
let appointmentAssetsPromise;

function getJsPDF() {
  jsPdfPromise ??= import("jspdf").then((module) => module.jsPDF);
  return jsPdfPromise;
}

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

function getAgeValue(formData) {
  const calculatedAge = calculateAge(formData.dateOfBirth);
  if (calculatedAge) {
    return calculatedAge;
  }

  if (hasValue(formData.age)) {
    return String(formData.age).trim();
  }

  return "";
}

function getPatientName(formData) {
  return [formData.firstName, formData.lastName].filter(Boolean).join(" ").trim() || String(formData.patient_name ?? "").trim();
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

function getPrescriptionFileName(patientName) {
  const slug = String(patientName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");

  return `prescription_${slug || "patient"}.pdf`;
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

  const cacheKey = JSON.stringify({
    src,
    alpha: options.alpha ?? 1,
    crop: options.crop ?? null,
  });

  if (imageDataUrlCache.has(cacheKey)) {
    return imageDataUrlCache.get(cacheKey);
  }

  const imagePromise = new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";

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
      if (options.crop) {
        const { x, y, width, height } = options.crop;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, x, y, width, height, 0, 0, width, height);
      } else {
        context.drawImage(image, 0, 0);
      }
      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => resolve(null);
    image.src = src;
  });

  imageDataUrlCache.set(cacheKey, imagePromise);
  return imagePromise;
}

async function getAppointmentAssets() {
  appointmentAssetsPromise ??= Promise.all([
    loadImageDataUrl(logoImageSrc),
    loadImageDataUrl(logoImageSrc, { alpha: 0.11 }),
    loadImageDataUrl(painScaleImageSrc),
  ]).then(([headerLogo, watermarkLogo, painScaleImage]) => ({
    headerLogo,
    watermarkLogo,
    painScaleImage,
  }));

  return appointmentAssetsPromise;
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
    lineYOffset = 1.1,
    valueOffset = -0.1,
    gap = 3.2,
    inputPadding = 0.8,
    eraseLineUnderValue = false,
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
    if (eraseLineUnderValue) {
      doc.setFillColor(...COLORS.page);
      doc.rect(rectX, y - 2.8, textWidthValue + 2.2, 4.2, "F");
    }
    doc.text(safeValue, lineEnd - 0.6, y + valueOffset, { align: "right" });
    return;
  }

  const textStart = lineStart + inputPadding;
  if (eraseLineUnderValue) {
    doc.setFillColor(...COLORS.page);
    doc.rect(lineStart - 0.2, y - 2.8, textWidthValue + 2, 4.2, "F");
  }
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
    const width = 140;
    const height = width * (174 / 439);
    const x = (PAGE_WIDTH - width) / 2 + 18;
    const y = (PAGE_HEIGHT - height) / 2 + 38;

    doc.addImage(watermarkLogo, "PNG", x, y, width, height, undefined, "FAST", 42);
    return;
  }

  doc.setTextColor(...COLORS.watermark);
  doc.setFont("times", "italic");
  doc.setFontSize(64);
  doc.text("DR. MEDMATE", 55, 190, { angle: 44 });
}

function drawPainScale(doc, painScaleImage) {
  if (!painScaleImage) {
    return;
  }

  const pageHeight = doc.internal.pageSize.getHeight();
  const width = 110;
  const height = width * (195 / 701);
  const x = 28;
  const y = pageHeight - height - 6;

  doc.addImage(painScaleImage, "PNG", x, y, width, height, undefined, "FAST");
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

  drawFieldLine(doc, "Date", printedDate, 4, 55, 45, {
    gap: 3.6,
    lineYOffset: 1.1,
    valueOffset: -0.1,
    eraseLineUnderValue: false,
  });
  doc.setFont("courier", "bold");
  doc.setFontSize(8.4);
  doc.text("||", 48.5, 55);
  drawFieldLine(doc, "Name", patientName, 53, 55, 149, {
    gap: 3.8,
    lineYOffset: 1.1,
    valueOffset: -0.1,
    eraseLineUnderValue: false,
  });
  doc.text("||", 149.5, 55);
  drawFieldLine(doc, "Age/Sex", ageSex, 153, 55, 198, {
    align: "right",
    gap: 3.6,
    lineYOffset: 1.1,
    valueOffset: -0.1,
    eraseLineUnderValue: false,
  });

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

  doc.setFont("courier", "bold");
  doc.setFontSize(8.6);
  doc.text("Mode:", 68, 197);
  doc.text(
    formData.consultationType === "teleconsultation" ? "Teleconsultation" : "Clinic Visit",
    68,
    202,
  );

  if (hasValue(formData.consultationPlatform)) {
    doc.text("Platform:", 68, 210);
    doc.text(String(formData.consultationPlatform), 68, 215);
  }

  if (hasValue(formData.consultationMessage)) {
    doc.text("Pre-consultation:", 118, 197);
    drawWrappedValue(doc, formData.consultationMessage, 118, 202, 74, {
      fontSize: 8,
      maxLines: 4,
      lineHeight: 3.8,
    });
  }

  if (hasValue(formData.message)) {
    doc.setFont("courier", "bold");
    doc.setFontSize(8.6);
    doc.text("Notes:", 68, 227);
    drawWrappedValue(doc, formData.message, 68, 232, 76, {
      fontSize: 8,
      maxLines: 6,
      lineHeight: 3.8,
    });
  }
}

function drawTemplate(doc, doctor, formData, patientName, ageSex, headerLogo, watermarkLogo, painScaleImage) {
  doc.setFillColor(...COLORS.page);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  drawHeader(doc, doctor, headerLogo);
  drawPatientDetails(doc, formData, patientName, ageSex);
  drawHistorySection(doc, formData);
  drawMaternalBox(doc, formData);
  drawSupplementalDetails(doc, { ...formData, watermarkLogo });
  drawPainScale(doc, painScaleImage);
  drawParallelCorner(doc, "bottom-right");
}

export async function generateAppointmentPDF(formData) {
  const jsPDF = await getJsPDF();
  const doc = new jsPDF("p", "mm", "a4");
  const doctor = getDoctorProfile(formData.doctorName);
  const patientName = getPatientName(formData);
  const age = getAgeValue(formData);
  const ageSex = [age, formData.gender].filter(Boolean).join(" / ");

  const { headerLogo, watermarkLogo, painScaleImage } = await getAppointmentAssets();

  drawTemplate(doc, doctor, formData, patientName, ageSex, headerLogo, watermarkLogo, painScaleImage);
  doc.save(getFileName(formData.firstName, formData.lastName));
}

function drawPrescriptionHeader(doc, doctor, headerLogo) {
  doc.setFillColor(...COLORS.page);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

  drawHeader(doc, doctor, headerLogo);
  drawParallelCorner(doc, "bottom-right");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.ink);
  doc.text("Medical Prescription", 105, 56, { align: "center" });

  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.55);
  doc.line(15, 60, 195, 60);
}

function formatPrescriptionDate(value) {
  const formatted = formatDate(value);
  return formatted || formatDate(new Date());
}

function drawPrescriptionPatientInfo(doc, data) {
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.ink);

  drawFieldLine(doc, "Date", formatPrescriptionDate(data.date), 12, 74, 65, {
    gap: 3.5,
    fontSize: 9.2,
  });
  drawFieldLine(doc, "Patient", data.patientName, 80, 74, 195, {
    gap: 3.5,
    fontSize: 9.2,
  });
  drawFieldLine(doc, "Age", data.age, 12, 86, 65, {
    gap: 3.5,
    fontSize: 9.2,
  });
  drawFieldLine(doc, "Gender", data.gender, 80, 86, 130, {
    gap: 3.5,
    fontSize: 9.2,
  });
  drawFieldLine(doc, "Diagnosis", data.diagnosis, 12, 98, 195, {
    gap: 3.5,
    fontSize: 9.2,
  });
}

function drawPrescriptionMedicineTable(doc, medicines) {
  let currentY = 114;

  doc.setFillColor(231, 245, 255);
  doc.roundedRect(12, currentY, 186, 12, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.2);
  doc.setTextColor(...COLORS.ink);
  doc.text("Medicine", 16, currentY + 7.5);
  doc.text("Morning", 105, currentY + 7.5, { align: "center" });
  doc.text("Afternoon", 132, currentY + 7.5, { align: "center" });
  doc.text("Night", 158, currentY + 7.5, { align: "center" });
  doc.text("Duration", 186, currentY + 7.5, { align: "center" });

  currentY += 18;

  medicines.forEach((medicine, index) => {
    const rowHeight = 13;

    doc.setDrawColor(220, 226, 235);
    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 249, index % 2 === 0 ? 255 : 252);
    doc.roundedRect(12, currentY - 7.5, 186, rowHeight, 3, 3, "FD");

    doc.setFont("courier", "bold");
    doc.setFontSize(8.8);
    doc.text(truncateTextToWidth(doc, medicine.name, 78), 16, currentY);
    doc.text(String(medicine.morning || "-"), 105, currentY, { align: "center" });
    doc.text(String(medicine.afternoon || "-"), 132, currentY, { align: "center" });
    doc.text(String(medicine.night || "-"), 158, currentY, { align: "center" });
    doc.text(String(medicine.duration || "-"), 186, currentY, { align: "center" });

    currentY += 15;
  });

  return currentY;
}

function drawPrescriptionNotes(doc, notes, startY) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Notes", 12, startY);

  doc.setDrawColor(220, 226, 235);
  doc.roundedRect(12, startY + 4, 186, 42, 5, 5);

  drawWrappedValue(doc, notes || "No additional notes.", 16, startY + 12, 176, {
    fontSize: 8.8,
    maxLines: 7,
    lineHeight: 4.5,
  });
}

function drawPrescriptionSignature(doc, doctor, startY) {
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.35);
  doc.line(138, startY, 192, startY);

  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  doc.text("Doctor Signature", 165, startY + 6, { align: "center" });

  if (hasValue(doctor.name)) {
    doc.text(String(doctor.name), 165, startY + 12, { align: "center" });
  }
}

export async function generatePrescriptionPDF(data) {
  const jsPDF = await getJsPDF();
  const doc = new jsPDF("p", "mm", "a4");
  const doctor = getDoctorProfile(data.doctorName);
  const medicines = Array.isArray(data.medicines)
    ? data.medicines.filter(
        (medicine) => hasValue(medicine?.name) || hasValue(medicine?.duration),
      )
    : [];
  const { headerLogo } = await getAppointmentAssets();

  drawPrescriptionHeader(doc, doctor, headerLogo);
  drawPrescriptionPatientInfo(doc, data);
  const nextY = drawPrescriptionMedicineTable(doc, medicines);
  drawPrescriptionNotes(doc, data.notes, Math.max(nextY + 4, 198));
  drawPrescriptionSignature(doc, doctor, 270);

  doc.save(getPrescriptionFileName(data.patientName));
}
