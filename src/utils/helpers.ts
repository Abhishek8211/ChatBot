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
