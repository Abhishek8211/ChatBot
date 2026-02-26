// ============================================
// GET /api/electricity-rate
// Returns electricity rates by country in local currency
// Data sourced from GlobalPetrolPrices, IEA & Statista (2024)
// ============================================

import { NextResponse } from "next/server";

interface RateEntry {
  country: string;
  rate_per_kwh: number;
  currency: string;
}

/**
 * Comprehensive electricity rates in LOCAL currency per kWh.
 * Residential averages, updated to reflect 2024 data.
 */
const ELECTRICITY_RATES: Record<string, RateEntry> = {
  // — Asia —
  india: { country: "India", rate_per_kwh: 8.0, currency: "₹" },
  japan: { country: "Japan", rate_per_kwh: 31.0, currency: "¥" },
  china: { country: "China", rate_per_kwh: 0.54, currency: "¥" },
  "south korea": { country: "South Korea", rate_per_kwh: 120.0, currency: "₩" },
  singapore: { country: "Singapore", rate_per_kwh: 0.33, currency: "S$" },
  indonesia: { country: "Indonesia", rate_per_kwh: 1444.0, currency: "Rp" },
  malaysia: { country: "Malaysia", rate_per_kwh: 0.57, currency: "RM" },
  thailand: { country: "Thailand", rate_per_kwh: 4.18, currency: "฿" },
  vietnam: { country: "Vietnam", rate_per_kwh: 2870.0, currency: "₫" },
  philippines: { country: "Philippines", rate_per_kwh: 11.5, currency: "₱" },
  pakistan: { country: "Pakistan", rate_per_kwh: 55.0, currency: "₨" },
  bangladesh: { country: "Bangladesh", rate_per_kwh: 9.0, currency: "৳" },
  "sri lanka": { country: "Sri Lanka", rate_per_kwh: 50.0, currency: "Rs" },
  nepal: { country: "Nepal", rate_per_kwh: 12.0, currency: "Rs" },

  // — Middle East —
  uae: { country: "UAE", rate_per_kwh: 0.38, currency: "AED" },
  "united arab emirates": {
    country: "UAE",
    rate_per_kwh: 0.38,
    currency: "AED",
  },
  "saudi arabia": {
    country: "Saudi Arabia",
    rate_per_kwh: 0.18,
    currency: "SAR",
  },
  qatar: { country: "Qatar", rate_per_kwh: 0.08, currency: "QAR" },
  kuwait: { country: "Kuwait", rate_per_kwh: 0.007, currency: "KWD" },
  iran: { country: "Iran", rate_per_kwh: 3200.0, currency: "IRR" },
  iraq: { country: "Iraq", rate_per_kwh: 40.0, currency: "IQD" },
  israel: { country: "Israel", rate_per_kwh: 0.58, currency: "₪" },

  // — Europe —
  "united kingdom": {
    country: "United Kingdom",
    rate_per_kwh: 0.34,
    currency: "£",
  },
  uk: { country: "United Kingdom", rate_per_kwh: 0.34, currency: "£" },
  germany: { country: "Germany", rate_per_kwh: 0.39, currency: "€" },
  france: { country: "France", rate_per_kwh: 0.26, currency: "€" },
  italy: { country: "Italy", rate_per_kwh: 0.32, currency: "€" },
  spain: { country: "Spain", rate_per_kwh: 0.28, currency: "€" },
  netherlands: { country: "Netherlands", rate_per_kwh: 0.4, currency: "€" },
  belgium: { country: "Belgium", rate_per_kwh: 0.36, currency: "€" },
  sweden: { country: "Sweden", rate_per_kwh: 1.8, currency: "kr" },
  norway: { country: "Norway", rate_per_kwh: 1.5, currency: "kr" },
  denmark: { country: "Denmark", rate_per_kwh: 2.9, currency: "kr" },
  finland: { country: "Finland", rate_per_kwh: 0.18, currency: "€" },
  switzerland: { country: "Switzerland", rate_per_kwh: 0.27, currency: "CHF" },
  austria: { country: "Austria", rate_per_kwh: 0.3, currency: "€" },
  portugal: { country: "Portugal", rate_per_kwh: 0.24, currency: "€" },
  ireland: { country: "Ireland", rate_per_kwh: 0.35, currency: "€" },
  poland: { country: "Poland", rate_per_kwh: 1.1, currency: "zł" },
  greece: { country: "Greece", rate_per_kwh: 0.25, currency: "€" },
  czech: { country: "Czech Republic", rate_per_kwh: 6.5, currency: "Kč" },
  "czech republic": {
    country: "Czech Republic",
    rate_per_kwh: 6.5,
    currency: "Kč",
  },
  hungary: { country: "Hungary", rate_per_kwh: 46.0, currency: "Ft" },
  romania: { country: "Romania", rate_per_kwh: 1.3, currency: "lei" },
  russia: { country: "Russia", rate_per_kwh: 5.4, currency: "₽" },
  turkey: { country: "Turkey", rate_per_kwh: 4.7, currency: "₺" },
  ukraine: { country: "Ukraine", rate_per_kwh: 2.64, currency: "₴" },

  // — Americas —
  "united states": {
    country: "United States",
    rate_per_kwh: 0.16,
    currency: "$",
  },
  usa: { country: "United States", rate_per_kwh: 0.16, currency: "$" },
  canada: { country: "Canada", rate_per_kwh: 0.17, currency: "C$" },
  mexico: { country: "Mexico", rate_per_kwh: 1.5, currency: "MX$" },
  brazil: { country: "Brazil", rate_per_kwh: 0.78, currency: "R$" },
  argentina: { country: "Argentina", rate_per_kwh: 75.0, currency: "AR$" },
  colombia: { country: "Colombia", rate_per_kwh: 800.0, currency: "COP" },
  chile: { country: "Chile", rate_per_kwh: 150.0, currency: "CLP" },
  peru: { country: "Peru", rate_per_kwh: 0.72, currency: "S/" },

  // — Africa —
  "south africa": { country: "South Africa", rate_per_kwh: 3.6, currency: "R" },
  nigeria: { country: "Nigeria", rate_per_kwh: 68.0, currency: "₦" },
  egypt: { country: "Egypt", rate_per_kwh: 2.5, currency: "E£" },
  kenya: { country: "Kenya", rate_per_kwh: 25.0, currency: "KSh" },
  ghana: { country: "Ghana", rate_per_kwh: 1.8, currency: "GH₵" },
  ethiopia: { country: "Ethiopia", rate_per_kwh: 0.9, currency: "ETB" },

  // — Oceania —
  australia: { country: "Australia", rate_per_kwh: 0.35, currency: "A$" },
  "new zealand": {
    country: "New Zealand",
    rate_per_kwh: 0.37,
    currency: "NZ$",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toLowerCase().trim() || "india";

  const rate = ELECTRICITY_RATES[country] ?? ELECTRICITY_RATES.india;

  return NextResponse.json(
    {
      country: rate.country,
      rate_per_kwh: rate.rate_per_kwh,
      currency: rate.currency,
      last_updated: new Date().toISOString(),
      source: country in ELECTRICITY_RATES ? "database" : "default",
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
