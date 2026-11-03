import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { branchImageUrl, defaultBranches, type HotelBranch } from '@/lib/branches';

async function getBranches(): Promise<HotelBranch[]> {
  try {
    const response = await fetch('http://localhost:5000/api/branches', { cache: 'no-store' });
    if (!response.ok) throw new Error('Gagal mengambil informasi cabang');
    return await response.json();
  } catch (error) { console.error(error); return defaultBranches; }
}

export default async function FeaturedRooms() {
  const branches = await getBranches();
  return (
    <section id="rooms" className="scroll-mt-20 bg-cream px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">Temukan Cabang Pilihan Anda</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">Informasi Cabang Hotel</h2>
          <span className="mx-auto mt-5 block h-1 w-24 bg-orange" />
        </div>
        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {branches.map(branch => (
            <article key={branch.id} className="group flex flex-col overflow-hidden rounded-lg border border-[#e5e2e1] bg-cream shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden bg-mint/20">
                {branch.imageUrl ? <Image src={branchImageUrl(branch.imageUrl)} alt={branch.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-secondary">Hannah Hotel {branch.id === 'padang' ? 'Padang' : 'Painan'}</div>}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-semibold text-ink">{branch.title}</h3>
                <p className="mt-4 whitespace-pre-line leading-7 text-secondary">{branch.description}</p>
                <p className="mt-4 flex items-start gap-2 whitespace-pre-line text-sm font-semibold text-primary"><MapPin size={18} className="mt-0.5 shrink-0" />{branch.location}</p>
                <div className="flex-1" />
                <Link href={`/rooms/${branch.id}`} className="mt-6 flex w-full items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white">Lihat Detail</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
