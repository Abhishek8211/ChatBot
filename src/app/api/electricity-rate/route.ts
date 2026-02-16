// ============================================
// GET /api/electricity-rate
// Returns electricity tariff rate data
// ============================================

import { NextResponse } from "next/server";

interface RateData {
  country: string;
  rate_per_kwh: number;
  currency: string;
  last_updated: string;
}

/** Electricity rates by country (mock data) */
const RATES: Record<string, RateData> = {
  india: {
    country: "India",
    rate_per_kwh: 8,
    currency: "₹",
    last_updated: new Date().toISOString(),
  },
  usa: {
    country: "United States",
    rate_per_kwh: 0.16,
    currency: "$",
    last_updated: new Date().toISOString(),
  },
  uk: {
    country: "United Kingdom",
    rate_per_kwh: 0.34,
    currency: "£",
    last_updated: new Date().toISOString(),
  },
  germany: {
    country: "Germany",
    rate_per_kwh: 0.39,
    currency: "€",
    last_updated: new Date().toISOString(),
  },
  australia: {
    country: "Australia",
    rate_per_kwh: 0.33,
    currency: "A$",
    last_updated: new Date().toISOString(),
  },
  canada: {
    country: "Canada",
    rate_per_kwh: 0.13,
    currency: "C$",
    last_updated: new Date().toISOString(),
  },
  japan: {
    country: "Japan",
    rate_per_kwh: 30,
    currency: "¥",
    last_updated: new Date().toISOString(),
  },
  brazil: {
    country: "Brazil",
    rate_per_kwh: 0.78,
    currency: "R$",
    last_updated: new Date().toISOString(),
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toLowerCase() || "india";

  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 300));

  const rate = RATES[country] || RATES.india;

  return NextResponse.json(rate, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
