"use client";

import {
  Github,
  Home,
  Instagram,
  Linkedin,
  Lock,
  Newspaper,
  NotebookText,
  Palette,
  Phone,
  Twitter,
  User,
  Youtube,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";
import ResponsiveComponent from "../ResponsiveComponent";
import { useAvatarContext } from "@/context/AvatarContext";

interface NavButtonProps {
  x: string;
  y: string;
  label: string;
  link: string;
  icon: string;
  newTab: boolean;
  labelDirection: string;
  isLocked?: boolean;
}

const getIcon = (icon: string) => {
  switch (icon) {
    case "blog":
      return <Newspaper className="w-full h-auto" strokeWidth={1.5} />;
    case "about":
      return <User className="w-full h-auto" strokeWidth={1.5} />;
    case "projects":
      return <Palette className="w-full h-auto" strokeWidth={1.5} />;
    case "contact":
      return <Phone className="w-full h-auto" strokeWidth={1.5} />;
    case "github":
      return <Github className="w-full h-auto" strokeWidth={1.5} />;
    case "linkedin":
      return <Linkedin className="w-full h-auto" strokeWidth={1.5} />;
    case "twitter":
      return <Twitter className="w-full h-auto" strokeWidth={1.5} />;
    case "instagram":
      return <Instagram className="w-full h-auto" strokeWidth={1.5} />;
    case "youtube":
      return <Youtube className="w-full h-auto" strokeWidth={1.5} />;
    case "resume":
      return <NotebookText className="w-full h-auto" strokeWidth={1.5} />;
    default:
      return <Home className="w-full h-auto" strokeWidth={1.5} />;
  }
};

const item = {
  hidden: { scale: 0 },
  show:   { scale: 1 },
};

function NavButton({
  x,
  y,
  label,
  link,
  icon,
  newTab,
  labelDirection,
  isLocked,
}: NavButtonProps) {
  const { triggerNoReaction, openInviteModal } = useAvatarContext();
  const [shaking, setShaking] = useState(false);

  const handleLockedClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerNoReaction();
    openInviteModal();
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const iconContent = (spinning: boolean) => (
    <span
      className={clsx(
        "relative flex items-center justify-center",
        spinning
          ? "w-14 h-14 p-4 animate-spin-slow-reverse group-hover:pause hover:text-accent"
          : "w-10 h-10 xs:w-14 xs:h-14 p-2.5 xs:p-4 hover:text-accent"
      )}
    >
      {getIcon(icon)}

      {/* Lock overlay for locked buttons */}
      {isLocked && (
        <span className="absolute bottom-1 right-1 text-accent/70">
          <Lock size={9} strokeWidth={2.5} />
        </span>
      )}

      <span className="peer bg-transparent absolute top-0 left-0 w-full h-full" />

      <span
        className={clsx(
          "absolute hidden peer-hover:block px-2 py-1 left-full mx-2 top-1/2 -translate-y-1/2 bg-background text-foreground text-sm rounded-md shadow-lg whitespace-nowrap",
          labelDirection === "left" ? "right-full left-auto" : ""
        )}
      >
        {label}
        {isLocked && (
          <Lock size={9} strokeWidth={2.5} className="inline ml-1 text-accent" />
        )}
      </span>
    </span>
  );

  const buttonClasses =
    "text-foreground rounded-full flex items-center justify-center custom-bg";

  return (
    <ResponsiveComponent>
      {({ size }) => {
        const spinning = !!(size && size >= 480);
        return spinning ? (
          <div
            className={clsx(
              "cursor-pointer z-50",
              spinning ? "absolute" : "w-fit"
            )}
            style={spinning ? { transform: `translate(${x}, ${y})` } : undefined}
          >
            {isLocked ? (
              <motion.button
                variants={item}
                onClick={handleLockedClick}
                onTouchStart={handleLockedClick}
                animate={shaking ? { x: [-7, 7, -5, 5, 0] } : { x: 0 }}
                transition={shaking ? { duration: 0.4 } : {}}
                className={buttonClasses}
                aria-label={label}
              >
                {iconContent(true)}
              </motion.button>
            ) : (
              <motion.a
                variants={item}
                href={link}
                target={newTab ? "_blank" : "_self"}
                rel={newTab ? "noopener noreferrer" : undefined}
                className={buttonClasses}
                aria-label={label}
              >
                {iconContent(true)}
              </motion.a>
            )}
          </div>
        ) : (
          <div className="w-fit cursor-pointer z-50">
            {isLocked ? (
              <motion.button
                variants={item}
                onClick={handleLockedClick}
                onTouchStart={handleLockedClick}
                animate={shaking ? { x: [-7, 7, -5, 5, 0] } : { x: 0 }}
                transition={shaking ? { duration: 0.4 } : {}}
                className={buttonClasses}
                aria-label={label}
              >
                {iconContent(false)}
              </motion.button>
            ) : (
              <motion.a
                variants={item}
                href={link}
                target={newTab ? "_blank" : "_self"}
                rel={newTab ? "noopener noreferrer" : undefined}
                className={buttonClasses}
                aria-label={label}
              >
                {iconContent(false)}
              </motion.a>
            )}
          </div>
        );
      }}
    </ResponsiveComponent>
  );
}

export default NavButton;
