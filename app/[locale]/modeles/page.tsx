import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client, queries } from '@/sanity/client'
import { CatalogClient } from '@/components/CatalogClient'
import { SanityImage } from '@/components/SanityImage'

const localize = (obj: any, locale: string, fallback: string | React.ReactNode) => {
  if (!obj) return fallback
  return obj[locale] || obj['fr'] || fallback
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'modeles.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export const revalidate = 0

export default async function ModelesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'modeles' })
  
  const [models, heroImages, pageData] = await Promise.all([
    client.fetch(queries.allModeles, { locale }, { next: { revalidate: 0 } }).catch(() => []),
    client.fetch(queries.heroImages, { locale }, { next: { revalidate: 0 } }).catch(() => []),
    client.fetch(queries.pageModeles, { locale }, { next: { revalidate: 0 } }).catch(() => null)
  ])

  const heroImg = heroImages.find((img: any) => img.title?.toLowerCase().includes('modeles') || img.title?.toLowerCase().includes('création')) || heroImages[0]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero ── */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#0a0a0a] border-b border-[#c9a96e]/20 min-h-[300px] flex flex-col justify-center overflow-hidden">
        {heroImg && heroImg.image && (
          <div className="absolute inset-0 z-0">
             <SanityImage asset={heroImg.image} alt={heroImg.alt || t('hero.title')} fill className="object-cover opacity-40" />
          </div>
        )}
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase mb-3">
            {localize(pageData?.hero?.tagline, locale, t('hero.tagline'))}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">
            {localize(pageData?.hero?.title, locale, t('hero.title'))}
          </h1>
          <p className="text-white/50 max-w-lg mx-auto">
            {localize(pageData?.hero?.desc, locale, t('hero.desc'))}
          </p>
        </div>
      </section>

      {/* ── Logic & Filtered Content (Client Side) ── */}
      <CatalogClient initialModels={models} locale={locale} />
    </main>
  )
}
