import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import FireFliesBackground from "@/components/FireFliesBackground";
import HomeBtn from "@/components/HomeButton";
import Sound from "@/components/Sound";
import Footer from "@/components/Footer";
import InviteOnlyModal from "@/components/InviteOnlyModal";
import { AvatarProvider } from "@/context/AvatarContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Agent Alex | Kupuri Media",
  description:
    "AI Agent Alex — Powered by Synthia 3.0™, created by Ivette Milo. Kupuri Media.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={clsx(
          inter.variable,
          dancingScript.variable,
          "bg-background text-foreground font-inter"
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <AvatarProvider>
            <HomeBtn />
            <LanguageSwitcher />
            {children}
            <FireFliesBackground />
            <Sound />
            <Footer />
            <InviteOnlyModal />
            <div id="my-modal"></div>
          </AvatarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
