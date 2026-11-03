export const DEFAULT_WHATSAPP = '628116617717'
export const DEFAULT_REVIEW_URL = 'https://forms.gle/2fgbFFbVL2VFMb98A'

export function normalizeWhatsApp(value: string): string {
  if (!/^[+\d\s()-]+$/.test(value.trim())) return ''
  const digits = value.replace(/\D/g, '').replace(/^0/, '62')
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : ''
}

export function validReviewUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && !!url.hostname
  } catch {
    return false
  }
}
