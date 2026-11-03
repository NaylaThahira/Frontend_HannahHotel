import ListingFilters from '@/components/ListingFilters'
import { matchesListingSearch } from '@/lib/listing-search'
import Image from 'next/image'
import Link from 'next/link'
import PageIntro from '@/components/PageIntro'

async function getRooms(location?: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/rooms${location ? `?location=${location}` : ''}`, { cache: 'no-store' });
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

export default async function RoomsListing({ location, query = '' }: { location?: 'padang' | 'painan'; query?: string }) {
  const [rooms, settings] = await Promise.all([getRooms(location), getSettings()]);
  const filteredRooms = rooms.filter((room: { name: string; description?: string }) => matchesListingSearch(room.name, room.description, query));
  const roomsSubtitle = settings[location === 'padang' ? 'rooms_subtitle_padang' : 'rooms_subtitle'] || "Temukan ruang istirahat yang dirancang untuk ketenangan Anda. Setiap kamar menghadirkan kenyamanan modern dalam suasana yang hangat dan sesuai prinsip Syari'ah.";

  return (
    <>
      <PageIntro patterned title={location ? `Kamar Hannah Hotel ${location === 'padang' ? 'Padang' : 'Painan'}` : 'Kamar Hannah Hotel'} description={roomsSubtitle} />
      <section className="bg-cream px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          <ListingFilters location={location} query={query} kind="rooms" />
          {(location ? [location] : ['padang', 'painan']).map(branch => (
            <section key={branch} aria-label={`Kamar ${branch}`}>
              {!filteredRooms.some((room: any) => room.location === branch) && <p className="rounded-lg border border-primary/10 bg-white p-8 text-secondary">{query ? `Tidak ada kamar ${branch === 'padang' ? 'Padang' : 'Painan'} yang cocok dengan pencarian "${query}".` : `Kamar ${branch === 'padang' ? 'Padang' : 'Painan'} belum tersedia.`}</p>}
              <div className="grid gap-8 md:grid-cols-2">
          {filteredRooms.filter((room: any) => room.location === branch).map((room: any) => (
            <article key={room.id} className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-72 overflow-hidden bg-[#e5e2e1]">
                {room.imageUrl ? (
                  <Image 
                    src={room.imageUrl.startsWith('http') || room.imageUrl.startsWith('/') ? (room.imageUrl.startsWith('/assets') ? room.imageUrl : `http://localhost:5000${room.imageUrl}`) : room.imageUrl} 
                    alt={room.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">No Image</div>
                )}
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-primary">{room.name}</h2>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-secondary/65">{room.note}</p>
                  </div>
                  <p className="w-fit rounded-full bg-peach px-3 py-1.5 text-sm font-bold text-orange-ink">{room.price}<span className="font-normal"> / malam</span></p>
                </div>
                <p className="mt-5 leading-7 text-secondary">{room.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Fasilitas ${room.name}`}>
                  {(room.facilities || []).map((amenity: any, i: number) => {
                    const name = typeof amenity === 'string' ? amenity : amenity.name;
                    return (
                      <li key={`${name}-${i}`} className="rounded-full bg-[#eae7e7] px-3 py-1.5 text-xs font-medium text-secondary">
                        {name}
                      </li>
                    );
                  })}
                </ul>
                <Link href={`/rooms/${room.id}`} className="mt-6 flex w-full items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white">
                  Lihat Detail
                </Link>
              </div>
            </article>
          ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
