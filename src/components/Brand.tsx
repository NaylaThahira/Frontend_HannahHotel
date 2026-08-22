<<<<<<< HEAD
import Link from 'next/link'
import Image from 'next/image'

// Import langsung dari folder assets agar Next.js memantau perubahannya
import logoNavbar from '@/assets/logo/logo-navbar.svg'

=======
>>>>>>> 38a8652e400b24c80a0845349201457aec57cdb2
type BrandProps = {
  compact?: boolean
}

export default function Brand({ compact = false }: BrandProps) {
  return (
<<<<<<< HEAD
    <Link href="/" className="group flex items-center gap-3" aria-label="Hannah Hotel - Beranda">
      {/* Ikon Rumah (Tetap Dipertahankan) */}
=======
    <Link to="/" className="group flex items-center gap-3" aria-label="Hannah Hotel - Beranda">
>>>>>>> 38a8652e400b24c80a0845349201457aec57cdb2
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/30 text-white transition group-hover:border-mint">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M4 20V8l8-5 8 5v12M8 20v-7h8v7M2 20h20" />
          <path d="M9 9h.01M15 9h.01" strokeLinecap="round" strokeWidth="2.5" />
        </svg>
      </span>
<<<<<<< HEAD

      {/* Bagian Teks Menggunakan Logo SVG Baru */}
      <Image
        src={logoNavbar}
        alt="Hannah Hotel Syari'ah Painan"
        className={compact ? "h-8 w-auto" : "h-10 sm:h-12 w-auto object-contain"}
      />
    </Link>
  )
}
=======
      <span className="leading-none">
        <strong className={`${compact ? 'text-xl' : 'text-[1.35rem] sm:text-2xl'} block font-display font-bold text-white`}>
          Hannah Hotel
        </strong>
        {!compact && <span className="mt-1.5 block text-xs tracking-[0.12em] text-white/70">Syari'ah Painan</span>}
      </span>
    </Link>
  )
}
import { Link } from 'react-router-dom'
>>>>>>> 38a8652e400b24c80a0845349201457aec57cdb2
