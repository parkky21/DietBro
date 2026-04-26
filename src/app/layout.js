import "./globals.css";

export const metadata = {
  title: "Diet Bro — no cap, this diet slaps 🔥",
  description: "Stop eating like an NPC and start fueling like a main character.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
