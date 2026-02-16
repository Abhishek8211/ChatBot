// ============================================
// PDF Report Generation Utility
// ============================================

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CalculationResult } from "./types";
import { DEVICE_ICONS } from "./constants";
import { formatCurrency, formatKwh } from "./helpers";

/**
 * Generate and download a PDF report from a calculation result
 */
export function downloadReport(result: CalculationResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(22);
  doc.setTextColor(32, 201, 151);
  doc.text("Smart Energy Report", pageWidth / 2, 20, { align: "center" });

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${new Date(result.timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    pageWidth / 2,
    28,
    { align: "center" },
  );

  // Summary section
  doc.setFontSize(14);
  doc.setTextColor(51, 154, 240);
  doc.text("Summary", 14, 42);

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Country: ${result.country}`, 14, 52);
  doc.text(
    `Electricity Rate: ${formatCurrency(result.ratePerKwh, result.currency)}/kWh`,
    14,
    59,
  );
  doc.text(`Total Daily Usage: ${formatKwh(result.totalDailyKwh)}`, 14, 66);
  doc.text(`Total Monthly Usage: ${formatKwh(result.totalMonthlyKwh)}`, 14, 73);

  doc.setFontSize(13);
  doc.setTextColor(32, 201, 151);
  doc.text(
    `Estimated Monthly Cost: ${formatCurrency(result.totalMonthlyCost, result.currency)}`,
    14,
    83,
  );

  // Device breakdown table
  doc.setFontSize(14);
  doc.setTextColor(51, 154, 240);
  doc.text("Device Breakdown", 14, 98);

  const tableData = result.devices.map((d) => [
    `${DEVICE_ICONS[d.device.type]} ${d.device.type}`,
    d.device.quantity.toString(),
    `${d.device.wattage}W`,
    `${d.device.hoursPerDay}h/day`,
    formatKwh(d.monthlyKwh),
    formatCurrency(d.monthlyCost, result.currency),
    `${d.percentage}%`,
  ]);

  autoTable(doc, {
    startY: 103,
    head: [
      ["Device", "Qty", "Wattage", "Hours", "Monthly kWh", "Cost", "Share"],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [32, 201, 151],
      textColor: [255, 255, 255],
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [60, 60, 60],
    },
    alternateRowStyles: {
      fillColor: [240, 248, 245],
    },
  });

  // Energy saving tips
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;
  if (finalY + 40 < doc.internal.pageSize.getHeight()) {
    doc.setFontSize(14);
    doc.setTextColor(51, 154, 240);
    doc.text("Energy Saving Tips", 14, finalY + 15);

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const tips = [
      "• Switch to LED bulbs to save up to 75% on lighting.",
      "• Set AC to 24°C — each degree saves ~6% energy.",
      "• Unplug idle devices to avoid phantom loads (5-10% of bill).",
      "• Use ceiling fans instead of AC when possible.",
      "• Run washing machines only with full loads.",
    ];
    tips.forEach((tip, i) => {
      doc.text(tip, 14, finalY + 25 + i * 7);
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(
    "Smart Energy Calculator — Reduce your carbon footprint 🌿",
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" },
  );

  // Download
  doc.save(`energy-report-${result.id}.pdf`);
}
