import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./session-provider";
import { PartsRequestsProvider } from "../contexts/parts-requests-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harsh Telecom - Professional Mobile Repair Services",
  description: "Leading mobile repair services with expert technicians, premium parts, and dedicated customer support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PartsRequestsProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </PartsRequestsProvider>
      </body>
    </html>
  );
}