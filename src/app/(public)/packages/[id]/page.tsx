import { getHotelBranches } from '@/lib/branch-server'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { notFound } from 'next/navigation'
import PageIntro from '@/components/PageIntro'

type HotelPackage = { id: number; name: string; description: string; included: string[]; imageUrl: string; location: string }

async function getPackage(id: string): Promise<HotelPackage | null> {
    try {
        const res = await fetch(`http://localhost:5000/api/packages/${id}`, { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const item = await getPackage((await params).id)
    if (!item) notFound()
    const branches = await getHotelBranches()
    const branch = branches.find(branch => branch.id === item.location)
    const included = Array.isArray(item.included) ? item.included : []
    const imageUrl = item.imageUrl?.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`

    return (
        <>
            <PageIntro title={item.name} description="Detail paket Hannah Hotel" />
            <section className="bg-cream px-5 pb-24 pt-12 sm:px-8">
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_.95fr]">
                    <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#e5e2e1] bg-white shadow-sm">
                        {item.imageUrl ? <Image src={imageUrl} alt={item.name} fill className="object-cover" priority /> : <div className="flex h-full min-h-[360px] items-center justify-center text-6xl text-primary">✦</div>}
                    </div>
                    <article className="rounded-lg border border-[#e5e2e1] bg-white p-7 shadow-sm sm:p-9">
                        <h1 className="font-display text-4xl font-semibold text-primary">{item.name}</h1>
                        <span className="mt-4 block h-1 w-16 bg-orange" />
                        <div className="mt-5 rounded-lg bg-mint/20 p-4 text-sm text-primary">
                            <p className="font-semibold">Hannah Hotel Syari'ah {item.location === 'padang' ? 'Padang' : 'Painan'}</p>
                            <p className="mt-2 flex items-start gap-2 text-secondary">
                                <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                                <span className="whitespace-pre-line">{branch?.location}</span>
                            </p>
                        </div>
                        <p className="mt-6 whitespace-pre-wrap leading-8 text-secondary">{item.description}</p>
                        {included.length > 0 && <div className="mt-8"><h2 className="font-display text-2xl font-semibold text-primary">Package Include</h2><ul className="mt-4 space-y-3 text-secondary">{included.map((entry, index) => <li key={`${entry}-${index}`} className="flex gap-3"><span className="text-orange">-</span><span>{entry}</span></li>)}</ul></div>}
                        <button type="button" className="mt-9 rounded-md bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-mint-ink">Info Lebih Lanjut</button>
                        <Link href={`/packages?location=${item.location}`} className="ml-4 text-sm font-semibold text-primary hover:text-orange">Kembali ke Paket</Link>
                    </article>
                </div>
            </section>
        </>
    )
}
