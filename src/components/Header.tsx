import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Brand from './Brand'

const navigation = [
  { label: 'Beranda', to: '/' },
  { label: 'Rooms', to: '/rooms' },
  { label: 'Facilities', to: '/facilities' },
  { label: 'Tentang Kami', to: '/#about' },
  { label: 'Contact', to: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 py-2 text-sm font-semibold tracking-wide transition-colors hover:border-peach hover:text-peach ${
      isActive ? 'border-peach text-peach' : 'border-transparent text-white/80'
    }`

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Brand />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <NavLink key={item.label} to={item.to} end={item.to === '/'} className={(state) => navClass({ isActive: state.isActive && !item.to.includes('#') })}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className="hidden rounded-sm bg-orange px-5 py-3 text-sm font-bold tracking-wide text-orange-ink shadow-md transition hover:bg-[#ffab6b] sm:inline-flex">
          Pesan Sekarang
        </Link>

        <button type="button" className="grid size-11 place-items-center rounded-sm border border-white/30 text-white lg:hidden" aria-label="Buka menu navigasi" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 bg-primary px-5 pb-6 pt-3 lg:hidden" aria-label="Navigasi mobile">
          <div className="mx-auto flex max-w-7xl flex-col">
            {navigation.map((item) => (
              <NavLink key={item.label} to={item.to} end={item.to === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `border-b border-white/10 py-3 text-sm font-semibold transition-colors hover:text-peach ${isActive && !item.to.includes('#') ? 'text-peach' : 'text-white/85'}`}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="mt-4 rounded-sm bg-orange px-5 py-3 text-center text-sm font-bold text-orange-ink">Pesan Sekarang</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
