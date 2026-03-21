'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'

export default function LocaleSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="relative flex items-center gap-1 bg-white dark:bg-jk-dark-surface rounded-full border border-jk-royal-gold/30 p-1" role="group" aria-label="Changer de langue">
      
      {/* Background slider */}
      <motion.div
        className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-jk-royal-gold rounded-full"
        animate={{ x: locale === 'en' ? '100%' : '0%' }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />

      {/* FR Button */}
      <button
        onClick={() => switchLocale('fr')}
        className={`relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          locale === 'fr' ? 'text-black' : 'text-jk-text-muted hover:text-black dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        🇫🇷 FR
      </button>

      {/* EN Button */}
      <button
        onClick={() => switchLocale('en')}
        className={`relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          locale === 'en' ? 'text-black' : 'text-jk-text-muted hover:text-black dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        EN 🇬🇧
      </button>
    </div>
  )
}
