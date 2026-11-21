import AyanaPortal from '@/components/AyanaPortal'
import { SERVER_API_URL } from '@/lib/api'
import { getHotelBranches } from '@/lib/branch-server'

async function getSettings() {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/settings?keys=home_hero_title,home_hero_image`, {
      next: { revalidate: 300, tags: ['settings'] }
    })
    if (!res.ok) return {}
    return res.json()
  } catch (error) {
    console.error(error)
    return {}
  }
}

export default async function HomePage() {
  const [settings, branches] = await Promise.all([
    getSettings(),
    getHotelBranches(),
  ])

  return (
    <AyanaPortal
      title={settings.home_hero_title}
      heroImage={settings.home_hero_image}
      branches={branches}
    />
  )
}
