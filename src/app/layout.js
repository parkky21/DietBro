import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata = {
  title: "Diet Bro — no cap, this diet slaps 🔥",
  description: "Stop eating like an NPC and start fueling like a main character.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
