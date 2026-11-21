'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronDown, MapPin } from 'lucide-react'
import padangFallbackImage from '@/assets/room/Padang/resepsionis/WhatsApp Image 2026-11-20 at 13.23.14.webp'
import painanFallbackImage from '@/assets/room/Painan/painan-hero.webp'
import logoNavbar from '@/assets/logo/logo-navbar.svg'
import { resolveImageUrl } from '@/lib/api'
import { defaultBranches, type HotelBranch } from '@/lib/branches'
import { useBranchTransition } from './BranchTransitionLoader'
import PortalFooter from './PortalFooter'

interface AyanaPortalProps {
  title?: string
  heroImage?: string
  branches?: HotelBranch[]
}

const branchMeta: Record<
  'padang' | 'painan',
  {
    name: string
    tagline: string
    fallbackImage?: StaticImageData
    defaultDescription: string
  }
> = {
  padang: {
    name: 'PADANG',
    tagline: 'Harmoni Kenyamanan Modern di Jantung Ibu Kota Sumatera Barat',
    fallbackImage: padangFallbackImage,
    defaultDescription:
      "Nikmati kenyamanan menginap di pusat Kota Padang dalam suasana tenang, bersih, dan mengedepankan nilai-nilai Syari'ah dengan akses strategis ke berbagai pusat aktivitas kota.",
  },
  painan: {
    name: 'PAINAN',
    tagline: 'Pesona Alam Pesisir Selatan & Ketenangan Istirahat Islami',
    fallbackImage: painanFallbackImage,
    defaultDescription:
      "Temukan tempat peristirahatan yang hangat dan damai di pusat Kota Painan, dekat dengan berbagai destinasi bahari terbaik Pesisir Selatan.",
  },
}

export default function AyanaPortal({
  title,
  heroImage,
  branches = defaultBranches,
}: AyanaPortalProps) {
  const { triggerBranchIntro } = useBranchTransition()

  const orderedBranches: HotelBranch[] = (['padang', 'painan'] as const).map((id) => {
    const found = branches.find((b) => b.id === id)
    if (found) return found
    return defaultBranches.find((b) => b.id === id)!
  })

  return (
    <div className="bg-[#07170f] text-white">
      {/* 1. AYANA-STYLE FULLSCREEN HERO */}
      <section className="relative isolate flex h-screen min-h-screen w-full flex-col justify-between overflow-hidden px-5 py-8 text-center supports-[height:100dvh]:h-dvh supports-[height:100dvh]:min-h-dvh sm:px-10 sm:py-12">
        {heroImage && (
          <Image
            src={resolveImageUrl(heroImage)}
            alt="Hannah Hotel Syari'ah"
            fill
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            priority
          />
        )}

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-[#002814]/45 to-black/80" />

        {/* Top Centered Brand Logo (Static / Non-Clickable & Enlarged) */}
        <header className="pointer-events-none mx-auto flex select-none flex-col items-center">
          <Image
            src={logoNavbar}
            alt="Hannah Hotel Syari'ah"
            className="h-24 w-auto object-contain drop-shadow-lg sm:h-28 lg:h-32"
            priority
          />
        </header>

        {/* Center Hero Headline + Pure Visual Non-Text Animation */}
        <div className="mx-auto my-auto flex max-w-4xl flex-col items-center px-2">
          <h1 className="animate-[heroTitleReveal_0.8s_cubic-bezier(0.22,1,0.36,1)_both] font-display text-4xl font-normal leading-[1.12] tracking-wide text-white drop-shadow-sm sm:text-6xl lg:text-[4.75rem]">
            {title || "Hannah Hotel Syari'ah"}
          </h1>

          {/* Pure Visual Geometric & Shimmering Light Animation (No Text) */}
          <div className="pointer-events-none mt-[60px] flex flex-col items-center justify-center" aria-hidden="true">
            <div className="relative flex items-center justify-center gap-6">
              {/* Left Animated Shimmer Line */}
              <div className="relative h-px w-24 overflow-hidden bg-white/20 sm:w-40">
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-peach to-transparent"
                />
              </div>

              {/* Left Pulsing Star Dot */}
              <motion.span
                animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="block size-2 rotate-45 bg-peach/80"
              />

              {/* Center Rotating Islamic Octagram / Mandala Ornament */}
              <div className="relative flex size-14 items-center justify-center">
                {/* Outer Breathing Halo */}
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0.6, 0.25] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border border-peach/40 shadow-[0_0_25px_rgba(254,147,64,0.35)]"
                />
                {/* Rotating Square 1 */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute size-8 border border-peach/80"
                />
                {/* Counter-Rotating Square 2 (Forms 8-Pointed Star) */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute size-8 rotate-45 border border-orange/90"
                />
                {/* Inner Glowing Core */}
                <motion.div
                  animate={{ scale: [0.85, 1.25, 0.85] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="size-2.5 rotate-45 bg-orange shadow-[0_0_12px_rgba(254,147,64,0.95)]"
                />
              </div>

              {/* Right Pulsing Star Dot */}
              <motion.span
                animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="block size-2 rotate-45 bg-peach/80"
              />

              {/* Right Animated Shimmer Line */}
              <div className="relative h-px w-24 overflow-hidden bg-white/20 sm:w-40">
                <motion.div
                  animate={{ x: ['200%', '-100%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-peach to-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Down Arrow Icon (Framer Motion, No Circle) */}
        <div className="mx-auto flex flex-col items-center">
          <motion.a
            href="#pilih-wilayah"
            aria-label="Gulir ke pilihan wilayah hotel"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center p-2 text-white/85 transition-colors hover:text-peach"
          >
            <ChevronDown className="size-7 sm:size-8" strokeWidth={2} />
          </motion.a>
        </div>
      </section>

      {/* 2. AYANA-STYLE SPLIT-SCREEN DESTINATION SELECTOR (LEFT: PADANG | RIGHT: PAINAN) */}
      <section
        id="pilih-wilayah"
        aria-label="Pilihan Wilayah Hannah Hotel"
        className="grid w-full grid-cols-1 lg:grid-cols-2"
      >
        {orderedBranches.map((branch) => {
          const meta = branchMeta[branch.id]
          const hasCustomImage = Boolean(branch.imageUrl && branch.imageUrl.trim())
          const description = branch.description?.trim() || meta.defaultDescription

          return (
            <Link
              key={branch.id}
              href={`/${branch.id}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                triggerBranchIntro(branch.id)
              }}
              className="group relative isolate flex h-[76vh] min-h-[540px] max-h-[820px] w-full flex-col justify-between overflow-hidden border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:odd:border-r lg:odd:border-white/10 lg:p-16"
            >
              {/* Background Image with Smooth Zoom on Hover */}
              {hasCustomImage ? (
                <Image
                  src={resolveImageUrl(branch.imageUrl)}
                  alt={`Hannah Hotel ${meta.name}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="absolute inset-0 -z-20 object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              ) : meta.fallbackImage ? (
                <Image
                  src={meta.fallbackImage}
                  alt={`Hannah Hotel ${meta.name}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="absolute inset-0 -z-20 object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              ) : null}

              {/* Dual Gradient Overlay for Top & Bottom Readability */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/25 to-black/85 transition-opacity duration-500 group-hover:via-black/35" />

              {/* Top Row: Left Destination Title & Right Poetic Tagline (Enlarged Typography) */}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-peach sm:text-sm">
                    HANNAH HOTEL SYARI&apos;AH
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-normal uppercase tracking-[0.12em] text-white sm:text-6xl lg:text-[4rem]">
                    {meta.name}
                  </h2>
                </div>
                <p className="max-w-[240px] text-right font-display text-sm italic leading-relaxed text-white/95 sm:max-w-[300px] sm:text-base lg:text-lg">
                  {meta.tagline}
                </p>
              </div>

              {/* Bottom Row: Left Description + Address & Right Circular Action Button (Enlarged Typography) */}
              <div className="flex items-end justify-between gap-6">
                <div className="max-w-lg space-y-3.5">
                  <p className="line-clamp-4 text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
                    {description}
                  </p>
                  {branch.location && (
                    <p className="flex items-center gap-2 text-sm font-medium text-peach">
                      <MapPin className="size-4 shrink-0" />
                      <span className="line-clamp-1">{branch.location}</span>
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 pt-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 transition group-hover:text-peach sm:text-sm">
                    Buka Profil {meta.name}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                {/* Iconic Ayana-Style White Circular Button with Right Arrow */}
                <span
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-primary shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-orange group-hover:text-white sm:size-14"
                >
                  <ArrowRight className="size-6 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.2} />
                </span>
              </div>
            </Link>
          )
        })}
      </section>

      {/* 3. STATIC AYANA-STYLE PORTAL FOOTER */}
      <PortalFooter />
    </div>
  )
}
