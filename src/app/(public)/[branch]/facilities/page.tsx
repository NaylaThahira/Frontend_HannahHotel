import { notFound } from 'next/navigation'
import PageIntro from '@/components/PageIntro'
import FacilitiesPackagesTabs, { type FacilityItem, type PackageItem } from '@/components/FacilitiesPackagesTabs'
import { SERVER_API_URL } from '@/lib/api'
import { isValidBranch } from '@/lib/branches'

async function getFacilities(location: string): Promise<FacilityItem[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/facilities?location=${location}`, {
      next: { revalidate: 300, tags: ['facilities'] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(error)
    return []
  }
}

async function getPackages(location: string): Promise<PackageItem[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/packages?location=${location}`, {
      next: { revalidate: 300, tags: ['packages'] },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(error)
    return []
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/settings?keys=facilities_subtitle,facilities_subtitle_padang`, {
      next: { revalidate: 300, tags: ['settings'] },
    })
    if (!res.ok) return {}
    return res.json()
  } catch (error) {
    console.error(error)
    return {}
  }
}

export default async function BranchFacilitiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ branch: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { branch } = await params
  if (!isValidBranch(branch)) {
    notFound()
  }

  const { tab } = await searchParams
  const initialTab = tab === 'packages' ? 'packages' : 'facilities'

  const [facilities, packages, settings] = await Promise.all([
    getFacilities(branch),
    getPackages(branch),
    getSettings(),
  ])

  const branchLabel = branch === 'padang' ? 'Padang' : 'Painan'
  const facilitiesSubtitle =
    settings[branch === 'padang' ? 'facilities_subtitle_padang' : 'facilities_subtitle'] ||
    'Nikmati rangkaian fasilitas dan paket lengkap yang kami siapkan untuk mendukung kenyamanan, ketenangan, dan kebutuhan Anda selama menginap.'

  return (
    <>
      <PageIntro title={`Fasilitas & Paket Hotel ${branchLabel}`} description={facilitiesSubtitle} />
      <FacilitiesPackagesTabs
        branch={branch}
        branchLabel={branchLabel}
        initialTab={initialTab}
        facilities={facilities}
        packages={packages}
      />
    </>
  )
}
