import { getHotelBranches } from '@/lib/branch-server'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { notFound } from 'next/navigation'
import PageIntro from '@/components/PageIntro'
import { SERVER_API_URL, resolveImageUrl } from '@/lib/api'
import { isValidBranch } from '@/lib/branches'
import { getBranchWhatsApp } from '@/lib/home-actions'

type HotelPackage = {
  id: number
  name: string
  description: string
  included: string[]
  imageUrl: string
  location: string
}

async function getPackage(id: string): Promise<HotelPackage | null> {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/packages/${id}`, {
      next: { revalidate: 300, tags: ['packages'] },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getWhatsappSettings() {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/settings?keys=home_whatsapp_number,home_whatsapp_number_padang`, {
      next: { revalidate: 300, tags: ['settings'] },
    })
    if (!res.ok) return {}
    return res.json()
  } catch {
    return {}
  }
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ branch: string; id: string }>
}) {
  const { branch: routeBranch, id } = await params
  if (!isValidBranch(routeBranch)) {
    notFound()
  }

  const [item, branches, settings] = await Promise.all([getPackage(id), getHotelBranches(), getWhatsappSettings()])
  if (!item) notFound()
  const activeBranch: 'padang' | 'painan' =
    item.location === 'padang' || item.location === 'painan' ? item.location : routeBranch
  const branch = branches.find((b) => b.id === activeBranch)
  const included = Array.isArray(item.included) ? item.included : []
  const imageUrl = resolveImageUrl(item.imageUrl)
  const whatsappPhone = getBranchWhatsApp(
    activeBranch,
    activeBranch === 'padang' ? settings.home_whatsapp_number_padang : settings.home_whatsapp_number
  )

  return (
    <>
      <PageIntro title={item.name} description="Detail paket Hannah Hotel" />
      <section className="bg-cream px-5 pb-24 pt-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm">
            {item.imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full min-h-[360px] items-center justify-center text-6xl text-primary">✦</div>
            )}
          </div>
          <article className="rounded-lg border border-[#e5e2e1] bg-white p-7 shadow-sm sm:p-9">
            <h1 className="font-display text-4xl font-semibold text-primary">{item.name}</h1>
            <span className="mt-4 block h-1 w-16 bg-orange" />
            <div className="mt-5 rounded-lg bg-mint/20 p-4 text-sm text-primary">
              <p className="font-semibold">
                Hannah Hotel Syari&apos;ah {activeBranch === 'padang' ? 'Padang' : 'Painan'}
              </p>
              <p className="mt-2 flex items-start gap-2 text-secondary">
                <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                <span className="whitespace-pre-line">{branch?.location}</span>
              </p>
            </div>
            <p className="mt-6 whitespace-pre-wrap leading-8 text-secondary">{item.description}</p>
            {included.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-2xl font-semibold text-primary">Package Include</h2>
                <ul className="mt-4 space-y-3 text-secondary">
                  {included.map((entry, index) => (
                    <li key={`${entry}-${index}`} className="flex gap-3">
                      <span className="text-orange">-</span>
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Halo Hannah Hotel Syari'ah ${activeBranch === 'padang' ? 'Padang' : 'Painan'}, saya ingin menanyakan info lebih lanjut mengenai paket ${item.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-block rounded-md bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-mint-ink"
            >
              Info Lebih Lanjut
            </a>
            <Link
              href={`/${activeBranch}/facilities?tab=packages`}
              className="ml-4 text-sm font-semibold text-primary hover:text-orange"
            >
              Kembali ke Paket
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}
