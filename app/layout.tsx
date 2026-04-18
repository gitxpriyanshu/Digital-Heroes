import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Digital Heroes | Golf for Good",
  description: "The premier subscription platform for golfers who give back. Play golf, be a hero.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans bg-[#050505]", inter.variable)}>
      <body className="antialiased selection:bg-emerald-500/30">
        {children}
        <Toaster closeButton position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
