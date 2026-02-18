// ============================================
// POST /api/gemini-tips
// Calls Google Gemini API to generate personalized
// energy-saving tips based on user's device data.
//
// Env var required: GEMINI_API_KEY
// ============================================

import { NextRequest, NextResponse } from "next/server";
import {
  GeminiTipsRequest,
  GeminiTipsResponse,
  buildGeminiPrompt,
  getFallbackTips,
} from "@/utils/geminiPromptBuilder";

// Gemini API endpoint (Gemini 2.0 Flash — fast + cheap)
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(request: NextRequest) {
  try {
    const body: GeminiTipsRequest = await request.json();

    // ---- Validate input ----
    if (!body.devices || !Array.isArray(body.devices) || body.devices.length === 0) {
      return NextResponse.json(
        { error: "No devices provided" },
        { status: 400 }
      );
    }

    if (!body.total_kwh || !body.monthly_cost) {
      return NextResponse.json(
        { error: "Missing total_kwh or monthly_cost" },
        { status: 400 }
      );
    }

    // ---- Check API key ----
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("[gemini-tips] GEMINI_API_KEY not set — using fallback tips");
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    // ---- Build prompt ----
    const prompt = buildGeminiPrompt(body);

    // ---- Call Gemini API ----
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error(`[gemini-tips] Gemini API error ${geminiRes.status}:`, errorText);
      // Fall back to rule-based tips
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    const geminiData = await geminiRes.json();

    // ---- Extract text from Gemini response ----
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText) {
      console.error("[gemini-tips] Empty response from Gemini");
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    // ---- Parse JSON from response (strip markdown code fences if present) ----
    let parsed: { tips: Array<{ icon: string; title: string; description: string; savings?: string }>; estimated_savings: string };

    try {
      // Remove ```json ... ``` wrapping if Gemini adds it
      const cleaned = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("[gemini-tips] Failed to parse Gemini response:", parseErr);
      console.error("[gemini-tips] Raw text:", rawText);
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    // ---- Validate parsed data ----
    if (!parsed.tips || !Array.isArray(parsed.tips) || parsed.tips.length === 0) {
      const fallback = getFallbackTips(body);
      return NextResponse.json(fallback);
    }

    const response: GeminiTipsResponse = {
      tips: parsed.tips.map((t) => ({
        icon: t.icon || "💡",
        title: t.title || "Energy Tip",
        description: t.description || "",
        savings: t.savings,
      })),
      estimated_savings: parsed.estimated_savings || `${body.currency}${Math.round(body.monthly_cost * 0.18)}/mo`,
      generated_at: new Date().toISOString(),
      source: "gemini",
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[gemini-tips] Unexpected error:", err);
    // Return a generic error — never expose internals
    return NextResponse.json(
      { error: "Failed to generate tips. Please try again." },
      { status: 500 }
    );
  }
}
