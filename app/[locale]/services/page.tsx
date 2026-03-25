'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { WhatsAppFormHandler } from '@/components/WhatsAppFormHandler'
import { useTranslations, useLocale } from 'next-intl'



// ─── ImageSlider composant interne ─────────────────────────────────────────
function ImageSlider({
  images,
  autoPlayMs = 3500,
  prevAriaLabel,
  nextAriaLabel,
}: {
  images: { src: string; label: string }[]
  autoPlayMs?: number
  prevAriaLabel: string
  nextAriaLabel: string
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, autoPlayMs)
    return () => clearInterval(timer)
  }, [images.length, autoPlayMs])

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
// ... existing code ...
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={images[current].src}
            alt={images[current].label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient label */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-5">
            <p className="text-white text-sm font-medium">{images[current].label}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label={prevAriaLabel}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-jk-royal-gold hover:text-black"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label={nextAriaLabel}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-jk-royal-gold hover:text-black"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-12 inset-x-0 flex justify-center gap-1.5 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-jk-royal-gold w-5' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const t = useTranslations('services')
  const locale = useLocale()

  const prevLabel = t('prev')
  const nextLabel = t('next')

  const [modalOpen, setModalOpen] = useState(false)
  const [formConfig, setFormConfig] = useState<{ type: 'order' | 'rental' | 'training'; title: string }>({
    type: 'order',
    title: '',
  })

  // ─── Slider soirée ─────────────────────────────────────────────────────────
  const soireeImages = [
    { src: '/catalogue/robes-soirees/120.000as.jpg', label: t('soiree.label', { price: '120 000' }) },
    { src: '/catalogue/robes-soirees/150.000.jpeg', label: t('soiree.label', { price: '150 000' }) },
    { src: '/catalogue/robes-soirees/200.000 C.jpg', label: t('soiree.label', { price: '200 000' }) },
    { src: '/catalogue/robes-soirees/250.000yy.jpg', label: t('soiree.label', { price: '250 000' }) },
    { src: '/catalogue/robes-soirees/300.000 a.jpg', label: t('soiree.label', { price: '300 000' }) },
    { src: '/catalogue/robes-soirees/350.000e.jpg', label: t('soiree.label', { price: '350 000' }) },
  ]

  // ─── Slider mariage ─────────────────────────────────────────────────────────
  const mariageImages = [
    { src: '/catalogue/robes-mariage/250.000 C.jpg', label: t('mariage.label', { price: '250 000' }) },
    { src: '/catalogue/robes-mariage/300.000 Q.jpg', label: t('mariage.label', { price: '300 000' }) },
    { src: '/catalogue/robes-mariage/350.000 SA.jpg', label: t('mariage.label', { price: '350 000' }) },
    { src: '/catalogue/robes-mariage/400.000.jpg',   label: t('mariage.label', { price: '400 000' }) },
    { src: '/catalogue/robes-mariage/500.000.jpg',   label: t('mariage.label', { price: '500 000' }) },
  ]

  // ─── Slider tenue de ville ────────────────────────────────────────────────
  const villeImages = [
    { src: '/catalogue/tenue-ville/45.000.jpg',    label: t('others.cityLabel', { price: '45 000' }) },
    { src: '/catalogue/tenue-ville/70.000 F.jpg', label: t('others.cityLabel', { price: '70 000' }) },
    { src: '/catalogue/tenue-ville/80.000D.jpg',   label: t('others.cityLabel', { price: '80 000' }) },
    { src: '/catalogue/tenue-ville/120.000.jpg',   label: t('others.cityLabel', { price: '120 000' }) },
  ]

  // ─── Slider traditionnel ──────────────────────────────────────────────────
  const traditionnelImages = [
    { src: '/catalogue/tenue-traditionnels/150.000 X.jpg', label: t('others.traditionalLabel', { price: '150 000' }) },
    { src: '/catalogue/tenue-traditionnels/200.000A.jpg',   label: t('others.traditionalLabel', { price: '200 000' }) },
    { src: '/catalogue/tenue-traditionnels/250.000c.jpg',   label: t('others.traditionalLabel', { price: '250 000' }) },
    { src: '/catalogue/tenue-traditionnels/350.000c.jpg',   label: t('others.traditionalLabel', { price: '350 000' }) },
  ]

  // ─── Slider couple ────────────────────────────────────────────────────────
  const coupleLabel = locale === 'en' ? 'Couple Outfit' : 'Tenue Couple'
  const coupleImages = [
    { src: '/modeles/Tenu%20de%20couple/h120.000%20;%20f250.000.jpg', label: coupleLabel },
    { src: '/modeles/Tenu%20de%20couple/h130.000%20;%20f150.000.jpg', label: coupleLabel },
    { src: '/modeles/Tenu%20de%20couple/h140.000%20;%20f250.000.jpg', label: coupleLabel },
    { src: '/modeles/Tenu%20de%20couple/h150.000%20;%20f350.000.jpg', label: coupleLabel },
    { src: '/modeles/Tenu%20de%20couple/h160.000%20;%20f%20380.000.jpg', label: coupleLabel },
    { src: '/modeles/Tenu%20de%20couple/h80.000%20;%20f%20200.000.jpg', label: coupleLabel },
  ]

  const openForm = (type: 'order' | 'rental' | 'training', title: string) => {
    setFormConfig({ type, title })
    setModalOpen(true)
  }

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/catalogue/robes-mariage/300.000 Q.jpg"
            alt="Atelier couture Justine Kem's"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-jk-imperial-green/60" />
        </div>
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-script text-jk-royal-gold mb-6 text-shadow-gold">
            {t.rich('heroTitle', { br: () => <br /> })}
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* ── Service 1 — Haute Couture ── */}
      <section id="haute-couture" className="py-24 container mx-auto px-4 max-w-7xl">
        <RevealOnScroll>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Texte */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-display text-jk-imperial-green dark:text-jk-cream mb-6">
                {t('hauteCouture.title')}
              </h2>
              <p className="text-lg text-jk-text-muted dark:text-gray-300 mb-8 leading-relaxed">
                {t('hauteCouture.description')}
              </p>

              <ul className="space-y-6 mb-10">
                {[
                  { title: t('hauteCouture.f1Title'), desc: t('hauteCouture.f1Desc') },
                  { title: t('hauteCouture.f2Title'), desc: t('hauteCouture.f2Desc') },
                  { title: t('hauteCouture.f3Title'), desc: t('hauteCouture.f3Desc') },
                  { title: t('hauteCouture.f4Title'), desc: t('hauteCouture.f4Desc') },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-jk-royal-gold mt-1">✦</span>
                    <div>
                      <h4 className="font-bold text-jk-imperial-green dark:text-jk-cream">{item.title}</h4>
                      <p className="text-jk-text-muted dark:text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="bg-gray-100 dark:bg-jk-dark-surface p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 inline-block">
                <span className="text-gray-500 text-sm uppercase block mb-1">{t('hauteCouture.pricingLabel')}</span>
                <span className="text-2xl font-bold text-jk-royal-gold">{t('hauteCouture.pricingValue')}</span>
              </div>

              <button
                onClick={() => openForm('order', t('hauteCouture.title'))}
                className="btn-primary w-full md:w-auto"
              >
                {t('hauteCouture.cta')}
              </button>
            </div>

            {/* Images Haute Couture — grille 2 colonnes */}
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 h-[600px]">
              {/* Grande image gauche — tenues de ville */}
              <div className="relative rounded-2xl h-full col-span-1 shadow-lg overflow-hidden group">
                <Image
                  src="/catalogue/tenue-ville/80.000D.jpg"
                  alt="Tenue haute couture"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="25vw"
                />
              </div>
              {/* Colonne droite : image + bandeau */}
              <div className="grid grid-rows-2 gap-4 h-full col-span-1">
                <div className="relative rounded-2xl shadow-lg overflow-hidden group">
                  <Image
                    src="/catalogue/tenue-ville/120.000.jpg"
                    alt="Création sur mesure"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="25vw"
                  />
                </div>
                <div className="bg-jk-imperial-green rounded-2xl shadow-lg flex items-center justify-center p-6 text-center">
                  <h3 className="text-2xl font-script text-jk-royal-gold">{t('hauteCouture.artisanat')}</h3>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ── Collection Soirée (slider) ── */}
      <section id="soiree" className="bg-white dark:bg-jk-dark-surface py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <RevealOnScroll>
            <h2 className="text-4xl font-display text-center text-jk-imperial-green dark:text-jk-cream mb-4">
              {t('soiree.title')}
            </h2>
            <p className="text-center text-jk-text-muted dark:text-gray-400 mb-12 max-w-xl mx-auto">
              {t('soiree.description')}
            </p>
          </RevealOnScroll>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Slider principal */}
            <RevealOnScroll>
              <div className="h-[520px]">
                <ImageSlider images={soireeImages} autoPlayMs={3800} prevAriaLabel={t('prev')} nextAriaLabel={t('next')} />
              </div>
            </RevealOnScroll>

            {/* Miniatures fixes */}
            <RevealOnScroll delay={0.15}>
              <div className="grid grid-cols-3 gap-3 h-[520px]">
                {soireeImages.slice(0, 6).map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden shadow-md group">
                    <Image
                      src={img.src}
                      alt={img.label}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="15vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          <div className="text-center mt-10">
            <a
              href={`/${locale}/catalogue?category=robes-soirees`}
              className="inline-block border border-jk-imperial-green dark:border-jk-royal-gold text-jk-imperial-green dark:text-jk-royal-gold px-8 py-3 rounded-full font-semibold hover:bg-jk-imperial-green hover:text-white dark:hover:bg-jk-royal-gold dark:hover:text-black transition-all"
            >
              {t('soiree.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* ── Collection Mariage (slider) ── */}
      <section id="mariage" className="py-24 container mx-auto px-4 max-w-7xl">
        <RevealOnScroll>
          <h2 className="text-4xl font-display text-center text-jk-imperial-green dark:text-jk-cream mb-4">
            {t('mariage.title')}
          </h2>
          <p className="text-center text-jk-text-muted dark:text-gray-400 mb-12 max-w-xl mx-auto">
            {t('mariage.description')}
          </p>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Miniatures */}
          <RevealOnScroll>
            <div className="grid grid-cols-3 gap-3 h-[520px]">
              {mariageImages.slice(0, 6).map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden shadow-md group">
                  <Image
                    src={img.src}
                    alt={img.label}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="15vw"
                  />
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Slider mariage */}
          <RevealOnScroll delay={0.15}>
            <div className="h-[520px]">
              <ImageSlider images={mariageImages} autoPlayMs={4200} prevAriaLabel={t('prev')} nextAriaLabel={t('next')} />
            </div>
          </RevealOnScroll>
        </div>

        <div className="text-center mt-10">
          <a
            href={`/${locale}/catalogue?category=robes-mariage`}
            className="inline-block border border-jk-imperial-green dark:border-jk-royal-gold text-jk-imperial-green dark:text-jk-royal-gold px-8 py-3 rounded-full font-semibold hover:bg-jk-imperial-green hover:text-white dark:hover:bg-jk-royal-gold dark:hover:text-black transition-all"
          >
            {t('mariage.cta')}
          </a>
        </div>
      </section>

      {/* ── Collection Couple (slider) ── */}
      <section id="couple" className="bg-white dark:bg-jk-dark-surface py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <RevealOnScroll>
            <h2 className="text-4xl font-display text-center text-jk-imperial-green dark:text-jk-cream mb-4">
              {t('couple.title')}
            </h2>
            <p className="text-center text-jk-text-muted dark:text-gray-400 mb-12 max-w-xl mx-auto">
              {t('couple.description')}
            </p>
          </RevealOnScroll>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Slider principal */}
            <RevealOnScroll>
              <div className="h-[520px]">
                <ImageSlider images={coupleImages} autoPlayMs={3900} prevAriaLabel={t('prev')} nextAriaLabel={t('next')} />
              </div>
            </RevealOnScroll>

            {/* Miniatures fixes */}
            <RevealOnScroll delay={0.15}>
              <div className="grid grid-cols-3 gap-3 h-[520px]">
                {coupleImages.slice(0, 6).map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden shadow-md group">
                    <Image
                      src={img.src}
                      alt={img.label}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="15vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          <div className="text-center mt-10">
            <a
              href={`/${locale}/catalogue?category=tenues-couple`}
              className="inline-block border border-jk-imperial-green dark:border-jk-royal-gold text-jk-imperial-green dark:text-jk-royal-gold px-8 py-3 rounded-full font-semibold hover:bg-jk-imperial-green hover:text-white dark:hover:bg-jk-royal-gold dark:hover:text-black transition-all"
            >
              {t('couple.cta')}
            </a>
          </div>
        </div>
      </section>


      {/* ── Processus 4 étapes ── */}
      <section className="bg-white dark:bg-jk-dark-surface py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display text-center text-jk-imperial-green dark:text-jk-cream mb-16">
            {t('process.title')}
          </h2>

          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gray-200 dark:bg-gray-700" />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '80%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              viewport={{ once: true }}
              className="hidden md:block absolute top-[28px] left-[10%] h-0.5 bg-jk-royal-gold shadow-neon-gold"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
              {[
                { step: 1, title: t('process.s1.title'), desc: t('process.s1.desc') },
                { step: 2, title: t('process.s2.title'), desc: t('process.s2.desc') },
                { step: 3, title: t('process.s3.title'), desc: t('process.s3.desc') },
                { step: 4, title: t('process.s4.title'), desc: t('process.s4.desc') },
              ].map((item, i) => (
                <RevealOnScroll key={i} delay={i * 0.2}>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-jk-imperial-green text-jk-royal-gold flex items-center justify-center text-xl font-bold mb-6 shadow-xl border-4 border-white dark:border-jk-dark-bg">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-jk-imperial-green dark:text-jk-cream mb-2">{item.title}</h3>
                    <p className="text-sm text-jk-text-muted dark:text-gray-400">{item.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Service — Location de Prestige ── */}
      <section id="location" className="py-24 container mx-auto px-4 max-w-7xl">
        <RevealOnScroll>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Texte */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-display text-jk-imperial-green dark:text-jk-cream mb-6">
                {t('location.title')}
              </h2>
              <p className="text-lg text-jk-text-muted dark:text-gray-300 mb-8 leading-relaxed">
                {t('location.description')}
              </p>

              <div className="bg-jk-cream dark:bg-jk-dark-surface p-8 rounded-2xl border border-jk-royal-gold/20 mb-8">
                <h4 className="font-bold text-jk-text-dark dark:text-jk-cream mb-4 uppercase tracking-wide">
                  {t('location.conditions')}
                </h4>
                <ul className="space-y-3">
                  <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-jk-text-muted dark:text-gray-400">{t('location.duration')}</span>
                    <span className="font-semibold text-jk-imperial-green dark:text-jk-cream">{t('location.durationValue')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-jk-text-muted dark:text-gray-400">{t('location.cleaning')}</span>
                    <span className="font-semibold text-green-600">{t('location.cleaningValue')}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-jk-text-muted dark:text-gray-400">{t('location.alterations')}</span>
                    <span className="font-semibold text-jk-imperial-green dark:text-jk-cream">{t('location.alterationsValue')}</span>
                  </li>
                </ul>
                <div className="mt-6 text-center">
                  <span className="text-jk-royal-gold text-2xl font-bold">{t('location.pricing')}</span>
                </div>
              </div>

              <button
                onClick={() => openForm('rental', t('location.title'))}
                className="bg-black dark:bg-white text-jk-royal-gold dark:text-black font-semibold px-8 py-3 rounded-full hover:shadow-neon-gold transition-all w-full md:w-auto"
              >
                {t('location.cta')}
              </button>
            </div>

            {/* Slider Collection Soirée — location */}
            <div className="order-1 lg:order-2 h-[600px]">
              <ImageSlider images={soireeImages} autoPlayMs={3200} prevAriaLabel={prevLabel} nextAriaLabel={nextLabel} />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ── Tenues Traditionnelles & Couple (side by side sliders) ── */}
      <section className="bg-white dark:bg-jk-dark-surface py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <RevealOnScroll>
            <h2 className="text-4xl font-display text-center text-jk-imperial-green dark:text-jk-cream mb-12">
              {t('others.title')}
            </h2>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Tenues Traditionnelles */}
            <RevealOnScroll>
              <div>
                <h3 className="text-2xl font-display text-jk-imperial-green dark:text-jk-cream mb-4 text-center">
                  {t('others.traditional')}
                </h3>
                <div className="h-[400px]">
                  <ImageSlider images={traditionnelImages} autoPlayMs={4000} prevAriaLabel={prevLabel} nextAriaLabel={nextLabel} />
                </div>
                <div className="text-center mt-5">
                  <a
                    href={`/${locale}/catalogue?category=tenue-traditionnels`}
                    className="text-jk-imperial-green dark:text-jk-royal-gold text-sm font-medium hover:underline"
                  >
                    {t('others.cta')}
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            {/* Tenues de Ville */}
            <RevealOnScroll delay={0.15}>
              <div>
                <h3 className="text-2xl font-display text-jk-imperial-green dark:text-jk-cream mb-4 text-center">
                  {t('others.city')}
                </h3>
                <div className="h-[400px]">
                  <ImageSlider images={villeImages} autoPlayMs={3600} prevAriaLabel={prevLabel} nextAriaLabel={nextLabel} />
                </div>
                <div className="text-center mt-5">
                  <a
                    href={`/${locale}/catalogue?category=tenue-ville`}
                    className="text-jk-imperial-green dark:text-jk-royal-gold text-sm font-medium hover:underline"
                  >
                    {t('others.cta')}
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── CTA Final WhatsApp ── */}
      <section className="bg-jk-imperial-green py-24 text-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-script text-jk-royal-gold mb-8 text-shadow-gold">
            {t('ctaFinal.title')}
          </h2>
          <a
            href={`https://wa.me/237677463484?text=${encodeURIComponent(t('ctaFinal.title'))}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-10 py-5 rounded-full font-bold text-xl shadow-lg hover:shadow-neon-green transition-all hover:scale-105"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          {t('ctaFinal.whatsapp')}
          </a>
        </div>
      </section>

      {/* ── Modal WhatsApp ── */}
      <WhatsAppFormHandler
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType={formConfig.type}
        productName={formConfig.title}
        submitButtonText={t('hauteCouture.cta')}
      />
    </div>
  )
}
