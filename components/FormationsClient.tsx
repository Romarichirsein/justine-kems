'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { WhatsAppFormHandler } from '@/components/WhatsAppFormHandler'

/* ─────────────── COMPOSANTS INTERNES ─────────────────── */

function FaqItem({ item, index }: { item: { q: string, a: string }; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <RevealOnScroll delay={index * 0.05}>
      <div
        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
          open
            ? 'border-jk-royal-gold/50 shadow-neon-gold bg-jk-royal-gold/5'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-jk-dark-surface'
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-4 p-6 text-left group"
        >
          <span className={`font-display font-semibold text-lg transition-colors ${open ? 'text-jk-royal-gold' : 'text-jk-text-dark dark:text-jk-cream'}`}>
            {item.q}
          </span>
          <span
            className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              open ? 'border-jk-royal-gold bg-jk-royal-gold text-black rotate-45' : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-6 pb-6 text-jk-text-muted dark:text-gray-300 leading-relaxed">
                {item.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RevealOnScroll>
  )
}

function TestimonialCard({ t, index }: { t: { name: string, role: string, text: string, stars: number }; index: number }) {
  return (
    <RevealOnScroll delay={index * 0.12}>
      <div className="bg-white dark:bg-jk-dark-surface rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col h-full relative overflow-hidden group hover:-translate-y-1 hover:shadow-neon-gold transition-all duration-300">
        <div className="absolute top-4 right-6 text-jk-royal-gold/20 text-7xl font-serif leading-none select-none">"</div>
        <div className="flex gap-1 mb-4">
          {Array.from({ length: t.stars }).map((_, i) => (
            <span key={i} className="text-jk-royal-gold text-lg">★</span>
          ))}
        </div>
        <p className="text-jk-text-muted dark:text-gray-300 leading-relaxed italic flex-1 mb-6 relative z-10">
          "{t.text}"
        </p>
        <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-5">
          <div className="w-12 h-12 rounded-full bg-jk-royal-gold/20 border-2 border-jk-royal-gold/40 flex items-center justify-center text-jk-royal-gold font-bold text-lg shrink-0 overflow-hidden">
            {t.name[0]}
          </div>
          <div>
            <p className="font-semibold text-jk-text-dark dark:text-jk-cream">{t.name}</p>
            <p className="text-xs text-jk-text-muted dark:text-gray-400">{t.role}</p>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  )
}

/* ─────────────────────── CLIENT MAIN ──────────────────── */

export function FormationsClient({ heroOnly = false, locale = 'fr' }: { heroOnly?: boolean, locale?: string }) {
  const t = useTranslations('formations')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState('')

  function openForm(title: string) {
    setSelectedFormation(title)
    setModalOpen(true)
  }

  if (heroOnly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
      >
        <button onClick={() => openForm('Information Formation')} className="btn-primary px-10 py-4 text-lg">
          {t('hero.btnPrograms')}
        </button>
        <a
          href={`https://wa.me/237677463484?text=${encodeURIComponent(t('hero.btnWhatsapp'))}`}
          target="_blank" rel="noreferrer"
          className="px-10 py-4 rounded-full border-2 border-jk-royal-gold/50 text-jk-cream font-semibold hover:border-jk-royal-gold hover:bg-jk-royal-gold/10 transition-all text-lg"
        >
          {t('hero.btnWhatsapp')}
        </a>
        <WhatsAppFormHandler
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          formType="training"
          formationTitle={selectedFormation}
          submitButtonText={t('ctaFinal.enrollViaWhatsapp')}
        />
      </motion.div>
    )
  }

  // Data helpers
  const programKeys = ['f1', 'f2', 'f3'] as const;
  const processKeys = ['s1', 's2', 's3', 's4'] as const;
  const testimonialKeys = ['t1', 't2', 't3'] as const;
  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

  const programs = programKeys.map((key, i) => ({
    level: t(`programmes.items.${key}.level`),
    badge: i === 0 ? '🌱' : i === 1 ? '⭐' : '👑',
    title: t(`programmes.items.${key}.title`),
    desc: t(`programmes.items.${key}.desc`),
    duration: t(`programmes.items.${key}.duration`),
    price: t(`programmes.items.${key}.price`),
    color: i === 0 ? 'from-green-400/20 to-emerald-600/10' : i === 1 ? 'from-jk-royal-gold/20 to-amber-600/10' : 'from-purple-500/20 to-indigo-600/10',
    borderColor: i === 0 ? 'border-green-400/30' : i === 1 ? 'border-jk-royal-gold/40' : 'border-purple-400/30',
    isBest: i === 1,
    modules: [0, 1, 2, 3].map(m => t(`programmes.items.${key}.modules.${m}`))
  }));

  const steps = processKeys.map((key, i) => ({
    num: `0${i + 1}`,
    title: t(`process.steps.${key}.title`),
    desc: t(`process.steps.${key}.desc`)
  }));

  const testimonials = testimonialKeys.map(key => ({
    name: t(`testimonials.items.${key}.name`),
    role: t(`testimonials.items.${key}.role`),
    text: t(`testimonials.items.${key}.text`),
    stars: 5
  }));

  const faqs = faqKeys.map(key => ({
    q: t(`faq.items.${key}.q`),
    a: t(`faq.items.${key}.a`)
  }));

  return (
    <>
      {/* ── PROGRAMMES ── */}
      <section className="py-24 bg-white dark:bg-jk-dark-bg border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-3">{t('programmes.tagline')}</p>
              <h2 className="text-5xl font-script text-jk-imperial-green dark:text-jk-royal-gold">{t('programmes.title')}</h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((form, i) => (
              <RevealOnScroll key={i} delay={i * 0.12}>
                <div className={`relative rounded-2xl border-2 ${form.borderColor} bg-gradient-to-br ${form.color} dark:bg-jk-dark-surface shadow-xl hover:shadow-neon-gold hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden group`}>
                  {form.isBest && (
                    <div className="absolute -top-0 -right-0 bg-jk-royal-gold text-black text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider">
                      {t('programmes.mostPopular')}
                    </div>
                  )}
                  <div className="h-1.5 w-full bg-gradient-gold" />
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-4xl mb-4">{form.badge}</div>
                    <span className="inline-block px-3 py-1 bg-white/60 dark:bg-gray-800 text-xs font-bold rounded-full w-max mb-4 uppercase tracking-wider text-jk-imperial-green dark:text-jk-royal-gold">
                      {form.level}
                    </span>
                    <h3 className="text-2xl font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-3">{form.title}</h3>
                    <p className="text-jk-text-muted dark:text-gray-400 mb-6 flex-1 leading-relaxed text-sm">{form.desc}</p>

                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-2">
                      {form.modules.map(mod => (
                        <div key={mod} className="flex gap-2 items-start text-sm text-jk-text-dark dark:text-gray-300">
                          <span className="text-jk-royal-gold mt-0.5 shrink-0">✓</span>
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700 mt-auto">
                      <p className="text-xs text-jk-text-muted dark:text-gray-400 uppercase tracking-widest font-semibold mb-1">{form.duration}</p>
                      <p className="text-3xl font-bold text-jk-royal-gold mb-5">{form.price}</p>
                      <button
                        onClick={() => openForm(form.title)}
                        className="w-full btn-primary py-4 group-hover:bg-jk-imperial-green group-hover:text-jk-cream transition-colors"
                      >
                        {t('programmes.ctaRegister')}
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESUS INSCRIPTION ── */}
      <section className="py-24 container mx-auto px-4 max-w-5xl">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-3">{t('process.tagline')}</p>
            <h2 className="text-4xl font-script text-jk-imperial-green dark:text-jk-cream">{t('process.title')}</h2>
          </div>
        </RevealOnScroll>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+3rem)] right-[-50%] h-px bg-gradient-to-r from-jk-royal-gold/40 to-transparent" />
                )}
                <div className="w-24 h-24 mx-auto rounded-full bg-jk-royal-gold/10 border-2 border-jk-royal-gold/30 flex items-center justify-center mb-5 group-hover:border-jk-royal-gold group-hover:bg-jk-royal-gold/20 transition-all duration-300">
                  <span className="text-2xl font-bold text-jk-royal-gold font-script">{step.num}</span>
                </div>
                <h3 className="font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-2">{step.title}</h3>
                <p className="text-sm text-jk-text-muted dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-24 bg-jk-imperial-green/5 dark:bg-jk-dark-surface/50 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-3">{t('testimonials.tagline')}</p>
              <h2 className="text-4xl font-script text-jk-imperial-green dark:text-jk-cream">{t('testimonials.title')}</h2>
            </div>
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testi, i) => <TestimonialCard key={i} t={testi} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="py-24 container mx-auto px-4 max-w-3xl">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-3">{t('faq.tagline')}</p>
            <h2 className="text-4xl font-script text-jk-imperial-green dark:text-jk-cream">{t('faq.title')}</h2>
          </div>
        </RevealOnScroll>
        <div className="space-y-4">
          {faqs.map((item, i) => <FaqItem key={i} item={item} index={i} />)}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-jk-imperial-green py-24 text-center text-jk-cream">
        <RevealOnScroll>
          <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-4">{t('ctaFinal.nextSession', { year: 2025 })}</p>
          <h2 className="text-4xl md:text-5xl font-script text-jk-royal-gold mb-6 text-shadow-gold whitespace-pre-line">
            {t('ctaFinal.title')}
          </h2>
          <p className="text-gray-200 mb-10 max-w-xl mx-auto text-lg">
            {t('ctaFinal.desc', { count: 8 })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openForm(t('ctaFinal.nextSession', { year: 2025 }))}
              className="bg-jk-royal-gold text-black font-bold text-lg px-10 py-4 rounded-full hover:bg-amber-400 transition-all hover:scale-105 shadow-neon-gold"
            >
              {t('ctaFinal.btnReserve')}
            </button>
            <button
              onClick={() => openForm('Question Générale Formation')}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-lg px-10 py-4 rounded-full shadow-neon-green transition-transform hover:scale-105 inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              {t('ctaFinal.btnWhatsapp')}
            </button>
          </div>
        </RevealOnScroll>
        <WhatsAppFormHandler
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          formType="training"
          formationTitle={selectedFormation}
          submitButtonText={t('ctaFinal.enrollViaWhatsapp')}
        />
      </section>
    </>
  )
}
