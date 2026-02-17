import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "react-hot-toast";
import CustomCursor from "@/components/CustomCursor";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EnergyIQ — Smart Energy Consumption Calculator",
  description:
    "AI-powered chatbot that calculates your home energy consumption, estimates monthly costs, and provides energy-saving tips.",
  keywords: "energy calculator, electricity cost, kWh, smart home, energy saving",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-900 text-dark-50`}
      >
        <CustomCursor />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#25262B",
              color: "#C1C2C5",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
