import Image from 'next/image'
import Link from 'next/link'
import PageIntro from '@/components/PageIntro'
import { SERVER_API_URL, resolveImageUrl } from '@/lib/api'

async function getRooms(location?: string) {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/rooms${location ? `?location=${location}` : ''}`, {
      next: { revalidate: 300, tags: ['rooms'] },
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/settings?keys=rooms_subtitle,rooms_subtitle_padang`, {
      next: { revalidate: 300, tags: ['settings'] },
    })
    if (!res.ok) return {}
    return res.json()
  } catch (error) {
    console.error(error)
    return {}
  }
}

export default async function RoomsListing({ location }: { location?: 'padang' | 'painan' }) {
  const [rooms, settings] = await Promise.all([getRooms(location), getSettings()])
  const roomsSubtitle =
    settings[location === 'padang' ? 'rooms_subtitle_padang' : 'rooms_subtitle'] ||
    "Temukan ruang istirahat yang dirancang untuk ketenangan Anda. Setiap kamar menghadirkan kenyamanan modern dalam suasana yang hangat dan sesuai prinsip Syari'ah."

  return (
    <>
      <PageIntro
        patterned
        title={location ? `Kamar Hannah Hotel ${location === 'padang' ? 'Padang' : 'Painan'}` : 'Kamar Hannah Hotel'}
        description={roomsSubtitle}
      />
      <section className="bg-cream px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          {(location ? [location] : ['padang', 'painan']).map((branch) => {
            const branchRooms = rooms.filter((room: any) => room.location === branch)
            return (
              <section key={branch} aria-label={`Kamar ${branch}`}>
                {branchRooms.length === 0 && (
                  <p className="rounded-lg border border-primary/10 bg-white p-8 text-secondary">
                    {`Kamar ${branch === 'padang' ? 'Padang' : 'Painan'} belum tersedia.`}
                  </p>
                )}
                <div className="grid gap-8 md:grid-cols-2">
                  {branchRooms.map((room: any, index: number) => (
                    <article
                      key={room.id}
                      className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-72 overflow-hidden bg-[#e5e2e1]">
                        {room.imageUrl ? (
                          <Image
                            src={resolveImageUrl(room.imageUrl)}
                            alt={room.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading={index < 2 ? 'eager' : 'lazy'}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-6 sm:p-7">
                        <div>
                          <h2 className="font-display text-3xl font-semibold text-primary">{room.name}</h2>
                          {room.note && (
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-secondary/65">
                              {room.note}
                            </p>
                          )}
                        </div>
                        <p className="mt-3 line-clamp-2 leading-7 text-secondary">{room.description}</p>
                        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Fasilitas ${room.name}`}>
                          {(room.facilities || []).map((amenity: any, i: number) => {
                            const name = typeof amenity === 'string' ? amenity : amenity.name
                            return (
                              <li
                                key={`${name}-${i}`}
                                className="rounded-full bg-[#eae7e7] px-3 py-1.5 text-xs font-medium text-secondary"
                              >
                                {name}
                              </li>
                            )
                          })}
                        </ul>
                        <Link
                          href={
                            location
                              ? `/${location}/rooms/${room.id}`
                              : `/${room.location || 'painan'}/rooms/${room.id}`
                          }
                          prefetch={false}
                          className="mt-6 flex w-full items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </section>
    </>
  )
}
