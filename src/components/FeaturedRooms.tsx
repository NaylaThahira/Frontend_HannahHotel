import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { type HotelBranch } from '@/lib/branches'
import { getHotelBranches } from '@/lib/branch-server'
import { SERVER_API_URL, resolveImageUrl } from '@/lib/api'

async function getBranchRooms(location: 'padang' | 'painan') {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/rooms?location=${location}`, {
      next: { revalidate: 300, tags: ['rooms'] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function FeaturedRooms({
  branches: initialBranches,
  activeBranch,
  initialRooms,
}: {
  branches?: HotelBranch[]
  activeBranch?: 'padang' | 'painan'
  initialRooms?: any[]
}) {
  const branches = initialBranches ?? (await getHotelBranches())

  if (activeBranch) {
    const branchInfo = branches.find((b) => b.id === activeBranch)
    const rooms = initialRooms ?? (await getBranchRooms(activeBranch))
    const featuredOnly = rooms.filter((r: any) => r.isFeatured)
    const featuredRooms = (featuredOnly.length > 0 ? featuredOnly : rooms).slice(0, 2)
    const branchLabel = activeBranch === 'padang' ? 'Padang' : 'Painan'

    return (
      <section id="rooms" className="scroll-mt-20 bg-cream px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">
              Hannah Hotel Syari&apos;ah {branchLabel}
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">
              Pilihan Kamar {branchLabel}
            </h2>
            <span className="mx-auto mt-5 block h-1 w-24 bg-orange" />
            {branchInfo?.description && (
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-secondary">
                {branchInfo.description}
              </p>
            )}
            {branchInfo?.location && (
              <p className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                <MapPin size={16} className="shrink-0 text-orange" />
                <span>{branchInfo.location}</span>
              </p>
            )}
          </div>

          {featuredRooms.length === 0 ? (
            <div className="mt-12 rounded-xl border border-primary/10 bg-white p-10 text-center text-secondary shadow-sm">
              Katalog kamar untuk wilayah {branchLabel} akan segera tersedia.
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {featuredRooms.map((room: any, index: number) => (
                <article
                  key={room.id}
                  className="group flex flex-col overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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
                        Hannah Hotel {branchLabel}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-primary sm:text-3xl">
                        {room.name}
                      </h3>
                      {room.note && (
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-secondary/65">
                          {room.note}
                        </p>
                      )}
                    </div>
                    <p className="mt-3 line-clamp-2 leading-7 text-secondary">{room.description}</p>
                    <div className="flex-1" />
                    <Link
                      href={`/${activeBranch}/rooms/${room.id}`}
                      prefetch={false}
                      className="mt-6 flex w-full items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white"
                    >
                      Lihat Detail Kamar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href={`/${activeBranch}/rooms`}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-[#003d1f]"
            >
              Lihat Semua Kamar {branchLabel}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="rooms" className="scroll-mt-20 bg-cream px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange">Temukan Cabang Pilihan Anda</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl">Informasi Cabang Hotel</h2>
          <span className="mx-auto mt-5 block h-1 w-24 bg-orange" />
        </div>
        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {branches.map((branch) => (
            <article
              key={branch.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-[#e5e2e1] bg-cream shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden bg-mint/20">
                {branch.imageUrl ? (
                  <Image
                    src={resolveImageUrl(branch.imageUrl)}
                    alt={branch.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-secondary">
                    Hannah Hotel {branch.id === 'padang' ? 'Padang' : 'Painan'}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-semibold text-ink">{branch.title}</h3>
                <p className="mt-4 whitespace-pre-line leading-7 text-secondary">{branch.description}</p>
                <p className="mt-4 flex items-start gap-2 whitespace-pre-line text-sm font-semibold text-primary">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  {branch.location}
                </p>
                <div className="flex-1" />
                <Link
                  href={`/${branch.id}`}
                  className="mt-6 flex w-full items-center justify-center rounded-sm border border-primary px-5 py-3 text-sm font-bold tracking-wide text-primary transition hover:bg-primary hover:text-white"
                >
                  Lihat Profil Hotel
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
