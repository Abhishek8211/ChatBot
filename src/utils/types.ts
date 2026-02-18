// ============================================
// Type definitions for Smart Energy Calculator
// ============================================

/** Available appliance device types */
export type DeviceType =
  | "AC"
  | "Fan"
  | "TV"
  | "Refrigerator"
  | "Washing Machine"
  | "Microwave"
  | "Water Heater"
  | "Light Bulb"
  | "Computer"
  | "Iron"
  | "Hair Dryer"
  | "Dishwasher"
  | "Electric Stove"
  | "Router"
  | "Phone Charger";

/** A single appliance device entry */
export interface Device {
  id: string;
  type: DeviceType;
  quantity: number;
  wattage: number;
  hoursPerDay: number;
}

/** Calculation result for a single device */
export interface DeviceResult {
  device: Device;
  dailyKwh: number;
  monthlyKwh: number;
  monthlyCost: number;
  percentage: number;
}

/** Full calculation result */
export interface CalculationResult {
  id: string;
  timestamp: string;
  devices: DeviceResult[];
  totalDailyKwh: number;
  totalMonthlyKwh: number;
  totalMonthlyCost: number;
  ratePerKwh: number;
  currency: string;
  country: string;
}

/** Electricity rate API response */
export interface ElectricityRate {
  country: string;
  rate_per_kwh: number;
  currency: string;
  last_updated: string;
}

/** Chat message in the chatbot */
export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: Date;
  options?: string[];
  isTyping?: boolean;
}

/** Chatbot conversation state */
export type ChatStep =
  | "greeting"
  | "ask_device_count"
  | "ask_device_type"
  | "ask_quantity"
  | "ask_wattage"
  | "ask_hours"
  | "confirm_device"
  | "add_more"
  | "calculating"
  | "result"
  | "tips"
  | "free_ask";

/** Energy saving tip */
export interface EnergySavingTip {
  icon: string;
  title: string;
  description: string;
}

/** Navigation item */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
