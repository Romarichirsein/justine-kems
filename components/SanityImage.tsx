'use client'

import Image from 'next/image'
import { urlForImage } from '@/sanity/client'
import React from 'react'

interface SanityImageProps {
  asset: any
  alt?: string
  priority?: boolean
  className?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
}

export const SanityImage = ({
  asset,
  alt = "Justine Kem's creation",
  priority = false,
  className = '',
  width,
  height,
  fill = false,
  sizes,
}: SanityImageProps) => {
  if (!asset) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-xs">No image</span>
      </div>
    )
  }

  // Calculate URL using Sanity builder
  const imageUrl = urlForImage(asset).url()

  return (
    <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''} ${className}`}>
      <Image
        src={imageUrl}
        alt={alt}
        priority={priority}
        className={`object-cover transition-opacity duration-300 ${className}`}
        width={!fill ? width || 800 : undefined}
        height={!fill ? height || 1000 : undefined}
        fill={fill}
        sizes={sizes || (fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined)}
      />
    </div>
  )
}
