import Link from 'next/link'
import Image from 'next/image'

// Import langsung dari folder assets agar Next.js memantau perubahannya
import logoNavbar from '@/assets/logo/logo-navbar.svg'

type BrandProps = {
  compact?: boolean
}

export default function Brand({ compact = false }: BrandProps) {
  return (
    <Link href="/" className="group flex items-center" aria-label="Hannah Hotel - Beranda">
      <Image
        src={logoNavbar}
        alt="Hannah Hotel Syari'ah Painan"
        className={compact ? "h-8 w-auto" : "h-10 sm:h-12 w-auto object-contain"}
      />
    </Link>
  )
}
