import ContactContent from '@/components/ContactContent'
import { getBranchContactSettings } from '@/lib/contact-settings'

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ location?: string }> }) {
  const location = (await searchParams).location === 'padang' ? 'padang' : 'painan'
  let data = {}
  try {
    const response = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' })
    if (!response.ok) throw new Error('Failed to load contact settings')
    data = await response.json()
  } catch (error) { console.error('Failed to load contact settings:', error) }
  return <ContactContent initialLocation={location} painan={getBranchContactSettings(data, 'painan')} padang={getBranchContactSettings(data, 'padang')} />
}
