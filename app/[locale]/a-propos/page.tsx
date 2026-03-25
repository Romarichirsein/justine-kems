import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { AnimatedCounter } from '@/components/AnimatedCounter'

export const metadata: Metadata = {
  title: "À propos de Justine Kem's - Créatrice de Mode à Yaoundé | Notre Histoire",
  description: "Découvrez l'histoire de Justine Kem's, créatrice de mode à Yaoundé. De la passion à l'excellence en haute couture sur mesure depuis 2015. Créations uniques, savoir-faire africain.",
}

export default function AboutPage() {
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
            Notre histoire
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-script text-white mb-6 leading-tight">
            L'histoire derrière<br/>chaque couture
          </h1>
          <p className="text-xl font-display text-jk-cream/80">
            De la passion à l'excellence, depuis Yaoundé jusqu'au monde.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-jk-royal-gold py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 13, suffix: ' ans', label: "D'expérience" },
              { value: 500, suffix: '+', label: 'Créations réalisées' },
              { value: 100, suffix: '+', label: 'Pays desservis' },
              { value: 100, suffix: '%', label: 'Clientes satisfaites' },
            ].map((stat, i) => (
              <RevealOnScroll key={stat.label} delay={i * 0.1} variant="zoom-in">
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
              <p className="text-xs uppercase tracking-[0.3em] text-jk-royal-gold mb-4">Chapitre 1</p>
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-royal-gold mb-6">Les débuts</h2>
              <p className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed">
                Née d'une passion précoce pour les tissus et la création, Justine Kem's a débuté son parcours dans l'univers de la mode dès son adolescence. Formée aux techniques traditionnelles de couture camerounaise puis enrichie par des influences européennes, elle développe rapidement une signature unique mêlant héritage africain et élégance intemporelle.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] relative group">
              <Image
                src="/modeles/etat%20civil/120.000.jpg"
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
              <p className="text-xs uppercase tracking-[0.3em] text-jk-royal-gold mb-4">Chapitre 2</p>
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-royal-gold mb-6">La vision</h2>
              <p className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed">
                Créer des pièces qui racontent une histoire, celle de la femme qui les porte. Chaque création Justine Kem's est pensée pour sublimer la personnalité unique de sa cliente, loin des standards de la fast-fashion. L'objectif : une garde-robe sur-mesure où chaque pièce devient iconique.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] relative group md:order-1">
              <Image
                src="/modeles/Tenue%20traditionnels/150.000c.jpg"
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
              <p className="text-xs uppercase tracking-[0.3em] text-jk-royal-gold mb-4">Chapitre 3</p>
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-royal-gold mb-6">L'engagement</h2>
              <p className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed">
                Ancrée à Yaoundé tout en rayonnant à l'international, la maison Justine Kem's s'engage pour une mode éthique : tissus de qualité, artisanat local, transparence totale du processus de création, et transmission du savoir-faire via nos formations professionnelles.
              </p>
              <ul className="mt-6 space-y-3 text-jk-text-muted dark:text-gray-400">
                {['Tissus sourcés localement', 'Zéro gaspillage de matière', 'Artisans camerounais valorisés', 'Formations gratuites chaque trimestre'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-5 h-5 flex-shrink-0 rounded-full bg-jk-royal-gold/20 text-jk-royal-gold text-xs flex items-center justify-center">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] relative group">
              <Image
                src="/modeles/Robes%20de%20soirees/250.000f.jpg"
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
            <h2 className="text-5xl font-script text-jk-royal-gold mb-4">Notre Parcours</h2>
            <div className="w-20 h-0.5 bg-jk-royal-gold mx-auto mb-16" />
          </RevealOnScroll>
          <div className="flex flex-col md:flex-row justify-between items-start relative max-w-5xl mx-auto gap-8 md:gap-0">
            {/* Ligne dorée desktop */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-jk-royal-gold/40 to-transparent -z-10" />
            
            {[
              { year: '2015', text: "Création de l'atelier", icon: '✂️' },
              { year: '2017', text: "Première collection capsule", icon: '👗' },
              { year: '2019', text: "Lancement formations", icon: '📚' },
              { year: '2021', text: "Expansion internationale", icon: '🌍' },
              { year: '2023', text: "500+ créations livrées", icon: '🏆' },
              { year: '2025', text: "Ouverture service location", icon: '✨' },
            ].map((item, i) => (
              <RevealOnScroll key={item.year} delay={i * 0.1} variant="fade-up">
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
              Nos valeurs
            </h2>
            <div className="w-20 h-0.5 bg-jk-royal-gold mx-auto mb-16" />
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { label: 'Excellence', desc: "Chaque point de couture est réalisé avec une précision méticuleuse, sans compromis sur la qualité.", icon: '💎' },
              { label: 'Authenticité', desc: "Nos créations puisent dans le patrimoine africain pour offrir des pièces uniques et significatives.", icon: '🌺' },
              { label: 'Transmission', desc: "Partager notre savoir-faire pour former la prochaine génération de créateurs africains.", icon: '🤝' },
            ].map((val, i) => (
              <RevealOnScroll key={val.label} delay={i * 0.15} variant="fade-up">
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
              Prête à créer votre pièce unique ?
            </h2>
            <p className="text-jk-black/70 text-lg mb-10">
              Rejoignez les centaines de clientes qui nous font confiance.
            </p>
            <Link
              href="/fr/contact"
              className="inline-flex items-center gap-2 bg-jk-black text-white hover:bg-jk-imperial-green px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-xl"
            >
              Prendre rendez-vous →
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}
