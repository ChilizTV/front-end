import type { Metadata } from "next";
import "./globals.css";
import { Lexend } from "next/font/google";
import { PrivyWrapper } from "@/components/providers/PrivyWrapper";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChilizTV - Live Sports Betting Streaming",
  description: "Watch live sports matches and place bets in real-time with ChilizTV. Experience the thrill of live sports streaming and betting all in one platform.",
  icons: {
    icon: "/chiliz_icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.className} antialiased bg-black`}
      >
        <PrivyWrapper>
          {children}
        </PrivyWrapper>
      </body>
    </html>
  );
}
