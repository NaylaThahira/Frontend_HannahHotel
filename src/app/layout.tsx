import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Hannah Hotel Syari'ah",
  description: "Kenyamanan Islami di jantung Kota Painan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body className="min-h-screen overflow-x-hidden bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
