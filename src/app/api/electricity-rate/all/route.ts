// ============================================
// GET /api/electricity-rate/all
// Returns all electricity rates with USD equivalents
// ============================================

import { NextResponse } from "next/server";

interface RateEntry {
  country: string;
  rate_per_kwh: number;
  currency: string;
  usd_per_kwh: number;
  flag: string;
  region: string;
}

/** Approximate exchange rates to USD (2024) */
const TO_USD: Record<string, number> = {
  "₹": 1 / 83,
  "¥": 1 / 150,
  "₩": 1 / 1350,
  "S$": 0.74,
  Rp: 1 / 15700,
  RM: 0.21,
  "฿": 0.028,
  "₫": 1 / 25000,
  "₱": 0.018,
  "₨": 0.0036,
  "৳": 0.0083,
  Rs: 0.003,
  AED: 0.27,
  SAR: 0.27,
  QAR: 0.27,
  KWD: 3.25,
  IRR: 1 / 42000,
  IQD: 1 / 1310,
  "₪": 0.27,
  "£": 1.27,
  "€": 1.08,
  kr: 0.095,
  CHF: 1.13,
  "zł": 0.25,
  "Kč": 0.043,
  Ft: 0.0028,
  lei: 0.22,
  "₽": 0.011,
  "₺": 0.031,
  "₴": 0.024,
  $: 1,
  "C$": 0.74,
  "MX$": 0.058,
  "R$": 0.2,
  "AR$": 0.001,
  COP: 0.00025,
  CLP: 0.001,
  "S/": 0.27,
  R: 0.053,
  "₦": 0.00063,
  "E£": 0.021,
  KSh: 0.0065,
  "GH₵": 0.064,
  ETB: 0.017,
  "A$": 0.65,
  "NZ$": 0.6,
};

const ALL_RATES: RateEntry[] = [
  // — Asia —
  { country: "India", rate_per_kwh: 8.0, currency: "₹", usd_per_kwh: 0, flag: "🇮🇳", region: "Asia" },
  { country: "Japan", rate_per_kwh: 31.0, currency: "¥", usd_per_kwh: 0, flag: "🇯🇵", region: "Asia" },
  { country: "China", rate_per_kwh: 0.54, currency: "¥", usd_per_kwh: 0, flag: "🇨🇳", region: "Asia" },
  { country: "South Korea", rate_per_kwh: 120.0, currency: "₩", usd_per_kwh: 0, flag: "🇰🇷", region: "Asia" },
  { country: "Singapore", rate_per_kwh: 0.33, currency: "S$", usd_per_kwh: 0, flag: "🇸🇬", region: "Asia" },
  { country: "Indonesia", rate_per_kwh: 1444.0, currency: "Rp", usd_per_kwh: 0, flag: "🇮🇩", region: "Asia" },
  { country: "Malaysia", rate_per_kwh: 0.57, currency: "RM", usd_per_kwh: 0, flag: "🇲🇾", region: "Asia" },
  { country: "Thailand", rate_per_kwh: 4.18, currency: "฿", usd_per_kwh: 0, flag: "🇹🇭", region: "Asia" },
  { country: "Vietnam", rate_per_kwh: 2870.0, currency: "₫", usd_per_kwh: 0, flag: "🇻🇳", region: "Asia" },
  { country: "Philippines", rate_per_kwh: 11.5, currency: "₱", usd_per_kwh: 0, flag: "🇵🇭", region: "Asia" },
  { country: "Pakistan", rate_per_kwh: 55.0, currency: "₨", usd_per_kwh: 0, flag: "🇵🇰", region: "Asia" },
  { country: "Bangladesh", rate_per_kwh: 9.0, currency: "৳", usd_per_kwh: 0, flag: "🇧🇩", region: "Asia" },
  { country: "Sri Lanka", rate_per_kwh: 50.0, currency: "Rs", usd_per_kwh: 0, flag: "🇱🇰", region: "Asia" },
  { country: "Nepal", rate_per_kwh: 12.0, currency: "Rs", usd_per_kwh: 0, flag: "🇳🇵", region: "Asia" },

  // — Middle East —
  { country: "UAE", rate_per_kwh: 0.38, currency: "AED", usd_per_kwh: 0, flag: "🇦🇪", region: "Middle East" },
  { country: "Saudi Arabia", rate_per_kwh: 0.18, currency: "SAR", usd_per_kwh: 0, flag: "🇸🇦", region: "Middle East" },
  { country: "Qatar", rate_per_kwh: 0.08, currency: "QAR", usd_per_kwh: 0, flag: "🇶🇦", region: "Middle East" },
  { country: "Kuwait", rate_per_kwh: 0.007, currency: "KWD", usd_per_kwh: 0, flag: "🇰🇼", region: "Middle East" },
  { country: "Israel", rate_per_kwh: 0.58, currency: "₪", usd_per_kwh: 0, flag: "🇮🇱", region: "Middle East" },

  // — Europe —
  { country: "United Kingdom", rate_per_kwh: 0.34, currency: "£", usd_per_kwh: 0, flag: "🇬🇧", region: "Europe" },
  { country: "Germany", rate_per_kwh: 0.39, currency: "€", usd_per_kwh: 0, flag: "🇩🇪", region: "Europe" },
  { country: "France", rate_per_kwh: 0.26, currency: "€", usd_per_kwh: 0, flag: "🇫🇷", region: "Europe" },
  { country: "Italy", rate_per_kwh: 0.32, currency: "€", usd_per_kwh: 0, flag: "🇮🇹", region: "Europe" },
  { country: "Spain", rate_per_kwh: 0.28, currency: "€", usd_per_kwh: 0, flag: "🇪🇸", region: "Europe" },
  { country: "Netherlands", rate_per_kwh: 0.4, currency: "€", usd_per_kwh: 0, flag: "🇳🇱", region: "Europe" },
  { country: "Belgium", rate_per_kwh: 0.36, currency: "€", usd_per_kwh: 0, flag: "🇧🇪", region: "Europe" },
  { country: "Sweden", rate_per_kwh: 1.8, currency: "kr", usd_per_kwh: 0, flag: "🇸🇪", region: "Europe" },
  { country: "Norway", rate_per_kwh: 1.5, currency: "kr", usd_per_kwh: 0, flag: "🇳🇴", region: "Europe" },
  { country: "Denmark", rate_per_kwh: 2.9, currency: "kr", usd_per_kwh: 0, flag: "🇩🇰", region: "Europe" },
  { country: "Finland", rate_per_kwh: 0.18, currency: "€", usd_per_kwh: 0, flag: "🇫🇮", region: "Europe" },
  { country: "Switzerland", rate_per_kwh: 0.27, currency: "CHF", usd_per_kwh: 0, flag: "🇨🇭", region: "Europe" },
  { country: "Austria", rate_per_kwh: 0.3, currency: "€", usd_per_kwh: 0, flag: "🇦🇹", region: "Europe" },
  { country: "Portugal", rate_per_kwh: 0.24, currency: "€", usd_per_kwh: 0, flag: "🇵🇹", region: "Europe" },
  { country: "Ireland", rate_per_kwh: 0.35, currency: "€", usd_per_kwh: 0, flag: "🇮🇪", region: "Europe" },
  { country: "Poland", rate_per_kwh: 1.1, currency: "zł", usd_per_kwh: 0, flag: "🇵🇱", region: "Europe" },
  { country: "Greece", rate_per_kwh: 0.25, currency: "€", usd_per_kwh: 0, flag: "🇬🇷", region: "Europe" },
  { country: "Turkey", rate_per_kwh: 4.7, currency: "₺", usd_per_kwh: 0, flag: "🇹🇷", region: "Europe" },

  // — Americas —
  { country: "United States", rate_per_kwh: 0.16, currency: "$", usd_per_kwh: 0.16, flag: "🇺🇸", region: "Americas" },
  { country: "Canada", rate_per_kwh: 0.17, currency: "C$", usd_per_kwh: 0, flag: "🇨🇦", region: "Americas" },
  { country: "Mexico", rate_per_kwh: 1.5, currency: "MX$", usd_per_kwh: 0, flag: "🇲🇽", region: "Americas" },
  { country: "Brazil", rate_per_kwh: 0.78, currency: "R$", usd_per_kwh: 0, flag: "🇧🇷", region: "Americas" },
  { country: "Argentina", rate_per_kwh: 75.0, currency: "AR$", usd_per_kwh: 0, flag: "🇦🇷", region: "Americas" },
  { country: "Colombia", rate_per_kwh: 800.0, currency: "COP", usd_per_kwh: 0, flag: "🇨🇴", region: "Americas" },
  { country: "Chile", rate_per_kwh: 150.0, currency: "CLP", usd_per_kwh: 0, flag: "🇨🇱", region: "Americas" },
  { country: "Peru", rate_per_kwh: 0.72, currency: "S/", usd_per_kwh: 0, flag: "🇵🇪", region: "Americas" },

  // — Africa —
  { country: "South Africa", rate_per_kwh: 3.6, currency: "R", usd_per_kwh: 0, flag: "🇿🇦", region: "Africa" },
  { country: "Nigeria", rate_per_kwh: 68.0, currency: "₦", usd_per_kwh: 0, flag: "🇳🇬", region: "Africa" },
  { country: "Egypt", rate_per_kwh: 2.5, currency: "E£", usd_per_kwh: 0, flag: "🇪🇬", region: "Africa" },
  { country: "Kenya", rate_per_kwh: 25.0, currency: "KSh", usd_per_kwh: 0, flag: "🇰🇪", region: "Africa" },
  { country: "Ghana", rate_per_kwh: 1.8, currency: "GH₵", usd_per_kwh: 0, flag: "🇬🇭", region: "Africa" },
  { country: "Ethiopia", rate_per_kwh: 0.9, currency: "ETB", usd_per_kwh: 0, flag: "🇪🇹", region: "Africa" },

  // — Oceania —
  { country: "Australia", rate_per_kwh: 0.35, currency: "A$", usd_per_kwh: 0, flag: "🇦🇺", region: "Oceania" },
  { country: "New Zealand", rate_per_kwh: 0.37, currency: "NZ$", usd_per_kwh: 0, flag: "🇳🇿", region: "Oceania" },
];

// Compute USD equivalents
ALL_RATES.forEach((r) => {
  if (r.usd_per_kwh === 0) {
    const toUsd = TO_USD[r.currency] ?? 1;
    r.usd_per_kwh = Math.round(r.rate_per_kwh * toUsd * 10000) / 10000;
  }
});

export async function GET() {
  return NextResponse.json(
    {
      count: ALL_RATES.length,
      last_updated: new Date().toISOString(),
      rates: ALL_RATES,
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
