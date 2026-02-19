<div align="center">

# ⚡ EnergyIQ — AI-Powered Home Energy Optimizer

### 🏠 Calculate, Analyze & Reduce Your Electricity Costs

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Chat with our AI to calculate your home electricity consumption, explore live rates across 50+ countries, get Gemini-powered saving tips, and download detailed PDF reports — all through a stunning conversational interface.**

[🚀 Live Demo](#) · [📖 Features](#-features) · [🛠️ Setup](#-getting-started) · [📸 Screenshots](#️-preview)

---

</div>

## 🖼️ Preview

| Landing Page | Calculator Chatbot | Live Rates Explorer |
|---|---|---|
| Hero + animated stats + rate preview | Conversational AI flow with country selection | 50+ countries with search, filters & sort |

| Dashboard | History | AI Tips |
|---|---|---|
| Stats, charts & cost analysis | Past calculations viewer | Gemini-powered recommendations |

---

## ✨ Features

### 🔋 Core

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chatbot Calculator** | Step-by-step conversational flow to input devices and calculate energy costs |
| 🧠 **Gemini AI Tips** | Personalized energy-saving recommendations powered by Google Gemini 2.0 Flash |
| 🌍 **50+ Country Rates** | Electricity rates across 6 regions with local currency + USD conversion |
| 📊 **Smart Dashboard** | Visual breakdown with pie charts, bar charts & cost analysis |
| 📜 **Calculation History** | All calculations saved in localStorage with full detail |
| 📥 **PDF Reports** | Download detailed energy reports with device breakdowns and tips |

### 🚀 Advanced

| Feature | Description |
|---------|-------------|
| 🌐 **Country Selection** | Choose your country at the start — rates fetched automatically |
| 🔍 **Rate Explorer** | Beautiful rates page with search, region filters, sort & price bars |
| 🤖 **AI Suggestions** | Personalized tips with priority levels (high/medium/low) and savings estimates |
| 🎉 **Confetti Celebration** | Canvas confetti animation fires when calculation completes |
| 📸 **Share as Image** | Capture results as a PNG screenshot using html2canvas |
| 🐦 **Share on Twitter** | Pre-filled tweet with your energy stats and cost breakdown |
| 📊 **Export to CSV** | Download device data, totals, and rate info as `.csv` |
| 💡 **Tooltip Education** | Hover device buttons to see wattage, tips, and fun facts |

### 🎨 UI/UX

| Feature | Description |
|---------|-------------|
| 🌙 **Theme Toggle** | Dark/light mode with full glassmorphism support (persisted) |
| 🔊 **Sound Effects** | Subtle audio feedback on send/receive/complete (toggleable) |
| ⏱️ **Hover Timestamps** | Hover any chat bubble to see the exact send time |
| 📊 **Progress Bar** | Visual progress of device input completion |
| ⌨️ **Keyboard Shortcuts** | Press `1`–`9` to tap quick action buttons |
| ↩️ **Undo Last Device** | Remove the last added device with one click |
| 💰 **Running Cost Preview** | Floating badge showing estimated cost as you add devices |
| ⚡ **Turbopack Dev** | Blazing fast development with Next.js Turbopack |
| ✨ **Glassmorphism UI** | Futuristic dark-themed glass cards with gradient accents |
| 🎞️ **Framer Motion** | Smooth page transitions, chat animations, chart reveals |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet & mobile |

---

## 🛠️ Tech Stack

```
Frontend     →  Next.js 14 (App Router) · React 18 · TypeScript 5
Styling      →  Tailwind CSS 3 · Glassmorphism dark/light theme
AI Engine    →  Google Gemini 2.0 Flash (chat + tips)
Animations   →  Framer Motion 12
Charts       →  Recharts 3 (lazy loaded)
PDF Export   →  jsPDF + html2canvas
Confetti     →  canvas-confetti
Notifications→  react-hot-toast
Icons        →  react-icons (hi, hi2)
Counters     →  react-countup
HTTP         →  Axios
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
│   │   │   │   └── route.ts               # POST — AI-powered energy suggestions
│   │   │   ├── electricity-rate/
│   │   │   │   ├── route.ts               # GET  — Single country rate
│   │   │   │   └── all/
│   │   │   │       └── route.ts           # GET  — All 50+ country rates + USD
│   │   │   ├── energy-tips/
│   │   │   │   └── route.ts               # GET  — Random energy-saving tips
│   │   │   ├── gemini-chat/
│   │   │   │   └── route.ts               # POST — Gemini AI chat completions
│   │   │   └── gemini-tips/
│   │   │       └── route.ts               # POST — Gemini AI energy tips
│   │   ├── calculator/
│   │   │   └── page.tsx                   # Calculator page (chat + charts)
│   │   ├── dashboard/
│   │   │   └── page.tsx                   # Dashboard with stats & charts
│   │   ├── history/
│   │   │   └── page.tsx                   # Calculation history viewer
│   │   ├── rates/
│   │   │   └── page.tsx                   # 🆕 Global electricity rates explorer
│   │   ├── globals.css                    # Glassmorphism + light/dark theme
│   │   ├── layout.tsx                     # Root layout with AppShell
│   │   └── page.tsx                       # Landing page with live rates preview
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CostBreakdownChart.tsx     # Horizontal cost breakdown
│   │   │   ├── EnergyBarChart.tsx          # Daily vs monthly bar chart
│   │   │   └── EnergyPieChart.tsx          # Device distribution pie chart
│   │   ├── layout/
│   │   │   ├── AppShell.tsx               # Main layout with sidebar
│   │   │   ├── Header.tsx                 # Sticky header with theme toggle
│   │   │   └── Sidebar.tsx                # Navigation sidebar (5 pages)
│   │   ├── ChatBot.tsx                    # Core chatbot engine (~975 lines)
│   │   ├── CustomCursor.tsx               # Custom animated cursor
│   │   ├── ThemeToggle.tsx                # Dark/light toggle button
│   │   └── TipsModal.tsx                  # AI tips modal
│   ├── hooks/
│   │   ├── useCustomCursor.ts             # Cursor tracking hook
│   │   └── useGeminiTips.ts               # Gemini tips fetcher hook
│   └── utils/
│       ├── constants.ts                   # Device data, wattages, icons, tooltips
│       ├── geminiPromptBuilder.ts         # Gemini prompt construction
│       ├── helpers.ts                     # Calculations, localStorage, CSV, share
│       ├── pdf.ts                         # PDF report generation
│       └── types.ts                       # TypeScript interfaces & types
├── .env.local                             # API keys (not committed)
├── next.config.mjs                        # Next.js config with optimizePackageImports
├── tailwind.config.ts                     # Custom color palette & animations
├── package.json
└── README.md
```

---

## 🌍 Supported Countries (50+)

> Rates in local currency with USD equivalent, organized by region

| Region | Countries |
|--------|-----------|
| 🌏 **Asia** | 🇮🇳 India · 🇯🇵 Japan · 🇨🇳 China · 🇰🇷 South Korea · 🇸🇬 Singapore · 🇮🇩 Indonesia · 🇲🇾 Malaysia · 🇹🇭 Thailand · 🇻🇳 Vietnam · 🇵🇭 Philippines · 🇵🇰 Pakistan · 🇧🇩 Bangladesh · 🇱🇰 Sri Lanka · 🇳🇵 Nepal |
| 🏜️ **Middle East** | 🇦🇪 UAE · 🇸🇦 Saudi Arabia · 🇶🇦 Qatar · 🇰🇼 Kuwait · 🇮🇱 Israel |
| 🏰 **Europe** | 🇬🇧 UK · 🇩🇪 Germany · 🇫🇷 France · 🇮🇹 Italy · 🇪🇸 Spain · 🇳🇱 Netherlands · 🇧🇪 Belgium · 🇸🇪 Sweden · 🇳🇴 Norway · 🇩🇰 Denmark · 🇫🇮 Finland · 🇨🇭 Switzerland · 🇦🇹 Austria · 🇵🇹 Portugal · 🇮🇪 Ireland · 🇵🇱 Poland · 🇬🇷 Greece · 🇹🇷 Turkey |
| 🌎 **Americas** | 🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico · 🇧🇷 Brazil · 🇦🇷 Argentina · 🇨🇴 Colombia · 🇨🇱 Chile · 🇵🇪 Peru |
| 🌍 **Africa** | 🇿🇦 South Africa · 🇳🇬 Nigeria · 🇪🇬 Egypt · 🇰🇪 Kenya · 🇬🇭 Ghana · 🇪🇹 Ethiopia |
| 🏝️ **Oceania** | 🇦🇺 Australia · 🇳🇿 New Zealand |

---

## ⚡ Calculation Logic

```
Energy (kWh) = (Wattage × Quantity × Hours per Day × 30) / 1000
Monthly Cost = Total kWh × Electricity Rate per kWh
```

Each device is calculated individually, then aggregated for total daily/monthly kWh and cost with percentage breakdowns.

---

## 🔌 API Routes

### `GET /api/electricity-rate?country=india`

Returns the electricity rate for a single country in local currency.

```json
{
  "country": "India",
  "rate_per_kwh": 8,
  "currency": "₹",
  "last_updated": "2026-02-19T...",
  "source": "database"
}
```

### `GET /api/electricity-rate/all`

Returns all 50+ country rates with USD equivalents, flags, and regions.

```json
{
  "count": 53,
  "last_updated": "2026-02-19T...",
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

Sends a message to Google Gemini 2.0 Flash and returns the AI response for the chatbot conversation.

### `POST /api/gemini-tips`

Generates personalized energy-saving tips using Gemini AI based on device usage data.

### `POST /api/ai-suggestions`

Rule-based energy-saving suggestions with priority levels and savings estimates.

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

Returns 4 random energy-saving tips with icons and descriptions.

---

## 📊 Supported Devices (15)

| Device | Icon | Default Wattage |
|--------|------|-----------------|
| AC | ❄️ | 1500W |
| Fan | 🌀 | 75W |
| TV | 📺 | 120W |
| Refrigerator | 🧊 | 200W |
| Washing Machine | 🧺 | 500W |
| Microwave | 📡 | 1200W |
| Water Heater | 🔥 | 3000W |
| Light Bulb | 💡 | 60W |
| Computer | 💻 | 300W |
| Iron | 👔 | 1000W |
| Hair Dryer | 💇 | 1800W |
| Dishwasher | 🍽️ | 1800W |
| Electric Stove | 🍳 | 2000W |
| Router | 📶 | 12W |
| Phone Charger | 🔌 | 5W |

---

## 🏃 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Google Gemini API Key** → [Get one here](https://aistudio.google.com/app/apikey)

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
GEMINI_API_KEY=your_gemini_api_key_here
```

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

| Format | Description |
|--------|-------------|
| 📄 **PDF** | Full report with device table, summary, and energy tips |
| 📊 **CSV** | Spreadsheet-friendly export with device data and totals |
| 📸 **PNG Image** | Screenshot of results section via html2canvas |
| 🐦 **Twitter** | Pre-filled tweet with energy stats and cost |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1`–`9` | Tap the corresponding quick action button |
| `Enter` | Send typed message |

---

## 🧠 AI Engines

### Gemini AI Chat & Tips
- Powered by **Google Gemini 2.0 Flash**
- Contextual energy-saving advice based on your actual devices
- Fallback tips if API key is not set

### Rule-Based Suggestion Engine
1. **Devices sorted by cost** — highest consumers get priority
2. **Curated tips** per device type from `AI_SUGGESTION_RULES`
3. **Priority classification** — `high` (>30% of bill), `medium` (>10%), `low` (<10%)
4. **Savings estimates** — calculated from actual usage data
5. **General suggestions** — solar panels (if bill > ₹500), smart home (if 5+ devices)

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary | Teal `#20c997` → Blue `#339af0` gradient |
| Background | Dark `#101113` / Light `#f8f9fa` |
| Cards | Glassmorphism with subtle borders |
| Animations | Framer Motion spring + fade-in-up |
| Typography | System font stack (SF Pro, Segoe UI, Roboto) |
| Layout | Sidebar + content with sticky header |

---

## 📜 License

MIT — free to use, modify, and distribute.

---

<div align="center">

**Built with 💚 by [Abhishek](https://github.com/Abhishek8211) for a greener planet 🌍**

⭐ **Star this repo if you found it useful!**

</div>
