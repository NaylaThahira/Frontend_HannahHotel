'use client'

import { useId, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { MapPin, Phone, Mail } from 'lucide-react'
import { type ContactSettings } from '@/lib/contact-settings'
import { getBranchWhatsApp, normalizeWhatsApp } from '@/lib/home-actions'

const ContactMap = dynamic(() => import('@/components/ContactMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#edf0ed] text-sm text-secondary">
      Memuat peta...
    </div>
  ),
})

export default function ContactContent({
  painan,
  padang,
  initialLocation = 'painan',
  lockBranch = false,
  whatsappNumbers,
}: {
  painan: ContactSettings
  padang: ContactSettings
  initialLocation?: 'padang' | 'painan'
  lockBranch?: boolean
  whatsappNumbers?: { padang?: string; painan?: string }
}) {
  const [location, setLocation] = useState(initialLocation)
  const pathname = usePathname()
  const id = useId()
  const isScopedBranchRoute = pathname?.startsWith('/padang') || pathname?.startsWith('/painan')
  const hideTabs = lockBranch || isScopedBranchRoute

  const settings = location === 'padang' ? padang : painan
  const label = location === 'padang' ? 'Padang' : 'Painan'
  const hotelName = settings.contact_hotel_name.toLowerCase().includes(label.toLowerCase())
    ? settings.contact_hotel_name
    : `${settings.contact_hotel_name} ${label}`
  const phone = settings.contact_phone.replace(/[^+\d]/g, '')
  const whatsappNumber =
    normalizeWhatsApp(settings.contact_phone) ||
    getBranchWhatsApp(location, location === 'padang' ? whatsappNumbers?.padang : whatsappNumbers?.painan)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Hannah Hotel Syari'ah ${label}, saya ingin menanyakan informasi dan reservasi.`
  )}`

  return (
    <section className="bg-cream px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            {settings.contact_title || painan.contact_title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary sm:text-base">
            {settings.contact_description || painan.contact_description}
          </p>
        </header>

        {!hideTabs && (
          <div
            role="tablist"
            aria-label="Pilihan cabang kontak"
            className="mx-auto mb-6 mt-7 flex max-w-sm rounded-full bg-[#e7f2ec] p-1.5 sm:mb-7 sm:mt-8"
          >
            {(['padang', 'painan'] as const).map((branch) => (
              <button
                key={branch}
                id={`${id}-tab-${branch}`}
                type="button"
                role="tab"
                aria-selected={location === branch}
                aria-controls={`${id}-panel`}
                tabIndex={location === branch ? 0 : -1}
                onClick={() => setLocation(branch)}
                onKeyDown={(event) => {
                  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
                  event.preventDefault()
                  const next =
                    event.key === 'Home'
                      ? 'padang'
                      : event.key === 'End'
                        ? 'painan'
                        : location === 'padang'
                          ? 'painan'
                          : 'padang'
                  setLocation(next)
                  const buttons = event.currentTarget.parentElement?.querySelectorAll('button')
                  buttons?.[next === 'padang' ? 0 : 1]?.focus()
                }}
                className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-5 sm:py-2.5 sm:text-sm ${
                  location === branch
                    ? 'bg-primary text-white shadow-[0_5px_16px_rgba(0,82,42,0.22)]'
                    : 'text-primary hover:bg-white/50'
                }`}
              >
                Cabang {branch === 'padang' ? 'Padang' : 'Painan'}
              </button>
            ))}
          </div>
        )}

        <div
          id={`${id}-panel`}
          role={hideTabs ? undefined : 'tabpanel'}
          aria-labelledby={hideTabs ? undefined : `${id}-tab-${location}`}
          className={`${hideTabs ? 'mt-10' : ''} grid overflow-hidden rounded-[22px] border border-primary/10 bg-white shadow-[0_12px_40px_rgba(25,55,37,0.08)] lg:grid-cols-[0.95fr_1.05fr]`}
        >
          <article className="min-w-0 p-6 sm:p-7 lg:p-8">
            <h2 className="max-w-md font-display text-2xl font-semibold leading-tight text-primary sm:text-3xl">
              {hotelName}
            </h2>
            <dl className="my-6 space-y-5">
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e7f2ec] text-primary">
                  <MapPin size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-sm text-secondary">Alamat</dt>
                  <dd className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-ink sm:text-base">
                    {settings.contact_address || 'Alamat belum tersedia.'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e7f2ec] text-primary">
                  <Phone size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-sm text-secondary">Telepon</dt>
                  <dd className="mt-1 text-sm font-medium leading-6 text-ink sm:text-base">
                    {phone ? (
                      <a href={`tel:${phone}`} className="hover:text-primary hover:underline">
                        {settings.contact_phone}
                      </a>
                    ) : (
                      'Nomor kontak belum tersedia.'
                    )}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e7f2ec] text-primary">
                  <Mail size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-sm text-secondary">Email</dt>
                  <dd className="mt-1 break-all text-sm font-medium leading-6 text-ink sm:text-base">
                    {settings.contact_email ? (
                      <a href={`mailto:${settings.contact_email}`} className="hover:text-primary hover:underline">
                        {settings.contact_email}
                      </a>
                    ) : (
                      'Email belum tersedia.'
                    )}
                  </dd>
                </div>
              </div>
            </dl>
            <div className="flex flex-col items-start gap-3">
              {whatsappNumber && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-105"
                >
                  Telepon sekarang
                </a>
              )}
              <a
                href={settings.contact_map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-xl border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-mint/20"
              >
                {settings.contact_map_label}
              </a>
            </div>
          </article>

          <div className="relative min-h-[280px] bg-[#edf0ed] lg:min-h-[440px]" aria-label={`Peta lokasi ${label}`}>
            <ContactMap
              location={location}
              longitude={Number(settings.contact_map_longitude)}
              latitude={Number(settings.contact_map_latitude)}
              hotelName={hotelName}
              address={settings.contact_address}
              mapUrl={settings.contact_map_url}
              mapLabel={settings.contact_map_label}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
