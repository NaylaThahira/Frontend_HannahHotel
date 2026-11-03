'use client';

import { useEffect, useId, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { type HotelBranch } from '@/lib/branches';

export function BranchSelector({ value, branches = [], onChange, ownLocation, showAddress = true, roomPaths = false, allowAll = false }: {
  value: string; allowAll?: boolean; roomPaths?: boolean; branches?: HotelBranch[]; showAddress?: boolean; onChange?: (location: string) => void; ownLocation?: string;
}) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const selected = branches.find(branch => branch.id === value);
  return <div className="space-y-3">
    <label htmlFor={id} className="block text-sm font-semibold text-primary">Lokasi Cabang Hotel</label>
    <select id={id} value={value} disabled={pending} onChange={event => {
      const location = event.target.value;
      if (onChange) onChange(location);
      else {
        const query = new URLSearchParams(params.toString());
        if (roomPaths || !location) query.delete('location'); else query.set('location', location);
        const target = roomPaths ? (location ? `/rooms/${location}` : '/rooms') : pathname;
        const suffix = query.toString();
        startTransition(() => router.push(suffix ? `${target}?${suffix}` : target, { scroll: false }));
      }
    }} className="w-full rounded-lg border border-primary/20 bg-white px-4 py-3 text-sm text-primary disabled:opacity-60">
      {(roomPaths || allowAll) && <option value="">Semua</option>}
      <option value="padang" disabled={!!ownLocation && ownLocation !== 'padang'}>Hannah Hotel Syari&apos;ah Padang</option>
      <option value="painan" disabled={!!ownLocation && ownLocation !== 'painan'}>Hannah Hotel Syari&apos;ah Painan</option>
    </select>
    {showAddress && <p aria-live="polite" className="flex items-start gap-2 rounded-lg bg-mint/20 p-4 text-sm text-secondary"><MapPin size={18} className="mt-0.5 shrink-0 text-primary" /><span className="whitespace-pre-line">{pending ? 'Memuat lokasi cabang...' : selected?.location || 'Lokasi cabang belum tersedia.'}</span></p>}
  </div>;
}

export default function BranchLocationField({ value, onChange, ownLocation }: { value: string; onChange: (location: string) => void; ownLocation: string }) {
  const [branches, setBranches] = useState<HotelBranch[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetch('http://localhost:5000/api/branches', { cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error('Gagal memuat alamat cabang');
      const data = await response.json();
      if (active) setBranches(data);
    }).catch(() => { if (active) setError('Gagal memuat alamat cabang. Buka ulang form untuk mencoba lagi.'); });
    return () => { active = false; };
  }, []);
  return <div><BranchSelector value={value} branches={branches} onChange={onChange} ownLocation={ownLocation} />{error && <p role="status" className="mt-2 text-sm text-red-600">{error}</p>}</div>;
}
