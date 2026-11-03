import { Star } from 'lucide-react'
import { DEFAULT_WHATSAPP, DEFAULT_REVIEW_URL, normalizeWhatsApp, validReviewUrl } from '@/lib/home-actions'

export default function HomeFloatingActions({ whatsappNumber = DEFAULT_WHATSAPP, reviewUrl = DEFAULT_REVIEW_URL }: { whatsappNumber?: string; reviewUrl?: string }) {
  const phone = normalizeWhatsApp(whatsappNumber) || DEFAULT_WHATSAPP
  const reviewLink = validReviewUrl(reviewUrl) ? reviewUrl : DEFAULT_REVIEW_URL
  const buttonClass = 'flex min-h-12 items-center justify-center gap-3 rounded-full bg-orange px-5 py-3 text-sm font-bold text-orange-ink shadow-lg transition-colors hover:bg-[#ffab6b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:min-h-14 sm:px-7 sm:py-4 sm:text-base'

  return (
    <nav aria-label="Hubungi hotel dan beri penilaian" className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6">
          <path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.94 11.94 0 0 0 5.8 1.48h.01C18.65 23.84 24 18.48 24 11.9c0-3.19-1.24-6.18-3.48-8.42ZM12.06 21.82a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.9 9.9 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.94-9.94a9.87 9.87 0 0 1 7.03 2.91 9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.47 9.87-10 9.87Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.62.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
        </svg>
        WhatsApp
        <span className="sr-only"> (dibuka di tab baru)</span>
      </a>
      <a href={reviewLink} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        <Star aria-hidden="true" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
        Write a Review
        <span className="sr-only"> (dibuka di tab baru)</span>
      </a>
    </nav>
  )
}
