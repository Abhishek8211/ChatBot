// ============================================
// Constants for Smart Energy Calculator
// ============================================

import { DeviceType, EnergySavingTip } from "./types";

/** Default wattage for common appliance types (in Watts) */
export const DEFAULT_WATTAGE: Record<DeviceType, number> = {
  AC: 1500,
  Fan: 75,
  TV: 120,
  Refrigerator: 200,
  "Washing Machine": 500,
  Microwave: 1200,
  "Water Heater": 3000,
  "Light Bulb": 60,
  Computer: 300,
  Iron: 1000,
  "Hair Dryer": 1800,
  Dishwasher: 1800,
  "Electric Stove": 2000,
  Router: 12,
  "Phone Charger": 5,
};

/** Device icons mapping (emoji) */
export const DEVICE_ICONS: Record<DeviceType, string> = {
  AC: "❄️",
  Fan: "🌀",
  TV: "📺",
  Refrigerator: "🧊",
  "Washing Machine": "🧺",
  Microwave: "📡",
  "Water Heater": "🔥",
  "Light Bulb": "💡",
  Computer: "💻",
  Iron: "👔",
  "Hair Dryer": "💇",
  Dishwasher: "🍽️",
  "Electric Stove": "🍳",
  Router: "📶",
  "Phone Charger": "🔌",
};

/** Chart color palette */
export const CHART_COLORS = [
  "#20c997",
  "#339af0",
  "#845ef7",
  "#f06595",
  "#ff922b",
  "#fcc419",
  "#51cf66",
  "#22b8cf",
  "#be4bdb",
  "#ff6b6b",
  "#94d82d",
  "#15aabf",
  "#7950f2",
  "#e64980",
  "#fd7e14",
];

/** All available device types */
export const DEVICE_TYPES: DeviceType[] = [
  "AC",
  "Fan",
  "TV",
  "Refrigerator",
  "Washing Machine",
  "Microwave",
  "Water Heater",
  "Light Bulb",
  "Computer",
  "Iron",
  "Hair Dryer",
  "Dishwasher",
  "Electric Stove",
  "Router",
  "Phone Charger",
];

/** Energy saving tips */
export const ENERGY_TIPS: EnergySavingTip[] = [
  {
    icon: "💡",
    title: "Switch to LED Bulbs",
    description:
      "LED bulbs use up to 75% less energy than incandescent bulbs and last 25x longer.",
  },
  {
    icon: "❄️",
    title: "Optimize AC Temperature",
    description:
      "Set your AC to 24°C instead of 18°C. Each degree saves about 6% energy.",
  },
  {
    icon: "🔌",
    title: "Unplug Idle Devices",
    description:
      "Phantom loads from idle devices can account for 5-10% of your electricity bill.",
  },
  {
    icon: "🌀",
    title: "Use Ceiling Fans",
    description:
      "Ceiling fans use only 75W compared to AC's 1500W. Use fans when possible.",
  },
  {
    icon: "⭐",
    title: "Buy Star-Rated Appliances",
    description:
      "5-star rated appliances consume up to 45% less energy than non-rated ones.",
  },
  {
    icon: "☀️",
    title: "Use Natural Light",
    description:
      "Open curtains during the day to reduce the need for artificial lighting.",
  },
  {
    icon: "🧺",
    title: "Full Load Washing",
    description:
      "Run your washing machine only with full loads to maximize efficiency.",
  },
  {
    icon: "🔥",
    title: "Reduce Water Heating",
    description:
      "Water heaters are energy hogs. Reduce temperature to 50°C and limit usage.",
  },
];

/** Days in a month (average) */
export const DAYS_IN_MONTH = 30;

/** Local storage key for calculation history */
export const HISTORY_STORAGE_KEY = "energy_calc_history";

/** Maximum history entries to keep */
export const MAX_HISTORY_ENTRIES = 50;
