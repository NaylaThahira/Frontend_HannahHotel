import ListingFilters from '@/components/ListingFilters'
import { matchesListingSearch } from '@/lib/listing-search'
import Image from 'next/image'
import Link from 'next/link'
import PageIntro from '@/components/PageIntro'

type HotelPackage = { id: number; name: string; description: string; imageUrl: string }

async function getPackages(location?: string): Promise<HotelPackage[]> {
    try {
        const res = await fetch(`http://localhost:5000/api/packages${location ? `?location=${location}` : ''}`, { cache: 'no-store' })
        if (!res.ok) return []
        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch {
        return []
    }
}

function imageSrc(imageUrl: string) {
    return imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`
}

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ location?: string; q?: string }> }) {
    const params = await searchParams;
    const query = (params.q || '').trim();
    const location = params.location === 'padang' || params.location === 'painan' ? params.location : undefined
    const packages = await getPackages(location)

    const filteredPackages = packages.filter(item => matchesListingSearch(item.name, item.description, query))

    return (
        <>
            <PageIntro title="Paket Hannah Hotel" description="Pilih paket yang kami siapkan untuk melengkapi kebutuhan acara dan masa inap Anda." />
            <section className="bg-cream px-5 pb-24 pt-12 sm:px-8">
                <div className="mx-auto mb-8 max-w-6xl"><ListingFilters location={location} query={query} kind="packages" /></div>
                <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {filteredPackages.map((item) => (
                        <Link key={item.id} href={`/packages/${item.id}`} className="group overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                            <div className="relative h-72 overflow-hidden bg-[#e8f5ee]">
                                {item.imageUrl ? <Image src={imageSrc(item.imageUrl)} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-5xl text-primary">✦</div>}
                            </div>
                            <div className="p-6 sm:p-7"><h2 className="font-display text-3xl font-semibold text-primary">{item.name}</h2></div>
                        </Link>
                    ))}
                    {filteredPackages.length === 0 && <p className="text-secondary">{query ? `Tidak ada paket yang cocok dengan pencarian "${query}".` : 'Belum ada paket yang tersedia.'}</p>}
                </div>
            </section>
        </>
    )
}
