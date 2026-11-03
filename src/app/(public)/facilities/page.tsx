import ListingFilters from '@/components/ListingFilters'
import { matchesListingSearch } from '@/lib/listing-search'
import PageIntro from '@/components/PageIntro'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react';

async function getFacilities(location?: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/facilities${location ? `?location=${location}` : ''}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getSettings() {
  try {
    const res = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default async function FacilitiesPage({ searchParams }: { searchParams: Promise<{ location?: string; q?: string }> }) {
  const params = await searchParams;
  const query = (params.q || '').trim();
  const location = params.location === 'padang' || params.location === 'painan' ? params.location : undefined;
  const [facilities, settings] = await Promise.all([getFacilities(location), getSettings()]);
  const filteredFacilities = facilities.filter((item: { name: string; description?: string }) => matchesListingSearch(item.name, item.description, query));
  const facilitiesSubtitle = settings[location === 'padang' ? 'facilities_subtitle_padang' : 'facilities_subtitle'] || "Nikmati rangkaian fasilitas lengkap yang kami siapkan untuk mendukung kenyamanan, ketenangan, dan kebutuhan Anda selama menginap.";

  return (
    <>
      <PageIntro title="Fasilitas Hotel" description={facilitiesSubtitle} />
      <section className="bg-cream px-5 pb-24 pt-12 sm:px-8">
        <div className="mx-auto mb-8 max-w-6xl"><ListingFilters location={location} query={query} kind="facilities" /></div>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredFacilities.length === 0 && <p className="text-secondary">{query ? `Tidak ada fasilitas yang cocok dengan pencarian "${query}".` : location ? `Belum ada fasilitas untuk cabang ${location === 'padang' ? 'Padang' : 'Painan'}.` : 'Belum ada fasilitas yang tersedia.'}</p>}
          {filteredFacilities.map((facility: any) => {
            const IconComp = (LucideIcons as any)[facility.icon] || LucideIcons.Check;
            return (
              <article key={facility.id} className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-72 overflow-hidden bg-[#e5e2e1]">
                  {facility.imageUrl ? <Image src={facility.imageUrl.startsWith('http') ? facility.imageUrl : `http://localhost:5000${facility.imageUrl}`} alt={facility.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center bg-[#e8f5ee] text-primary"><IconComp size={64} strokeWidth={1.4} /></div>}
                </div>
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#e8f5ee] text-primary"><IconComp size={20} /></span><h2 className="font-display text-3xl font-semibold text-primary">{facility.name}</h2></div>{facility.price && <p className="rounded-full bg-peach px-3 py-1.5 text-sm font-bold text-orange-ink">{facility.price}</p>}</div>
                  <p className="mt-5 leading-7 text-secondary">{facility.description}</p>
                  {(facility.facilities || []).length > 0 && <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Detail ${facility.name}`}>{facility.facilities.map((item: any, index: number) => { const ItemIcon = (LucideIcons as any)[typeof item === 'string' ? 'Check' : item.icon] || LucideIcons.Check; const name = typeof item === 'string' ? item : item.name; return <li key={`${name}-${index}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#eae7e7] px-3 py-1.5 text-xs font-medium text-secondary"><ItemIcon size={14} />{name}</li> })}</ul>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  )
}
