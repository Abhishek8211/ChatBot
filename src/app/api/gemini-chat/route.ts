// ============================================
// POST /api/gemini-chat
// General-purpose electricity Q&A powered by Gemini.
// Answers any electricity / energy-related question.
//
// Env var required: GEMINI_API_KEY
// ============================================

import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are EnergyIQ, a smart AI assistant built into a Smart Energy Calculator app. You can answer any question the user asks.

About this app:
- Users add their electrical devices (type, quantity, wattage, hours of usage per day).
- The app calculates energy consumption using these formulas:
  * Daily kWh = (Wattage x Quantity x Hours per day) / 1000
  * Monthly kWh = Daily kWh x 30
  * Monthly Cost = Monthly kWh x Electricity Rate per kWh
  * Percentage share = (Device Monthly kWh / Total Monthly kWh) x 100
- The electricity rate is fetched based on the user's country (default: India at approx ₹8/kWh).

Rules:
- You can answer ANY question the user asks — general knowledge, science, math, coding, history, or anything else.
- For electricity and energy questions, provide extra detail and practical tips.
- Keep answers concise (max 3-4 short paragraphs).
- Use simple language anyone can understand.
- If you mention numbers, include units where applicable.
- Do NOT use markdown formatting like ** or ## — use plain text only.`;

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (
      !question ||
      typeof question !== "string" ||
      question.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        answer:
          "I'm sorry, the AI service is not configured yet. Please set the GEMINI_API_KEY environment variable to enable AI-powered answers.",
        source: "fallback",
      });
    }

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${SYSTEM_PROMPT}\n\nUser question: ${question.trim()}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error(
        `[gemini-chat] Gemini API error ${geminiRes.status}:`,
        errorText,
      );

      // Handle rate limiting (429) — retry once after a short delay
      if (geminiRes.status === 429) {
        console.log("[gemini-chat] Rate limited, retrying after 2s...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const retryRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: `${SYSTEM_PROMPT}\n\nUser question: ${question.trim()}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              topK: 40,
              maxOutputTokens: 800,
            },
          }),
        });

        if (retryRes.ok) {
          const retryData = await retryRes.json();
          const retryText: string =
            retryData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          if (retryText) {
            return NextResponse.json({
              answer: retryText.trim(),
              source: "gemini",
            });
          }
        }

        return NextResponse.json({
          answer:
            "The AI service is temporarily busy due to high usage. Please wait a few seconds and try again.",
          source: "rate_limited",
        });
      }

      return NextResponse.json({
        answer:
          "Sorry, I couldn't reach the AI service right now. Please try again in a moment.",
        source: "error",
      });
    }

    const geminiData = await geminiRes.json();
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText) {
      return NextResponse.json({
        answer:
          "I wasn't able to generate an answer. Could you rephrase your question?",
        source: "empty",
      });
    }

    return NextResponse.json({
      answer: rawText.trim(),
      source: "gemini",
    });
  } catch (err) {
    console.error("[gemini-chat] Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to process your question. Please try again." },
      { status: 500 },
    );
  }
}
