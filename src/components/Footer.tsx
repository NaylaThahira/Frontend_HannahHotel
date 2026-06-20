import { Link } from 'react-router-dom'
import Brand from './Brand'

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div id="about"><Brand compact /><p className="mt-5 max-w-xs text-sm leading-6 text-white/70">Kenyamanan Islami di jantung Kota Painan. Menghadirkan pengalaman menginap yang damai dan sesuai nilai Syari'ah.</p></div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-mint">Tautan Cepat</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            <li><Link className="hover:text-peach" to="/">Beranda</Link></li>
            <li><Link className="hover:text-peach" to="/rooms">Rooms</Link></li>
            <li><Link className="hover:text-peach" to="/facilities">Facilities</Link></li>
            <li><Link className="hover:text-peach" to="/#about">Tentang Kami</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-mint">Kontak</h3>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-white/75">
            <li>Jl. Ilyas Yakub, Painan</li><li><a className="hover:text-peach" href="tel:+62756700000">(0756) 700 000</a></li><li><a className="hover:text-peach" href="mailto:info@hannahhotel.id">info@hannahhotel.id</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-mint">Newsletter</h3>
          <p className="mt-5 text-sm leading-6 text-white/75">Dapatkan penawaran dan promo terbaru.</p>
          <form className="mt-4 flex" onSubmit={(event) => event.preventDefault()}><label htmlFor="newsletter-email" className="sr-only">Alamat email</label><input id="newsletter-email" type="email" placeholder="Alamat email" className="min-w-0 flex-1 rounded-l-sm bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-secondary/60 focus:ring-2 focus:ring-mint" /><button type="submit" className="rounded-r-sm bg-orange px-4 text-sm font-bold text-orange-ink hover:bg-[#ffab6b]">Kirim</button></form>
          <a href="/admin/login" className="mt-5 inline-block text-xs text-white/45 underline-offset-4 hover:text-white hover:underline">Login Admin</a>
        </div>
      </div>
      <div className="border-t border-mint/10 px-5 py-6 text-center text-sm text-white/50">&copy; 2026 Hannah Hotel Syari'ah. Seluruh hak cipta dilindungi.</div>
    </footer>
  )
}
