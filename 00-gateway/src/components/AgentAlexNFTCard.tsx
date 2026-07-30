"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

const KupuriLogo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-1.5 align-middle"
  >
    <rect
      x="2"
      y="2"
      width="24"
      height="24"
      rx="4"
      stroke="#FEFE5B"
      strokeWidth="1.5"
      fill="rgba(254,254,91,0.07)"
    />
    <text
      x="14"
      y="19"
      textAnchor="middle"
      fontSize="11"
      fontWeight="bold"
      fontFamily="Arial Black, Arial, sans-serif"
      fill="#FEFE5B"
    >
      KM
    </text>
  </svg>
);

function AgentAlexNFTCard() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("NFTCard");

  const fields = [
    { label: t("fieldTokenId"), value: "KM-ALEX-001" },
    { label: t("fieldColeccion"), value: "Kupuri Digital Identity" },
    { label: t("fieldCreadoPor"), value: "Ivette Milo" },
    { label: t("fieldMarca"), value: "Kupuri Media™" },
    { label: t("fieldPlataforma"), value: "Synthia 3.0™" },
    { label: t("fieldRegistro"), value: "Kupuri IP Chain" },
  ];

  return (
    <>
      {/* Toggle badge */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-3 xs:right-5 z-50 custom-bg rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest text-accent hover:shadow-glass-sm transition-all"
        aria-label={t("toggleLabel")}
      >
        NFT
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="nft-card"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-32 right-3 xs:right-5 z-50 w-64 xs:w-72"
          >
            <div className="custom-bg rounded-lg p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-accent/20 pb-2">
                <div className="flex items-center">
                  <KupuriLogo />
                  <div>
                    <p className="text-accent text-xs font-bold tracking-wider">
                      {t("agentName")}
                    </p>
                    <p className="text-muted text-[9px] tracking-widest">
                      {t("brand")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted hover:text-accent text-sm leading-none"
                  aria-label={t("closeLabel")}
                >
                  ✕
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-1.5">
                {fields.map((f) => (
                  <div key={f.label} className="flex justify-between items-start">
                    <span className="text-muted text-[9px] tracking-wider uppercase flex-shrink-0 mr-2">
                      {f.label}
                    </span>
                    <span className="text-foreground text-[10px] text-right font-medium">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div className="border-t border-accent/20 pt-2 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[9px] tracking-wider uppercase font-bold">
                  {t("status")}
                </span>
              </div>

              {/* Footer */}
              <p className="text-muted text-[8px] text-center tracking-wide">
                {t("footer")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AgentAlexNFTCard;
