# ⚡ EnergyIQ — Smart Energy Consumption Calculator Chatbot

A modern, AI-powered chatbot web application that calculates home energy consumption based on user device inputs. It fetches real-time electricity tariff data, calculates total energy usage in kWh, and estimates monthly cost — all through a conversational chatbot interface.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

- **AI Chatbot** — Step-by-step conversational flow to input devices and calculate energy
- **Real-time Rates** — Mock API with rates for 8 countries (India, USA, UK, Germany, etc.)
- **Visual Charts** — Pie chart (device distribution), Bar chart (daily vs monthly), Cost breakdown
- **PDF Reports** — Download detailed energy reports with device breakdowns
- **Calculation History** — All calculations saved in localStorage
- **Energy Saving Tips** — Smart tips shown after every calculation
- **Dark Mode** — Futuristic glassmorphism UI with gradient accents
- **Animated Counters** — CountUp animations for all numeric values
- **Framer Motion** — Smooth page transitions, chat animations, chart reveals
- **Mobile Responsive** — Fully responsive with sidebar navigation

---

## 🛠️ Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| Framework     | Next.js 14 (App Router) |
| Language      | TypeScript              |
| Styling       | Tailwind CSS            |
| Animations    | Framer Motion           |
| Charts        | Recharts                |
| PDF           | jsPDF + jspdf-autotable |
| Notifications | react-hot-toast         |
| Icons         | react-icons             |
| Counters      | react-countup           |

---

## 📁 Project Structure

```
energy-calculator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── electricity-rate/route.ts   # GET /api/electricity-rate
│   │   │   └── energy-tips/route.ts        # GET /api/energy-tips
│   │   ├── calculator/page.tsx             # Calculator + Chatbot page
│   │   ├── dashboard/page.tsx              # Dashboard with stats & charts
│   │   ├── history/page.tsx                # Calculation history
│   │   ├── globals.css                     # Global styles + glassmorphism
│   │   ├── layout.tsx                      # Root layout
│   │   └── page.tsx                        # Landing / Home page
│   ├── components/
│   │   ├── charts/
│   │   │   ├── EnergyPieChart.tsx
│   │   │   ├── EnergyBarChart.tsx
│   │   │   └── CostBreakdownChart.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ChatBot.tsx
│   └── utils/
│       ├── types.ts
│       ├── constants.ts
│       ├── helpers.ts
│       └── pdf.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## ⚡ Calculation Logic

```
Energy (kWh) = (Wattage × Quantity × Hours per Day × 30) / 1000
Monthly Cost = Total kWh × Electricity Rate per kWh
```

---

## 🔌 API Routes

### `GET /api/electricity-rate?country=india`

Returns electricity rate for the specified country.

```json
{
  "country": "India",
  "rate_per_kwh": 8,
  "currency": "₹",
  "last_updated": "2026-02-16T..."
}
```

Supported countries: `india`, `usa`, `uk`, `germany`, `australia`, `canada`, `japan`, `brazil`

### `GET /api/energy-tips`

Returns 4 random energy-saving tips.

---

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd energy-calculator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🎨 UI Design

- **Dark mode** by default with glassmorphism cards
- **Gradient accent** colors (teal-blue energy theme)
- **ChatGPT-style** conversational interface
- **Apple-inspired** dashboard layout
- **Smooth animations** on every interaction
- **Mobile-first** responsive design

---

## 📊 Supported Devices (15)

AC • Fan • TV • Refrigerator • Washing Machine • Microwave • Water Heater • Light Bulb • Computer • Iron • Hair Dryer • Dishwasher • Electric Stove • Router • Phone Charger

---

## 📜 License

MIT — free to use, modify, and distribute.

Built with 💚 for a greener planet.
"# ChatBot" 
