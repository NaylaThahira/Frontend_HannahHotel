'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getHotelIcon } from '@/lib/hotel-icons'
import { resolveImageUrl } from '@/lib/api'
import { getBranchWhatsApp } from '@/lib/home-actions'

export type FacilityItem = {
  id: number
  name: string
  description: string
  icon?: string
  imageUrl?: string
  price?: string
  facilities?: Array<string | { name: string; icon?: string }>
}

export type PackageItem = {
  id: number
  name: string
  description: string
  imageUrl?: string
}

export default function FacilitiesPackagesTabs({
  branch,
  branchLabel,
  initialTab = 'facilities',
  facilities,
  packages,
}: {
  branch: 'padang' | 'painan'
  branchLabel: string
  initialTab?: 'facilities' | 'packages'
  facilities: FacilityItem[]
  packages: PackageItem[]
}) {
  const [activeTab, setActiveTab] = useState<'facilities' | 'packages'>(initialTab)
  const router = useRouter()
  const pathname = usePathname()

  const handleSelectTab = (tab: 'facilities' | 'packages') => {
    setActiveTab(tab)
    const nextUrl = tab === 'packages' ? `${pathname}?tab=packages` : pathname
    router.replace(nextUrl, { scroll: false })
  }

  return (
    <section className="bg-cream px-5 pb-24 pt-12 sm:px-8">
      {/* Tab Switcher */}
      <div className="mx-auto mb-12 flex max-w-md rounded-full border border-primary/15 bg-white p-1.5 shadow-sm" role="tablist" aria-label="Pilih kategori fasilitas atau paket">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'facilities'}
          onClick={() => handleSelectTab('facilities')}
          className={`flex-1 rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition-all ${
            activeTab === 'facilities'
              ? 'bg-primary text-white shadow-sm'
              : 'text-primary/75 hover:bg-primary/5 hover:text-primary'
          }`}
        >
          Fasilitas
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'packages'}
          onClick={() => handleSelectTab('packages')}
          className={`flex-1 rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition-all ${
            activeTab === 'packages'
              ? 'bg-primary text-white shadow-sm'
              : 'text-primary/75 hover:bg-primary/5 hover:text-primary'
          }`}
        >
          Paket
        </button>
      </div>

      {/* Tab Panel: Fasilitas */}
      {activeTab === 'facilities' && (
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-3" role="tabpanel">
          {facilities.length === 0 && (
            <p className="col-span-full rounded-lg border border-primary/10 bg-white p-8 text-center text-secondary">
              {`Belum ada fasilitas untuk cabang ${branchLabel}.`}
            </p>
          )}
          {facilities.map((facility, index) => {
            const IconComp = getHotelIcon(facility.icon)
            return (
              <article
                key={facility.id}
                className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-72 overflow-hidden bg-[#e5e2e1]">
                  {facility.imageUrl ? (
                    <Image
                      src={resolveImageUrl(facility.imageUrl)}
                      alt={facility.name}
                      fill
                      loading={index < 3 ? 'eager' : 'lazy'}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#e8f5ee] text-primary">
                      <IconComp size={64} strokeWidth={1.4} />
                    </div>
                  )}
                </div>
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-[#e8f5ee] text-primary">
                        <IconComp size={20} />
                      </span>
                      <h2 className="font-display text-3xl font-semibold text-primary">{facility.name}</h2>
                    </div>
                    {facility.price && (
                      <p className="rounded-full bg-peach px-3 py-1.5 text-sm font-bold text-orange-ink">
                        {facility.price}
                      </p>
                    )}
                  </div>
                  <p className="mt-5 leading-7 text-secondary">{facility.description}</p>
                  {(facility.facilities || []).length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Detail ${facility.name}`}>
                      {facility.facilities!.map((item, idx) => {
                        const ItemIcon = getHotelIcon(typeof item === 'string' ? 'Check' : item.icon)
                        const name = typeof item === 'string' ? item : item.name
                        return (
                          <li
                            key={`${name}-${idx}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#eae7e7] px-3 py-1.5 text-xs font-medium text-secondary"
                          >
                            <ItemIcon size={14} />
                            {name}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Tab Panel: Paket */}
      {activeTab === 'packages' && (
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-3" role="tabpanel">
          {packages.length === 0 && (
            <div className="col-span-full mx-auto max-w-2xl rounded-xl border border-primary/15 bg-white p-8 text-center shadow-sm sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
                Informasi Paket {branchLabel}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-primary sm:text-3xl">
                {branch === 'padang'
                  ? 'Paket Menginap Cabang Padang Sedang Disiapkan'
                  : `Belum Ada Paket untuk Cabang ${branchLabel}`}
              </h2>
              <p className="mt-3 text-sm leading-7 text-secondary sm:text-base">
                {branch === 'padang'
                  ? 'Informasi paket menginap khusus cabang Padang saat ini masih dalam tahap diskusi oleh pihak manajemen dan terpisah dari daftar fasilitas hotel. Untuk reservasi kamar atau penawaran rombongan, silakan hubungi resepsionis cabang Padang.'
                  : `Belum ada paket untuk cabang ${branchLabel}.`}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectTab('facilities')}
                  className="rounded-md border border-primary px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  Lihat Fasilitas Hotel {branchLabel}
                </button>
                <a
                  href={`https://wa.me/${getBranchWhatsApp(branch)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#003d1f]"
                >
                  Hubungi Resepsionis {branchLabel}
                </a>
              </div>
            </div>
          )}
          {packages.map((item, index) => (
            <Link
              key={item.id}
              href={`/${branch}/packages/${item.id}`}
              className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-72 overflow-hidden bg-[#e8f5ee]">
                {item.imageUrl ? (
                  <Image
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.name}
                    fill
                    loading={index < 3 ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl text-primary">✦</div>
                )}
              </div>
              <div className="p-6 sm:p-7">
                <h2 className="font-display text-3xl font-semibold text-primary">{item.name}</h2>
                {item.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-secondary">{item.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

