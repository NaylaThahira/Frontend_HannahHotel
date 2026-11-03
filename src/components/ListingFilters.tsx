'use client';

import { useId } from 'react';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BranchSelector } from './BranchLocationField';

export default function ListingFilters({ location, query, kind }: {
  location?: string; query: string; kind: 'rooms' | 'facilities' | 'packages';
}) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const label = kind === 'rooms' ? 'kamar' : kind === 'facilities' ? 'fasilitas' : 'paket';
  return <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
    <BranchSelector value={location || ''} showAddress={false} allowAll roomPaths={kind === 'rooms'} />
    <form className="space-y-3" onSubmit={event => {
      event.preventDefault();
      const search = String(new FormData(event.currentTarget).get('q') || '').trim();
      const nextParams = new URLSearchParams(params.toString());
      if (search) nextParams.set('q', search); else nextParams.delete('q');
      const suffix = nextParams.toString();
      router.push(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
    }}>
      <label htmlFor={id} className="block text-sm font-semibold text-primary">Cari {label}</label>
      <div className="flex overflow-hidden rounded-lg border border-primary/20 bg-white focus-within:ring-2 focus-within:ring-primary/20">
        <input key={query} id={id} name="q" type="search" defaultValue={query} placeholder={`Cari nama atau deskripsi ${label}...`} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-primary outline-none" />
        <button type="submit" aria-label={`Cari ${label}`} className="flex items-center justify-center border-l border-primary/20 px-4 text-primary transition hover:bg-mint/20"><Search size={20} aria-hidden="true" /></button>
      </div>
    </form>
  </div>;
}
