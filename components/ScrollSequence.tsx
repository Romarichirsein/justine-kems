'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface ScrollSequenceProps {
  frameCount: number
  baseUrl: string
}

export default function ScrollSequence({ frameCount = 16, baseUrl = '/motion/ezgif-frame-' }: ScrollSequenceProps) {
  const t = useTranslations('homeExt')
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const frameIndex = useTransform(smoothProgress, [0, 1], [1, frameCount])

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const loadedImages: HTMLImageElement[] = []
      const promises = []

      for (let i = 1; i <= frameCount; i++) {
        const img = new Image()
        const frameNumber = i.toString().padStart(3, '0')
        img.src = `${baseUrl}${frameNumber}.jpg`
        
        const promise = new Promise((resolve) => {
          img.onload = () => resolve(img)
          img.onerror = () => resolve(null) // Skip failed images
        })
        promises.push(promise)
        loadedImages.push(img)
      }

      await Promise.all(promises)
      setImages(loadedImages)
      setIsLoading(false)
    }

    preloadImages()
  }, [frameCount, baseUrl])

  // Draw current frame to canvas
  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return

    const render = () => {
      const canvas = canvasRef.current!
      const context = canvas.getContext('2d')
      if (!context) return

      const currentFrame = Math.floor(frameIndex.get()) - 1
      const activeImage = images[currentFrame] || images[0]

      if (activeImage) {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height)
        
        // Calculate scale to cover canvas (object-fit: cover equivalent)
        const scale = Math.max(
          canvas.width / activeImage.width,
          canvas.height / activeImage.height
        )
        const x = (canvas.width / 2) - (activeImage.width / 2) * scale
        const y = (canvas.height / 2) - (activeImage.height / 2) * scale
        
        context.drawImage(activeImage, x, y, activeImage.width * scale, activeImage.height * scale)
      }
    }

    // Update on frame change
    const unsubscribe = frameIndex.onChange(render)
    
    // Initial draw
    render()

    // Handle resizing
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        render()
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      unsubscribe()
      window.removeEventListener('resize', handleResize)
    }
  }, [images, frameIndex])

  // Text overlay opacity transforms
  const text1Opacity = useTransform(smoothProgress, [0.1, 0.2, 0.3, 0.4], [0, 1, 1, 0])
  const text2Opacity = useTransform(smoothProgress, [0.4, 0.5, 0.6, 0.7], [0, 1, 1, 0])
  const text3Opacity = useTransform(smoothProgress, [0.7, 0.8, 0.9, 0.95], [0, 1, 1, 0])

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <div className="w-12 h-12 border-4 border-jk-royal-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover"
        />

        {/* Overlays Professionnels */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Text 1 */}
          <motion.div 
            style={{ opacity: text1Opacity }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl text-center">
              <h1 className="text-3xl md:text-5xl font-script text-jk-royal-gold mb-4">
                {t('scrollSequence.t1Title')}
              </h1>
              <p className="text-jk-cream text-lg md:text-xl font-light">
                {t('scrollSequence.t1Desc')}
              </p>
            </div>
          </motion.div>

          {/* Text 2 */}
          <motion.div 
            style={{ opacity: text2Opacity }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl text-center">
              <h2 className="text-3xl md:text-5xl font-display text-jk-royal-gold mb-4 uppercase tracking-tighter">
                {t('scrollSequence.t2Title')}
              </h2>
              <p className="text-jk-cream text-lg md:text-xl font-light">
                {t('scrollSequence.t2Desc')}
              </p>
            </div>
          </motion.div>

          {/* Text 3 */}
          <motion.div 
            style={{ opacity: text3Opacity }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl text-center">
              <h2 className="text-3xl md:text-5xl font-script text-jk-royal-gold mb-4">
                {t('scrollSequence.t3Title')}
              </h2>
              <p className="text-jk-cream text-lg md:text-xl font-light">
                {t('scrollSequence.t3Desc')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Gradient Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </div>
    </div>
  )
}
