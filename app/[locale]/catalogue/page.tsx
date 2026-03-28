import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { client, queries } from '@/sanity/client'
import { CatalogueClient } from '@/components/CatalogueClient'


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalogue.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function CataloguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalogue' })
  const products = await client.fetch(queries.allProducts).catch(() => [])

  return (
    <div className="min-h-screen bg-jk-cream dark:bg-jk-dark-bg">
      {/* Hero header */}
      <div className="relative bg-jk-imperial-green dark:bg-jk-dark-surface pt-28 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(/textures/batik.png)', backgroundSize: '200px' }}
        />
        <h1 className="relative text-5xl md:text-7xl font-script text-jk-royal-gold mb-4">
          {t('hero.title')}
        </h1>
        <p className="relative text-jk-cream/80 text-lg max-w-2xl mx-auto px-4">
          {t('hero.subtitle', { count: products.length })}
        </p>

        {/* Stats - Optional/Static for now or derived from products */}
      </div>

      <CatalogueClient products={products} locale={locale} />
    </div>
  )
}
