import { headers } from 'next/headers';
import Link from 'next/link';
import { Users, BedDouble } from "lucide-react";
import AttractionsManagement from '@/components/admin/AttractionsManagement';
import BranchManagement from '@/components/admin/BranchManagement';
import HomeManagement from "@/components/admin/HomeManagement";

export default async function AdminDashboardPage() {
  const location = (await headers()).get('x-hotel-location') === 'padang' ? 'padang' : 'painan';
  let roomTypesCount = "0";
  try {
    const res = await fetch(`http://localhost:5000/api/rooms?location=${location}`, { cache: "no-store" });
    if (res.ok) {
      const rooms = await res.json();
      roomTypesCount = rooms.length.toString();
    }
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }

  // Dummy data
  const totalVisits = "12.540";

  return (
    <div className="space-y-8">
      {/* Unified & Beautiful Dashboard Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#004d26] p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" id="patternId" width="100%" height="100%">
            <defs>
              <pattern id="a" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="scale(2) rotate(0)">
                <rect x="0" y="0" width="100%" height="100%" fill="hsla(0, 0%, 100%, 0)"/>
                <path d="M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z"  strokeWidth="0.5" stroke="hsla(144, 49%, 81%, 1)" fill="none"/>
              </pattern>
            </defs>
            <rect width="800%" height="800%" transform="translate(0,0)" fill="url(#a)"/>
          </svg>
        </div>
        
        <div className="relative z-10 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-cream tracking-tight">Ringkasan Performa</h2>
          <p className="mt-2 text-sm text-white/80 max-w-md">
            Pantau informasi utama properti Anda, dari ketersediaan fasilitas hingga interaksi pengunjung publik.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 lg:gap-12">
          {/* Room Types Card */}
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/10 p-3 text-mint backdrop-blur-sm border border-white/10 shadow-inner">
              <BedDouble size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-white/60">Jenis Kamar</p>
              <p className="text-4xl font-display font-bold text-cream leading-tight">{roomTypesCount}</p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block w-px h-16 bg-white/20 rounded-full"></div>

          {/* Visits Card */}
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/10 p-3 text-orange backdrop-blur-sm border border-white/10 shadow-inner">
              <Users size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-white/60">Total Kunjungan</p>
              <p className="text-4xl font-display font-bold text-cream leading-tight">{totalVisits}</p>
              <p className="text-[10px] text-white/40 mt-0.5">*Data traffic website</p>
            </div>
          </div>
        </div>
      </div>

      <BranchManagement />
      <div className="border-t border-gray-200 pt-8 mt-8">
        {location === 'painan' ? <HomeManagement /> : <><AttractionsManagement /><Link href="/adminPadang/rooms" className="inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-white">Manajemen Kamar Padang</Link></>}
      </div>
    </div>
  );
}
