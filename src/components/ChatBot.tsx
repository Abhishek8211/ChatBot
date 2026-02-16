"use client";

// ============================================
// ChatBot Component — Conversational energy calculator
// ============================================

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { ChatMessage, ChatStep, Device, DeviceType, CalculationResult } from "@/utils/types";
import { DEFAULT_WATTAGE, DEVICE_TYPES, DEVICE_ICONS } from "@/utils/constants";
import { generateId, calculateAllDevices, saveToHistory } from "@/utils/helpers";

interface ChatBotProps {
  onCalculationComplete: (result: CalculationResult) => void;
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

/** Single chat message bubble */
function ChatBubble({ message }: { message: ChatMessage }) {
  const isBot = message.role === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isBot ? "" : "justify-end"}`}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs flex-shrink-0">
          ⚡
        </div>
      )}
      <div
        className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? "glass-light rounded-tl-sm text-dark-50"
            : "bg-primary-500/15 border border-primary-500/20 rounded-tr-sm text-primary-300"
        }`}
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
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

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  // Send greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      addBotMessage(
        `👋 Hello! I'm <strong>EnergyIQ</strong>, your smart energy assistant.<br/><br/>I'll help you calculate your monthly electricity consumption and cost.<br/><br/>Let's start — <strong>how many electrical devices</strong> do you use at home?`
      );
      setStep("ask_device_count");
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Add bot message with typing delay */
  const addBotMessage = useCallback(
    (content: string, options?: string[]) => {
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
      }, 600 + Math.random() * 400);
    },
    []
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
    setInput("");
    processInput(trimmed);
  };

  /** Handle option click */
  const handleOptionClick = (option: string) => {
    if (isTyping) return;
    addUserMessage(option);
    processInput(option);
  };

  /** Process user input based on current step */
  const processInput = (userInput: string) => {
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
          `Great! You have <strong>${count} device${count > 1 ? "s" : ""}</strong>. Let's add them one by one.<br/><br/>📱 <strong>Device #1</strong> — What type of device is it?<br/><br/>Choose from: ${DEVICE_TYPES.map((d) => `<code>${DEVICE_ICONS[d]} ${d}</code>`).join(", ")}`
        );
        break;
      }

      case "ask_device_type": {
        const matchedType = DEVICE_TYPES.find(
          (d) => d.toLowerCase() === userInput.toLowerCase()
        );
        if (!matchedType) {
          addBotMessage(
            `I don't recognize that device. Please pick one from:<br/>${DEVICE_TYPES.map((d) => `<code>${DEVICE_ICONS[d]} ${d}</code>`).join(", ")}`
          );
          return;
        }
        setCurrentDevice({ type: matchedType });
        setStep("ask_quantity");
        addBotMessage(
          `${DEVICE_ICONS[matchedType]} <strong>${matchedType}</strong> — nice! How many of these do you have?`
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
          `Got it — <strong>${qty}x ${currentDevice.type}</strong>.<br/><br/>What's the wattage rating? The average for ${currentDevice.type} is about <strong>${suggestedWatt}W</strong>.<br/><br/>Type the wattage or just say <code>auto</code> to use the default.`
        );
        break;
      }

      case "ask_wattage": {
        let wattage: number;
        if (userInput.toLowerCase() === "auto" || userInput.toLowerCase() === "default") {
          wattage = DEFAULT_WATTAGE[currentDevice.type as DeviceType] || 100;
        } else {
          wattage = parseInt(userInput);
          if (isNaN(wattage) || wattage < 1 || wattage > 50000) {
            addBotMessage("Please enter a valid wattage (1–50000) or type <code>auto</code>.");
            return;
          }
        }
        setCurrentDevice((prev) => ({ ...prev, wattage }));
        setStep("ask_hours");
        addBotMessage(
          `⚡ <strong>${wattage}W</strong> — noted!<br/><br/>How many <strong>hours per day</strong> do you use this device on average?`
        );
        break;
      }

      case "ask_hours": {
        const hours = parseFloat(userInput);
        if (isNaN(hours) || hours < 0.1 || hours > 24) {
          addBotMessage("Please enter hours between 0.1 and 24.");
          return;
        }
        const device: Device = {
          id: generateId(),
          type: currentDevice.type as DeviceType,
          quantity: currentDevice.quantity || 1,
          wattage: currentDevice.wattage || 100,
          hoursPerDay: hours,
        };

        const dailyKwh = (device.wattage * device.quantity * device.hoursPerDay) / 1000;
        const monthlyKwh = dailyKwh * 30;

        const newDevices = [...devices, device];
        setDevices(newDevices);
        const nextIndex = deviceIndex + 1;
        setDeviceIndex(nextIndex);

        if (nextIndex < totalDeviceCount) {
          setStep("ask_device_type");
          addBotMessage(
            `✅ <strong>${DEVICE_ICONS[device.type]} ${device.type}</strong> added!<br/>` +
              `• Qty: ${device.quantity} | Wattage: ${device.wattage}W | Hours: ${device.hoursPerDay}h/day<br/>` +
              `• Daily: ${dailyKwh.toFixed(2)} kWh | Monthly: ${monthlyKwh.toFixed(2)} kWh<br/><br/>` +
              `📱 <strong>Device #${nextIndex + 1}</strong> — What type?<br/><br/>` +
              `${DEVICE_TYPES.map((d) => `<code>${DEVICE_ICONS[d]} ${d}</code>`).join(", ")}`
          );
        } else {
          // All devices added, calculate
          setStep("calculating");
          addBotMessage(
            `✅ <strong>${DEVICE_ICONS[device.type]} ${device.type}</strong> added!<br/>` +
              `• Qty: ${device.quantity} | Wattage: ${device.wattage}W | Hours: ${device.hoursPerDay}h/day<br/><br/>` +
              `All <strong>${totalDeviceCount} devices</strong> added! Let me calculate your energy consumption... 🔄`
          );

          // Run calculation after a delay
          setTimeout(() => {
            const result = calculateAllDevices(
              newDevices,
              rateData.rate,
              rateData.currency,
              rateData.country
            );
            saveToHistory(result);
            onCalculationComplete(result);

            setStep("result");
            const breakdown = result.devices
              .map(
                (d) =>
                  `${DEVICE_ICONS[d.device.type]} <strong>${d.device.type}</strong> (x${d.device.quantity}): ${d.monthlyKwh} kWh — ${rateData.currency}${d.monthlyCost} (${d.percentage}%)`
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
                `Type <code>reset</code> to calculate again, or <code>tips</code> for energy-saving advice! 💡`
            );
          }, 1500);
        }
        break;
      }

      case "result":
      case "tips": {
        if (userInput.toLowerCase() === "reset") {
          setDevices([]);
          setCurrentDevice({});
          setDeviceIndex(0);
          setTotalDeviceCount(0);
          setStep("ask_device_count");
          addBotMessage(
            "🔄 Reset! Let's start fresh.<br/><br/>How many electrical devices do you use at home?"
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
              `Type <code>reset</code> to calculate again!`
          );
        } else {
          addBotMessage(
            "Type <code>reset</code> to start a new calculation, or <code>tips</code> for energy-saving advice!"
          );
        }
        break;
      }

      default:
        break;
    }
  };

  /** Quick option buttons for device selection */
  const showQuickOptions = step === "ask_device_type";

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)] md:max-h-[600px]">
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
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Quick options */}
      {showQuickOptions && !isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-2"
        >
          <div className="flex flex-wrap gap-1.5">
            {DEVICE_TYPES.map((d) => (
              <button
                key={d}
                onClick={() => handleOptionClick(d)}
                className="px-3 py-1.5 text-xs rounded-full glass hover:bg-primary-500/15 hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200 border border-white/10"
              >
                {DEVICE_ICONS[d]} {d}
              </button>
            ))}
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
                ? "Enter hours per day..."
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
