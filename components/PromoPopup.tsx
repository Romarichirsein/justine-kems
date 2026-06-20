'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'

/* ─────────────────────────────────────────────
   Keys used for sessionStorage
───────────────────────────────────────────── */
const MAIN_POPUP_DISMISSED_KEY = 'jk_promo_popup_dismissed'
const EXIT_POPUP_DISMISSED_KEY = 'jk_exit_popup_dismissed'

/* ─────────────────────────────────────────────
   Backdrop overlay
───────────────────────────────────────────── */
function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9998]"
      style={{
        background: 'rgba(4, 10, 30, 0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={onClick}
      aria-hidden="true"
    />
  )
}

/* ─────────────────────────────────────────────
   Close Button
───────────────────────────────────────────── */
function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 group"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(212,175,55,0.25)',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="transition-transform duration-200 group-hover:rotate-90"
      >
        <path d="M1 1L13 13M13 1L1 13" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}

/* ─────────────────────────────────────────────
   Advantage Item
───────────────────────────────────────────── */
function AdvantageItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm text-white/85">
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8860B)', color: '#081B4B' }}
      >
        ✓
      </span>
      {text}
    </li>
  )
}

/* ─────────────────────────────────────────────
   Date Card
───────────────────────────────────────────── */
function DateCard({ city, date }: { city: string; date: string }) {
  return (
    <div
      className="flex-1 rounded-xl p-3 text-center"
      style={{
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.3)',
      }}
    >
      <p className="text-xs text-white/60 mb-1">📍 {city}</p>
      <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>
        🗓️ {date}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN POPUP
───────────────────────────────────────────── */
function MainPopup({ onClose }: { onClose: () => void }) {
  const t = useTranslations('promoPopup')
  const advantages = t.raw('advantages') as string[]

  const whatsappUrl = `https://api.whatsapp.com/send?phone=237677463484&text=${encodeURIComponent(
    '🎓 Bonjour Justine KEM\'S ! Je souhaite obtenir plus d\'informations sur la formation d\'excellence 2026 et réserver ma place.'
  )}`

  return (
    <motion.div
      key="main-popup"
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Popup Formation Justine KEM'S"
    >
      <div
        className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col lg:flex-row"
        style={{
          background: 'linear-gradient(145deg, #081B4B 0%, #0d2560 50%, #081B4B 100%)',
          border: '1px solid rgba(212,175,55,0.35)',
          boxShadow:
            '0 0 0 1px rgba(212,175,55,0.15), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(8,27,75,0.5)',
        }}
      >
        {/* ── Decorative top gold bar ── */}
        <div
          className="absolute top-0 inset-x-0 h-0.5 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, #F5E17C, #D4AF37, transparent)' }}
        />

        {/* ── Decorative corner orbs ── */}
        <div
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-8 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />

        <CloseButton onClick={onClose} label={t('closeLabel')} />

        {/* ════════════════════════════════════════
            LEFT PANEL — Flyer image (desktop only)
        ════════════════════════════════════════ */}
        <div className="hidden lg:flex lg:w-[38%] flex-col relative overflow-hidden rounded-l-2xl">
          <Image
            src="/images/formations.jpeg"
            alt="Formation d'Excellence Justine KEM'S 2026"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(8,27,75,0) 0%, rgba(8,27,75,0.15) 100%)',
            }}
          />
          {/* Bottom label */}
          <div
            className="absolute bottom-0 inset-x-0 p-4"
            style={{ background: 'linear-gradient(to top, rgba(8,27,75,0.95), transparent)' }}
          >
            <p className="text-xs text-center font-semibold tracking-widest" style={{ color: '#D4AF37' }}>
              JUSTINE KEM&apos;S ACADEMY
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT PANEL — Content
        ════════════════════════════════════════ */}
        <div className="flex-1 p-5 sm:p-7 lg:p-8 flex flex-col gap-4 min-w-0">

          {/* Mobile flyer strip */}
          <div className="lg:hidden relative w-full h-36 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src="/images/formations.jpeg"
              alt="Formation Justine KEM'S 2026"
              fill
              className="object-cover object-top"
              priority
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(8,27,75,0.7), transparent)' }}
            />
          </div>

          {/* Badge */}
          <div className="flex justify-center lg:justify-start">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))',
                border: '1px solid rgba(212,175,55,0.5)',
                color: '#D4AF37',
                letterSpacing: '0.12em',
              }}
            >
              {t('badge')}
            </span>
          </div>

          {/* Main title */}
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-center lg:text-left"
            style={{ color: '#FFFFFF', fontFamily: "'Playfair Display', serif" }}
          >
            {t('title')}
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-white/70 leading-relaxed text-center lg:text-left">
            {t('subtitle')}
          </p>

          {/* Advantages */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {advantages.map((adv: string, i: number) => (
              <AdvantageItem key={i} text={adv} />
            ))}
          </ul>

          {/* Date blocks */}
          <div>
            <p
              className="text-xs font-bold tracking-widest mb-2 uppercase text-center lg:text-left"
              style={{ color: '#D4AF37' }}
            >
              {t('datesTitle')}
            </p>
            <div className="flex gap-3">
              <DateCard city={t('bafoussam')} date={t('bafoussamDate')} />
              <DateCard city={t('yaounde')} date={t('yaoundeDate')} />
            </div>
          </div>

          {/* Urgency block */}
          <div
            className="rounded-xl p-3.5"
            style={{
              background: 'rgba(212,175,55,0.06)',
              border: '1px solid rgba(212,175,55,0.25)',
            }}
          >
            <p className="text-sm font-bold text-white mb-1">{t('urgencyTitle')}</p>
            <p className="text-xs text-white/65 mb-2">{t('urgencyDesc')}</p>
            <p
              className="text-xs font-bold"
              style={{ color: '#FF6B35' }}
            >
              {t('urgencyHighlight')}
            </p>
          </div>

          {/* Testimonial */}
          <div
            className="rounded-xl p-3.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-xs font-bold mb-2" style={{ color: '#D4AF37' }}>
              ⭐⭐⭐⭐⭐ &nbsp;{t('testimonialLabel')}
            </p>
            <p className="text-xs text-white/70 italic leading-relaxed">
              &ldquo;{t('testimonial')}&rdquo;
            </p>
            <p className="text-xs text-white/50 mt-1.5">
              — {t('testimonialAuthor')}, <span className="opacity-70">{t('testimonialRole')}</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            {/* Primary — gold glow */}
            <Link
              href="/inscription"
              onClick={onClose}
              id="popup-cta-inscription"
              className="flex-1 relative overflow-hidden rounded-xl py-3.5 px-5 text-center text-sm font-black tracking-wider transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E17C 50%, #D4AF37 100%)',
                color: '#081B4B',
                boxShadow: '0 0 20px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              {/* Shimmer */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer-sweep 1.5s ease infinite',
                }}
              />
              <span className="relative z-10">{t('btnPrimary')}</span>
            </Link>

            {/* Secondary — ghost */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="popup-cta-info"
              className="flex-1 rounded-xl py-3.5 px-5 text-center text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white/10"
              style={{
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#D4AF37',
              }}
            >
              {t('btnSecondary')}
            </a>
          </div>

          {/* Contact line */}
          <div className="flex items-center justify-center gap-4 pt-1 border-t border-white/8">
            <span className="text-xs text-white/50">📞 {t('phone')}</span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-xs text-white/50">📍 {t('cameroon')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   EXIT-INTENT POPUP
───────────────────────────────────────────── */
function ExitPopup({ onClose }: { onClose: () => void }) {
  const t = useTranslations('promoPopup')

  return (
    <motion.div
      key="exit-popup"
      initial={{ opacity: 0, scale: 0.88, y: -30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Popup sortie Justine KEM'S"
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #081B4B 0%, #0d2560 100%)',
          border: '1px solid rgba(212,175,55,0.5)',
          boxShadow: '0 0 0 1px rgba(212,175,55,0.12), 0 40px 100px rgba(0,0,0,0.8)',
        }}
      >
        {/* Gold top bar */}
        <div
          className="h-1 w-full"
          style={{ background: 'linear-gradient(90deg, #B8860B, #D4AF37, #F5E17C, #D4AF37, #B8860B)' }}
        />

        {/* Decorative orb */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />

        <CloseButton onClick={onClose} label={t('closeLabel')} />

        <div className="p-7 sm:p-8 text-center flex flex-col items-center gap-4">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
              border: '2px solid rgba(212,175,55,0.4)',
            }}
          >
            🎁
          </div>

          {/* Title */}
          <h3
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}
          >
            {t('exit.title')}
          </h3>

          {/* Subtitle */}
          <p className="text-base font-semibold text-white leading-snug">
            {t('exit.subtitle')}
          </p>

          {/* Divider */}
          <div
            className="w-16 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
          />

          {/* Description */}
          <p className="text-sm text-white/65 leading-relaxed">
            {t('exit.desc')}
          </p>
          <p className="text-sm font-semibold text-white/90">
            {t('exit.action')}
          </p>

          {/* Urgency pill */}
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(255,80,30,0.15)',
              border: '1px solid rgba(255,80,30,0.4)',
              color: '#FF6B35',
            }}
          >
            🔥 Plus de 70% des places sont réservées
          </span>

          {/* CTA */}
          <Link
            href="/inscription"
            onClick={onClose}
            id="exit-popup-cta"
            className="relative overflow-hidden w-full rounded-xl py-4 text-center text-base font-black tracking-wider transition-all duration-300 group mt-1"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E17C 50%, #D4AF37 100%)',
              color: '#081B4B',
              boxShadow: '0 0 24px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
              }}
            />
            <span className="relative z-10">{t('exit.btn')}</span>
          </Link>

          {/* Dismiss */}
          <button
            onClick={onClose}
            className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200 underline underline-offset-2"
          >
            Non merci, je renonce à cette opportunité
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT — Orchestrates both popups
───────────────────────────────────────────── */
export default function PromoPopup() {
  const [showMain, setShowMain] = useState(false)
  const [showExit, setShowExit] = useState(false)
  const [mounted, setMounted] = useState(false)

  /* ── Prevent SSR mismatch ── */
  useEffect(() => {
    setMounted(true)
  }, [])

  /* ── Main popup: appears after 3s (once per session) ── */
  useEffect(() => {
    if (!mounted) return
    const dismissed = sessionStorage.getItem(MAIN_POPUP_DISMISSED_KEY)
    if (dismissed) return

    const timer = setTimeout(() => {
      setShowMain(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [mounted])

  /* ── Exit-intent: mouseleave toward top of page ── */
  useEffect(() => {
    if (!mounted) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if cursor exits near the top of the viewport
      if (e.clientY > 20) return

      const exitDismissed = sessionStorage.getItem(EXIT_POPUP_DISMISSED_KEY)
      if (exitDismissed) return

      // Don't stack on top of main popup
      if (showMain) return

      setShowExit(true)
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [mounted, showMain])

  const handleCloseMain = useCallback(() => {
    setShowMain(false)
    sessionStorage.setItem(MAIN_POPUP_DISMISSED_KEY, '1')
  }, [])

  const handleCloseExit = useCallback(() => {
    setShowExit(false)
    sessionStorage.setItem(EXIT_POPUP_DISMISSED_KEY, '1')
  }, [])

  if (!mounted) return null

  const anyOpen = showMain || showExit

  return (
    <>
      {/* ── Global shimmer keyframe (injected once) ── */}
      <style>{`
        @keyframes shimmer-sweep {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes jk-pulse-gold {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.3); }
          50%       { box-shadow: 0 0 36px rgba(212,175,55,0.6), 0 4px 24px rgba(0,0,0,0.35); }
        }
        #popup-cta-inscription {
          animation: jk-pulse-gold 2.5s ease-in-out infinite;
        }
      `}</style>

      <AnimatePresence>
        {anyOpen && (
          <Backdrop
            key="backdrop"
            onClick={showMain ? handleCloseMain : handleCloseExit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMain && <MainPopup key="main" onClose={handleCloseMain} />}
      </AnimatePresence>

      <AnimatePresence>
        {showExit && !showMain && <ExitPopup key="exit" onClose={handleCloseExit} />}
      </AnimatePresence>
    </>
  )
}
