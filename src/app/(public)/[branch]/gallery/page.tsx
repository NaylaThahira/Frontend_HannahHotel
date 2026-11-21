import { notFound } from 'next/navigation'
import Image from 'next/image'
import { SERVER_API_URL, resolveImageUrl } from '@/lib/api'
import { isValidBranch } from '@/lib/branches'

async function getGalleries(branch: 'padang' | 'painan') {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/galleries?location=${branch}`, {
      next: { revalidate: 300, tags: ['galleries', `galleries-${branch}`] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Failed to load gallery images', err)
    return []
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/settings?keys=galleries_subtitle,galleries_subtitle_padang`, {
      next: { revalidate: 300, tags: ['settings'] },
    })
    if (!res.ok) return {}
    return res.json()
  } catch (err) {
    console.error('Failed to load gallery settings', err)
    return {}
  }
}

export default async function FullGalleryPage({
  params,
}: {
  params: Promise<{ branch: string }>
}) {
  const { branch } = await params
  if (!isValidBranch(branch)) {
    notFound()
  }

  const [galleryImages, settingsData] = await Promise.all([getGalleries(branch), getSettings()])
  const branchLabel = branch === 'padang' ? 'Padang' : 'Painan'
  const subtitleKey = branch === 'padang' ? 'galleries_subtitle_padang' : 'galleries_subtitle'
  const galleriesSubtitle =
    settingsData[subtitleKey] ||
    `Jelajahi seluruh koleksi foto fasilitas, kamar, dan lingkungan sekitar Hannah Hotel Syari'ah ${branchLabel}.`

  return (
    <main className="min-h-screen bg-[#FCF9F8] pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Galeri Hannah Hotel {branchLabel}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{galleriesSubtitle}</p>
          <div className="mt-8 flex w-full items-center justify-center gap-4">
            <span className="h-[1px] w-16 bg-[#BFC9BE]" />
            <div
              className="flex h-3 w-3 items-center justify-center bg-[#BFC9BE]"
              style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
            />
            <span className="h-[1px] w-16 bg-[#BFC9BE]" />
          </div>
        </div>

        {/* Gallery Grid */}
        {galleryImages.length === 0 ? (
          <div className="rounded-xl bg-white py-20 text-center text-gray-500 shadow-sm">
            Belum ada foto yang ditambahkan ke galeri cabang {branchLabel}.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryImages.map((img: any, index: number) => (
              <div
                key={img.id}
                className="group relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 shadow-md"
              >
                <div className="relative h-full overflow-hidden bg-[#e5e2e1]">
                  {img.imageUrl ? (
                    <Image
                      src={resolveImageUrl(img.imageUrl)}
                      alt={img.title}
                      fill
                      loading={index < 4 ? 'eager' : 'lazy'}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-500">No Image</div>
                  )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="translate-y-4 transform p-5 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-lg font-bold text-white shadow-sm">{img.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
