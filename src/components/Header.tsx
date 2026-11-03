'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Brand from './Brand'
import { ChevronDown } from 'lucide-react'

const navigation = [
  { label: 'Beranda', href: '/' },
  { label: 'Kamar', href: '/rooms', subItems: [
    { label: 'Padang', href: '/rooms/padang' },
    { label: 'Painan', href: '/rooms/painan' },
  ] },
  {
    label: 'Fasilitas',
    href: '/facilities',
    subItems: [
      { label: 'Fasilitas', href: '/facilities' },
      { label: 'Paket', href: '/packages' },
    ],
  },
  {
    label: 'Tentang Kami',
    href: '#about',
    subItems: [
      { label: 'Sejarah', href: '/sejarah' },
      { label: 'Visi Misi', href: '/visi-misi' },
    ]
  },
  { label: 'Galeri', href: '/gallery' },
  { label: 'Kontak', href: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 py-2 text-sm font-semibold tracking-wide transition-colors hover:border-peach hover:text-peach ${isActive ? 'border-peach text-peach' : 'border-transparent text-white/80'
    }`

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-[#003119] shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex flex-1">
          <Brand />
        </div>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
          {navigation.map((item) => {
            const isMatch = !item.href.includes('#') && !!pathname && (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))

            if (item.subItems) {
              return (
                <div key={item.label} className="group relative">
                  <div className={`flex cursor-pointer items-center gap-1 ${navClass({ isActive: isMatch })}`}>
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </div>
                  {/* Dropdown Menu Desktop */}
                  <div className="absolute left-0 top-[calc(100%+0.5rem)] invisible w-48 origin-top-left -translate-y-2 scale-95 rounded-md bg-white p-1.5 opacity-0 shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                    <div className="flex flex-col">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block rounded-md px-4 py-2.5 text-sm font-semibold text-ink/80 transition-all hover:bg-cream hover:text-orange hover:pl-5"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link key={item.label} href={item.href} className={navClass({ isActive: isMatch })}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-1 justify-end">
          <button type="button" className="grid size-11 place-items-center rounded-md border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 lg:hidden" aria-label="Buka menu navigasi" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <div className="relative w-5 h-4">
              <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 bg-gradient-to-b from-[#003119] to-primary px-5 pb-6 pt-3 lg:hidden" aria-label="Navigasi mobile">
          <div className="mx-auto flex max-w-7xl flex-col">
            {navigation.map((item) => {
              const isMatch = !item.href.includes('#') && !!pathname && (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))

              if (item.subItems) {
                const isOpen = openDropdown === item.label
                return (
                  <div key={item.label} className="flex flex-col">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between border-b border-white/10 py-3 text-left text-sm font-semibold text-white/85 transition-colors hover:text-peach"
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-peach' : 'opacity-50'}`} />
                    </button>
                    {/* Dropdown Menu Mobile */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      <div className="flex flex-col space-y-1 rounded-lg bg-black/20 p-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => {
                              setMenuOpen(false)
                              setOpenDropdown(null)
                            }}
                            className="block rounded-md px-4 py-2 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-peach hover:pl-5"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className={`border-b border-white/10 py-3 text-sm font-semibold transition-colors hover:text-peach ${isMatch ? 'text-peach' : 'text-white/85'}`}>
                  {item.label}
                </Link>
              )
            })}
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="mt-4 rounded-sm bg-orange px-5 py-3 text-center text-sm font-bold text-orange-ink">Pesan Sekarang</Link>
          </div>
        </nav>
      )}
    </header>
  )
}