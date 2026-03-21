'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import LocaleSwitcher from './LocaleSwitcher'

export default function Navbar() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const lastScrollY = useRef(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const progress = Math.min(y / 80, 1)
      setScrollProgress(progress)
      setScrolled(y > 20)

      // Auto-hide on scroll down, show on scroll up
      if (y > lastScrollY.current && y > 120) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/a-propos`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/modeles`, label: t('models') },
    { href: `/${locale}/catalogue`, label: t('catalogue') },
    { href: `/${locale}/formations`, label: t('formations') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <>
      <motion.nav
        animate={{
          y: hidden && !menuOpen ? -100 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed w-full z-50 top-0"
        style={{ willChange: 'transform' }}
      >
        {/* Dynamic background */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: scrolled
              ? `rgba(0, 0, 0, ${0.82 + scrollProgress * 0.12})`
              : 'transparent',
            backdropFilter: scrolled ? `blur(${12 + scrollProgress * 8}px) saturate(1.8)` : 'none',
            WebkitBackdropFilter: scrolled ? `blur(${12 + scrollProgress * 8}px) saturate(1.8)` : 'none',
            borderBottom: scrolled
              ? `1px solid rgba(212, 175, 55, ${0.15 + scrollProgress * 0.2})`
              : '1px solid transparent',
          }}
        />

        {/* Gold shimmer line at bottom when scrolled */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, #D4AF37, #c9a96e, #D4AF37, transparent)',
            width: `${scrollProgress * 100}%`,
          }}
        />

        <div className="relative container mx-auto px-4 flex justify-between items-center h-20 py-2">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center group z-50 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative"
            >
              <Image
                src="/logo-justine-kems.png"
                alt="Justine Kem's"
                width={120}
                height={54}
                className="object-contain relative z-10 transition-all duration-300"
                style={{
                  filter: scrolled
                    ? 'drop-shadow(0 0 8px rgba(212,175,55,0.4)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                    : 'drop-shadow(0 0 12px rgba(212,175,55,0.6)) drop-shadow(0 0 20px rgba(212,175,55,0.3)) drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
                }}
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  className="text-white/85 hover:text-[#D4AF37] text-sm font-medium transition-colors duration-200 relative group py-1"
                  style={{
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                  }}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#D4AF37] to-[#c9a96e] group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LocaleSwitcher />
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href={`/${locale}/contact`}
                className="relative overflow-hidden bg-gradient-to-r from-[#D4AF37] to-[#c9a96e] hover:from-[#c9a96e] hover:to-[#D4AF37] text-black font-bold px-5 py-2 rounded-full transition-all text-sm shadow-lg hover:shadow-[0_4px_20px_rgba(212,175,55,0.5)]"
              >
                <span className="relative z-10">{t('cta')}</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden z-50 relative w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: menuOpen ? 'rgba(212,175,55,0.15)' : 'transparent',
            }}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-5 h-0.5 bg-[#D4AF37] block rounded-full"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-0.5 bg-[#D4AF37] block rounded-full"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-5 h-0.5 bg-[#D4AF37] block rounded-full"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1512 50%, #0d0d0d 100%)',
            }}
          >
            {/* Decorative gold orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #c9a96e, transparent)' }} />

            <div className="relative flex flex-col items-center justify-center h-full gap-6 text-center px-8 w-full">
              {/* Mobile Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Link href={`/${locale}`} onClick={() => setMenuOpen(false)} className="block mb-2">
                  <Image
                    src="/logo-justine-kems.png"
                    alt="Justine Kem's"
                    width={160}
                    height={72}
                    className="object-contain"
                    style={{
                      filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.5)) drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
                    }}
                  />
                </Link>
              </motion.div>

              {/* Gold divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-24 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
              />

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-display text-white/90 hover:text-[#D4AF37] transition-all duration-200 hover:tracking-wider block"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-col items-center gap-4 mt-4 pt-6 w-full border-t border-white/10"
              >
                <LocaleSwitcher />
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setMenuOpen(false)}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#c9a96e] text-black font-bold px-10 py-3.5 rounded-full hover:shadow-[0_4px_24px_rgba(212,175,55,0.5)] transition-all text-base"
                >
                  {t('cta')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
