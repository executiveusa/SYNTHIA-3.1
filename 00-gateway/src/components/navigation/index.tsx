"use client";

import { BtnList } from "@/data";
import React from "react";
import NavButton from "./NavButton";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import useScreenSize from "../hooks/useScreenSize";
import ResponsiveComponent from "../ResponsiveComponent";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

function Navigation() {
  const t = useTranslations("Nav");
  const angleIncrement = 360 / BtnList.length;
  const size = useScreenSize()!;
  const isLarge = size >= 1024;
  const isMedium = size >= 768;

  const translatedBtnList = BtnList.map((btn) => ({
    ...btn,
    label: t(btn.icon as any) ?? btn.label,
  }));

  return (
    <div className="fixed h-screen flex items-center justify-center w-full">
      <ResponsiveComponent>
        {({ size }) => {
          return size && size >= 480 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="w-max flex items-center justify-center relative hover:pause animate-spin-slow group"
            >
              {translatedBtnList.map((btn, index) => {
                const angleRad = (index * angleIncrement * Math.PI) / 180;
                const radius = isLarge
                  ? "calc(20vw - 1rem)"
                  : isMedium
                  ? "calc(30vw - 1rem)"
                  : "calc(40vw - 1rem)";

                const x = `calc(${radius}*${Math.cos(angleRad)})`;
                const y = `calc(${radius}*${Math.sin(angleRad)})`;

                return (
                  <NavButton
                    key={btn.label}
                    x={x}
                    y={y}
                    {...btn}
                    labelDirection="right"
                  />
                );
              })}
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="w-full px-2.5 xs:p-0 xs:w-max flex flex-col space-y-4 item-start xs:items-center justify-center relative  group xs:hidden"
              >
                {translatedBtnList.slice(0, translatedBtnList.length / 2).map((btn) => {
                  return (
                    <NavButton
                      key={btn.label}
                      x={"0"}
                      y={"0"}
                      {...btn}
                      labelDirection="right"
                    />
                  );
                })}
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="w-full px-2.5 xs:p-0 xs:w-max flex flex-col space-y-4 items-end xs:items-center justify-center relative group xs:hidden"
              >
                {translatedBtnList.slice(translatedBtnList.length / 2, translatedBtnList.length).map(
                  (btn) => {
                    return (
                      <NavButton
                        key={btn.label}
                        x={"0"}
                        y={"0"}
                        {...btn}
                        labelDirection="left"
                      />
                    );
                  }
                )}
              </motion.div>
            </>
          );
        }}
      </ResponsiveComponent>
    </div>
  );
}

export default Navigation;
