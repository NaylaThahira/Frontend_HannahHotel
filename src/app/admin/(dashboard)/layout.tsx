"use client";

import { adminFetch, adminLocation, adminApi, adminBase } from '@/lib/admin-api';
import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import logoNavbar from "../../../assets/logo/logo-navbar.svg";
import { Phone } from 'lucide-react';

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
);
const RoomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>
);
const PromoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
);

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const location = adminLocation(pathname);
  const api = adminApi(location);
  const base = adminBase(location);
  const label = location === 'padang' ? 'Padang' : 'Painan';
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isCurrent = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await adminFetch(`${api}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Logout error", error);
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-admin-bg)] text-[var(--color-admin-text)]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-primary to-mint-ink border-r border-mint/10 z-20 flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 shrink-0 items-center justify-center px-6 border-b border-mint/10">
          <Link href={base} className="block relative w-36 h-12">
            <Image
              src={logoNavbar}
              alt="Hannah Hotel Syariah"
              fill
              className="object-contain brightness-0 invert"
              sizes="144px"
              priority
            />
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <Link
            href={base}
            prefetch={false}
            onMouseEnter={() => router.prefetch(base)}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isCurrent(base)
                ? 'bg-white/10 text-mint'
                : 'text-cream/70 hover:bg-white/5 hover:text-mint'
              }`}
          >
            <DashboardIcon />
            Dashboard
          </Link>
          <Link
            href={`${base}/rooms`}
            prefetch={false}
            onMouseEnter={() => router.prefetch(`${base}/rooms`)}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isCurrent(`${base}/rooms`)
                ? 'bg-white/10 text-mint'
                : 'text-cream/70 hover:bg-white/5 hover:text-mint'
              }`}
          >
            <RoomIcon />
            Manajemen Kamar
          </Link>

          <Link
            href={`${base}/facilities`}
            prefetch={false}
            onMouseEnter={() => router.prefetch(`${base}/facilities`)}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isCurrent(`${base}/facilities`)
                ? 'bg-white/10 text-mint'
                : 'text-cream/70 hover:bg-white/5 hover:text-mint'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /></svg>
            Manajemen Fasilitas
          </Link>

          <Link
            href={`${base}/packages`}
            prefetch={false}
            onMouseEnter={() => router.prefetch(`${base}/packages`)}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isCurrent(`${base}/packages`)
                ? 'bg-white/10 text-mint'
                : 'text-cream/70 hover:bg-white/5 hover:text-mint'
              }`}
          >
            <PromoIcon />
            Manajemen Paket
          </Link>

          <Link
            href={`${base}/contact`}
            prefetch={false}
            onMouseEnter={() => router.prefetch(`${base}/contact`)}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isCurrent(`${base}/contact`) ? 'bg-white/10 text-mint' : 'text-cream/70 hover:bg-white/5 hover:text-mint'}`}
          >
            <Phone className="h-5 w-5 shrink-0" />
            Manajemen Kontak
          </Link>

          <Link
            href={`${base}/galleries`}
            prefetch={false}
            onMouseEnter={() => router.prefetch(`${base}/galleries`)}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isCurrent(`${base}/galleries`)
                ? 'bg-white/10 text-mint'
                : 'text-cream/70 hover:bg-white/5 hover:text-mint'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
            Manajemen Galeri
          </Link>

          <Link
            href={`${base}/about`}
            prefetch={false}
            onMouseEnter={() => router.prefetch(`${base}/about`)}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isCurrent(`${base}/about`)
                ? 'bg-white/10 text-mint'
                : 'text-cream/70 hover:bg-white/5 hover:text-mint'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
            Manajemen Sejarah
          </Link>

          <Link
            href={`${base}/footer`}
            prefetch={false}
            onMouseEnter={() => router.prefetch(`${base}/footer`)}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isCurrent(`${base}/footer`)
                ? 'bg-white/10 text-mint'
                : 'text-cream/70 hover:bg-white/5 hover:text-mint'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
            Pengaturan Footer
          </Link>
        </nav>
        <div className="p-4 border-t border-mint/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-8 shadow-sm">
          <div className="flex items-center gap-x-4">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold">Dashboard Admin {label}</h1>
          </div>
          <div className="flex items-center gap-x-4">
            {/* User Profile */}
            <div className="flex items-center gap-x-3 pl-4 border-l border-gray-200">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-700">Admin {label}</p>
                <p className="text-xs text-gray-500">Hannah Hotel {label}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
