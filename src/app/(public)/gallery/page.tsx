"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function FullGalleryPage() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [galleriesSubtitle, setGalleriesSubtitle] = useState("Jelajahi seluruh koleksi foto fasilitas, kamar, dan lingkungan sekitar Hannah Hotel Syari'ah.");

  useEffect(() => {
    const fetchGalleriesAndSettings = async () => {
      try {
        const [res, settingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/galleries'),
          fetch('http://localhost:5000/api/settings')
        ]);
        const data = await res.json();
        const settingsData = await settingsRes.json();
        setGalleryImages(data);
        if (settingsData.galleries_subtitle) {
          setGalleriesSubtitle(settingsData.galleries_subtitle);
        }
      } catch (err) {
        console.error('Failed to load gallery images', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleriesAndSettings();
  }, []);

  return (
    <main className="min-h-screen bg-[#FCF9F8] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Galeri Hannah Hotel
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {galleriesSubtitle}
          </p>
          <div className="mt-8 flex w-full items-center justify-center gap-4">
            <span className="h-[1px] w-16 bg-[#BFC9BE]"></span>
            <div className="flex h-3 w-3 items-center justify-center bg-[#BFC9BE]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
            <span className="h-[1px] w-16 bg-[#BFC9BE]"></span>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Memuat foto galeri...</div>
        ) : galleryImages.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
            Belum ada foto yang ditambahkan ke galeri.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryImages.map((img) => (
              <div key={img.id} className="group relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 shadow-md">
                <div className="relative h-full overflow-hidden bg-[#e5e2e1]">
                  {img.imageUrl ? (
                    <Image 
                      src={img.imageUrl.startsWith('http') ? img.imageUrl : `http://localhost:5000${img.imageUrl}`} 
                      alt={img.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="p-5 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-lg font-bold text-white shadow-sm">{img.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
