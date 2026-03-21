'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type Variant = 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in' | 'blur-in'

function getVariants(variant: Variant) {
  switch (variant) {
    case 'fade-left':
      return {
        initial: { opacity: 0, x: -50 } as const,
        animate: { opacity: 1, x: 0 } as const,
      }
    case 'fade-right':
      return {
        initial: { opacity: 0, x: 50 } as const,
        animate: { opacity: 1, x: 0 } as const,
      }
    case 'zoom-in':
      return {
        initial: { opacity: 0, scale: 0.88 } as const,
        animate: { opacity: 1, scale: 1 } as const,
      }
    case 'blur-in':
      return {
        initial: { opacity: 0, filter: 'blur(12px)' } as const,
        animate: { opacity: 1, filter: 'blur(0px)' } as const,
      }
    default: // 'fade-up'
      return {
        initial: { opacity: 0, y: 50 } as const,
        animate: { opacity: 1, y: 0 } as const,
      }
  }
}

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  variant?: Variant
  className?: string
}

export function RevealOnScroll({
  children,
  delay = 0,
  variant = 'fade-up',
  className,
}: RevealOnScrollProps) {
  const { initial, animate } = getVariants(variant)
  return (
    <motion.div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initial={initial as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      whileInView={animate as any}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
