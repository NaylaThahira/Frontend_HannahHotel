import Image from 'next/image'
import logoNavbar from '@/assets/logo/logo-navbar.svg'

const staticMenuItems = [
  "Hannah Syari'ah",
  'Reservasi Kamar',
  'Layanan Tamu',
  'Kebijakan Privasi',
  'Karir',
  'Informasi Properti',
]

export default function PortalFooter() {
  return (
    <footer
      aria-label="Footer Portal Hannah Hotel"
      className="select-none border-t border-mint/15 bg-gradient-to-br from-primary to-[#002814] px-6 py-20 text-center text-white sm:py-28"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        {/* 1. Centered Static Brand Logo */}
        <div className="pointer-events-none flex flex-col items-center">
          <Image
            src={logoNavbar}
            alt="Hannah Hotel Syari'ah"
            className="h-20 w-auto object-contain sm:h-24"
          />
        </div>

        {/* 2. Static Primary Row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold tracking-wide text-white/95 sm:text-sm">
          {staticMenuItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        {/* 3. Static Social Media Row with Icons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-white/80 sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <span>instagram</span>
            <svg viewBox="0 0 24 24" className="size-3.5 fill-none stroke-current" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>

          <span className="inline-flex items-center gap-2">
            <span>facebook</span>
            <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </span>

          <span className="inline-flex items-center gap-2">
            <span>youtube</span>
            <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </span>

          <span className="inline-flex items-center gap-2">
            <span>tiktok</span>
            <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </span>

          <span className="inline-flex items-center gap-2">
            <span>whatsapp</span>
            <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
              <path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.94 11.94 0 0 0 5.8 1.48h.01C18.65 23.84 24 18.48 24 11.9c0-3.19-1.24-6.18-3.48-8.42Z" />
            </svg>
          </span>
        </div>

        {/* 4. Static Muted Language & Region Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/45">
          <span>Bahasa Indonesia</span>
          <span>English</span>
        </div>

        {/* 5. Static Copyright */}
        <p className="mt-14 text-[11px] uppercase tracking-[0.2em] text-white/60">
          &copy; HANNAH HOTEL SYARI&apos;AH
        </p>
      </div>
    </footer>
  )
}

