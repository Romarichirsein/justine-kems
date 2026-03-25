import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { InscriptionClient } from '@/components/InscriptionClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'inscription.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function InscriptionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen py-32">
      <InscriptionClient locale={locale} />
    </div>
  )
}
