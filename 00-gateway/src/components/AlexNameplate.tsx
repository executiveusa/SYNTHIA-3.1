"use client";
import { motion } from "framer-motion";
import React from "react";
import { useTranslations } from "next-intl";

const sparkles = [
  { top: "-4px", left: "10%", delay: "0s", size: "3px" },
  { top: "-5px", left: "45%", delay: "0.4s", size: "2.5px" },
  { top: "-3px", left: "80%", delay: "0.8s", size: "3.5px" },
  { top: "50%", left: "-5px", delay: "1.2s", size: "2.5px" },
  { top: "50%", right: "-5px", left: "auto", delay: "0.6s", size: "3px" },
];

const AgentAlexLogo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-0.5"
  >
    <path
      d="M18 2 L32 10 L32 26 L18 34 L4 26 L4 10 Z"
      stroke="#FFD700"
      strokeWidth="1.5"
      fill="rgba(255,215,0,0.08)"
    />
    <circle cx="18" cy="5.5" r="1.5" fill="#FFD700" opacity="0.7" />
    <circle cx="29.5" cy="12" r="1.5" fill="#FFD700" opacity="0.7" />
    <circle cx="29.5" cy="24" r="1.5" fill="#FFD700" opacity="0.7" />
    <circle cx="18" cy="30.5" r="1.5" fill="#FFD700" opacity="0.7" />
    <circle cx="6.5" cy="24" r="1.5" fill="#FFD700" opacity="0.7" />
    <circle cx="6.5" cy="12" r="1.5" fill="#FFD700" opacity="0.7" />
    <text
      x="18"
      y="23"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
      fill="#FFD700"
    >
      A
    </text>
  </svg>
);

function AlexNameplate() {
  const t = useTranslations("Nameplate");

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 1.2 }}
      className="fixed bottom-[22%] left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none"
    >
      <div
        className="relative px-4 py-1.5 rounded-sm border border-yellow-600/50"
        style={{
          background:
            "linear-gradient(180deg, rgba(50,40,10,0.85) 0%, rgba(20,15,5,0.95) 100%)",
          boxShadow:
            "0 0 9px 2px rgba(255,215,0,0.35), 0 0 2px 1px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,215,0,0.3)",
        }}
      >
        {/* Sparkle dots */}
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="sparkle-dot absolute rounded-full bg-yellow-300"
            style={{
              width: s.size,
              height: s.size,
              top: s.top,
              left: s.left,
              right: (s as any).right,
              animationDelay: s.delay,
            }}
          />
        ))}

        {/* Top accent line */}
        <div
          className="absolute top-0 left-2 right-2 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #FFD700, transparent)",
          }}
        />

        <AgentAlexLogo />

        {/* ALEX™ text */}
        <div className="flex items-start justify-center gap-0.5">
          <span
            className="nameplate-text text-base font-black tracking-[0.3em] uppercase"
            style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
          >
            ALEX
          </span>
          <span
            className="text-yellow-400 text-[8px] font-bold mt-0.5"
            style={{ WebkitTextFillColor: "#FBBF24" }}
          >
            ™
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-center text-yellow-600/70 text-[7px] tracking-[0.25em] uppercase mt-0.5">
          {t("subtitle")}
        </p>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-2 right-2 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #FFD700, transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}

export default AlexNameplate;
