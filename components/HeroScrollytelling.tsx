'use client'

import { useRef } from 'react'
import ScrollytellingCanvas from './ScrollytellingCanvas'
import ScrollOverlays from './ScrollOverlays'

export default function HeroScrollytelling() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={heroRef} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ScrollytellingCanvas
          frameCount={61}
          frameBasePath="/images/fabric-frames/frame-"
          frameExtension="jpg"
          containerRef={heroRef}
        />
        <ScrollOverlays containerRef={heroRef} />
      </div>
    </section>
  )
}
