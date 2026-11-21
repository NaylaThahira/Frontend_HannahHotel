import { notFound } from 'next/navigation'
import FeaturedRooms from '@/components/FeaturedRooms'
import Gallery from '@/components/Gallery'
import Hero from '@/components/Hero'
import HomeFloatingActions from '@/components/HomeFloatingActions'
import TrustBar from '@/components/TrustBar'
import TouristAttractions from '@/components/TouristAttractions'
import { defaultPainanAttractions, parseAttractions } from '@/lib/attractions'
import { SERVER_API_URL } from '@/lib/api'
import { getHotelBranches } from '@/lib/branch-server'
import { isValidBranch } from '@/lib/branches'

const PAINAN_HOME_KEYS =
  'home_hero_title,home_hero_subtitle,home_hero_image,home_sections_order,home_whatsapp_number,home_review_url,tourist_attractions_json'
const PADANG_HOME_KEYS =
  'home_hero_title_padang,home_hero_subtitle_padang,home_hero_image_padang,home_sections_order_padang,home_sections_order,home_whatsapp_number_padang,home_review_url_padang,tourist_attractions_padang_json'

async function getSettings(branch: 'padang' | 'painan') {
  try {
    const keys = branch === 'padang' ? PADANG_HOME_KEYS : PAINAN_HOME_KEYS
    const res = await fetch(`${SERVER_API_URL}/api/settings?keys=${keys}`, {
      next: { revalidate: 300, tags: ['settings'] },
    })
    if (!res.ok) return {}
    return res.json()
  } catch (error) {
    console.error(error)
    return {}
  }
}

async function getBranchRooms(branch: 'padang' | 'painan') {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/rooms?location=${branch}`, {
      next: { revalidate: 300, tags: ['rooms'] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(error)
    return []
  }
}

async function getHomeGalleries(branch: 'padang' | 'painan') {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/galleries?location=${branch}&limit=6`, {
      next: { revalidate: 300, tags: ['galleries', `galleries-${branch}`] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.slice(0, 6) : []
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function BranchHomePage({
  params,
}: {
  params: Promise<{ branch: string }>
}) {
  const { branch } = await params
  if (!isValidBranch(branch)) {
    notFound()
  }

  const [settings, branches, galleries, rooms] = await Promise.all([
    getSettings(branch),
    getHotelBranches(),
    getHomeGalleries(branch),
    getBranchRooms(branch),
  ])

  const branchInfo = branches.find((b) => b.id === branch)
  const branchLabel = branch === 'padang' ? 'Padang' : 'Painan'
  const isPadang = branch === 'padang'

  const heroTitle =
    (isPadang ? settings.home_hero_title_padang : settings.home_hero_title) ||
    branchInfo?.title ||
    `Hannah Hotel Syari'ah ${branchLabel}`

  const heroSubtitle =
    (isPadang ? settings.home_hero_subtitle_padang : settings.home_hero_subtitle) ||
    branchInfo?.description ||
    `Nikmati pengalaman menginap yang nyaman, tenang, dan sesuai nilai Syari'ah di pusat Kota ${branchLabel}.`

  const heroImage =
    (isPadang ? settings.home_hero_image_padang : settings.home_hero_image) || branchInfo?.imageUrl

  let sectionsOrder = ['hero', 'trustbar', 'rooms', 'attractions', 'gallery']
  const rawOrder = isPadang ? settings.home_sections_order_padang || settings.home_sections_order : settings.home_sections_order
  if (rawOrder) {
    try {
      sectionsOrder = JSON.parse(rawOrder)
    } catch {}
  }

  const whatsappNumber = isPadang
    ? settings.home_whatsapp_number_padang
    : settings.home_whatsapp_number
  const reviewUrl = isPadang
    ? settings.home_review_url_padang
    : settings.home_review_url

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return <Hero key="hero" title={heroTitle} subtitle={heroSubtitle} heroImage={heroImage} />
      case 'trustbar':
        return <TrustBar key="trustbar" />
      case 'rooms':
        return <FeaturedRooms key="rooms" branches={branches} activeBranch={branch} initialRooms={rooms} />
      case 'attractions':
        return (
          <TouristAttractions
            key="attractions"
            activeBranch={branch}
            painan={parseAttractions(settings.tourist_attractions_json, defaultPainanAttractions)}
            padang={parseAttractions(settings.tourist_attractions_padang_json)}
          />
        )
      case 'gallery':
        return <Gallery key="gallery" images={galleries} activeBranch={branch} />
      default:
        return null
    }
  }

  return (
    <>
      {sectionsOrder.map((section) => renderSection(section))}
      <HomeFloatingActions branch={branch} whatsappNumber={whatsappNumber} reviewUrl={reviewUrl} />
    </>
  )
}
