import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'aboutExt' })

  return {
    title: t('hero.title').replace('\n', ' '),
    description: t('hero.subtitle'),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'aboutExt' })

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen">
      
      {/* Hero À Propos */}
      <section className="relative min-h-[80vh] flex flex-col md:flex-row items-center bg-jk-imperial-green overflow-hidden pt-20">
        {/* Photo Portrait */}
        <div className="w-full md:w-[60%] h-[50vh] md:h-screen relative md:absolute md:left-0 md:top-0">
          <Image
            src="/images/justine-profil.jpg"
            alt="Portrait Justine Kem créatrice de mode à Yaoundé"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-jk-imperial-green/50 to-jk-imperial-green hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-jk-imperial-green md:hidden" />
        </div>

        {/* Text Area */}
        <div className="w-full md:w-1/2 md:ml-auto relative z-10 p-8 md:p-16 flex flex-col justify-center animate-fade-in-right">
          <p className="text-sm uppercase tracking-[0.3em] text-jk-royal-gold mb-4 font-medium">
            {t('hero.tagline')}
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-script text-white mb-6 leading-tight whitespace-pre-line">
            {t('hero.title')}
          </h1>
          <p className="text-xl font-display text-jk-cream/80">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-jk-royal-gold py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: parseInt(t('stats.s1Value')), suffix: t('stats.s1Suffix'), label: t('stats.s1Label') },
              { value: parseInt(t('stats.s2Value')), suffix: t('stats.s2Suffix'), label: t('stats.s2Label') },
              { value: parseInt(t('stats.s3Value')), suffix: t('stats.s3Suffix'), label: t('stats.s3Label') },
              { value: parseInt(t('stats.s4Value')), suffix: t('stats.s4Suffix'), label: t('stats.s4Label') },
            ].map((stat, i) => (
              <RevealOnScroll key={i} delay={i * 0.1} variant="zoom-in">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-jk-black mb-1 leading-none">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-jk-black/70 font-medium">
                    {stat.label}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Biographie — Les débuts */}
      <section className="py-24 container mx-auto px-4 max-w-6xl">
        <RevealOnScroll variant="fade-left">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-jk-royal-gold mb-4">{t('story.ch1Num')}</p>
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-royal-gold mb-6">{t('story.ch1Title')}</h2>
              <p className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed">
                {t('story.ch1Desc')}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] relative group">
              <Image
                src="/modeles/etat-civil/120.000.jpg"
                alt="Atelier Justine Kem's"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jk-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </RevealOnScroll>

        {/* La vision */}
        <RevealOnScroll delay={0.15} variant="fade-right">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-32 md:flex-row-reverse">
            <div className="md:order-2">
              <p className="text-xs uppercase tracking-[0.3em] text-jk-royal-gold mb-4">{t('story.ch2Num')}</p>
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-royal-gold mb-6">{t('story.ch2Title')}</h2>
              <p className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed">
                {t('story.ch2Desc')}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] relative group md:order-1">
              <Image
                src="/modeles/tenue-traditionnels/150.000c.jpg"
                alt="Tissus colorés et matières précieuses"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </RevealOnScroll>

        {/* L'engagement */}
        <RevealOnScroll delay={0.15} variant="fade-left">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-jk-royal-gold mb-4">{t('story.ch3Num')}</p>
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-royal-gold mb-6">{t('story.ch3Title')}</h2>
              <p className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed">
                {t('story.ch3Desc')}
              </p>
              <ul className="mt-6 space-y-3 text-jk-text-muted dark:text-gray-400">
                {[t('story.commit1'), t('story.commit2'), t('story.commit3'), t('story.commit4')].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-5 h-5 flex-shrink-0 rounded-full bg-jk-royal-gold/20 text-jk-royal-gold text-xs flex items-center justify-center">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] relative group">
              <Image
                src="/modeles/robes-soirees/250.000f.jpg"
                alt="Engagement mode éthique Justine Kem's"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Timeline */}
      <section className="bg-jk-dark-bg py-24 text-jk-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-jk-royal-gold/5 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <RevealOnScroll variant="blur-in">
            <h2 className="text-5xl font-script text-jk-royal-gold mb-4">{t('timeline.title')}</h2>
            <div className="w-20 h-0.5 bg-jk-royal-gold mx-auto mb-16" />
          </RevealOnScroll>
          <div className="flex flex-col md:flex-row justify-between items-start relative max-w-5xl mx-auto gap-8 md:gap-0">
            {/* Ligne dorée desktop */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-jk-royal-gold/40 to-transparent -z-10" />
            
            {[
              { year: t('timeline.y1Year'), text: t('timeline.y1Text'), icon: '✂️' },
              { year: t('timeline.y2Year'), text: t('timeline.y2Text'), icon: '👗' },
              { year: t('timeline.y3Year'), text: t('timeline.y3Text'), icon: '📚' },
              { year: t('timeline.y4Year'), text: t('timeline.y4Text'), icon: '🌍' },
              { year: t('timeline.y5Year'), text: t('timeline.y5Text'), icon: '🏆' },
              { year: t('timeline.y6Year'), text: t('timeline.y6Text'), icon: '✨' },
            ].map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.1} variant="fade-up">
                <div className="flex flex-col items-center w-28 relative group">
                  <div className="w-16 h-16 rounded-full bg-jk-royal-gold/10 border border-jk-royal-gold/40 flex items-center justify-center mb-4 group-hover:bg-jk-royal-gold/20 group-hover:border-jk-royal-gold transition-all duration-300 text-2xl">
                    {item.icon}
                  </div>
                  <div className="text-xl font-bold text-jk-royal-gold mb-2">{item.year}</div>
                  <div className="text-xs text-gray-400 leading-snug text-center">{item.text}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 bg-white dark:bg-jk-dark-surface">
        <div className="container mx-auto px-4">
          <RevealOnScroll variant="blur-in">
            <h2 className="text-4xl font-script text-jk-imperial-green dark:text-jk-royal-gold text-center mb-4">
              {t('values.title')}
            </h2>
            <div className="w-20 h-0.5 bg-jk-royal-gold mx-auto mb-16" />
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { label: t('values.v1Label'), desc: t('values.v1Desc'), icon: '💎' },
              { label: t('values.v2Label'), desc: t('values.v2Desc'), icon: '🌺' },
              { label: t('values.v3Label'), desc: t('values.v3Desc'), icon: '🤝' },
            ].map((val, i) => (
              <RevealOnScroll key={i} delay={i * 0.15} variant="fade-up">
                <div className="text-center p-8 rounded-2xl hover:bg-jk-royal-gold/5 transition-colors group">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {val.icon}
                  </div>
                  <h3 className="text-xl font-display text-jk-imperial-green dark:text-jk-cream mb-3">
                    {val.label}
                  </h3>
                  <p className="text-jk-text-muted dark:text-gray-400 leading-relaxed text-sm">
                    {val.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-jk-royal-gold text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <RevealOnScroll variant="zoom-in">
            <h2 className="text-4xl md:text-5xl font-display text-jk-black mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-jk-black/70 text-lg mb-10">
              {t('cta.desc')}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-jk-black text-white hover:bg-jk-imperial-green px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-xl"
            >
              {t('cta.btn')}
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}
