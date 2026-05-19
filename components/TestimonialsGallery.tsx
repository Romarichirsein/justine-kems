'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { RevealOnScroll } from './RevealOnScroll'

interface TestimonialsGalleryProps {
  translations: {
    showMore: string
    showLess: string
    zoom: string
    next: string
    prev: string
    close: string
  }
}

const IMAGES_COUNT = 19
const INITIAL_VISIBLE_COUNT = 8

export function TestimonialsGallery({ translations }: TestimonialsGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

  // Generate screenshot image paths
  const screenshots = Array.from(
    { length: IMAGES_COUNT },
    (_, i) => `/images/temoignages/screenshot-${i + 1}.jpeg`
  )

  const visibleScreenshots = isExpanded ? screenshots : screenshots.slice(0, INITIAL_VISIBLE_COUNT)

  // Navigation handlers for Lightbox
  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setActiveImageIndex((prev) => (prev === null || prev === 0 ? IMAGES_COUNT - 1 : prev - 1))
  }, [])

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setActiveImageIndex((prev) => (prev === null || prev === IMAGES_COUNT - 1 ? 0 : prev + 1))
  }, [])

  const handleClose = useCallback(() => {
    setActiveImageIndex(null)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (activeImageIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [activeImageIndex, handleClose, handlePrev, handleNext])

  return (
    <div className="w-full">
      {/* ── Grid of Screenshots ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleScreenshots.map((src, index) => (
          <RevealOnScroll
            key={src}
            delay={(index % 4) * 0.05}
            variant="zoom-in"
            className="w-full"
          >
            <div
              onClick={() => setActiveImageIndex(index)}
              className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-2xl border border-jk-royal-gold/15 bg-jk-dark-bg transition-all duration-500 hover:border-jk-royal-gold/50 hover:shadow-[0_0_20px_rgba(197,160,89,0.15)]"
            >
              {/* Image */}
              <Image
                src={src}
                alt={`Testimonial screenshot ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={index < 4}
              />

              {/* Elegant Hover Overlay */}
              <div className="absolute inset-0 bg-jk-black/70 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100 flex flex-col items-center justify-center p-4 text-center">
                {/* Gold plus zoom icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-jk-royal-gold/30 bg-jk-royal-gold/10 text-jk-royal-gold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </motion.div>
                <p className="text-xs uppercase tracking-widest text-jk-royal-gold font-semibold">
                  {translations.zoom}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* ── Show More / Show Less Button ── */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-jk-royal-gold/40 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-jk-cream transition-all duration-350 hover:border-jk-royal-gold hover:text-jk-black"
        >
          {/* Slider Background effect */}
          <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-jk-royal-gold to-jk-royal-gold-dark transition-transform duration-300 ease-out group-hover:translate-y-0" />
          
          <span>{isExpanded ? translations.showLess : translations.showMore}</span>
          
          {/* Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* ── Premium Lightbox Modal ── */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-jk-black/95 p-4 backdrop-blur-md md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label={translations.close}
              className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-jk-royal-gold/10 bg-jk-dark-surface/50 text-jk-cream hover:border-jk-royal-gold/40 hover:text-jk-royal-gold transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={handlePrev}
              aria-label={translations.prev}
              className="absolute left-4 z-50 hidden h-14 w-14 items-center justify-center rounded-full border border-jk-royal-gold/10 bg-jk-dark-surface/50 text-jk-cream hover:border-jk-royal-gold/40 hover:text-jk-royal-gold transition-colors duration-300 md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={handleNext}
              aria-label={translations.next}
              className="absolute right-4 z-50 hidden h-14 w-14 items-center justify-center rounded-full border border-jk-royal-gold/10 bg-jk-dark-surface/50 text-jk-cream hover:border-jk-royal-gold/40 hover:text-jk-royal-gold transition-colors duration-300 md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* Content Area with smooth transition */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[82vh] w-full max-w-lg flex-col items-center justify-center"
            >
              <motion.div
                key={activeImageIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative h-full w-full overflow-hidden rounded-2xl border border-jk-royal-gold/20 shadow-2xl"
              >
                <Image
                  src={screenshots[activeImageIndex]}
                  alt={`Zoomed client testimonial screenshot ${activeImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 512px"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Image counter at the bottom */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-jk-royal-gold/70 font-semibold">
                {activeImageIndex + 1} / {IMAGES_COUNT}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
