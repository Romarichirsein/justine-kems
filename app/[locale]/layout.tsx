import { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { locales } from '@/i18n/request'
import { Providers } from '../providers'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import '../globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppFloating from '@/components/WhatsAppFloating'
import { OrganizationSchema, WebSiteSchema } from '@/components/StructuredData'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

type Props = {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const baseUrl = 'https://justinekems.com'

  return {
    title: {
      default: t('title'),
      template: `%s | Justine Kem's`
    },
    description: t('description'),
    keywords: [
      'haute couture Yaoundé',
      'couture sur mesure Cameroun',
      'styliste Yaoundé',
      'création mode africaine',
      'formation couture Cameroun',
      'location robe soirée Yaoundé',
      'tailoring Cameroon',
      'fashion designer Yaounde',
      'African luxury fashion'
    ],
    authors: [{ name: 'Justine Kem\'s' }],
    creator: 'Justine Kem\'s',
    publisher: 'Justine Kem\'s',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
      languages: {
        'fr': '/fr',
        'en': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CM' : 'en_US',
      url: baseUrl,
      siteName: 'Justine Kem\'s',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Justine Kem\'s - Haute Couture',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.jpg'],
      creator: '@justinekems',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'votre-code-verification-google',
      yandex: 'votre-code-yandex',
    },
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} className={montserrat.variable}>
      <body className="font-sans antialiased text-jk-text-dark bg-jk-cream dark:bg-jk-dark-bg dark:text-jk-dark-text min-h-screen flex flex-col">
        <WebSiteSchema />
        <OrganizationSchema />
        <Providers locale={locale} messages={messages}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <WhatsAppFloating />
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
