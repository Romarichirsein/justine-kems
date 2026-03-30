import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client, queries } from '@/sanity/client'
import { CatalogClient } from '@/components/CatalogClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'modeles.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ModelesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'modeles' })
  const products = await client.fetch(queries.allProducts).catch(() => [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero ── */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#0a0a0a] border-b border-[#c9a96e]/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase mb-3">{t('hero.tagline')}</p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">{t('hero.title')}</h1>
          <p className="text-white/50 max-w-lg mx-auto">{t('hero.desc')}</p>
        </div>
      </section>

      {/* ── Logic & Filtered Content (Client Side) ── */}
      <CatalogClient initialModels={products} locale={locale} />
    </main>
  )
}
