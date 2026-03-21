'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function ScrollOverlays({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const t = useTranslations('scrollStory')
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Calculer l'opacité pour chaque overlay selon la progression
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0])
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0])
  const opacity3 = useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0])
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.75, 0.85, 0.9], [0, 1, 1, 0])
  const opacity5 = useTransform(scrollYProgress, [0.9, 0.93, 0.97, 1], [0, 1, 0.6, 0])

  const overlayClass = "fixed inset-0 flex items-center justify-center pointer-events-none z-10"
  const textClass = "text-center max-w-3xl px-8"

  return (
    <>
      <motion.div className={overlayClass} style={{ opacity: opacity1 }}>
        <div className={textClass}>
          <h2 className="text-5xl md:text-7xl font-script text-[#D4AF37] mb-4">
            {t('step1')}
          </h2>
        </div>
      </motion.div>

      <motion.div className={overlayClass} style={{ opacity: opacity2 }}>
        <div className={textClass}>
          <h2 className="text-5xl md:text-7xl font-script text-[#D4AF37] mb-4">
            {t('step2')}
          </h2>
        </div>
      </motion.div>

      <motion.div className={overlayClass} style={{ opacity: opacity3 }}>
        <div className={textClass}>
          <h2 className="text-5xl md:text-7xl font-script text-[#D4AF37] mb-4">
            {t('step3')}
          </h2>
        </div>
      </motion.div>

      <motion.div className={overlayClass} style={{ opacity: opacity4 }}>
        <div className={textClass}>
          <h2 className="text-5xl md:text-7xl font-script text-[#D4AF37] mb-4">
            {t('step4')}
          </h2>
        </div>
      </motion.div>

      <motion.div className={overlayClass} style={{ opacity: opacity5 }}>
        <div className={textClass}>
          <h2 className="text-5xl md:text-7xl font-script text-[#D4AF37] mb-4">
            {t('step5')}
          </h2>
        </div>
      </motion.div>
    </>
  )
}
