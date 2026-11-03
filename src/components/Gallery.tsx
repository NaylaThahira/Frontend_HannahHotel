"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/galleries')
        const data = await res.json()
        // Only take the first 6 for the homepage
        setGalleryImages(data.slice(0, 6))
      } catch (err) {
        console.error('Failed to load gallery images', err)
      }
    }
    fetchGalleries()
  }, [])

  return (
    <section id="gallery" className="px-5 py-24 sm:px-10 lg:px-16" style={{ background: '#FCF9F8' }}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-16">
        {/* Header */}
        <div className="flex w-full max-w-[1072px] flex-col items-center gap-[15px] text-center">
          <h2 className="font-display text-[56px] font-bold leading-[62px] tracking-[-1.12px] text-primary">
            Gallery
          </h2>
          <div className="max-w-[672px]">
            <p className="text-[18px] leading-[29px] text-[#404941]">
              Jelajahi keindahan dan fasilitas Hannah Hotel melalui koleksi foto kami.
            </p>
          </div>
          <div className="mt-4 flex w-full items-center justify-center gap-4">
            <span className="h-[1px] w-16 bg-[#BFC9BE]"></span>
            <div className="flex h-3 w-3 items-center justify-center bg-[#BFC9BE]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
            <span className="h-[1px] w-16 bg-[#BFC9BE]"></span>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid w-full max-w-[1072px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {galleryImages.map((img) => (
            <div key={img.id} className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md">
              {img.imageUrl ? (
                <Image 
                  src={img.imageUrl.startsWith('http') ? img.imageUrl : `http://localhost:5000${img.imageUrl}`} 
                  alt={img.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
              )}
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-4">
                  <h3 className="text-sm font-semibold tracking-[0.7px] text-white">{img.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Lihat Selengkapnya */}
        <div className="-mt-6 text-center">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-primary hover:text-orange">
            Lihat Galeri Lengkap <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
