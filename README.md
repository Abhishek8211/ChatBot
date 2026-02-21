<div align="center">

# ⚡ EnergyIQ — AI-Powered Home Energy Optimizer

### 🏠 Calculate, Analyze & Reduce Your Electricity Costs

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenRouter AI](https://img.shields.io/badge/OpenRouter-AI-8E75B2?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Chat with our AI to calculate your home electricity consumption, explore live rates across 50+ countries, get AI-powered saving tips via OpenRouter (8-model fallback chain), and download detailed PDF reports — all through a stunning conversational interface.**

[🚀 Live Demo](#) · [📖 Features](#-features) · [🛠️ Setup](#-getting-started) · [📸 Screenshots](#️-preview)

---

</div>

## 🖼️ Preview

| Landing Page                         | Calculator Chatbot                            | Live Rates Explorer                       |
| ------------------------------------ | --------------------------------------------- | ----------------------------------------- |
| Hero + animated stats + rate preview | Conversational AI flow with country selection | 50+ countries with search, filters & sort |

| Dashboard                     | History                  | AI Tips                    |
| ----------------------------- | ------------------------ | -------------------------- |
| Stats, charts & cost analysis | Past calculations viewer | AI-powered recommendations |

---

## ✨ Features

### 🔋 Core

| Feature                      | Description                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 🤖 **AI Chatbot Calculator** | Step-by-step conversational flow to input devices and calculate energy costs                                        |
| 🧠 **AI-Powered Tips**       | Personalized energy-saving recommendations via OpenRouter (8-model fallback chain) with rule-based offline fallback |
| 🌍 **50+ Country Rates**     | Electricity rates across 6 regions with local currency + USD conversion                                             |
| 📊 **Smart Dashboard**       | Visual breakdown with pie charts, bar charts & cost analysis                                                        |
| 📜 **Calculation History**   | All calculations saved in localStorage with full detail (max 50 entries)                                            |
| 📥 **PDF Reports**           | Download detailed energy reports with device breakdowns and tips                                                    |

### 🚀 Advanced

| Feature                     | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| 🌐 **Country Selection**    | Choose your country at the start — rates fetched automatically                  |
| 🔍 **Rate Explorer**        | Beautiful rates page with search, region filters, sort & color-coded price bars |
| 🤖 **AI Suggestions**       | Personalized tips with priority levels (high/medium/low) and savings estimates  |
| 💬 **Free-Ask Mode**        | Ask the AI any question — auto-detected via `?` or prefixed with `ask`          |
| 🕐 **Flexible Time Input**  | Supports hours (`2`), minutes (`30m`, `45min`), and mixed (`1h30m`, `2h 30min`) |
| 🔄 **Global Commands**      | Type `reset`, `tips`, or `ask <question>` from any chatbot step                 |
| 🎉 **Confetti Celebration** | Canvas confetti animation fires when calculation completes                      |
| 📸 **Share as Image**       | Capture results as a PNG screenshot using html2canvas                           |
| 🐦 **Share on Twitter**     | Pre-filled tweet with your energy stats and cost breakdown                      |
| 📊 **Export to CSV**        | Download device data, totals, and rate info as `.csv`                           |
| 💡 **Tooltip Education**    | Hover device buttons to see wattage ranges, tips, and fun facts                 |

### 🎨 UI/UX

| Feature                       | Description                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 🌙 **Theme Toggle**           | Dark/light mode with full glassmorphism support (persisted in localStorage)                                     |
| 🖱️ **Custom Animated Cursor** | Dual-layer cursor (dot + trailing ring) with theme-aware glow, click ripple, pulse animation, and toggle button |
| 🔊 **Sound Effects**          | Web Audio API feedback on send (600Hz), receive (800Hz), complete (1000Hz) — toggleable                         |
| ⏱️ **Hover Timestamps**       | Hover any chat bubble to see the exact send time                                                                |
| 📊 **Progress Bar**           | Visual progress of device input completion                                                                      |
| ⌨️ **Keyboard Shortcuts**     | Press `1`–`9` to tap quick action buttons, `Esc` to close modals                                                |
| ↩️ **Undo Last Device**       | Remove the last added device with one click                                                                     |
| 💰 **Running Cost Preview**   | Floating badge showing estimated cost as you add devices                                                        |
| 🏷️ **Device Counter Badge**   | Header badge showing "2/5 devices" progress                                                                     |
| ⚡ **Turbopack Dev**          | Blazing fast development with Next.js Turbopack                                                                 |
| ✨ **Glassmorphism UI**       | Futuristic glass cards with gradient accents (dark & light variants)                                            |
| 🎞️ **Framer Motion**          | Smooth page transitions, chat animations, chart reveals with spring physics                                     |
| 📱 **Fully Responsive**       | Works beautifully on desktop, tablet & mobile with slide-in sidebar                                             |
| 🎯 **First-Paint Fix**        | CSS animation trick prevents Framer Motion blank flash on initial load                                          |

### 🧩 AI Tips Modal

| Feature                   | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| ✍️ **Typing Effect**      | Tips appear character-by-character with animated cursor        |
| 💾 **Cached & Debounced** | 2s debounce, localStorage caching, prevents duplicate requests |
| 📋 **Copy to Clipboard**  | One-click copy all tips to clipboard                           |
| 📄 **Separate Tips PDF**  | Download tips as a standalone PDF report                       |
| 🔄 **Regenerate**         | Clear cache and fetch fresh tips from AI                       |
| 🏷️ **Source Badge**       | Shows "OPENROUTER AI" or "OFFLINE" origin indicator            |
| ⏰ **Timestamps**         | Display when tips were generated                               |
| 🛡️ **Error Recovery**     | Error state with "Try Again" button                            |

---

## 🛠️ Tech Stack

```
Frontend     →  Next.js 14.2 (App Router) · React 18 · TypeScript 5
Styling      →  Tailwind CSS 3.4 · Glassmorphism dark/light theme
AI Engine    →  OpenRouter API (8-model fallback chain) + rule-based fallback
Models       →  Gemma 3 27B · Gemma 3n E4B · Gemma 3 12B · DeepSeek R1
               Nemotron Nano 9B · LLaMA 3.3 70B · Qwen3 4B · Mistral Small 3.1
Animations   →  Framer Motion 12
Charts       →  Recharts 3 (lazy loaded with Suspense)
PDF Export   →  jsPDF 4 + jspdf-autotable 5 + html2canvas
Confetti     →  canvas-confetti
Notifications→  react-hot-toast
Icons        →  react-icons (hi, hi2)
Counters     →  react-countup (with scroll-spy)
HTTP         →  Axios
Fonts        →  Geist Sans + Geist Mono (local)
Dev Server   →  Turbopack (instant HMR)
```

---

## 📁 Project Structure

```
energy-calculator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-suggestions/
│   │   │   │   └── route.ts               # POST — Rule-based energy suggestions
│   │   │   ├── electricity-rate/
│   │   │   │   ├── route.ts               # GET  — Single country rate (53 countries)
│   │   │   │   └── all/
│   │   │   │       └── route.ts           # GET  — All 47 country rates + USD
│   │   │   ├── energy-tips/
│   │   │   │   └── route.ts               # GET  — Random energy-saving tips
│   │   │   ├── gemini-chat/
│   │   │   │   └── route.ts               # POST — OpenRouter AI chat (8-model fallback)
│   │   │   └── gemini-tips/
│   │   │       └── route.ts               # POST — OpenRouter AI energy tips
│   │   ├── calculator/
│   │   │   └── page.tsx                   # Calculator page (chat + charts + actions)
│   │   ├── dashboard/
│   │   │   └── page.tsx                   # Dashboard with stats & charts
│   │   ├── history/
│   │   │   └── page.tsx                   # Calculation history viewer
│   │   ├── rates/
│   │   │   └── page.tsx                   # Global electricity rates explorer
│   │   ├── globals.css                    # Glassmorphism + light/dark theme + cursor CSS
│   │   ├── layout.tsx                     # Root layout with AppShell + CustomCursor
│   │   └── page.tsx                       # Landing page with live rates preview
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CostBreakdownChart.tsx     # Horizontal cost breakdown bar chart
│   │   │   ├── EnergyBarChart.tsx          # Daily vs monthly grouped bar chart
│   │   │   └── EnergyPieChart.tsx          # Device distribution donut chart
│   │   ├── layout/
│   │   │   ├── AppShell.tsx               # Main layout with sidebar + header
│   │   │   ├── Header.tsx                 # Sticky glassmorphism header
│   │   │   └── Sidebar.tsx                # Navigation sidebar (5 pages)
│   │   ├── ChatBot.tsx                    # Core chatbot engine (~1000 lines)
│   │   ├── CustomCursor.tsx               # Custom animated dual-layer cursor (332 lines)
│   │   ├── ThemeToggle.tsx                # Dark/light toggle button
│   │   └── TipsModal.tsx                  # AI tips modal with typing effect (697 lines)
│   ├── hooks/
│   │   ├── useCustomCursor.ts             # 60fps cursor tracking with lerp smoothing
│   │   └── useGeminiTips.ts               # AI tips fetcher with caching & debounce
│   └── utils/
│       ├── constants.ts                   # Device data, wattages, icons, tooltips, AI rules
│       ├── geminiPromptBuilder.ts         # AI prompt construction + fallback tips
│       ├── helpers.ts                     # Calculations, localStorage, CSV, share
│       ├── pdf.ts                         # PDF report generation
│       └── types.ts                       # TypeScript interfaces & types (12 types)
├── .env.local                             # API keys (not committed)
├── next.config.mjs                        # Next.js config with optimizePackageImports
├── tailwind.config.ts                     # Custom color palette & animations
├── package.json
└── README.md
```

---

## 🌍 Supported Countries (53)

> Rates in local currency with USD equivalent, organized by region

| Region                 | Countries                                                                                                                                                                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🌏 **Asia** (14)       | 🇮🇳 India · 🇯🇵 Japan · 🇨🇳 China · 🇰🇷 South Korea · 🇸🇬 Singapore · 🇮🇩 Indonesia · 🇲🇾 Malaysia · 🇹🇭 Thailand · 🇻🇳 Vietnam · 🇵🇭 Philippines · 🇵🇰 Pakistan · 🇧🇩 Bangladesh · 🇱🇰 Sri Lanka · 🇳🇵 Nepal                                                                                                          |
| 🏜️ **Middle East** (7) | 🇦🇪 UAE · 🇸🇦 Saudi Arabia · 🇶🇦 Qatar · 🇰🇼 Kuwait · 🇮🇷 Iran · 🇮🇶 Iraq · 🇮🇱 Israel                                                                                                                                                                                                                          |
| 🏰 **Europe** (22)     | 🇬🇧 UK · 🇩🇪 Germany · 🇫🇷 France · 🇮🇹 Italy · 🇪🇸 Spain · 🇳🇱 Netherlands · 🇧🇪 Belgium · 🇸🇪 Sweden · 🇳🇴 Norway · 🇩🇰 Denmark · 🇫🇮 Finland · 🇨🇭 Switzerland · 🇦🇹 Austria · 🇵🇹 Portugal · 🇮🇪 Ireland · 🇵🇱 Poland · 🇬🇷 Greece · 🇹🇷 Turkey · 🇨🇿 Czech Republic · 🇭🇺 Hungary · 🇷🇴 Romania · 🇷🇺 Russia · 🇺🇦 Ukraine |
| 🌎 **Americas** (8)    | 🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico · 🇧🇷 Brazil · 🇦🇷 Argentina · 🇨🇴 Colombia · 🇨🇱 Chile · 🇵🇪 Peru                                                                                                                                                                                                             |
| 🌍 **Africa** (6)      | 🇿🇦 South Africa · 🇳🇬 Nigeria · 🇪🇬 Egypt · 🇰🇪 Kenya · 🇬🇭 Ghana · 🇪🇹 Ethiopia                                                                                                                                                                                                                              |
| 🏝️ **Oceania** (2)     | 🇦🇺 Australia · 🇳🇿 New Zealand                                                                                                                                                                                                                                                                            |

> **Note:** All 53 countries are available via the single-rate endpoint. The bulk `/all` endpoint returns 47 countries with USD equivalents, flags, and regions.

---

## ⚡ Calculation Logic

```
Energy (kWh) = (Wattage × Quantity × Hours per Day × 30) / 1000
Monthly Cost = Total kWh × Electricity Rate per kWh
```

Each device is calculated individually, then aggregated for total daily/monthly kWh and cost with percentage breakdowns.

---

## 🔌 API Routes (6 Endpoints)

### `GET /api/electricity-rate?country=india`

Returns the electricity rate for a single country in local currency. Supports aliases (e.g., `usa`, `uk`, `uae`).

```json
{
  "country": "India",
  "rate_per_kwh": 8,
  "currency": "₹",
  "last_updated": "2026-02-21T...",
  "source": "database"
}
```

### `GET /api/electricity-rate/all`

Returns 47 country rates with computed USD equivalents, flags, and regions.

```json
{
  "count": 47,
  "last_updated": "2026-02-21T...",
  "rates": [
    {
      "country": "India",
      "rate_per_kwh": 8.0,
      "currency": "₹",
      "usd_per_kwh": 0.0964,
      "flag": "🇮🇳",
      "region": "Asia"
    }
  ]
}
```

### `POST /api/gemini-chat`

Sends user messages to OpenRouter API with an 8-model fallback chain for general Q&A. Auto-retries on 429/503 errors with 30s timeout per model.

**Fallback chain:** Gemma 3 27B → Gemma 3n E4B → Gemma 3 12B → DeepSeek R1 → Nemotron Nano 9B → LLaMA 3.3 70B → Qwen3 4B → Mistral Small 3.1

### `POST /api/gemini-tips`

Generates 6 personalized energy-saving tips via OpenRouter with structured JSON output. Falls back to rule-based tips (`getFallbackTips()`) if API key is missing, all models fail, or JSON parsing fails. Response includes `source: "openrouter" | "fallback"`.

### `POST /api/ai-suggestions`

Rule-based energy-saving suggestions with priority levels and savings estimates. No external API required.

```json
{
  "suggestions": [
    {
      "icon": "❄️",
      "title": "AC Optimization",
      "description": "Upgrade to a 5-star inverter AC — saves up to 40% energy",
      "savingsEstimate": "Save ~₹1152/mo (15-30%)",
      "priority": "high"
    }
  ],
  "totalPotentialSavings": "₹1037/month"
}
```

### `GET /api/energy-tips`

Returns 4 random energy-saving tips from a pool of 8 static tips with icons and descriptions.

---

## 📊 Supported Devices (15)

| Device          | Icon | Default Wattage |
| --------------- | ---- | --------------- |
| AC              | ❄️   | 1500W           |
| Fan             | 🌀   | 75W             |
| TV              | 📺   | 120W            |
| Refrigerator    | 🧊   | 200W            |
| Washing Machine | 🧺   | 500W            |
| Microwave       | 📡   | 1200W           |
| Water Heater    | 🔥   | 3000W           |
| Light Bulb      | 💡   | 60W             |
| Computer        | 💻   | 300W            |
| Iron            | 👔   | 1000W           |
| Hair Dryer      | 💇   | 1800W           |
| Dishwasher      | 🍽️   | 1800W           |
| Electric Stove  | 🍳   | 2000W           |
| Router          | 📶   | 12W             |
| Phone Charger   | 🔌   | 5W              |

---

## 🏃 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **OpenRouter API Key** → [Get one here](https://openrouter.ai/keys) (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhishek8211/ChatBot.git

# Navigate to project directory
cd ChatBot/energy-calculator

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Add your API key to `.env.local`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> **Note:** The app works without an API key — AI chat and tips will fall back to rule-based suggestions automatically.

```bash
# Start development server (with Turbopack ⚡)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Production Build

```bash
npm run build
npm start
```

---

## 🗂️ Export Options

| Format           | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| 📄 **PDF**       | Full report with device table, summary, and energy tips (jsPDF + autotable) |
| 📊 **CSV**       | Spreadsheet-friendly export with device data and totals                     |
| 📸 **PNG Image** | Screenshot of results section via html2canvas                               |
| 🐦 **Twitter**   | Pre-filled tweet with energy stats and cost                                 |
| 📋 **Copy Tips** | Copy AI-generated tips to clipboard from the Tips Modal                     |
| 📄 **Tips PDF**  | Standalone PDF of AI tips (separate from main report)                       |

---

## ⌨️ Keyboard Shortcuts

| Key      | Action                                                                |
| -------- | --------------------------------------------------------------------- |
| `1`–`9`  | Tap the corresponding quick action button (when input is not focused) |
| `Enter`  | Send typed message                                                    |
| `Escape` | Close the AI Tips Modal                                               |

---

## 🤖 Chatbot Commands

| Command          | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `reset`          | Reset the conversation and start over (works from any step) |
| `tips`           | Open the AI Tips Modal (works from any step)                |
| `ask <question>` | Ask the AI any question (e.g., `ask what is solar energy?`) |
| `?` in message   | Auto-routes to AI for an answer                             |

The chatbot also auto-detects questions starting with: who, what, why, how, when, where, is, are, can, do, does, tell, explain, describe, define.

---

## 🧠 AI Engines

### OpenRouter AI (Chat & Tips)

- Powered by **OpenRouter API** with an 8-model fallback chain
- **Models (in priority order):** Gemma 3 27B → Gemma 3n E4B → Gemma 3 12B → DeepSeek R1 0528 → Nemotron Nano 9B → LLaMA 3.3 70B → Qwen3 4B → Mistral Small 3.1 24B
- Auto-retries on rate limits (429) and service unavailable (503)
- 30-second timeout per model attempt
- Contextual energy-saving advice based on your actual devices
- Falls back to rule-based tips if no API key is set or all models fail

### Rule-Based Suggestion Engine

1. **Devices sorted by cost** — highest consumers get priority
2. **Curated tips** per device type from `AI_SUGGESTION_RULES` (2–4 tips each)
3. **Priority classification** — `high` (>30% of bill), `medium` (>10%), `low` (<10%)
4. **Savings estimates** — calculated from actual usage data
5. **General suggestions** — solar panels (if bill > ₹500), smart home automation (if 5+ devices)
6. **Max 6 suggestions** returned, sorted by priority

---

## 🖱️ Custom Animated Cursor

| Feature               | Description                                                                          |
| --------------------- | ------------------------------------------------------------------------------------ |
| **Dual-layer design** | Inner dot (8px) + trailing outer ring (36px) with lerp smoothing (0.15 factor)       |
| **Variant detection** | Auto-switches: default → hover (clickable) → text (text content) → click (mousedown) |
| **Theme-aware glow**  | Dark mode: white glow · Light mode: green-to-blue gradient glow                      |
| **Ambient glow**      | Large, faint radial gradient background layer                                        |
| **Pulse animation**   | Expanding/fading ring animation (dark mode only)                                     |
| **Gradient rotation** | Spinning conic gradient ring (light mode only)                                       |
| **Click ripple**      | Expanding circle animation on mouse click                                            |
| **Toggle button**     | Enable/disable with localStorage persistence (fixed bottom-right)                    |
| **Accessibility**     | Respects `prefers-reduced-motion` · Auto-hides on mobile/touch devices               |

---

## 📊 Chart Types

| Chart                   | Component                | Description                                                                                                    |
| ----------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| 🍩 **Energy Pie Chart** | `EnergyPieChart.tsx`     | Donut chart (innerRadius=60, outerRadius=110) showing device-wise kWh distribution with glassmorphism tooltips |
| 📊 **Energy Bar Chart** | `EnergyBarChart.tsx`     | Grouped vertical bars comparing daily vs monthly kWh per device (teal + blue)                                  |
| 📈 **Cost Breakdown**   | `CostBreakdownChart.tsx` | Horizontal bar chart showing monthly cost per device with individual cell colors                               |

All charts are **lazy-loaded** with React Suspense and skeleton fallbacks for optimal performance.

---

## 🎨 Design System

| Element            | Value                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| Primary            | Teal `#20c997` → Blue `#339af0` gradient                                  |
| Background         | Dark `#101113` / Light `#f8f9fa`                                          |
| Cards              | Glassmorphism with subtle borders (`.glass`, `.glass-light`)              |
| Animations         | Framer Motion spring + fade-in-up                                         |
| Typography         | Geist Sans + Geist Mono (local fonts)                                     |
| Layout             | Sidebar (5 nav items) + content with sticky glassmorphism header          |
| Cursor             | Custom animated dual-layer with theme-aware effects                       |
| Rate colors        | Green (≤$0.08) · Teal ($0.08–$0.20) · Amber ($0.20–$0.35) · Red (>$0.35)  |
| Custom scrollbar   | 6px dark-themed scrollbar                                                 |
| Gradient utilities | `.gradient-text`, `.gradient-border`, `.energy-glow`, `.text-shadow-glow` |

---

## 📜 License

MIT — free to use, modify, and distribute.

---

<div align="center">

**Built with 💚 by [Abhishek](https://github.com/Abhishek8211) for a greener planet 🌍**

⭐ **Star this repo if you found it useful!**

</div>
