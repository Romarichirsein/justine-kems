import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { WhatsAppFormHandler } from '@/components/WhatsAppFormHandler'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { FormationsClient } from '@/components/FormationsClient'
import { queries, safeFetch } from '@/sanity/client'
import { SanityImage } from '@/components/SanityImage'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'formations.metadata' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: {
        'fr': '/fr/formations',
        'en': '/en/formations',
      },
    },
  }
}

import { SanityImageInfo } from '@/types/sanity'

export const revalidate = 0

export default async function FormationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'formations' })
  
  const heroImages = await safeFetch<SanityImageInfo[]>(queries.heroImages) ?? []
  console.log('Hero Images for Formations fetched:', heroImages.length)
  const profilImage = heroImages.find(img => img.title?.toLowerCase().includes('formation') || img.title?.toLowerCase().includes('atelier')) || heroImages[2] || heroImages[0]

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen">
      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-b from-jk-imperial-green via-[#0d2420] to-[#0A1A18] py-32">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-jk-royal-gold/10 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-jk-royal-gold/15" />
        </div>
        <div className="absolute inset-0 opacity-5 bg-[url('/pattern-baroque.svg')] bg-repeat bg-[length:200px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <p className="text-jk-royal-gold uppercase tracking-[0.4em] text-sm font-semibold mb-8">
            {t('hero.tagline')}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-script text-jk-royal-gold mb-6 text-shadow-gold leading-tight whitespace-pre-line">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl font-display mb-10 text-gray-200 max-w-2xl mx-auto">
            {t('hero.subtitle', { exp: 10 })}
          </p>

          <FormationsClient heroOnly={true} />

          {/* Stats bar */}
          <div className="flex flex-col md:flex-row gap-6 justify-center text-jk-royal-gold font-bold uppercase tracking-wider text-sm border-t border-b border-jk-royal-gold/30 py-6 max-w-2xl mx-auto">
            <span className="flex-1 border-b md:border-b-0 md:border-r border-jk-royal-gold/20 pb-4 md:pb-0">{t('hero.stats.students')}</span>
            <span className="flex-1 border-b md:border-b-0 md:border-r border-jk-royal-gold/20 pb-4 md:pb-0">{t('hero.stats.satisfaction')}</span>
            <span className="flex-1">{t('hero.stats.cert')}</span>
          </div>
        </div>
      </section>

      {/* ── PROFIL FORMATRICE ── */}
      <section className="py-24 container mx-auto px-4">
        <RevealOnScroll>
          <div className="bg-white dark:bg-jk-dark-surface rounded-3xl p-8 md:p-16 shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 relative overflow-hidden border border-jk-royal-gold/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-jk-royal-gold/5 rounded-full blur-3xl -z-[1]" />

            <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-4 border-jk-royal-gold shadow-neon-gold">
              <SanityImage
                asset={profilImage?.image}
                alt={t('profil.name')}
                fill
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-jk-imperial-green/40" />
            </div>

            <div className="text-center md:text-left">
              <p className="text-jk-royal-gold font-bold uppercase tracking-widest text-sm mb-2">{t('profil.tagline')}</p>
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-cream mb-4">{t('profil.name')}</h2>
              <blockquote className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed mb-6 italic border-l-4 border-jk-royal-gold/40 pl-4">
                {t('profil.quote')}
              </blockquote>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-jk-cream dark:bg-gray-800 rounded-full text-sm font-medium text-jk-imperial-green dark:text-jk-royal-gold border border-jk-royal-gold/20">{t('profil.labels.exp')}</span>
                <span className="px-4 py-2 bg-jk-cream dark:bg-gray-800 rounded-full text-sm font-medium text-jk-imperial-green dark:text-jk-royal-gold border border-jk-royal-gold/20">{t('profil.labels.senior')}</span>
                <span className="px-4 py-2 bg-jk-cream dark:bg-gray-800 rounded-full text-sm font-medium text-jk-imperial-green dark:text-jk-royal-gold border border-jk-royal-gold/20">{t('profil.labels.mentor')}</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ── PROGRAMMES, TESTIMONIALS, FAQ, CTA ── */}
      <FormationsClient locale={locale} />
    </div>
  )
}
