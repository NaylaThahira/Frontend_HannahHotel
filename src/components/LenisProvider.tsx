'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.18,
        duration: 0.75,
        wheelMultiplier: 1.35,
        touchMultiplier: 1.5,
        smoothWheel: true,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
