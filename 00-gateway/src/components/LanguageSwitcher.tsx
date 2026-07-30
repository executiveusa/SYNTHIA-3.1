"use client";
import { useTranslations } from "next-intl";

function LanguageSwitcher() {
  const t = useTranslations("Lang");

  const toggle = () => {
    const current = document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] || "es";
    const next = current === "es" ? "en" : "es";
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-4 left-2.5 xs:left-4 z-50 custom-bg w-10 h-10 xs:w-14 xs:h-14 rounded-full flex items-center justify-center text-foreground hover:text-accent text-[10px] xs:text-xs font-bold tracking-widest transition-colors"
      aria-label="Switch language"
    >
      {t("toggle")}
    </button>
  );
}

export default LanguageSwitcher;
