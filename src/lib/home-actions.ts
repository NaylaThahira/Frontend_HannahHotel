export const DEFAULT_WHATSAPP = '628116617717'
export const DEFAULT_WHATSAPP_PAINAN = '628116617717'
export const DEFAULT_WHATSAPP_PADANG = '628116670024'

export const DEFAULT_REVIEW_URL = 'https://forms.gle/2fgbFFbVL2VFMb98A'
export const DEFAULT_REVIEW_URL_PAINAN = 'https://forms.gle/2fgbFFbVL2VFMb98A'
export const DEFAULT_REVIEW_URL_PADANG = ''

export function normalizeWhatsApp(value: string): string {
  if (!value || !/^[+\d\s()-]+$/.test(value.trim())) return ''
  const digits = value.replace(/\D/g, '').replace(/^0/, '62')
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : ''
}

export function validReviewUrl(value: string): boolean {
  if (!value || !value.trim()) return false
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && !!url.hostname
  } catch {
    return false
  }
}

export function getBranchWhatsApp(branch: 'padang' | 'painan', rawValue?: string): string {
  const normalized = rawValue ? normalizeWhatsApp(rawValue) : ''
  if (normalized) return normalized
  return branch === 'padang' ? DEFAULT_WHATSAPP_PADANG : DEFAULT_WHATSAPP_PAINAN
}

export function getBranchReviewUrl(branch: 'padang' | 'painan', rawValue?: string): string {
  if (rawValue !== undefined) {
    const trimmed = rawValue.trim()
    if (!trimmed) return ''
    return validReviewUrl(trimmed) ? trimmed : ''
  }
  return branch === 'padang' ? DEFAULT_REVIEW_URL_PADANG : DEFAULT_REVIEW_URL_PAINAN
}
