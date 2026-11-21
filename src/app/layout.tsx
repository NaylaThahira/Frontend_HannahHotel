import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hannah Hotel Syari'ah",
  description: "Kenyamanan Islami di Sumatera Barat — Padang & Painan",
};

const BRANCH_INTRO_GUARD_SCRIPT = `(function(){try{var p=window.location.pathname;if(p!=='/padang'&&p!=='/painan')return;var nav=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];if(nav&&nav.type==='reload')return;var branch=p.slice(1);var ref=document.referrer?new URL(document.referrer):null;var fromPortal=Boolean(ref&&ref.origin===window.location.origin&&ref.pathname==='/');var pending=sessionStorage.getItem('hannah_branch_intro');if(fromPortal||pending===branch){document.documentElement.setAttribute('data-branch-entering',branch);setTimeout(function(){document.documentElement.removeAttribute('data-branch-entering');},4000);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={cn("font-sans", inter.variable, playfair.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BRANCH_INTRO_GUARD_SCRIPT }} />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
