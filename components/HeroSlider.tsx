'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SanityImage } from './SanityImage'
import { urlForImage } from '@/sanity/client'
import Image from 'next/image'

interface HeroSliderProps {
  slides: any[]
  fallbackTitle?: string
  fallbackSubtitle?: string
}

export default function HeroSlider({ slides, fallbackTitle, fallbackSubtitle }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Default fallback if no slides from Sanity
  const defaultSlides = [
    {
      _id: 'default-1',
      title: fallbackTitle || "Bienvenue chez Justine Kem's",
      caption: fallbackSubtitle || "L'élégance façonnée sur mesure",
      isDefault: true,
    }
  ]

  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides

  useEffect(() => {
    if (activeSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-jk-imperial-green">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {activeSlides[currentIndex].isDefault ? (
            // Placeholder when NO Sanity images exist
            // Using the hero image pattern you sent
            <div className="absolute inset-0 bg-[#003B36]">
               <Image 
                 src="/images/placeholders/soiree.jpg" 
                 alt="Soirée Elégance" 
                 fill 
                 className="object-cover opacity-70"
                 priority
               />
            </div>
          ) : (
            <SanityImage 
              asset={activeSlides[currentIndex].image} 
              alt={activeSlides[currentIndex].alt || activeSlides[currentIndex].title || 'Hero Image'} 
              fill
              priority
              className="object-cover"
            />
          )}

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              {fallbackTitle || activeSlides[currentIndex].title}
            </h1>
            {(fallbackSubtitle || activeSlides[currentIndex].caption) && (
              <p className="text-xl md:text-2xl font-light text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {fallbackSubtitle || activeSlides[currentIndex].caption}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-jk-royal-gold w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
