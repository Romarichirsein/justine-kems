import { Metadata } from 'next'
import { locales } from '@/i18n/request'
import { Providers } from '../providers'
import { getMessages, setRequestLocale } from 'next-intl/server'
import '../globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppFloating from '@/components/WhatsAppFloating'
import { OrganizationSchema } from '@/components/StructuredData'

type Props = {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  const titles = {
    fr: 'Justine Kem\'s - Haute Couture sur Mesure à Yaoundé',
    en: 'Justine Kem\'s - Bespoke Haute Couture in Yaoundé'
  }

  const descriptions = {
    fr: 'Maison de haute couture à Yaoundé, Cameroun. Créations sur mesure, location de tenues de prestige et formations professionnelles en couture.',
    en: 'Haute couture house in Yaoundé, Cameroon. Bespoke creations, luxury garment rentals and professional sewing training.'
  }

  return {
    title: {
      default: titles[locale as keyof typeof titles],
      template: `%s | Justine Kem's`
    },
    description: descriptions[locale as keyof typeof descriptions],
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
    metadataBase: new URL('https://justinekems.com'),
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
      url: 'https://justinekems.com',
      siteName: 'Justine Kem\'s',
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
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
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      images: ['/og-image.jpg'],
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <OrganizationSchema />
      </head>
      <body className="font-sans antialiased text-jk-text-dark bg-jk-cream dark:bg-jk-dark-bg dark:text-jk-dark-text min-h-screen flex flex-col">
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
