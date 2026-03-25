import ScrollSequence from '@/components/ScrollSequence'
import { safeFetch, queries } from '@/sanity/client'
import { OrganizationSchema } from '@/components/StructuredData'
import { CustomCursor } from '@/components/CustomCursor'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { AnimatedCounter } from '@/components/AnimatedCounter'

import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  
  const featuredProducts = await safeFetch(queries.featuredProducts) ?? []
  const testimonials = await safeFetch(queries.testimonials) ?? []
  
  const t = await getTranslations('trustBar')

  return (
    <>
      <OrganizationSchema />
      <CustomCursor />
      
      {/* Hero Experience Scrollytelling 3D */}
      <ScrollSequence frameCount={16} baseUrl="/motion/ezgif-frame-" />

      {/* Trust Bar */}
      <section className="bg-jk-imperial-green text-jk-cream py-4 relative z-20 shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/luxury-pattern.png')] bg-repeat" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-around items-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <span className="text-jk-royal-gold">✦</span>
              <span>{t('custom')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-jk-royal-gold">✦</span>
              <span>{t('shipping')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-jk-royal-gold">✦</span>
              <span>{t('guarantee')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Counter Section ── */}
      <section className="py-20 bg-white dark:bg-jk-dark-surface relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/luxury-pattern.png')] bg-repeat pointer-events-none" />
        <div className="container mx-auto px-4">
          <RevealOnScroll variant="blur-in">
            <p className="text-center text-sm uppercase tracking-[0.3em] text-jk-royal-gold mb-12 font-medium">
              Nos chiffres parlent d'eux-mêmes
            </p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 max-w-2xl mx-auto">
            {[
              { value: 500, suffix: '+', label: 'Créations livrées', icon: '✂️' },
              { value: 13, suffix: ' ans', label: "D'expérience", icon: '⭐' },
              { value: 100, suffix: '+ pays', label: 'Livraison mondiale', icon: '🌍' },
            ].map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={i * 0.12} variant="zoom-in">
                <div className="text-center group">
                  <div className="text-2xl mb-3">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-display font-bold text-jk-imperial-green dark:text-jk-royal-gold mb-2 leading-none">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-jk-text-muted dark:text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Section Savoir-faire avec animation */}
      <section className="py-24 bg-jk-cream dark:bg-jk-dark-bg relative z-20">
        <div className="container mx-auto px-4">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-5xl font-script text-jk-imperial-green dark:text-jk-royal-gold text-center mb-4">
              Notre savoir-faire
            </h2>
            <div className="w-20 h-0.5 bg-jk-royal-gold mx-auto mb-16" />
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Haute Couture */}
            <RevealOnScroll delay={0.1} variant="fade-left">
              <div className="group bg-white dark:bg-jk-dark-surface p-8 rounded-2xl shadow-lg hover:shadow-neon-gold transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-jk-royal-gold/20 h-full flex flex-col">
                <div className="w-16 h-16 mx-auto mb-6 text-jk-royal-gold bg-jk-imperial-green/5 dark:bg-jk-royal-gold/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-display text-jk-imperial-green dark:text-jk-cream mb-4 text-center">
                  Haute Couture
                </h3>
                <p className="text-jk-text-muted dark:text-gray-400 text-center mb-6 flex-1">
                  Créations uniques pensées pour sublimer votre silhouette
                </p>
                <Link
                  href="/fr/services#haute-couture"
                  className="block text-center text-jk-royal-gold hover:text-jk-royal-gold-dark font-medium transition-colors"
                >
                  En savoir plus →
                </Link>
              </div>
            </RevealOnScroll>

            {/* Location */}
            <RevealOnScroll delay={0.2} variant="fade-up">
              <div className="group bg-white dark:bg-jk-dark-surface p-8 rounded-2xl shadow-lg hover:shadow-neon-gold transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-jk-royal-gold/20 h-full flex flex-col">
                <div className="w-16 h-16 mx-auto mb-6 text-jk-royal-gold bg-jk-imperial-green/5 dark:bg-jk-royal-gold/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 21.6V22h-2v-2h-3v2H5v-2H3v-2h1V8H3V6h1V4.4L12 2l8 2.4V6h1v2h-1v10h1v2h-2v2h-2v-2h-3v2h-2v-.4zm-4-11.6v2h2v-2h-2z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-display text-jk-imperial-green dark:text-jk-cream mb-4 text-center">
                  Location de Prestige
                </h3>
                <p className="text-jk-text-muted dark:text-gray-400 text-center mb-6 flex-1">
                  Des tenues d'exception disponibles pour vos événements
                </p>
                <Link
                  href="/fr/services#location"
                  className="block text-center text-jk-royal-gold hover:text-jk-royal-gold-dark font-medium transition-colors"
                >
                  En savoir plus →
                </Link>
              </div>
            </RevealOnScroll>

            {/* Formation */}
            <RevealOnScroll delay={0.3} variant="fade-right">
              <div className="group bg-white dark:bg-jk-dark-surface p-8 rounded-2xl shadow-lg hover:shadow-neon-gold transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-jk-royal-gold/20 h-full flex flex-col">
                <div className="w-16 h-16 mx-auto mb-6 text-jk-royal-gold bg-jk-imperial-green/5 dark:bg-jk-royal-gold/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2.12-1.15V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-display text-jk-imperial-green dark:text-jk-cream mb-4 text-center">
                  Formations
                </h3>
                <p className="text-jk-text-muted dark:text-gray-400 text-center mb-6 flex-1">
                  Transmettre notre passion à la nouvelle génération
                </p>
                <Link
                  href="/fr/formations"
                  className="block text-center text-jk-royal-gold hover:text-jk-royal-gold-dark font-medium transition-colors"
                >
                  En savoir plus →
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── Process / Comment ça marche ── */}
      <section className="py-24 bg-jk-imperial-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/luxury-pattern.png')] bg-repeat" />
        <div className="container mx-auto px-4">
          <RevealOnScroll variant="blur-in">
            <h2 className="text-4xl md:text-5xl font-script text-jk-royal-gold text-center mb-4">
              Comment ça marche ?
            </h2>
            <div className="w-20 h-0.5 bg-jk-royal-gold mx-auto mb-16" />
          </RevealOnScroll>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-jk-royal-gold/40 to-transparent" />
            {[
              { step: '01', title: 'Contact', desc: 'Décrivez votre projet via WhatsApp ou notre formulaire.' },
              { step: '02', title: 'Consultation', desc: 'Prise de mesures et choix des tissus ensemble.' },
              { step: '03', title: 'Création', desc: 'Notre atelier réalise votre pièce avec soin, sur mesure, en qualité supérieure.' },
              { step: '04', title: 'Livraison', desc: 'Réception impeccable, partout dans le monde.' },
            ].map((item, i) => (
              <RevealOnScroll key={item.step} delay={i * 0.15} variant="fade-up">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-jk-royal-gold flex items-center justify-center mx-auto mb-6 relative bg-jk-imperial-green">
                    <span className="text-2xl font-bold text-jk-royal-gold">{item.step}</span>
                    <div className="absolute inset-0 rounded-full bg-jk-royal-gold/10 animate-pulse-soft" />
                  </div>
                  <h3 className="text-xl font-display text-jk-cream mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-24 bg-jk-dark-bg text-jk-cream relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-jk-royal-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-jk-royal-gold/5 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="container mx-auto px-4 relative z-10">
          <RevealOnScroll variant="blur-in">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-script text-jk-royal-gold mb-4">
                Ce que disent nos clientes
              </h2>
              <div className="w-24 h-1 bg-jk-royal-gold mx-auto" />
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial: any, index: number) => (
                <RevealOnScroll
                  key={testimonial._id || index}
                  delay={index * 0.1}
                  variant="fade-up"
                >
                  <div className="bg-jk-dark-surface p-8 rounded-2xl border border-jk-royal-gold/10 hover:border-jk-royal-gold/30 transition-all group h-full flex flex-col">
                    <div className="flex gap-1 mb-4 text-jk-royal-gold">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < (testimonial.rating || 5) ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-300 italic mb-8 leading-relaxed flex-1">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-jk-royal-gold/20 flex-shrink-0 relative">
                        {testimonial.avatar ? (
                          <Image 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-jk-royal-gold font-bold">
                            {testimonial.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-jk-royal-gold">{testimonial.name}</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{testimonial.city || "Cameroun"}</p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              ))
            ) : (
              // Fallback static testimonials
              <>
                {[
                  { name: "Serena B.", city: "Yaoundé", content: "Justine a su créer la robe de mes rêves pour mon mariage. Le souci du détail est tout simplement incroyable." },
                  { name: "Marie-Claire K.", city: "Douala", content: "Un professionnalisme exemplaire. Les finitions sont dignes des plus grandes maisons de couture européennes." },
                  { name: "Inès T.", city: "Paris", content: "Même à distance, la communication et les mesures étaient parfaites. Ma robe est arrivée impeccablement emballée." }
                ].map((item, i) => (
                  <RevealOnScroll key={i} delay={i * 0.12} variant="fade-up">
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-jk-royal-gold/20 transition-all h-full flex flex-col">
                      <div className="flex gap-1 mb-6 text-jk-royal-gold">
                        {[...Array(5)].map((_, starI) => (
                          <svg key={starI} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-300 italic mb-8 leading-relaxed flex-1">
                        "{item.content}"
                      </p>
                      <div>
                        <h4 className="font-display font-bold text-jk-royal-gold">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.city}</p>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </>
            )}
          </div>

          {/* Bouton voir plus */}
          <RevealOnScroll variant="fade-up" delay={0.3}>
            <div className="text-center mt-12">
              <Link
                href={`/${locale}/temoignages`}
                className="inline-flex items-center gap-3 border border-jk-royal-gold text-jk-royal-gold hover:bg-jk-royal-gold hover:text-jk-black px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105 group"
              >
                <span>Voir plus de témoignages</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Newsletter Section ── */}


      {/* ── CTA Finale Banner ── */}
      <section className="py-24 bg-gradient-to-br from-jk-imperial-green via-jk-imperial-green-dk to-jk-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/luxury-pattern.png')] bg-repeat" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-jk-royal-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <RevealOnScroll variant="zoom-in">
            <h2 className="text-4xl md:text-6xl font-script text-jk-royal-gold mb-6">
              Votre pièce unique vous attend
            </h2>
            <p className="text-jk-cream/80 text-lg mb-10 max-w-xl mx-auto">
              Contactez-nous dès aujourd&apos;hui et commençons à créer ensemble la tenue dont vous rêvez.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-jk-royal-gold text-jk-black hover:bg-jk-royal-gold-dark px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-xl"
              >
                ✉️ Prendre rendez-vous
              </Link>
              <a
                href="https://wa.me/237677463484"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 text-jk-cream hover:bg-white/20 border border-white/20 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105"
              >
                💬 WhatsApp direct
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}
