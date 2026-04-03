import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import CursorGlow from "../components/CursorGlow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "stables info — Stablecoin Risk Intelligence",
  description: "Real-time monitoring of 62+ stablecoins across 141 blockchains",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <CursorGlow />
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 ml-0 md:ml-[220px] pt-16 md:pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}
