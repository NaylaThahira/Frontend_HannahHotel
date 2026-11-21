import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/api'

interface HeroProps {
  title?: string;
  subtitle?: string;
  heroImage?: string;
}

export default function Hero({ title, subtitle, heroImage }: HeroProps) {
  return (
    <section id="home" className="relative isolate flex h-[83vh] min-h-[500px] lg:min-h-[550px] w-full items-center justify-center overflow-hidden bg-primary px-5 text-center">
      {heroImage && (
        <Image src={resolveImageUrl(heroImage)} alt="Suasana nyaman Hannah Hotel" fill sizes="100vw" className="absolute inset-0 -z-20 object-cover" priority />
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,55,27,.88),rgba(0,82,42,.68),rgba(0,55,27,.88))]" />

      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
          {title || "Hannah Hotel Syari'ah"}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
          {subtitle || "Find a hotel close to the tourist attraction and shopping centers in Painan? Where else if not at Hannah Syariah Hotel. Let's Stay and have a pleasant experience with us."}
        </p>
      </div>

      {/* Downward Arrow for scrolling */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <Link href="#rooms" aria-label="Lihat Kamar" className="group flex flex-col items-center gap-3 text-white/80 transition hover:text-white">
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold">Lihat Kamar</span>
          <svg 
            className="w-5 h-5 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
