import { headers } from 'next/headers';
import { Users, BedDouble } from "lucide-react";
import BranchManagement from '@/components/admin/BranchManagement';
import HomeManagement from "@/components/admin/HomeManagement";
import { SERVER_API_URL } from '@/lib/api';
import type { HotelBranch } from '@/lib/branches';

export default async function AdminDashboardPage() {
  const location = (await headers()).get('x-hotel-location') === 'padang' ? 'padang' : 'painan';
  const settingsKeys = location === 'painan'
    ? 'home_hero_title,home_hero_subtitle,home_hero_image,home_whatsapp_number,home_review_url,home_sections_order,tourist_attractions_json'
    : 'home_hero_title_padang,home_hero_subtitle_padang,home_hero_image_padang,home_whatsapp_number_padang,home_review_url_padang,home_sections_order_padang,tourist_attractions_padang_json';

  let roomTypesCount = "0";
  let ownBranch: HotelBranch | null = null;
  let settings: Record<string, string> | undefined = undefined;

  try {
    const [countRes, branchesRes, settingsRes] = await Promise.all([
      fetch(`${SERVER_API_URL}/api/rooms/count?location=${location}`, { cache: "no-store" }),
      fetch(`${SERVER_API_URL}/api/branches`, { cache: "no-store" }),
      fetch(`${SERVER_API_URL}/api/settings?keys=${settingsKeys}`, { cache: "no-store" }),
    ]);

    if (countRes.ok) {
      const data = await countRes.json();
      roomTypesCount = typeof data.count === 'number' ? data.count.toString() : "0";
    }
    if (branchesRes.ok) {
      const branches: HotelBranch[] = await branchesRes.json();
      ownBranch = branches.find(item => item.id === location) || null;
    }
    if (settingsRes.ok) {
      settings = await settingsRes.json();
    }
  } catch (error) {
    console.error("Failed to fetch admin dashboard data:", error);
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

      <BranchManagement initialBranch={ownBranch} />
      <div className="border-t border-gray-200 pt-8 mt-8">
        <HomeManagement initialSettings={settings} />
      </div>
    </div>
  );
}
