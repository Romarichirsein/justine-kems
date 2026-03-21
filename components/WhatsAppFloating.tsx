'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function WhatsAppFloating() {
  const t = useTranslations('whatsapp')
  const [isHovered, setIsHovered] = useState(false)
  
  // Numéro WhatsApp Justine (+237 677 463 484)
  const whatsappNumber = '237677463484'
  const message = encodeURIComponent(t('defaultMessage'))
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-3 bg-[#25D366] text-white rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-shadow z-10"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icône WhatsApp */}
        <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#25D366] rounded-full">
          <svg
            viewBox="0 0 32 32"
            className="w-8 h-8 md:w-10 md:h-10"
            fill="currentColor"
          >
            <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 8.188-2.113c2.35 1.288 5.013 1.963 7.813 1.963 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.5c-2.547 0-5.037-0.725-7.163-2.088l-0.513-0.3-5.325 1.375 1.425-5.3-0.338-0.538c-1.475-2.337-2.262-5.038-2.262-7.825 0-8.15 6.637-14.787 14.787-14.787s14.787 6.637 14.787 14.787-6.637 14.787-14.787 14.787zM23.238 19.488c-0.4-0.2-2.363-1.163-2.725-1.3-0.363-0.138-0.625-0.2-0.888 0.2s-1.025 1.3-1.25 1.563c-0.225 0.262-0.45 0.3-0.85 0.1s-1.663-0.613-3.163-1.95c-1.175-1.038-1.963-2.325-2.188-2.725s-0.025-0.613 0.175-0.813c0.188-0.188 0.4-0.488 0.6-0.738 0.2-0.25 0.263-0.425 0.4-0.713 0.138-0.287 0.063-0.537-0.038-0.737s-0.888-2.138-1.213-2.925c-0.325-0.775-0.65-0.663-0.888-0.675-0.225-0.013-0.488-0.013-0.75-0.013s-0.688 0.1-1.05 0.5-1.375 1.338-1.375 3.263 1.413 3.788 1.613 4.050c0.2 0.262 2.825 4.313 6.863 6.05 0.962 0.413 1.713 0.663 2.3 0.85 0.975 0.3 1.863 0.263 2.563 0.163 0.787-0.113 2.363-0.963 2.7-1.9s0.338-1.738 0.238-1.9c-0.1-0.163-0.363-0.263-0.763-0.463z" />
          </svg>
        </div>

        {/* Texte au survol (desktop) */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden md:block pr-5 font-medium whitespace-nowrap overflow-hidden"
            >
              {t('buttonText')}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>

      {/* Ping animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366] pointer-events-none"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop'
        }}
      />
    </motion.div>
  )
}
