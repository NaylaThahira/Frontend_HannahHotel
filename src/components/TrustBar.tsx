const features = [
  { icon: 'M3 10h18M7 15h.01M11 15h2', label: '100% Syari' },
  { icon: 'M6 19V5m12 14V5M6 8h12M6 16h12', label: 'Kamar Nyaman' },
  { icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2', label: 'Layanan 24 Jam' },
  { icon: 'M4 19V9l8-6 8 6v10M9 21v-8h6v8', label: 'Lokasi Strategis' },
]

export default function TrustBar() {
  return (
    <section id="facilities" className="border-b border-[#bfc9be] bg-[#f6f3f2]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-5 gap-y-6 px-5 py-8 md:grid-cols-4 md:px-8">
        {features.map((feature) => (
          <div key={feature.label} className="flex items-center justify-center gap-2.5 text-center text-xs font-bold tracking-wide text-secondary sm:text-sm">
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={feature.icon} />
            </svg>
            <span>{feature.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
