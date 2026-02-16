# ⚡ EnergyIQ — Smart Energy Consumption Calculator Chatbot

A modern, AI-powered chatbot web application that calculates home energy consumption based on user device inputs. It fetches real-time electricity tariff data, calculates total energy usage in kWh, and estimates monthly cost — all through a conversational chatbot interface with smart suggestions, visual charts, and export options.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff69b4?logo=framer)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🖼️ Preview

| Landing Page          | Calculator Chatbot     | Results & Charts       |
| --------------------- | ---------------------- | ---------------------- |
| Hero + animated stats | Conversational AI flow | Pie, bar & cost charts |

---

## 🚀 Features

### Core

- **AI Chatbot** — Step-by-step conversational flow to input devices and calculate energy
- **Real-time Rates** — Mock API with rates for 8 countries (India, USA, UK, Germany, etc.)
- **Visual Charts** — Pie chart (device distribution), Bar chart (daily vs monthly), Cost breakdown
- **PDF Reports** — Download detailed energy reports with device breakdowns
- **Calculation History** — All calculations saved in localStorage
- **Energy Saving Tips** — Smart tips shown after every calculation

### Advanced

- **🤖 AI-Powered Suggestions** — Personalized energy-saving recommendations based on your devices, with priority levels (high/medium/low) and estimated savings
- **🎉 Confetti Celebration** — Canvas confetti animation fires when calculation completes
- **📸 Share as Image** — Capture results section as a PNG screenshot using html2canvas
- **🐦 Share on Twitter** — Pre-filled tweet with your energy stats and cost breakdown
- **📊 Export to CSV** — Download device data, totals, and rate info as a `.csv` file
- **💡 Tooltip Education** — Hover over device buttons to see average wattage, energy tips, and fun facts
- **📈 Animated Landing Stats** — Live personal stats (calculations done, kWh tracked, devices analyzed) pulled from localStorage history

### UI/UX

- **🎨 Theme Toggle** — Switch between dark and light mode (persisted in localStorage)
- **🔊 Sound Effects** — Subtle audio feedback on send/receive/complete (toggleable)
- **⏱️ Hover Timestamps** — Hover any chat bubble to see the exact send time
- **📊 Progress Bar** — Visual progress of device input completion
- **⌨️ Keyboard Shortcuts** — Press 1–9 to tap quick action buttons
- **↩️ Undo Last Device** — Remove the last added device with one click
- **💰 Running Cost Preview** — Floating badge showing estimated cost as you add devices
- **⚡ Instant Responses** — Quick-tap buttons trigger instant bot replies (no typing delay)
- **📱 Mobile Responsive** — Fully responsive with sidebar navigation
- **✨ Glassmorphism UI** — Futuristic dark-themed glass cards with gradient accents
- **🎞️ Framer Motion** — Smooth page transitions, chat animations, chart reveals
- **🔢 Animated Counters** — CountUp animations for all numeric values

---

## 🛠️ Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| Framework     | Next.js 14 (App Router) |
| Language      | TypeScript 5            |
| Styling       | Tailwind CSS 3          |
| Animations    | Framer Motion 12        |
| Charts        | Recharts 3              |
| PDF           | jsPDF + jspdf-autotable |
| Screenshots   | html2canvas             |
| Confetti      | canvas-confetti         |
| Notifications | react-hot-toast         |
| Icons         | react-icons             |
| Counters      | react-countup           |
| HTTP          | Axios                   |

---

## 📁 Project Structure

```
energy-calculator/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-suggestions/
│   │   │   │   └── route.ts              # POST — AI-powered energy suggestions
│   │   │   ├── electricity-rate/
│   │   │   │   └── route.ts              # GET  — Electricity rate by country
│   │   │   └── energy-tips/
│   │   │       └── route.ts              # GET  — Random energy-saving tips
│   │   ├── calculator/
│   │   │   └── page.tsx                  # Calculator page (chat + charts + share)
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Dashboard with stats & charts
│   │   ├── history/
│   │   │   └── page.tsx                  # Calculation history viewer
│   │   ├── fonts/                        # Custom fonts (Geist)
│   │   ├── favicon.ico
│   │   ├── globals.css                   # Global styles + glassmorphism + light theme
│   │   ├── layout.tsx                    # Root layout with AppShell
│   │   └── page.tsx                      # Landing / Home page with animated stats
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CostBreakdownChart.tsx    # Horizontal cost breakdown chart
│   │   │   ├── EnergyBarChart.tsx         # Daily vs monthly bar chart
│   │   │   └── EnergyPieChart.tsx         # Device distribution pie chart
│   │   ├── layout/
│   │   │   ├── AppShell.tsx              # Main layout wrapper with sidebar
│   │   │   ├── Header.tsx                # Sticky header with theme toggle
│   │   │   └── Sidebar.tsx               # Navigation sidebar
│   │   ├── ChatBot.tsx                   # Main chatbot component (all features)
│   │   └── ThemeToggle.tsx               # Dark/light theme toggle button
│   └── utils/
│       ├── constants.ts                  # Device data, wattages, icons, tooltips, AI rules, tips
│       ├── helpers.ts                    # Calculations, localStorage, CSV export, share helpers
│       ├── pdf.ts                        # PDF report generation
│       └── types.ts                      # TypeScript interfaces & types
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

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

Returns electricity rate for the specified country.

```json
{
  "country": "India",
  "rate_per_kwh": 8,
  "currency": "₹",
  "last_updated": "2026-02-17T..."
}
```

**Supported countries:** `india`, `usa`, `uk`, `germany`, `australia`, `canada`, `japan`, `brazil`

### `GET /api/energy-tips`

Returns 4 random energy-saving tips with icon, title, and description.

### `POST /api/ai-suggestions`

Generates personalized AI-powered energy-saving suggestions based on actual device usage.

**Request body:**

```json
{
  "devices": [
    {
      "type": "AC",
      "quantity": 2,
      "wattage": 1500,
      "hoursPerDay": 8,
      "monthlyKwh": 720,
      "monthlyCost": 5760
    }
  ],
  "totalMonthlyCost": 5760,
  "currency": "₹"
}
```

**Response:**

```json
{
  "suggestions": [
    {
      "icon": "❄️",
      "title": "AC Optimization",
      "description": "Consider upgrading to a 5-star inverter AC — saves up to 40% energy",
      "savingsEstimate": "Save ~₹1152/mo (15-30%)",
      "priority": "high"
    }
  ],
  "totalPotentialSavings": "₹1037/month"
}
```

---

## 🏃 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhishek8211/ChatBot.git

# Navigate to project directory
cd energy-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

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

## 🎨 UI Design

- **Dark mode** by default with glassmorphism cards
- **Light mode** with comprehensive theme overrides
- **Gradient accent** colors (teal `#20c997` → blue `#339af0`)
- **ChatGPT-style** conversational interface with typing indicators
- **Apple-inspired** dashboard layout
- **Smooth animations** on every interaction (Framer Motion)
- **Mobile-first** responsive design with collapsible sidebar

---

## ⌨️ Keyboard Shortcuts

| Key     | Action                                    |
| ------- | ----------------------------------------- |
| `1`–`9` | Tap the corresponding quick action button |
| `Enter` | Send typed message                        |

---

## 🗂️ Export Options

| Format        | Description                                             |
| ------------- | ------------------------------------------------------- |
| **PDF**       | Full report with device table, summary, and energy tips |
| **CSV**       | Spreadsheet-friendly export with device data and totals |
| **PNG Image** | Screenshot of results section via html2canvas           |
| **Twitter**   | Pre-filled tweet with energy stats and cost             |

---

## 🧠 AI Suggestion Engine

The AI suggestion engine analyzes your specific device configuration and generates personalized recommendations:

1. **Devices sorted by cost** — highest consumers get priority
2. **Rule-based tips** — curated suggestions per device type from `AI_SUGGESTION_RULES`
3. **Priority classification** — `high` (>30% of bill), `medium` (>10%), `low` (<10%)
4. **Savings estimates** — calculated based on actual usage data
5. **General suggestions** — solar panels (if bill > ₹500), smart home automation (if 5+ devices)

---

## 📜 License

MIT — free to use, modify, and distribute.

---

Built with 💚 by [Abhishek](https://github.com/Abhishek8211) for a greener planet.
