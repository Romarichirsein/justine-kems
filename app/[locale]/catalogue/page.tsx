import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client, queries } from '@/sanity/client'
import { CatalogueClient } from '@/components/CatalogueClient'
import { SanityImage } from '@/components/SanityImage'
import React from 'react'

const localize = (obj: any, locale: string, fallback: string | React.ReactNode) => {
  if (!obj) return fallback
  return obj[locale] || obj['fr'] || fallback
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalogue.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export const revalidate = 0

export default async function CataloguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'catalogue' })
  
  const [products, heroImages, pageData] = await Promise.all([
    client.fetch(queries.allProducts, { locale }, { next: { revalidate: 0 } }).catch(() => []),
    client.fetch(queries.heroImages, { locale }, { next: { revalidate: 0 } }).catch(() => []),
    client.fetch(queries.pageCatalogue, { locale }, { next: { revalidate: 0 } }).catch(() => null)
  ])

  const heroImg = heroImages.find((img: any) => img.title?.toLowerCase().includes('catalogue') || img.title?.toLowerCase().includes('boutique')) || heroImages[0]

  return (
    <div className="min-h-screen bg-jk-cream dark:bg-jk-dark-bg">
      {/* Hero header */}
      <div className="relative bg-jk-imperial-green dark:bg-jk-dark-surface pt-28 pb-16 text-center overflow-hidden min-h-[300px] flex flex-col justify-center">
        {heroImg && heroImg.image && (
          <div className="absolute inset-0 z-0">
             <SanityImage asset={heroImg.image} alt={heroImg.alt || t('hero.title')} fill className="object-cover opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 opacity-10 z-0"
          style={{ backgroundImage: 'url(/textures/batik.png)', backgroundSize: '200px' }}
        />
        <div className="relative z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-script text-jk-royal-gold mb-4">
              {localize(pageData?.hero?.title, locale, t('hero.title'))}
            </h1>
            <p className="text-jk-cream/80 text-lg max-w-2xl mx-auto">
              {localize(pageData?.hero?.subtitle, locale, t('hero.subtitle', { count: products.length })).toString().replace('{count}', products.length.toString())}
            </p>
        </div>
      </div>

      <CatalogueClient products={products} locale={locale} />
    </div>
  )
}
