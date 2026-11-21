"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Brand from './Brand'

type FooterLink = { label: string; url: string }

const defaultFooterLinks: FooterLink[] = [
  { label: "Beranda", url: "/" },
  { label: "Katalog Kamar", url: "/rooms" },
  { label: "Fasilitas", url: "/facilities" },
  { label: "Kontak", url: "/contact" }
]

export default function Footer({ initialSettings = {} }: { initialSettings?: Record<string, string> }) {
  const pathname = usePathname()

  // Gunakan PortalFooter khusus di halaman Portal Utama (/) agar Footer wilayah tidak terpengaruh
  if (pathname === '/') {
    return null
  }

  const activeBranch: 'padang' | 'painan' | null = pathname?.startsWith('/padang')
    ? 'padang'
    : pathname?.startsWith('/painan')
      ? 'painan'
      : null

  const isPadang = activeBranch === 'padang'
  const rawFooterLinks = isPadang ? (initialSettings.footer_links_padang || initialSettings.footer_links) : initialSettings.footer_links

  let parsedLinks = defaultFooterLinks;
  if (rawFooterLinks) {
    try {
      const candidate = JSON.parse(rawFooterLinks);
      if (Array.isArray(candidate)) parsedLinks = candidate;
    } catch {
      parsedLinks = defaultFooterLinks;
    }
  }

  const branchLinks: FooterLink[] = activeBranch
    ? [
        { label: `Beranda ${activeBranch === 'padang' ? 'Padang' : 'Painan'}`, url: `/${activeBranch}` },
        { label: 'Katalog Kamar', url: `/${activeBranch}/rooms` },
        { label: 'Fasilitas Hotel', url: `/${activeBranch}/facilities` },
        { label: 'Paket Menginap', url: `/${activeBranch}/facilities?tab=packages` },
        { label: 'Hubungi Kami', url: `/${activeBranch}/contact` },
      ]
    : [
        { label: 'Hannah Hotel Padang', url: '/padang' },
        { label: 'Hannah Hotel Painan', url: '/painan' },
        ...parsedLinks,
      ]

  const settings = {
    footer_about: (isPadang ? initialSettings.footer_about_padang : initialSettings.footer_about) || initialSettings.footer_about || "Kenyamanan Islami di Sumatera Barat. Menghadirkan pengalaman menginap yang damai dan sesuai nilai Syari'ah di Padang dan Painan.",
    footer_address: (isPadang ? initialSettings.footer_address_padang : initialSettings.footer_address) || (isPadang ? "Padang, Sumatera Barat" : "Jl. Ilyas Yakub, Painan"),
    footer_phone: (isPadang ? initialSettings.footer_phone_padang : initialSettings.footer_phone) || initialSettings.footer_phone || "0811 6617 717",
    footer_email: (isPadang ? initialSettings.footer_email_padang : initialSettings.footer_email) || initialSettings.footer_email || "",
    footer_links: branchLinks,
    footer_show_newsletter: (isPadang ? initialSettings.footer_show_newsletter_padang : initialSettings.footer_show_newsletter) === "false" ? false : true
  };

  const contactEmail = settings.footer_email.trim();

  return (
    <footer className="bg-gradient-to-br from-primary to-[#002814] text-white">
      <div className={`mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:px-12 ${settings.footer_show_newsletter ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        <div id="about"><Brand href={activeBranch ? `/${activeBranch}` : '/'} /><p className="mt-5 max-w-xs text-sm leading-6 text-white/70">{settings.footer_about}</p></div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-mint">Tautan Cepat</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {settings.footer_links.map((link: FooterLink, idx: number) => (
              <li key={idx}>
                <Link className="hover:text-peach transition-colors" href={link.url}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-mint">Kontak</h3>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-white/75">
            <li>{settings.footer_address}</li>
            <li><a className="hover:text-peach" href={`tel:${settings.footer_phone.replace(/\D/g, '')}`}>{settings.footer_phone}</a></li>
            <li><a className="hover:text-peach" href={contactEmail ? `mailto:${contactEmail}` : 'https://www.hannahhotelsyariah.com'}>{contactEmail || 'www.hannahhotelsyariah.com'}</a></li>
          </ul>
        </div>
        {settings.footer_show_newsletter && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-mint">Newsletter</h3>
            <p className="mt-5 text-sm leading-6 text-white/75">Dapatkan penawaran dan promo terbaru.</p>
            <form className="mt-4 flex" onSubmit={(event) => event.preventDefault()}><label htmlFor="newsletter-email" className="sr-only">Alamat email</label><input id="newsletter-email" type="email" placeholder="Alamat email" className="min-w-0 flex-1 rounded-l-sm bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-secondary/60 focus:ring-2 focus:ring-mint" /><button type="submit" className="rounded-r-sm bg-orange px-4 text-sm font-bold text-orange-ink hover:bg-[#ffab6b]">Kirim</button></form>
          </div>
        )}
      </div>
      <div className="border-t border-mint/10 px-5 py-6 text-center text-sm text-white/50">&copy; {new Date().getFullYear()} Hannah Hotel Syari&apos;ah. Seluruh hak cipta dilindungi.</div>
    </footer>
  )
}
