'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollytellingCanvasProps {
  frameCount: number
  frameBasePath: string
  frameExtension: string
  containerRef: React.RefObject<HTMLElement>
}

export default function ScrollytellingCanvas({
  frameCount,
  frameBasePath,
  frameExtension,
  containerRef
}: ScrollytellingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Préchargement des images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = []
    let loadedCount = 0

    // Charger les 10 premières images en priorité
    const priorityFrames = 10
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image()
      img.src = `${frameBasePath}${i.toString().padStart(4, '0')}.${frameExtension}`
      
      img.onload = () => {
        loadedCount++
        if (loadedCount === priorityFrames || loadedCount === frameCount) {
          setImagesLoaded(true)
        }
      }
      
      loadedImages[i - 1] = img
    }
    
    setImages(loadedImages)
  }, [frameCount, frameBasePath, frameExtension])

  // Animation scroll → frame
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    // Dimensions responsive
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const render = () => {
      if (!containerRef.current) return
      
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      
      // Calculate progress relative to the container
      // (amount of container scrolled) / (total scrollable height of container)
      const scrollHeight = container.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const scrollFraction = Math.max(0, Math.min(1, scrolled / scrollHeight))

      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      )

      const img = images[frameIndex]
      if (img && img.complete) {
        // Dessiner l'image en maintenant le ratio
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        )
        const x = (canvas.width / 2) - (img.width / 2) * scale
        const y = (canvas.height / 2) - (img.height / 2) * scale

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, x, y, img.width * scale, img.height * scale)
      }

      requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [images, imagesLoaded, frameCount, containerRef])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ backgroundColor: '#003B36' }}
    />
  )
}
