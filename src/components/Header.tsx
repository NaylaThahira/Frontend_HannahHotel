'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Brand from './Brand'
import { ChevronDown, MapPin } from 'lucide-react'

type NavItem = {
  label: string
  href: string
  subItems?: { label: string; href: string }[]
}

function buildNavigation(branchPrefix: string): NavItem[] {
  return [
    { label: 'Beranda', href: branchPrefix },
    { label: 'Kamar', href: `${branchPrefix}/rooms` },
    { label: 'Fasilitas', href: `${branchPrefix}/facilities` },
    {
      label: 'Tentang Kami',
      href: '#about',
      subItems: [
        { label: 'Sejarah', href: `${branchPrefix}/sejarah` },
        { label: 'Visi Misi', href: `${branchPrefix}/visi-misi` },
      ],
    },
    { label: 'Galeri', href: `${branchPrefix}/gallery` },
    { label: 'Kontak', href: `${branchPrefix}/contact` },
  ]
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [storedBranch, setStoredBranch] = useState<'padang' | 'painan'>('painan')
  const pathname = usePathname()

  const pathBranch: 'padang' | 'painan' | null = pathname?.startsWith('/padang')
    ? 'padang'
    : pathname?.startsWith('/painan')
      ? 'painan'
      : null

  useEffect(() => {
    if (pathBranch) {
      setStoredBranch(pathBranch)
      try {
        sessionStorage.setItem('hannah_active_branch', pathBranch)
      } catch {}
    } else {
      try {
        const saved = sessionStorage.getItem('hannah_active_branch')
        if (saved === 'padang' || saved === 'painan') {
          setStoredBranch(saved)
        }
      } catch {}
    }
  }, [pathBranch])

  // Sembunyikan Header standar pada halaman Portal Utama (/) karena menggunakan UI gaya Ayana
  if (pathname === '/') {
    return null
  }

  const activeBranch = pathBranch || storedBranch
  const branchPrefix = `/${activeBranch}`
  const branchLabel = activeBranch === 'padang' ? 'Padang' : 'Painan'
  const navigation = buildNavigation(branchPrefix)

  const isNavItemActive = (item: NavItem) => {
    if (!pathname || item.href.includes('#')) {
      if (item.subItems) {
        return item.subItems.some((sub) => pathname?.startsWith(sub.href))
      }
      return false
    }
    if (item.href === branchPrefix) {
      return pathname === branchPrefix
    }
    if (item.href === `${branchPrefix}/facilities` && pathname.startsWith(`${branchPrefix}/packages`)) {
      return true
    }
    if (item.subItems) {
      return item.subItems.some((sub) => pathname.startsWith(sub.href))
    }
    return pathname.startsWith(item.href)
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 py-2 text-sm font-semibold tracking-wide transition-colors hover:border-peach hover:text-peach ${
      isActive ? 'border-peach text-peach' : 'border-transparent text-white/80'
    }`

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-[#003119] shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex flex-1 items-center gap-3">
          <Brand href={branchPrefix} />
        </div>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
          {navigation.map((item) => {
            const isMatch = isNavItemActive(item)

            if (item.subItems) {
              return (
                <div key={item.label} className="group relative">
                  <div className={`flex cursor-pointer items-center gap-1 ${navClass({ isActive: isMatch })}`}>
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </div>
                  {/* Dropdown Menu Desktop */}
                  <div className="invisible absolute left-0 top-[calc(100%+0.5rem)] w-48 origin-top-left -translate-y-2 scale-95 rounded-md bg-white p-1.5 opacity-0 shadow-xl ring-1 ring-black/5 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                    <div className="flex flex-col">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          prefetch={false}
                          className="block rounded-md px-4 py-2.5 text-sm font-semibold text-ink/80 transition-all hover:bg-cream hover:pl-5 hover:text-orange"
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
              <Link key={item.label} href={item.href} prefetch={false} className={navClass({ isActive: isMatch })}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3">
          <span
            className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-peach sm:inline-flex"
            aria-label={`Wilayah aktif: ${branchLabel}`}
          >
            <MapPin className="size-3.5" />
            {branchLabel}
          </span>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-md border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 lg:hidden"
            aria-label="Buka menu navigasi"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
                  menuOpen ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
                  menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-white/10 bg-gradient-to-b from-[#003119] to-primary px-5 pb-6 pt-3 lg:hidden"
          aria-label="Navigasi mobile"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-peach">
                <MapPin className="size-3.5" />
                {branchLabel}
              </span>
            </div>

            {navigation.map((item) => {
              const isMatch = isNavItemActive(item)

              if (item.subItems) {
                const isOpen = openDropdown === item.label
                return (
                  <div key={item.label} className="flex flex-col">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between border-b border-white/10 py-3 text-left text-sm font-semibold text-white/85 transition-colors hover:text-peach"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-peach' : 'opacity-50'
                        }`}
                      />
                    </button>
                    {/* Dropdown Menu Mobile */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'mt-1 max-h-48 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="flex flex-col space-y-1 rounded-lg bg-black/20 p-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => {
                              setMenuOpen(false)
                              setOpenDropdown(null)
                            }}
                            className="block rounded-md px-4 py-2 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:pl-5 hover:text-peach"
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
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`border-b border-white/10 py-3 text-sm font-semibold transition-colors hover:text-peach ${
                    isMatch ? 'text-peach' : 'text-white/85'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href={`${branchPrefix}/contact`}
              onClick={() => setMenuOpen(false)}
              className="mt-4 rounded-sm bg-orange px-5 py-3 text-center text-sm font-bold text-orange-ink"
            >
              Pesan Sekarang
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
