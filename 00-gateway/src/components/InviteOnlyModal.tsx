"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, X } from "lucide-react";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useAvatarContext } from "@/context/AvatarContext";
import { useTranslations } from "next-intl";

const INVITE_CODE = process.env.NEXT_PUBLIC_INVITE_CODE ?? "kupuri2006";

function InviteOnlyModal() {
  const { showInviteModal, closeInviteModal, triggerNoReaction, triggerYesReaction } = useAvatarContext();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const t = useTranslations("InviteModal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === INVITE_CODE) {
      // Correct code: "yes" finger dip gesture, then close
      triggerYesReaction();
      setError(false);
      setTimeout(() => {
        setCode("");
        closeInviteModal();
      }, 900);
    } else {
      // Wrong code: Mexican "no" finger wag
      triggerNoReaction();
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleClose = () => {
    setCode("");
    setError(false);
    closeInviteModal();
  };

  if (typeof document === "undefined") return null;
  const modalRoot = document.getElementById("my-modal");
  if (!modalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {showInviteModal && (
        <motion.div
          key="invite-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            key="invite-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="custom-bg rounded-lg p-8 max-w-sm w-full mx-4 space-y-5 relative"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-muted hover:text-accent transition-colors"
              aria-label={t("closeLabel")}
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full custom-bg flex items-center justify-center">
                <Lock className="text-accent" size={22} strokeWidth={1.5} />
              </div>
              <h2 className="text-foreground font-semibold text-lg text-center">
                {t("title")}
              </h2>
              <p className="text-muted text-sm text-center leading-relaxed">
                {t("description")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <motion.div
                animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(false);
                  }}
                  placeholder={t("placeholder")}
                  className="w-full bg-background/30 border border-accent/30 rounded px-4 py-2.5 text-foreground text-sm placeholder-muted focus:outline-none focus:border-accent/70 transition-colors"
                />
                {error && (
                  <p className="text-red-400 text-xs mt-1 text-center">
                    {t("error")}
                  </p>
                )}
              </motion.div>

              <button
                type="submit"
                className="w-full py-2.5 border border-accent/40 rounded text-accent text-sm font-medium hover:shadow-glass-sm hover:border-accent/70 transition-all"
              >
                {t("submitBtn")}
              </button>
            </form>

            <p className="text-muted text-[10px] text-center tracking-wide">
              {t("footer")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
}

export default InviteOnlyModal;
