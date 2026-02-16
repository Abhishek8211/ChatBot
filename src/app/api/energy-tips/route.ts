// ============================================
// GET /api/energy-tips
// Returns random energy-saving tips
// ============================================

import { NextResponse } from "next/server";
import { ENERGY_TIPS } from "@/utils/constants";

export async function GET() {
  // Shuffle tips and return top 4
  const shuffled = [...ENERGY_TIPS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  return NextResponse.json({ tips: selected });
}
