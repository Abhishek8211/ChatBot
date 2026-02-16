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

/** Tooltip education data for each device type */
export const DEVICE_TOOLTIPS: Record<
  DeviceType,
  { avgWattage: string; tip: string; funFact: string }
> = {
  AC: {
    avgWattage: "1000–2500W",
    tip: "Set to 24°C to save ~6% per degree",
    funFact: "ACs consume 40-60% of household electricity",
  },
  Fan: {
    avgWattage: "50–100W",
    tip: "Use instead of AC on mild days to save big",
    funFact: "A fan uses 20x less energy than an AC",
  },
  TV: {
    avgWattage: "80–200W",
    tip: "Lower brightness by 30% to save energy",
    funFact: "Standby mode still draws 5-10W constantly",
  },
  Refrigerator: {
    avgWattage: "100–400W",
    tip: "Keep it 3/4 full and away from heat sources",
    funFact: "Runs 24/7 — often #1 energy consumer",
  },
  "Washing Machine": {
    avgWattage: "400–600W",
    tip: "Use cold water cycles to cut energy by 90%",
    funFact: "80% of energy goes to heating water",
  },
  Microwave: {
    avgWattage: "800–1500W",
    tip: "More efficient than ovens for reheating food",
    funFact: "Uses 80% less energy than a conventional oven",
  },
  "Water Heater": {
    avgWattage: "2000–4500W",
    tip: "Set to 50°C max; insulate the tank",
    funFact: "Accounts for 15-25% of home energy use",
  },
  "Light Bulb": {
    avgWattage: "10–100W",
    tip: "Switch to LED — saves 75% vs incandescent",
    funFact: "LEDs last 25x longer than traditional bulbs",
  },
  Computer: {
    avgWattage: "100–500W",
    tip: "Enable sleep mode when idle for 15+ minutes",
    funFact: "Laptops use 80% less energy than desktops",
  },
  Iron: {
    avgWattage: "800–1200W",
    tip: "Iron clothes in bulk to minimize heat-up cycles",
    funFact: "One of the highest per-minute energy users",
  },
  "Hair Dryer": {
    avgWattage: "1200–2000W",
    tip: "Towel-dry first to cut drying time in half",
    funFact: "Draws more power than most kitchen appliances",
  },
  Dishwasher: {
    avgWattage: "1200–2400W",
    tip: "Run only full loads & skip heated dry cycle",
    funFact: "Uses less water than hand-washing dishes",
  },
  "Electric Stove": {
    avgWattage: "1500–3000W",
    tip: "Use lids on pots to cook 25% faster",
    funFact: "Induction stoves are 90% energy-efficient",
  },
  Router: {
    avgWattage: "5–20W",
    tip: "Schedule auto-off during sleeping hours",
    funFact: "Always-on but very low power draw",
  },
  "Phone Charger": {
    avgWattage: "3–10W",
    tip: "Unplug when done — phantom draw adds up",
    funFact: "Leaving plugged in wastes ~0.5 kWh/month",
  },
};

/** AI-powered suggestion rules per device type */
export const AI_SUGGESTION_RULES: Record<DeviceType, string[]> = {
  AC: [
    "Consider upgrading to a 5-star inverter AC — saves up to 40% energy",
    "Use AC with ceiling fans to circulate cool air more efficiently",
    "Clean AC filters monthly for 15% better efficiency",
    "Use a smart thermostat to auto-adjust temperature",
  ],
  Fan: [
    "BLDC fans consume 65% less energy than regular fans",
    "Use timer to auto-off fans when you leave the room",
  ],
  TV: [
    "Enable eco-mode in TV settings to reduce power by 30%",
    "Use a smart power strip to eliminate standby drain",
    "Smaller screen sizes consume significantly less power",
  ],
  Refrigerator: [
    "Upgrading to a 5-star fridge can save ₹2000–3000/year",
    "Let hot food cool before placing in the fridge",
    "Check door seals — poor seals waste 20% energy",
  ],
  "Washing Machine": [
    "Front-load machines use 50% less water and energy",
    "Wash with cold water — most modern detergents work fine",
    "Run full loads instead of multiple small loads",
  ],
  Microwave: [
    "Use microwave for reheating instead of stovetop — much faster",
    "Defrost food in fridge overnight instead of using microwave",
  ],
  "Water Heater": [
    "Install a solar water heater — pays for itself in 2-3 years",
    "Use a timer to heat water only when needed",
    "Insulate hot water pipes to prevent heat loss",
  ],
  "Light Bulb": [
    "Replace ALL incandescent bulbs with LED immediately",
    "Use motion sensors in bathrooms and hallways",
    "Maximize natural daylight — open curtains during the day",
  ],
  Computer: [
    "Use laptop instead of desktop when possible — saves 80% energy",
    "Enable power-saving mode in OS settings",
    "Turn off monitor when stepping away for 10+ minutes",
  ],
  Iron: [
    "Iron clothes in one batch to avoid multiple heat-up cycles",
    "Use appropriate temperature for fabric type",
    "Iron slightly damp clothes for faster results",
  ],
  "Hair Dryer": [
    "Air-dry hair partially before using the dryer",
    "Use lower heat settings — they use less power",
  ],
  Dishwasher: [
    "Skip the heated dry cycle — air dry instead",
    "Run only when fully loaded to maximize efficiency",
    "Use eco-mode for daily washes",
  ],
  "Electric Stove": [
    "Switch to induction cooktop — 90% efficient vs 65% for coil",
    "Match pot size to burner size to avoid energy waste",
    "Use pressure cooker to reduce cooking time by 70%",
  ],
  Router: [
    "Schedule router auto-off at night if not needed 24/7",
    "Newer routers are more energy-efficient — consider upgrading",
  ],
  "Phone Charger": [
    "Unplug chargers when not in use — they still draw power",
    "Use a smart plug to auto-cut power when device is full",
  ],
};
