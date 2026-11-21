import { notFound } from 'next/navigation'
import ContactContent from '@/components/ContactContent'
import { getBranchContactSettings } from '@/lib/contact-settings'
import { SERVER_API_URL } from '@/lib/api'
import { isValidBranch } from '@/lib/branches'

const CONTACT_KEYS =
  'contact_title,contact_description,contact_hotel_name,contact_address,contact_phone,contact_email,contact_map_latitude,contact_map_longitude,contact_map_url,contact_map_label,contact_padang_hotel_name,contact_padang_address,contact_padang_phone,contact_padang_email,contact_padang_map_latitude,contact_padang_map_longitude,contact_padang_map_url,contact_padang_map_label,home_whatsapp_number,home_whatsapp_number_padang'

export default async function BranchContactPage({
  params,
}: {
  params: Promise<{ branch: string }>
}) {
  const { branch } = await params
  if (!isValidBranch(branch)) {
    notFound()
  }

  let data: Record<string, string> = {}
  try {
    const response = await fetch(`${SERVER_API_URL}/api/settings?keys=${CONTACT_KEYS}`, {
      next: { revalidate: 300, tags: ['settings'] },
    })
    if (response.ok) {
      data = await response.json()
    }
  } catch (error) {
    console.error('Failed to load contact settings:', error)
  }

  return (
    <ContactContent
      initialLocation={branch}
      lockBranch
      painan={getBranchContactSettings(data, 'painan')}
      padang={getBranchContactSettings(data, 'padang')}
      whatsappNumbers={{
        painan: data.home_whatsapp_number,
        padang: data.home_whatsapp_number_padang,
      }}
    />
  )
}

