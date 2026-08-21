"use client"

import Link from 'next/link'
import Brand from './Brand'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [settings, setSettings] = useState({
    footer_about: "Kenyamanan Islami di jantung Kota Painan. Menghadirkan pengalaman menginap yang damai dan sesuai nilai Syari'ah.",
    footer_address: "Jl. Ilyas Yakub, Painan",
    footer_phone: "(0756) 700 000",
    footer_email: "info@hannahhotel.id",
    footer_links: [
      { label: "Beranda", url: "/" },
      { label: "Katalog Kamar", url: "/rooms" },
      { label: "Fasilitas", url: "/#facilities" },
      { label: "Tentang Kami", url: "/#about" }
    ],
    footer_show_newsletter: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/settings');
        const data = await res.json();
        
        let parsedLinks = settings.footer_links;
        if (data.footer_links) {
          try {
            parsedLinks = JSON.parse(data.footer_links);
          } catch (e) {
            console.error("Failed to parse footer links");
          }
        }
        
        // Merge fetched data with defaults
        setSettings(prev => ({ 
          ...prev, 
          ...data,
          footer_links: parsedLinks,
          footer_show_newsletter: data.footer_show_newsletter === "false" ? false : true
        }));
      } catch (err) {
        console.error('Failed to load footer settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-primary to-[#002814] text-white">
      <div className={`mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:px-12 ${settings.footer_show_newsletter ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        <div id="about"><Brand /><p className="mt-5 max-w-xs text-sm leading-6 text-white/70">{settings.footer_about}</p></div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-mint">Tautan Cepat</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {settings.footer_links.map((link: any, idx: number) => (
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
            <li><a className="hover:text-peach" href={`mailto:${settings.footer_email}`}>{settings.footer_email}</a></li>
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
      <div className="border-t border-mint/10 px-5 py-6 text-center text-sm text-white/50">&copy; {new Date().getFullYear()} Hannah Hotel Syari'ah. Seluruh hak cipta dilindungi.</div>
    </footer>
  )
}
