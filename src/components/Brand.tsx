type BrandProps = {
  compact?: boolean
}

export default function Brand({ compact = false }: BrandProps) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Hannah Hotel - Beranda">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/30 text-white transition group-hover:border-mint">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M4 20V8l8-5 8 5v12M8 20v-7h8v7M2 20h20" />
          <path d="M9 9h.01M15 9h.01" strokeLinecap="round" strokeWidth="2.5" />
        </svg>
      </span>
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
