"use client";

// ============================================
// ChatBot Component — Conversational energy calculator
// ============================================

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import {
  ChatMessage,
  ChatStep,
  Device,
  DeviceType,
  CalculationResult,
} from "@/utils/types";
import {
  DEFAULT_WATTAGE,
  DEVICE_TYPES,
  DEVICE_ICONS,
  DEVICE_TOOLTIPS,
} from "@/utils/constants";
import {
  generateId,
  calculateAllDevices,
  saveToHistory,
} from "@/utils/helpers";

interface ChatBotProps {
  onCalculationComplete: (result: CalculationResult) => void;
}

/** Tooltip for device education */
function DeviceTooltip({
  deviceType,
  children,
}: {
  deviceType: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const tooltip = DEVICE_TOOLTIPS[deviceType as DeviceType];
  if (!tooltip) return <>{children}</>;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 p-3 rounded-xl glass border border-white/10 shadow-xl text-left pointer-events-none"
          >
            <div className="text-xs font-semibold text-dark-50 mb-1.5">
              {DEVICE_ICONS[deviceType as DeviceType]} {deviceType}
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-primary-400">
                <span>⚡</span>
                <span>{tooltip.avgWattage}</span>
              </div>
              <div className="flex items-start gap-1.5 text-dark-200">
                <span>💡</span>
                <span>{tooltip.tip}</span>
              </div>
              <div className="flex items-start gap-1.5 text-dark-300">
                <span>📌</span>
                <span>{tooltip.funFact}</span>
              </div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 rotate-45 bg-dark-700 border-r border-b border-white/10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Typing indicator */
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs flex-shrink-0">
        ⚡
      </div>
      <div className="glass-light rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
        <span className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
        <span className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
      </div>
    </div>
  );
}

/** Single chat message bubble with hover timestamp */
function ChatBubble({ message }: { message: ChatMessage }) {
  const [showTime, setShowTime] = useState(false);
  const isBot = message.role === "bot";
  const timeStr = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isBot ? "" : "justify-end"}`}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs flex-shrink-0">
          ⚡
        </div>
      )}
      <div className="flex flex-col">
        <div
          className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isBot
              ? "glass-light rounded-tl-sm text-dark-50"
              : "bg-primary-500/15 border border-primary-500/20 rounded-tr-sm text-primary-300"
          }`}
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
        <AnimatePresence>
          {showTime && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[10px] text-dark-400 mt-0.5 ${
                isBot ? "" : "text-right"
              }`}
            >
              {timeStr}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/** Floating running cost total */
function RunningTotal({
  devices,
  rate,
  currency,
}: {
  devices: Device[];
  rate: number;
  currency: string;
}) {
  if (devices.length === 0) return null;

  const totalMonthlyKwh = devices.reduce(
    (sum, d) => sum + (d.wattage * d.quantity * d.hoursPerDay * 30) / 1000,
    0,
  );
  const cost = totalMonthlyKwh * rate;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-14 right-3 z-10 glass px-3 py-2 rounded-xl border border-primary-500/20 text-xs"
    >
      <div className="text-dark-300">Running total</div>
      <div className="text-primary-400 font-bold text-sm">
        {currency}
        {cost.toFixed(0)}
        <span className="text-dark-400 font-normal">/mo</span>
      </div>
      <div className="text-dark-400">{totalMonthlyKwh.toFixed(1)} kWh</div>
    </motion.div>
  );
}

export default function ChatBot({ onCalculationComplete }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<ChatStep>("greeting");
  const [isTyping, setIsTyping] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentDevice, setCurrentDevice] = useState<Partial<Device>>({});
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [totalDeviceCount, setTotalDeviceCount] = useState(0);
  const [rateData, setRateData] = useState({
    rate: 8,
    currency: "₹",
    country: "India",
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Play a subtle UI sound effect */
  const playSound = useCallback(
    (type: "send" | "receive" | "complete") => {
      if (!soundEnabled) return;
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.05;
        if (type === "send") {
          osc.frequency.value = 600;
          osc.type = "sine";
        } else if (type === "receive") {
          osc.frequency.value = 800;
          osc.type = "sine";
        } else {
          osc.frequency.value = 1000;
          osc.type = "triangle";
        }
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch {
        /* AudioContext not available */
      }
    },
    [soundEnabled],
  );

  // Toggle theme class on document root & sync with localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", !darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Scroll to latest message — shows the TOP of the new message
  // so long content like tips is readable from the start
  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Fetch electricity rate on mount
  useEffect(() => {
    fetch("/api/electricity-rate?country=india")
      .then((res) => res.json())
      .then((data) => {
        setRateData({
          rate: data.rate_per_kwh,
          currency: data.currency,
          country: data.country,
        });
      })
      .catch(() => {});
  }, []);

  // Send greeting on mount — instant, no artificial delay
  // Guard prevents duplicate in React Strict Mode (dev double-mount)
  const greetingSent = useRef(false);
  useEffect(() => {
    if (greetingSent.current) return;
    greetingSent.current = true;
    addBotMessage(
      `👋 Hello! I'm <strong>EnergyIQ</strong>, your smart energy assistant.<br/><br/>I'll help you calculate your monthly electricity consumption and cost.<br/><br/>Let's start — <strong>how many electrical devices</strong> do you use at home?`,
      undefined,
      true,
    );
    setStep("ask_device_count");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Add bot message with typing delay (or instant for quick actions) */
  const addBotMessage = useCallback(
    (content: string, options?: string[], instant = false) => {
      if (instant) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "bot",
            content,
            timestamp: new Date(),
            options,
          },
        ]);
        playSound("receive");
        return;
      }
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "bot",
            content,
            timestamp: new Date(),
            options,
          },
        ]);
        playSound("receive");
      }, 100);
    },
    [playSound],
  );

  /** Add user message */
  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      },
    ]);
  };

  /** Handle user input */
  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    addUserMessage(trimmed);
    playSound("send");
    setInput("");
    processInput(trimmed);
  };

  /** Handle option click */
  const handleOptionClick = (option: string) => {
    if (isTyping) return;
    addUserMessage(option === "__undo__" ? "↩️ Undo last device" : option);
    playSound("send");
    processInput(option);
  };

  /** Process user input based on current step */
  const processInput = (userInput: string) => {
    // Handle undo last device
    if (userInput === "__undo__" && devices.length > 0) {
      const updated = devices.slice(0, -1);
      setDevices(updated);
      setDeviceIndex(deviceIndex - 1);
      setStep("ask_device_type");
      addBotMessage(
        `↩️ Last device removed! You now have <strong>${updated.length}/${totalDeviceCount}</strong> devices.<br/><br/>` +
          `📱 <strong>Device #${deviceIndex}</strong> — What type?<br/><br/>` +
          `${DEVICE_TYPES.map((d) => `<code>${DEVICE_ICONS[d]} ${d}</code>`).join(", ")}`,
        undefined,
        true,
      );
      return;
    }

    switch (step) {
      case "ask_device_count": {
        const count = parseInt(userInput);
        if (isNaN(count) || count < 1 || count > 50) {
          addBotMessage("Please enter a valid number between 1 and 50.");
          return;
        }
        setTotalDeviceCount(count);
        setDeviceIndex(0);
        setStep("ask_device_type");
        addBotMessage(
          `Great! You have <strong>${count} device${count > 1 ? "s" : ""}</strong>. Let's add them one by one.<br/><br/>📱 <strong>Device #1</strong> — What type of device is it?<br/><br/>Choose from: ${DEVICE_TYPES.map((d) => `<code>${DEVICE_ICONS[d]} ${d}</code>`).join(", ")}`,
        );
        break;
      }

      case "ask_device_type": {
        const matchedType = DEVICE_TYPES.find(
          (d) => d.toLowerCase() === userInput.toLowerCase(),
        );
        if (!matchedType) {
          addBotMessage(
            `I don't recognize that device. Please pick one from:<br/>${DEVICE_TYPES.map((d) => `<code>${DEVICE_ICONS[d]} ${d}</code>`).join(", ")}`,
          );
          return;
        }
        setCurrentDevice({ type: matchedType });
        setStep("ask_quantity");
        addBotMessage(
          `${DEVICE_ICONS[matchedType]} <strong>${matchedType}</strong> — nice! How many of these do you have?`,
        );
        break;
      }

      case "ask_quantity": {
        const qty = parseInt(userInput);
        if (isNaN(qty) || qty < 1 || qty > 100) {
          addBotMessage("Please enter a valid quantity (1–100).");
          return;
        }
        setCurrentDevice((prev) => ({ ...prev, quantity: qty }));
        const suggestedWatt =
          DEFAULT_WATTAGE[currentDevice.type as DeviceType] || 100;
        setStep("ask_wattage");
        addBotMessage(
          `Got it — <strong>${qty}x ${currentDevice.type}</strong>.<br/><br/>What's the wattage rating? The average for ${currentDevice.type} is about <strong>${suggestedWatt}W</strong>.<br/><br/>Type the wattage or just say <code>auto</code> to use the default.`,
        );
        break;
      }

      case "ask_wattage": {
        let wattage: number;
        if (
          userInput.toLowerCase() === "auto" ||
          userInput.toLowerCase() === "default"
        ) {
          wattage = DEFAULT_WATTAGE[currentDevice.type as DeviceType] || 100;
        } else {
          wattage = parseInt(userInput);
          if (isNaN(wattage) || wattage < 1 || wattage > 50000) {
            addBotMessage(
              "Please enter a valid wattage (1–50000) or type <code>auto</code>.",
            );
            return;
          }
        }
        setCurrentDevice((prev) => ({ ...prev, wattage }));
        setStep("ask_hours");
        addBotMessage(
          `⚡ <strong>${wattage}W</strong> — noted!<br/><br/>How long do you use this device <strong>per day</strong>?<br/><br/>You can type:<br/>• Hours: <code>2</code> or <code>0.5</code><br/>• Minutes: <code>30m</code> or <code>45min</code><br/>• Both: <code>1h30m</code>`,
        );
        break;
      }

      case "ask_hours": {
        let hours: number;
        const input = userInput.trim().toLowerCase();

        // Parse "1h30m", "1h 30m", "2h30min" format
        const hhmm = input.match(/^(\d+(?:\.\d+)?)\s*h\s*(\d+)?\s*m(?:in)?$/i);
        // Parse "30m", "45min", "90min" format
        const minOnly = input.match(/^(\d+(?:\.\d+)?)\s*m(?:in)?$/i);

        if (hhmm) {
          hours =
            parseFloat(hhmm[1]) + (hhmm[2] ? parseFloat(hhmm[2]) / 60 : 0);
        } else if (minOnly) {
          hours = parseFloat(minOnly[1]) / 60;
        } else {
          hours = parseFloat(input);
        }

        if (isNaN(hours) || hours < 1 / 60 || hours > 24) {
          addBotMessage(
            "⚠️ Please enter a valid duration.<br/><br/>" +
              "Examples: <code>2</code> (hours), <code>30m</code> (minutes), <code>1h30m</code> (mixed)<br/>" +
              "Range: 1 minute to 24 hours.",
          );
          return;
        }

        // Round to 2 decimal places
        hours = Math.round(hours * 100) / 100;
        const device: Device = {
          id: generateId(),
          type: currentDevice.type as DeviceType,
          quantity: currentDevice.quantity || 1,
          wattage: currentDevice.wattage || 100,
          hoursPerDay: hours,
        };

        const dailyKwh =
          (device.wattage * device.quantity * device.hoursPerDay) / 1000;
        const monthlyKwh = dailyKwh * 30;

        // Format display time nicely
        const displayTime =
          device.hoursPerDay >= 1
            ? device.hoursPerDay % 1 === 0
              ? `${device.hoursPerDay}h`
              : `${Math.floor(device.hoursPerDay)}h ${Math.round((device.hoursPerDay % 1) * 60)}m`
            : `${Math.round(device.hoursPerDay * 60)}m`;

        const newDevices = [...devices, device];
        setDevices(newDevices);
        const nextIndex = deviceIndex + 1;
        setDeviceIndex(nextIndex);

        if (nextIndex < totalDeviceCount) {
          setStep("ask_device_type");
          addBotMessage(
            `✅ <strong>${DEVICE_ICONS[device.type]} ${device.type}</strong> added!<br/>` +
              `• Qty: ${device.quantity} | Wattage: ${device.wattage}W | Usage: ${displayTime}/day<br/>` +
              `• Daily: ${dailyKwh.toFixed(2)} kWh | Monthly: ${monthlyKwh.toFixed(2)} kWh<br/><br/>` +
              `📱 <strong>Device #${nextIndex + 1}</strong> — What type?<br/><br/>` +
              `${DEVICE_TYPES.map((d) => `<code>${DEVICE_ICONS[d]} ${d}</code>`).join(", ")}`,
          );
        } else {
          // All devices added, calculate
          setStep("calculating");
          addBotMessage(
            `✅ <strong>${DEVICE_ICONS[device.type]} ${device.type}</strong> added!<br/>` +
              `• Qty: ${device.quantity} | Wattage: ${device.wattage}W | Usage: ${displayTime}/day<br/><br/>` +
              `All <strong>${totalDeviceCount} devices</strong> added! Let me calculate your energy consumption... 🔄`,
          );

          // Run calculation after a delay
          setTimeout(() => {
            const result = calculateAllDevices(
              newDevices,
              rateData.rate,
              rateData.currency,
              rateData.country,
            );
            saveToHistory(result);
            onCalculationComplete(result);

            setStep("result");
            const breakdown = result.devices
              .map(
                (d) =>
                  `${DEVICE_ICONS[d.device.type]} <strong>${d.device.type}</strong> (x${d.device.quantity}): ${d.monthlyKwh} kWh — ${rateData.currency}${d.monthlyCost} (${d.percentage}%)`,
              )
              .join("<br/>");

            addBotMessage(
              `📊 <strong>Calculation Complete!</strong><br/><br/>` +
                `<strong>Device Breakdown:</strong><br/>${breakdown}<br/><br/>` +
                `━━━━━━━━━━━━━━━━━━<br/>` +
                `⚡ <strong>Daily Usage:</strong> ${result.totalDailyKwh} kWh<br/>` +
                `📅 <strong>Monthly Usage:</strong> ${result.totalMonthlyKwh} kWh<br/>` +
                `💰 <strong>Estimated Monthly Cost:</strong> <span style="color:#20c997;font-size:1.1em;font-weight:700">${rateData.currency}${result.totalMonthlyCost}</span><br/>` +
                `🌍 Rate: ${rateData.currency}${rateData.rate}/kWh (${rateData.country})<br/><br/>` +
                `Check the <strong>Charts</strong> section below for visual breakdown! 📈<br/>` +
                `You can also download a <strong>PDF report</strong> or view your <strong>History</strong>.<br/><br/>` +
                `Type <code>reset</code> to calculate again, <code>tips</code> for energy-saving advice, or <strong>ask me any electricity question</strong>! 💡`,
            );
          }, 1500);
        }
        break;
      }

      case "result":
      case "tips":
      case "free_ask": {
        if (userInput.toLowerCase() === "reset") {
          setDevices([]);
          setCurrentDevice({});
          setDeviceIndex(0);
          setTotalDeviceCount(0);
          setStep("ask_device_count");
          addBotMessage(
            "🔄 Reset! Let's start fresh.<br/><br/>How many electrical devices do you use at home?",
            undefined,
            true,
          );
        } else if (userInput.toLowerCase() === "tips") {
          setStep("tips");
          addBotMessage(
            `💡 <strong>Energy Saving Tips:</strong><br/><br/>` +
              `1. 💡 Switch to <strong>LED bulbs</strong> — save up to 75% on lighting.<br/>` +
              `2. ❄️ Set AC to <strong>24°C</strong> — each degree saves ~6% energy.<br/>` +
              `3. 🔌 <strong>Unplug idle devices</strong> — phantom loads = 5-10% of bill.<br/>` +
              `4. 🌀 Use <strong>ceiling fans</strong> instead of AC when possible.<br/>` +
              `5. ⭐ Buy <strong>5-star rated</strong> appliances — up to 45% less energy.<br/>` +
              `6. ☀️ Use <strong>natural light</strong> during daytime.<br/>` +
              `7. 🧺 Run washing machines on <strong>full loads</strong> only.<br/><br/>` +
              `Type <code>reset</code> to calculate again or ask me any electricity question!`,
            undefined,
            true,
          );
        } else {
          // Free-form electricity question → send to Gemini
          setStep("free_ask");
          setIsTyping(true);
          fetch("/api/gemini-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userInput }),
          })
            .then(async (res) => {
              const data = await res.json();
              setIsTyping(false);

              if (!res.ok) {
                // API returned an error status
                const errMsg = data.error || "Something went wrong. Please try again.";
                setMessages((prev) => [
                  ...prev,
                  {
                    id: generateId(),
                    role: "bot",
                    content:
                      `⚠️ ${errMsg}<br/><br/>` +
                      `Feel free to ask another question, type <code>reset</code> to calculate again, or <code>tips</code> for energy-saving advice!`,
                    timestamp: new Date(),
                  },
                ]);
                playSound("receive");
                return;
              }

              const answer = (
                data.answer ||
                "Sorry, I couldn't get an answer."
              ).replace(/\n/g, "<br/>");
              setMessages((prev) => [
                ...prev,
                {
                  id: generateId(),
                  role: "bot",
                  content:
                    `🤖 <strong>AI Answer:</strong><br/><br/>${answer}<br/><br/>` +
                    `Feel free to ask another question, type <code>reset</code> to calculate again, or <code>tips</code> for energy-saving advice!`,
                  timestamp: new Date(),
                },
              ]);
              playSound("receive");
            })
            .catch((err) => {
              console.error("Gemini chat fetch error:", err);
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: generateId(),
                  role: "bot",
                  content:
                    "⚠️ Sorry, I couldn't reach the AI service right now. Please try again in a moment.<br/><br/>" +
                    "Type <code>reset</code> to start a new calculation, or <code>tips</code> for energy-saving advice!",
                  timestamp: new Date(),
                },
              ]);
              playSound("receive");
            });
        }
        break;
      }

      default:
        break;
    }
  };

  /** Build quick-action buttons based on current step */
  const getQuickButtons = (): { label: string; value: string }[] => {
    switch (step) {
      case "ask_device_count":
        return [
          { label: "1️⃣ 1", value: "1" },
          { label: "2️⃣ 2", value: "2" },
          { label: "3️⃣ 3", value: "3" },
          { label: "4️⃣ 4", value: "4" },
          { label: "5️⃣ 5", value: "5" },
          { label: "🔟 10", value: "10" },
        ];
      case "ask_device_type":
        return [
          ...(devices.length > 0
            ? [{ label: "↩️ Undo", value: "__undo__" }]
            : []),
          ...DEVICE_TYPES.map((d) => ({
            label: `${DEVICE_ICONS[d]} ${d}`,
            value: d,
          })),
        ];
      case "ask_quantity":
        return [
          { label: "+1", value: "1" },
          { label: "+2", value: "2" },
          { label: "+3", value: "3" },
          { label: "+4", value: "4" },
          { label: "+5", value: "5" },
        ];
      case "ask_wattage": {
        const defaultW =
          DEFAULT_WATTAGE[currentDevice.type as DeviceType] || 100;
        return [
          { label: `⚡ Auto (${defaultW}W)`, value: "auto" },
          { label: "100W", value: "100" },
          { label: "500W", value: "500" },
          { label: "1000W", value: "1000" },
          { label: "1500W", value: "1500" },
        ];
      }
      case "ask_hours":
        return [
          { label: "15m", value: "15m" },
          { label: "30m", value: "30m" },
          { label: "45m", value: "45m" },
          { label: "1h", value: "1" },
          { label: "1h30m", value: "1h30m" },
          { label: "2h", value: "2" },
          { label: "4h", value: "4" },
          { label: "6h", value: "6" },
          { label: "8h", value: "8" },
          { label: "12h", value: "12" },
          { label: "24h", value: "24" },
        ];
      case "result":
      case "tips":
      case "free_ask":
        return [
          { label: "🔄 Reset", value: "reset" },
          { label: "💡 Tips", value: "tips" },
        ];
      default:
        return [];
    }
  };

  const quickButtons = getQuickButtons();
  const showQuickOptions = quickButtons.length > 0;

  /** Calculate progress percentage for the progress bar */
  const getProgress = (): number => {
    if (totalDeviceCount === 0) return 0;
    if (
      step === "result" ||
      step === "tips" ||
      step === "calculating" ||
      step === "free_ask"
    )
      return 100;

    const stepsPerDevice = 4;
    const totalSteps = totalDeviceCount * stepsPerDevice;
    const offsetMap: Record<string, number> = {
      ask_device_type: 0,
      ask_quantity: 1,
      ask_wattage: 2,
      ask_hours: 3,
    };

    const completed = deviceIndex * stepsPerDevice;
    const offset = offsetMap[step] ?? 0;
    return Math.min(((completed + offset) / totalSteps) * 100, 99);
  };

  const progress = getProgress();

  // Keyboard shortcuts — press 1-9 to tap quick buttons
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTyping) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < quickButtons.length) {
        e.preventDefault();
        handleOptionClick(quickButtons[idx].value);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isTyping, devices.length]);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)] md:max-h-[600px] relative">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm">
          ⚡
        </div>
        <div>
          <h3 className="text-sm font-semibold text-dark-50">EnergyIQ Bot</h3>
          <p className="text-xs text-primary-400">Online • Ready to help</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {devices.length > 0 && (
            <span className="text-xs text-dark-300 glass px-2 py-1 rounded-full">
              {devices.length}/{totalDeviceCount} devices
            </span>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xs px-2 py-1 rounded-full glass hover:bg-white/10 transition-all"
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-xs px-2 py-1 rounded-full glass hover:bg-white/10 transition-all"
            title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>
      </div>

      {/* Running cost total */}
      <RunningTotal
        devices={devices}
        rate={rateData.rate}
        currency={rateData.currency}
      />

      {/* Progress bar */}
      {totalDeviceCount > 0 && (
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between text-[10px] text-dark-300 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              ref={idx === messages.length - 1 ? lastMsgRef : undefined}
            >
              <ChatBubble message={msg} />
            </div>
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Quick action buttons */}
      {showQuickOptions && !isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-2"
        >
          <div className="flex flex-wrap gap-1.5">
            {quickButtons.map((btn) => {
              const isDeviceBtn =
                step === "ask_device_type" && btn.value !== "__undo__";
              const buttonEl = (
                <button
                  key={btn.value}
                  onClick={() => handleOptionClick(btn.value)}
                  className="px-3 py-1.5 text-xs rounded-full glass hover:bg-primary-500/15 hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200 border border-white/10"
                >
                  {btn.label}
                </button>
              );

              if (isDeviceBtn) {
                return (
                  <DeviceTooltip key={btn.value} deviceType={btn.value}>
                    {buttonEl}
                  </DeviceTooltip>
                );
              }
              return buttonEl;
            })}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              step === "ask_device_count"
                ? "Enter number of devices..."
                : step === "ask_device_type"
                  ? "Type device name or click above..."
                  : step === "ask_quantity"
                    ? "Enter quantity..."
                    : step === "ask_wattage"
                      ? "Enter wattage or type 'auto'..."
                      : step === "ask_hours"
                        ? "e.g. 2, 30m, 1h30m..."
                        : step === "free_ask"
                          ? "Ask any electricity question..."
                          : "Type a message..."
            }
            className="flex-1 px-4 py-2.5 rounded-xl glass text-sm text-dark-50 placeholder-dark-300 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
