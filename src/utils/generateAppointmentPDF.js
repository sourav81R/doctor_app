import { jsPDF } from "jspdf";
import { getDoctorByName } from "../data/doctors";

const templateModules = import.meta.glob("../assets/Doctor(1).jpeg", {
  eager: true,
  import: "default",
});

const templateImageSrc = Object.values(templateModules)[0] ?? null;
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

const IMAGE_CROPS = {
  headerLogo: { sx: 680, sy: 0, sw: 420, sh: 195, alpha: 1, type: "PNG" },
  watermarkLogo: { sx: 630, sy: 0, sw: 430, sh: 190, alpha: 0.1, type: "PNG" },
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

async function loadCroppedImageDataUrl(src, crop) {
  if (!src) {
    return null;
  }

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop?.sw ?? image.width;
      canvas.height = crop?.sh ?? image.height;

      const context = canvas.getContext("2d");
      if (!context) {
        resolve(null);
        return;
      }

      if (crop?.alpha !== undefined) {
        context.globalAlpha = crop.alpha;
      }

      if (crop) {
        context.drawImage(
          image,
          crop.sx,
          crop.sy,
          crop.sw,
          crop.sh,
          0,
          0,
          crop.sw,
          crop.sh,
        );
      } else {
        context.drawImage(image, 0, 0);
      }

      const type = crop?.type === "PNG" ? "image/png" : "image/jpeg";
      resolve(canvas.toDataURL(type, 0.98));
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
  } = options;

  doc.setFont("courier", "bold");
  doc.setFontSize(fontSize);
  doc.setTextColor(...COLORS.ink);
  doc.text(`${label}:`, x, y);

  const textWidth = doc.getTextWidth(`${label}:`);
  const lineStart = x + textWidth + 2;
  const lineEnd = x + width;
  drawDottedLine(doc, lineStart, y + lineYOffset, lineEnd);

  if (!hasValue(value)) {
    return;
  }

  const safeValue = String(value).trim();
  doc.setFont("courier", "bold");

  if (align === "right") {
    doc.text(safeValue, lineEnd - 0.6, y, { align: "right" });
    return;
  }

  doc.text(safeValue, lineStart + 1, y);
}

function drawHistoryItem(doc, label, x, y, checked) {
  doc.setDrawColor(...COLORS.ink);
  doc.setLineWidth(0.32);
  doc.circle(x, y - 0.8, 1.8);

  if (checked) {
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.text("X", x, y, { align: "center" });
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
    doc.addImage(watermarkLogo, "PNG", 27, 105, 145, 67, undefined, "FAST");
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
  doc.setFontSize(19);
  doc.text(doctor.name, 48, 14, { align: "center" });

  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.45);
  doc.line(22, 18, 74, 18);

  doc.setFont("courier", "bold");
  doc.setFontSize(8.3);
  doc.text((doctor.degree || "").toUpperCase(), 48, 22, { align: "center" });

  const specializationLines = doc.splitTextToSize((doctor.specialization || "").toUpperCase(), 62);
  doc.text(specializationLines, 48, 26, { align: "center" });

  let currentY = 26 + specializationLines.length * 4.2;

  if (hasValue(doctor.fellowship)) {
    doc.text(String(doctor.fellowship), 48, currentY, { align: "center" });
    currentY += 4.2;
  }

  doc.text(`Reg. No. ${doctor.regNo || ""}`, 48, currentY, { align: "center" });

  if (headerLogo) {
    doc.addImage(headerLogo, "PNG", 128, 3, 67, 30, undefined, "FAST");
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

  drawFieldLine(doc, "Date", printedDate, 4, 55, 45);
  doc.setFont("courier", "bold");
  doc.setFontSize(8.4);
  doc.text("||", 48.5, 55);
  drawFieldLine(doc, "Name", patientName, 53, 55, 149);
  doc.text("||", 149.5, 55);
  drawFieldLine(doc, "Age/Sex", ageSex, 153, 55, 198, { align: "right" });

  drawFieldLine(doc, "GCS", formData.gcs, 0.8, 67, 52);
  drawFieldLine(doc, "BP", formData.bp, 55, 67, 109);
  drawFieldLine(doc, "PR", formData.pr, 116, 67, 159);
  drawFieldLine(doc, "RR", formData.rr, 166, 67, 202);

  drawFieldLine(doc, "RBS", formData.rbs, 0.8, 79, 52);
  drawFieldLine(doc, "Height", formData.height, 54, 79, 95);
  drawFieldLine(doc, "Weight", formData.weight, 100, 79, 147);
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

  const commentsText = formData.comments || formData.message;
  if (hasValue(commentsText)) {
    drawWrappedValue(doc, commentsText, 159, 153, 33, { fontSize: 7.3, maxLines: 4, lineHeight: 3.2 });
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

  if (hasValue(formData.message) && !hasValue(formData.comments)) {
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
    loadCroppedImageDataUrl(templateImageSrc, IMAGE_CROPS.headerLogo),
    loadCroppedImageDataUrl(templateImageSrc, IMAGE_CROPS.watermarkLogo),
  ]);

  drawTemplate(doc, doctor, formData, patientName, ageSex, headerLogo, watermarkLogo);
  doc.save(getFileName(formData.firstName, formData.lastName));
}
