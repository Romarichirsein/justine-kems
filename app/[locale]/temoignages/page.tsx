import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { safeFetch, queries, client } from '@/sanity/client'
import { RevealOnScroll } from '@/components/RevealOnScroll'

const localize = (obj: any, locale: string, fallback: string | React.ReactNode) => {
  if (!obj) return fallback
  return obj[locale] || obj['fr'] || fallback
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'temoignages.metadata' })

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  }
}

export const revalidate = 0

export default async function TemoignagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'temoignages' })

  const [testimonials, pageData] = await Promise.all([
    safeFetch(queries.allTestimonials, { locale }, { next: { revalidate: 0 } }).catch(() => []),
    client.fetch(queries.pageTemoignages, { locale }, { next: { revalidate: 0 } }).catch(() => null)
  ])

  // Témoignages statiques de secours si Sanity est vide
  const fallbackKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'] as const
  const fallbackTestimonials = fallbackKeys.map(key => ({
    _id: key,
    name: t(`written.items.${key}.name`),
    city: t(`written.items.${key}.city`),
    rating: 5,
    content: t(`written.items.${key}.content`),
    avatar: null,
  }))

  const allTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials

  return (
    <main className="min-h-screen bg-jk-dark-bg text-jk-cream">

      {/* ── Hero ── */}
      <section className="relative py-32 bg-gradient-to-b from-jk-imperial-green to-jk-dark-bg overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/luxury-pattern.png')] bg-repeat" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-jk-royal-gold/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <RevealOnScroll variant="blur-in">
            <p className="text-jk-royal-gold uppercase text-xs tracking-[4px] font-bold mb-4">
              {localize(pageData?.hero?.tagline, locale, t('hero.tagline'))}
            </p>
            <h1 className="text-5xl md:text-6xl font-script text-jk-cream mb-6">
              {localize(pageData?.hero?.title, locale, t('hero.title'))}
            </h1>
            <div className="w-24 h-0.5 bg-jk-royal-gold mx-auto mb-8" />
            <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
              {localize(pageData?.hero?.desc, locale, t('hero.desc'))}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Témoignages écrits ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-jk-royal-gold/5 rounded-full blur-3xl -ml-32 -mt-32" />
        <div className="container mx-auto px-4 relative z-10">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-3xl font-script text-jk-royal-gold text-center mb-4">
              {localize(pageData?.written?.title, locale, t('written.title'))}
            </h2>
            <div className="w-16 h-0.5 bg-jk-royal-gold mx-auto mb-16" />
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTestimonials.map((testimonial: any, index: number) => (
              <RevealOnScroll
                key={testimonial._id || index}
                delay={index * 0.08}
                variant="fade-up"
              >
                <div className="bg-jk-dark-surface p-8 rounded-2xl border border-jk-royal-gold/10 hover:border-jk-royal-gold/40 transition-all duration-300 group h-full flex flex-col hover:-translate-y-1">
                  {/* Stars */}
                  <div className="flex gap-1 mb-5 text-jk-royal-gold">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < (testimonial.rating || 5) ? 'fill-current' : 'text-gray-600'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="text-jk-royal-gold/30 text-5xl font-serif leading-none mb-2">&ldquo;</div>
                  <p className="text-gray-300 italic leading-relaxed flex-1 mb-6">
                    {testimonial.content}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-jk-royal-gold/10">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-jk-royal-gold/20 flex-shrink-0 relative">
                      {testimonial.avatar ? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-jk-royal-gold font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-jk-royal-gold leading-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                        {testimonial.city || t('written.items.f2.city')}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Captures d'écran ── */}
      <section className="py-24 bg-jk-dark-surface relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-3xl font-script text-jk-royal-gold text-center mb-4">
              {localize(pageData?.screenshots?.title, locale, t('screenshots.title'))}
            </h2>
            <div className="w-16 h-0.5 bg-jk-royal-gold mx-auto mb-6" />
            <p className="text-center text-gray-500 text-sm mb-16 max-w-md mx-auto">
              {localize(pageData?.screenshots?.desc, locale, t('screenshots.desc'))}
            </p>
          </RevealOnScroll>

          {/* Placeholder — les captures seront ajoutées ici */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <RevealOnScroll key={i} delay={i * 0.06} variant="zoom-in">
                <div className="aspect-[3/4] rounded-xl border border-jk-royal-gold/10 bg-jk-dark-bg flex flex-col items-center justify-center text-center p-4 hover:border-jk-royal-gold/30 transition-all">
                  <div className="text-3xl mb-3 opacity-20">📱</div>
                  <p className="text-gray-600 text-xs">
                    {t('screenshots.placeholder')}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll variant="fade-up" delay={0.4}>
            <p className="text-center text-gray-600 text-xs mt-10 max-w-sm mx-auto">
              {t('screenshots.submitMsg')}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-jk-imperial-green text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/luxury-pattern.png')] bg-repeat" />
        <div className="container mx-auto px-4 relative z-10">
          <RevealOnScroll variant="zoom-in">
            <h2 className="text-3xl md:text-4xl font-script text-jk-royal-gold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-jk-cream/70 mb-8 max-w-md mx-auto">
              {t('cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/237677463484"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-jk-royal-gold text-jk-black hover:bg-jk-royal-gold-dark px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105 shadow-xl"
              >
                {t('cta.btnOrder')}
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border border-jk-royal-gold/40 text-jk-cream hover:border-jk-royal-gold px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105"
              >
                {t('cta.btnHome')}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  )
}
