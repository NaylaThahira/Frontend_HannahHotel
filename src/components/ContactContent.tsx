'use client'

import { useId, useState } from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'
import { type ContactSettings } from '@/lib/contact-settings'
import { Map, MapMarker, MapControls, MarkerPopup, MarkerContent } from '@/components/ui/map'

export default function ContactContent({ painan, padang, initialLocation = 'painan' }: {
  painan: ContactSettings; padang: ContactSettings; initialLocation?: 'padang' | 'painan';
}) {
  const [location, setLocation] = useState(initialLocation)
  const id = useId()
  const settings = location === 'padang' ? padang : painan
  const label = location === 'padang' ? 'Padang' : 'Painan'
  const hotelName = settings.contact_hotel_name.toLowerCase().includes(label.toLowerCase()) ? settings.contact_hotel_name : `${settings.contact_hotel_name} ${label}`
  const phone = settings.contact_phone.replace(/[^+\d]/g, '')

  return <section className="bg-cream px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12">
    <div className="mx-auto max-w-5xl">
      <header className="mx-auto max-w-4xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">{painan.contact_title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-secondary sm:text-base">{painan.contact_description}</p>
      </header>

      <div role="tablist" aria-label="Pilihan cabang kontak" className="mx-auto mb-6 mt-7 flex max-w-sm rounded-full bg-[#e7f2ec] p-1.5 sm:mb-7 sm:mt-8">
        {(['padang', 'painan'] as const).map(branch => <button
          key={branch} id={`${id}-tab-${branch}`} type="button" role="tab"
          aria-selected={location === branch} aria-controls={`${id}-panel`} tabIndex={location === branch ? 0 : -1}
          onClick={() => setLocation(branch)}
          onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
            event.preventDefault()
            const next = event.key === 'Home' ? 'padang' : event.key === 'End' ? 'painan' : location === 'padang' ? 'painan' : 'padang'
            setLocation(next)
            const buttons = event.currentTarget.parentElement?.querySelectorAll('button')
            buttons?.[next === 'padang' ? 0 : 1]?.focus()
          }}
          className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-5 sm:py-2.5 sm:text-sm ${location === branch ? 'bg-primary text-white shadow-[0_5px_16px_rgba(0,82,42,0.22)]' : 'text-primary hover:bg-white/50'}`}
        >Cabang {branch === 'padang' ? 'Padang' : 'Painan'}</button>)}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${location}`} className="grid overflow-hidden rounded-[22px] border border-primary/10 bg-white shadow-[0_12px_40px_rgba(25,55,37,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <article className="min-w-0 p-6 sm:p-7 lg:p-8">
          <h2 className="max-w-md font-display text-2xl font-semibold leading-tight text-primary sm:text-3xl">{hotelName}</h2>
          <dl className="my-6 space-y-5">
            <div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e7f2ec] text-primary"><MapPin size={20} aria-hidden="true" /></span><div className="min-w-0"><dt className="text-sm text-secondary">Alamat</dt><dd className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-ink sm:text-base">{settings.contact_address || 'Alamat belum tersedia.'}</dd></div></div>
            <div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e7f2ec] text-primary"><Phone size={20} aria-hidden="true" /></span><div className="min-w-0"><dt className="text-sm text-secondary">Telepon</dt><dd className="mt-1 text-sm font-medium leading-6 text-ink sm:text-base">{phone ? <a href={`tel:${phone}`} className="hover:text-primary hover:underline">{settings.contact_phone}</a> : 'Nomor kontak belum tersedia.'}</dd></div></div>
            <div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e7f2ec] text-primary"><Mail size={20} aria-hidden="true" /></span><div className="min-w-0"><dt className="text-sm text-secondary">Email</dt><dd className="mt-1 break-all text-sm font-medium leading-6 text-ink sm:text-base">{settings.contact_email ? <a href={`mailto:${settings.contact_email}`} className="hover:text-primary hover:underline">{settings.contact_email}</a> : 'Email belum tersedia.'}</dd></div></div>
          </dl>
          <div className="flex flex-col items-start gap-3">
            {phone && <a href={`tel:${phone}`} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-105">Telepon sekarang</a>}
            <a href={settings.contact_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-xl border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-mint/20">{settings.contact_map_label}</a>
          </div>
        </article>

        <div className="relative min-h-[280px] bg-[#edf0ed] lg:min-h-[440px]" aria-label={`Peta lokasi ${label}`}>
          <Map key={location} center={[Number(settings.contact_map_longitude), Number(settings.contact_map_latitude)]} zoom={15.5} className="absolute inset-0 h-full w-full">
            <MapMarker longitude={Number(settings.contact_map_longitude)} latitude={Number(settings.contact_map_latitude)}>
              <MarkerContent><div className="-translate-y-1/2 drop-shadow-lg"><svg viewBox="0 0 24 24" className="size-11 text-primary" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg></div></MarkerContent>
              <MarkerPopup closeButton><div className="p-3"><h3 className="font-display font-semibold text-primary">{hotelName}</h3><p className="mt-1 whitespace-pre-line text-sm text-secondary">{settings.contact_address}</p><a href={settings.contact_map_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold text-primary hover:underline">{settings.contact_map_label} &rarr;</a></div></MarkerPopup>
            </MapMarker>
            <MapControls position="top-right" />
          </Map>
        </div>
      </div>
    </div>
  </section>;
}
