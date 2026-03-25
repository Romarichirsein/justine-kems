import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ContactForm } from '@/components/ContactForm'
import { Toaster } from 'react-hot-toast'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen pb-24">
      {/* Hero */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center bg-jk-imperial-green overflow-hidden pt-32 pb-24 md:pb-32">
        <div className="absolute inset-0 bg-[url('/images/atelier-bg.jpg')] bg-cover bg-center opacity-20 dark:opacity-10 mix-blend-luminosity" />
        <h1 className="relative z-10 text-4xl sm:text-5xl md:text-8xl font-script text-jk-royal-gold text-shadow-gold text-center px-4">
          {t('heroTitle')}
        </h1>
      </section>

      <div className="container mx-auto px-4 -mt-12 md:-mt-24 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Infos de Contact (Col Gauche) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-jk-dark-surface p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
              
              {/* Phone */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-jk-royal-gold/10 flex items-center justify-center text-jk-royal-gold shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-jk-cream">{t('info.phone')}</h3>
                    <p className="text-sm text-jk-text-muted dark:text-gray-400">{t('info.phoneDesc')}</p>
                  </div>
                </div>
                <div className="flex gap-4 ml-16">
                  <a href="tel:+237677463484" className="text-jk-imperial-green dark:text-jk-royal-gold font-medium hover:underline text-sm">{t('info.call')} →</a>
                  <a href="https://wa.me/237677463484" target="_blank" rel="noreferrer" className="text-[#25D366] font-medium hover:underline text-sm">WhatsApp →</a>
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-jk-royal-gold/10 flex items-center justify-center text-jk-royal-gold shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                     <h3 className="font-bold text-lg dark:text-jk-cream">{t('info.locationTitle')}</h3>
                  </div>
                </div>
                <div className="ml-16 border-l-2 border-jk-royal-gold pl-3 space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-jk-text-dark dark:text-jk-cream">{t('info.yaounde')}</p>
                    <p className="text-xs text-jk-text-muted">{t('info.country')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-jk-text-dark dark:text-jk-cream">{t('info.bafoussam')}</p>
                    <p className="text-xs text-jk-text-muted">{t('info.country')}</p>
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div className="bg-gray-50 dark:bg-jk-dark-bg p-4 rounded-xl">
                 <h4 className="font-bold text-jk-imperial-green dark:text-jk-royal-gold mb-3 text-sm uppercase">{t('info.hoursTitle')}</h4>
                 <table className="w-full text-sm text-jk-text-muted dark:text-gray-300">
                   <tbody>
                     <tr><td className="py-1">{t('info.weekdays')}</td><td className="text-right font-medium">{t('info.weekdaysValue')}</td></tr>
                     <tr><td className="py-1">{t('info.saturday')}</td><td className="text-right font-medium">{t('info.saturdayValue')}</td></tr>
                     <tr><td className="py-1 text-red-500">{t('info.sunday')}</td><td className="text-right font-medium text-red-500">{t('info.sundayValue')}</td></tr>
                   </tbody>
                 </table>
              </div>

            </div>
          </div>

          {/* Formulaire Contact (Col Droite) */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </div>
      {/* Carte Google Maps */}
      <section className="container mx-auto px-4 mt-16">
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="bg-white dark:bg-jk-dark-surface px-8 py-5 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
            <svg className="w-5 h-5 text-jk-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="font-bold text-jk-imperial-green dark:text-jk-cream text-lg">{t('map.title')}</h3>
            <a
              href="https://maps.google.com/?q=Marché+Essos+Yaoundé+Cameroun"
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-sm text-jk-royal-gold hover:underline"
            >
              {t('map.openMaps')} →
            </a>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.6918936764!2d11.5357!3d3.8548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309ba093%3A0x6e1cfc0f38f14ad2!2sMarch%C3%A9%20Essos%2C%20Yaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2scm!4v1700000000000!5m2!1sfr!2scm"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('map.iframeTitle')}
          />
        </div>
      </section>

      <Toaster position="bottom-center" />
    </div>
  )
}
