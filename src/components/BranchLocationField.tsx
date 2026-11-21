'use client';

import { useEffect, useState } from 'react';
import { Building2, Lock, MapPin } from 'lucide-react';
import { type HotelBranch } from '@/lib/branches';
import { API_URL } from '@/lib/api';

export function BranchSelector({
  value,
  branches = [],
  ownLocation,
  showAddress = true,
}: {
  value: string;
  branches?: HotelBranch[];
  showAddress?: boolean;
  onChange?: (location: string) => void;
  ownLocation?: string;
}) {
  const activeLocation = ownLocation === 'padang' || ownLocation === 'painan'
    ? ownLocation
    : value === 'padang'
      ? 'padang'
      : 'painan';
  const branchName = activeLocation === 'padang'
    ? "Hannah Hotel Syari'ah Padang"
    : "Hannah Hotel Syari'ah Painan";
  const selected = branches.find((branch) => branch.id === activeLocation);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-semibold text-primary">
          Lokasi Cabang Hotel
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-mint/25 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          <Lock size={11} />
          Cabang Aktif
        </span>
      </div>
      <div
        data-active-branch={activeLocation}
        className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-mint/10 px-4 py-3 text-sm font-semibold text-primary"
      >
        <Building2 size={16} className="shrink-0 text-primary" />
        <span>{branchName}</span>
      </div>
      {showAddress && selected?.location && (
        <p aria-live="polite" className="flex items-start gap-2 rounded-lg bg-mint/20 p-3.5 text-sm text-secondary">
          <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
          <span className="whitespace-pre-line">{selected.location}</span>
        </p>
      )}
    </div>
  );
}

export default function BranchLocationField({
  value,
  onChange,
  ownLocation,
}: {
  value: string;
  onChange?: (location: string) => void;
  ownLocation: string;
}) {
  const [branches, setBranches] = useState<HotelBranch[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/api/branches`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Gagal memuat alamat cabang');
        const data = await response.json();
        if (active) setBranches(data);
      })
      .catch(() => {
        if (active) setError('Gagal memuat alamat cabang. Buka ulang form untuk mencoba lagi.');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <BranchSelector value={value} branches={branches} onChange={onChange} ownLocation={ownLocation} />
      {error && (
        <p role="status" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
