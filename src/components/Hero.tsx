import heroImage from '../assets/hotel-hero.jpg'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section id="home" className="relative isolate flex min-h-[600px] items-center justify-center overflow-hidden bg-primary px-5 py-20 text-center">
      <img src={heroImage} alt="Suasana nyaman Hannah Hotel" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,55,27,.88),rgba(0,82,42,.68),rgba(0,55,27,.88))]" />

      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <p className="rounded-full bg-mint px-4 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-mint-ink sm:text-sm">
          Hotel Syari'ah Terpercaya di Painan
        </p>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
          Hannah Hotel Syari'ah
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
          Kenyamanan Islami di jantung Kota Painan
        </p>
        <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Link to="/contact" className="rounded-sm bg-orange px-8 py-4 text-sm font-bold tracking-wide text-orange-ink shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffab6b]">
            Pesan Kamar Sekarang
          </Link>
          <Link to="/rooms" className="rounded-sm border border-white px-8 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-white hover:text-primary">
            Lihat Kamar
          </Link>
        </div>
      </div>
    </section>
  )
}
