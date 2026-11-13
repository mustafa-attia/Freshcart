import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshCart — A better kind of everyday",
  description:
    "Thoughtfully sourced everyday essentials, fresh finds, and small joys delivered to your door.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body className="flex min-h-full flex-col bg-background text-navy">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
