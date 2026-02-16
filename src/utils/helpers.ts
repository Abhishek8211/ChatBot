// ============================================
// Calculation & helper utilities
// ============================================

import { Device, DeviceResult, CalculationResult } from "./types";
import {
  DAYS_IN_MONTH,
  HISTORY_STORAGE_KEY,
  MAX_HISTORY_ENTRIES,
} from "./constants";

/**
 * Calculate energy consumption for a single device
 * Formula: Energy (kWh) = (Watt × Hours × Days) / 1000
 */
export function calculateDeviceEnergy(device: Device): {
  dailyKwh: number;
  monthlyKwh: number;
} {
  const totalWatts = device.wattage * device.quantity;
  const dailyKwh = (totalWatts * device.hoursPerDay) / 1000;
  const monthlyKwh = dailyKwh * DAYS_IN_MONTH;

  return {
    dailyKwh: Math.round(dailyKwh * 100) / 100,
    monthlyKwh: Math.round(monthlyKwh * 100) / 100,
  };
}

/**
 * Calculate full result for all devices
 */
export function calculateAllDevices(
  devices: Device[],
  ratePerKwh: number,
  currency: string,
  country: string,
): CalculationResult {
  let totalDailyKwh = 0;
  let totalMonthlyKwh = 0;

  const deviceResults: DeviceResult[] = devices.map((device) => {
    const { dailyKwh, monthlyKwh } = calculateDeviceEnergy(device);
    totalDailyKwh += dailyKwh;
    totalMonthlyKwh += monthlyKwh;

    return {
      device,
      dailyKwh,
      monthlyKwh,
      monthlyCost: 0,
      percentage: 0,
    };
  });

  // Calculate costs and percentages
  const totalMonthlyCost = Math.round(totalMonthlyKwh * ratePerKwh * 100) / 100;

  deviceResults.forEach((result) => {
    result.monthlyCost = Math.round(result.monthlyKwh * ratePerKwh * 100) / 100;
    result.percentage =
      totalMonthlyKwh > 0
        ? Math.round((result.monthlyKwh / totalMonthlyKwh) * 10000) / 100
        : 0;
  });

  return {
    id: generateId(),
    timestamp: new Date().toISOString(),
    devices: deviceResults,
    totalDailyKwh: Math.round(totalDailyKwh * 100) / 100,
    totalMonthlyKwh: Math.round(totalMonthlyKwh * 100) / 100,
    totalMonthlyCost,
    ratePerKwh,
    currency,
    country,
  };
}

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Format currency value */
export function formatCurrency(amount: number, currency: string = "₹"): string {
  return `${currency}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Format kWh value */
export function formatKwh(kwh: number): string {
  return `${kwh.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kWh`;
}

// ----- Local Storage Helpers -----

/** Save calculation result to history */
export function saveToHistory(result: CalculationResult): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    history.unshift(result);
    if (history.length > MAX_HISTORY_ENTRIES) {
      history.splice(MAX_HISTORY_ENTRIES);
    }
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

/** Get calculation history */
export function getHistory(): CalculationResult[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Clear calculation history */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

/** Delete a single history entry */
export function deleteHistoryEntry(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

// ----- CSV Export -----

/** Export calculation result to CSV and trigger download */
export function exportToCSV(result: CalculationResult): void {
  const headers = [
    "Device",
    "Quantity",
    "Wattage (W)",
    "Hours/Day",
    "Daily kWh",
    "Monthly kWh",
    "Monthly Cost",
    "Share (%)",
  ];
  const rows: (string | number)[][] = result.devices.map((d) => [
    d.device.type,
    d.device.quantity,
    d.device.wattage,
    d.device.hoursPerDay,
    d.dailyKwh,
    d.monthlyKwh,
    d.monthlyCost,
    d.percentage,
  ]);

  // Add summary row
  rows.push([]);
  rows.push([
    "TOTAL",
    "",
    "",
    "",
    result.totalDailyKwh,
    result.totalMonthlyKwh,
    result.totalMonthlyCost,
    "100",
  ]);
  rows.push([]);
  rows.push(["Rate per kWh", result.ratePerKwh]);
  rows.push(["Currency", result.currency]);
  rows.push(["Country", result.country]);
  rows.push(["Date", new Date(result.timestamp).toLocaleDateString()]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n",
  );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `energy-report-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ----- Share Helpers -----

/** Generate Twitter share URL from calculation result */
export function getTwitterShareUrl(result: CalculationResult): string {
  const text = `⚡ My monthly energy consumption: ${result.totalMonthlyKwh} kWh costing ${result.currency}${result.totalMonthlyCost}\n\n📊 ${result.devices.length} devices tracked\n🌍 Rate: ${result.currency}${result.ratePerKwh}/kWh (${result.country})\n\nCalculate yours at`;
  const url =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://energyiq.vercel.app";
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

/** Capture an element as image and download it */
export async function shareAsImage(elementId: string): Promise<void> {
  try {
    const { default: html2canvas } = await import("html2canvas");
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: "#0a0e14",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `energy-report-${new Date().toISOString().split("T")[0]}.png`;
    a.click();
  } catch (err) {
    console.error("Failed to capture image:", err);
  }
}

// ----- Landing Stats -----

/** Get aggregated stats from calculation history for landing page */
export function getAggregatedStats(): {
  totalCalculations: number;
  totalKwhTracked: number;
  totalDevicesTracked: number;
  totalSaved: number;
} {
  const history = getHistory();
  return {
    totalCalculations: history.length,
    totalKwhTracked: Math.round(
      history.reduce((sum, h) => sum + h.totalMonthlyKwh, 0),
    ),
    totalDevicesTracked: history.reduce((sum, h) => sum + h.devices.length, 0),
    totalSaved: Math.round(
      history.reduce((sum, h) => sum + h.totalMonthlyCost * 0.15, 0),
    ),
  };
}
