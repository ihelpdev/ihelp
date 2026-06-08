import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "i-help — Professional Services, Transparently Delivered",
  description:
    "Connect with elite, background-checked professionals for home maintenance, plumbing, electrical and more. Secure escrow payments, real-time job tracking, and fixed-rate subscriptions.",
  keywords: ["home services", "professional", "plumbing", "electrical", "escrow", "marketplace"],
};

import DevAuthBypass from "@/components/DevAuthBypass";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <StoreProvider>
          {children}
          {/* <DevAuthBypass /> */}
        </StoreProvider>
      </body>
    </html>
  );
}
