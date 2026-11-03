export const contactDefaults = {
  contact_title: 'Hubungi Kami',
  contact_description: 'Kami siap membantu merencanakan masa inap Anda. Hubungi cabang Padang atau Painan untuk pertanyaan, kebutuhan khusus, atau reservasi.',
  contact_form_title: 'Kirim Pesan',
  contact_fields_json: '',
  contact_name_label: 'Nama Lengkap',
  contact_name_placeholder: 'Masukkan nama Anda',
  contact_email_label: 'Email',
  contact_email_placeholder: 'contoh@email.com',
  contact_phone_label: 'Nomor HP / WhatsApp',
  contact_phone_placeholder: '0812 3456 7890',
  contact_message_label: 'Pesan Anda',
  contact_message_placeholder: 'Tuliskan pertanyaan atau kebutuhan Anda di sini...',
  contact_submit_label: 'Kirim Pesan',
  contact_address_label: 'Alamat',
  contact_hotel_name: "Hannah Hotel Syari'ah",
  contact_address: 'Jl. Sutan Syahrir No.25, Painan\nKec. IV Jurai, Kabupaten Pesisir Selatan\nSumatera Barat 25651',
  contact_info_label: 'Kontak',
  contact_info_title: 'Hubungi Langsung',
  contact_phone: '0811 6617 717',
  contact_email: 'info@hannahhotel.id',
  contact_map_latitude: '-1.3447921',
  contact_map_longitude: '100.5782687',
  contact_map_url: 'https://maps.app.goo.gl/GvfpnC9SNYi6ZkiH9',
  contact_map_label: 'Buka di Google Maps',
}

export type ContactSettings = typeof contactDefaults

export const MAX_CONTACT_FIELDS = 5
export const contactFieldTypes = ['text', 'email', 'tel', 'textarea', 'number', 'date'] as const
export type ContactField = {
  id: string
  label: string
  type: typeof contactFieldTypes[number]
  placeholder: string
  required: boolean
}

export function getContactFields(settings: ContactSettings): ContactField[] {
  if (settings.contact_fields_json) {
    try {
      const fields: unknown = JSON.parse(settings.contact_fields_json)
      if (Array.isArray(fields) && fields.length <= MAX_CONTACT_FIELDS && fields.every(field =>
        field && typeof field.id === 'string' && field.id.trim() &&
        typeof field.label === 'string' && field.label.trim() &&
        contactFieldTypes.includes(field.type) && typeof field.placeholder === 'string' && typeof field.required === 'boolean'
      ) && new Set(fields.map(field => field.id)).size === fields.length) return fields
    } catch { /* Use the existing form when saved data is invalid. */ }
  }
  return [
    { id: 'full-name', label: settings.contact_name_label, type: 'text', placeholder: settings.contact_name_placeholder, required: true },
    { id: 'email', label: settings.contact_email_label, type: 'email', placeholder: settings.contact_email_placeholder, required: true },
    { id: 'phone', label: settings.contact_phone_label, type: 'tel', placeholder: settings.contact_phone_placeholder, required: true },
    { id: 'message', label: settings.contact_message_label, type: 'textarea', placeholder: settings.contact_message_placeholder, required: true },
  ]
}

export function getContactSettings(data: Record<string, unknown>, defaults: ContactSettings = contactDefaults): ContactSettings {
  const settings = { ...defaults }
  for (const key of Object.keys(settings) as (keyof ContactSettings)[]) {
    if (typeof data[key] === 'string' && data[key].trim()) settings[key] = data[key]
  }
  for (const [key, limit] of [['contact_map_latitude', 90], ['contact_map_longitude', 180]] as const) {
    const value = Number(settings[key])
    if (!Number.isFinite(value) || Math.abs(value) > limit) settings[key] = defaults[key]
  }
  try {
    if (!['http:', 'https:'].includes(new URL(settings.contact_map_url).protocol)) settings.contact_map_url = defaults.contact_map_url
  } catch {
    settings.contact_map_url = defaults.contact_map_url
  }
  return settings
}

export const padangContactDefaults: ContactSettings = {
  ...contactDefaults,
  contact_hotel_name: "Hannah Hotel Syari'ah Padang",
  contact_address: '', contact_phone: '', contact_email: '',
  contact_map_latitude: '-0.9381099', contact_map_longitude: '100.3867207',
  contact_map_url: 'https://www.google.com/maps/place/Hannah+Guest+House+Syariah/@-0.9381099,100.3867207,793m/data=!3m2!1e3!4b1!4m9!3m8!1s0x2fd4b9c5113c0d27:0x6092b8a1f60a81ad!5m2!4m1!1i2!8m2!3d-0.9381099!4d100.3867207!16s%2Fg%2F11wjbcb_h_?entry=ttu',
};

export function contactSettingKey(key: keyof ContactSettings, location: string) {
  return location === 'padang' ? key.replace(/^contact_/, 'contact_padang_') : key;
}

export function getBranchContactSettings(data: Record<string, unknown>, location: string): ContactSettings {
  if (location === 'painan') return getContactSettings(data);
  const mapped = Object.fromEntries(Object.keys(padangContactDefaults).map(key => [key, data[contactSettingKey(key as keyof ContactSettings, location)]]));
  return getContactSettings(mapped, padangContactDefaults);
}
