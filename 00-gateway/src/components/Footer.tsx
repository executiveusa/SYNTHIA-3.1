"use client";
import { useTranslations } from "next-intl";

function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-10 py-1.5 px-4 border-t border-accent/15"
      style={{
        background: "rgba(27,27,27,0.55)",
        backdropFilter: "blur(8px)",
      }}
    >
      <p
        className="text-center text-accent/60 text-sm xs:text-base"
        style={{ fontFamily: "var(--font-dancing-script), cursive" }}
      >
        {t("text")}
      </p>
    </footer>
  );
}

export default Footer;
