'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { WhatsAppFormHandler } from '@/components/WhatsAppFormHandler'
import { RevealOnScroll } from '@/components/RevealOnScroll'


/* ─────────────────────────── DATA ─────────────────────────── */

const formations = [
  {
    level: 'Débutantes',
    badge: '🌱',
    title: 'Initiation à la Couture',
    desc: 'Maîtrisez les bases absolues de la couture — lecture de patrons, mesures, utilisation de la machine à coudre — en 4 mois de pratique intensive.',
    duration: '4 mois • 2 séances/semaine',
    price: '85 000 FCFA',
    color: 'from-green-400/20 to-emerald-600/10',
    borderColor: 'border-green-400/30',
    modules: [
      'Initiation à la machine à coudre',
      'Lecture et création de patrons simples',
      'Réalisation de vêtements de ville basiques',
      'Notions de tissu et entretien',
    ],
  },
  {
    level: 'Intermédiaires',
    badge: '⭐',
    title: 'Couture Avancée & Tissus Africains',
    desc: 'Perfectionnez votre technique avec les tissus africains (wax, bazin, kente) et découvrez les secrets de la confection haute couture camerounaise.',
    duration: '6 mois • 3 séances/semaine',
    price: '135 000 FCFA',
    color: 'from-jk-royal-gold/20 to-amber-600/10',
    borderColor: 'border-jk-royal-gold/40',
    isBest: true,
    modules: [
      'Maîtrise des tissus africains premium',
      'Patrons complexes et ajustements',
      'Tenues de cérémonie & tenues traditionnelles',
      'Broderies et ornementations',
    ],
  },
  {
    level: 'Professionnelles',
    badge: '👑',
    title: 'Formation Créatrice Entrepreneure',
    desc: "Du studio à l'entreprise : développez votre marque, créez vos collections, gérez un atelier et accédez à un réseau de clientes premium.",
    duration: '12 mois • Programme complet',
    price: '350 000 FCFA',
    color: 'from-purple-500/20 to-indigo-600/10',
    borderColor: 'border-purple-400/30',
    modules: [
      "Création de collection et identité de marque",
      'Gestion d\'atelier et comptabilité',
      'Marketing digital pour couturières',
      'Réseau professionnel & clients premium',
    ],
  },
]

const testimonials = [
  {
    name: 'Mariette Ngono',
    role: 'Ancienne étudiante • Débutantes',
    text: 'En 4 mois, je suis passée de zéro à créer mes propres robes de soirée. Justine enseigne avec une patience infinie et une passion contagieuse !',
    avatar: '/images/testimonial-1.jpg',
    stars: 5,
  },
  {
    name: 'Claudia Biya',
    role: 'Ancienne étudiante • Avancée',
    text: "La formation m'a donné toutes les clés pour ouvrir mon propre atelier à Douala. Le module entrepreneuriat était particulièrement précieux.",
    avatar: '/images/testimonial-2.jpg',
    stars: 5,
  },
  {
    name: 'Amina Traoré',
    role: 'Ancienne étudiante • Professionnelle',
    text: 'Je vends maintenant mes créations en ligne à Paris et Abidjan. Justine m\'a appris à croire en mon talent et à en faire un business.',
    avatar: '/images/testimonial-3.jpg',
    stars: 5,
  },
]

const faqItems = [
  {
    q: 'Faut-il avoir des bases en couture pour s\'inscrire ?',
    a: 'Non ! Notre formation Initiation est spécialement conçue pour les personnes sans aucune expérience. Nous accueillons des débutantes absolues.',
  },
  {
    q: 'Les formations se déroulent en présentiel ou en ligne ?',
    a: 'Les formations sont principalement en présentiel à notre atelier de Yaoundé. Nous proposons également des sessions en ligne pour certains modules théoriques.',
  },
  {
    q: 'Y a-t-il un certificat à la fin de la formation ?',
    a: 'Oui ! Chaque formation se conclut par un certificat de réussite Justine Kem\'s, reconnu dans le secteur de la mode au Cameroun et à l\'international.',
  },
  {
    q: 'Peut-on payer en plusieurs fois ?',
    a: 'Absolument. Nous proposons des facilités de paiement en 2 ou 3 mensualités sans frais supplémentaires. Contactez-nous pour en discuter.',
  },
  {
    q: 'Que comprend la formation Professionnelle sur 12 mois ?',
    a: 'La formation complète comprend : cours techniques avancés, cours de gestion d\'entreprise, stages pratiques en atelier, accès à notre réseau de clientes, et accompagnement au lancement de votre marque.',
  },
  {
    q: 'Quand commence la prochaine session ?',
    a: 'Les inscriptions pour la prochaine session de septembre 2025 sont ouvertes. Les places sont limitées à 8 étudiantes par groupe pour un suivi optimal. Inscrivez-vous maintenant pour réserver votre place.',
  },
]

const steps = [
  { num: '01', title: 'Contactez-nous', desc: 'Via WhatsApp ou le formulaire ci-dessous — nous répondons en moins de 24h.' },
  { num: '02', title: 'Entretien découverte', desc: 'Session gratuite de 30 min pour évaluer votre niveau actuel et vos objectifs.' },
  { num: '03', title: 'Inscription & paiement', desc: 'Choisissez votre programme et réglez en une ou plusieurs fois.' },
  { num: '04', title: 'Démarrez votre voyage', desc: 'Rejoignez votre groupe et commencez à créer dès la première semaine !' },
]

/* ─────────────── COMPOSANT FAQ ACCORDION ─────────────────── */

function FaqItem({ item, index }: { item: typeof faqItems[0]; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <RevealOnScroll delay={index * 0.05}>
      <div
        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
          open
            ? 'border-jk-royal-gold/50 shadow-neon-gold bg-jk-royal-gold/5'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-jk-dark-surface'
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-4 p-6 text-left group"
        >
          <span className={`font-display font-semibold text-lg transition-colors ${open ? 'text-jk-royal-gold' : 'text-jk-text-dark dark:text-jk-cream'}`}>
            {item.q}
          </span>
          <span
            className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              open ? 'border-jk-royal-gold bg-jk-royal-gold text-black rotate-45' : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <p className="px-6 pb-6 text-jk-text-muted dark:text-gray-300 leading-relaxed">
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RevealOnScroll>
  )
}

/* ─────────────── COMPOSANT TESTIMONIAL CARD ─────────────────── */

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  return (
    <RevealOnScroll delay={index * 0.12}>
      <div className="bg-white dark:bg-jk-dark-surface rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col h-full relative overflow-hidden group hover:-translate-y-1 hover:shadow-neon-gold transition-all duration-300">
        {/* Quote icon */}
        <div className="absolute top-4 right-6 text-jk-royal-gold/20 text-7xl font-serif leading-none select-none">"</div>
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: t.stars }).map((_, i) => (
            <span key={i} className="text-jk-royal-gold text-lg">★</span>
          ))}
        </div>
        <p className="text-jk-text-muted dark:text-gray-300 leading-relaxed italic flex-1 mb-6 relative z-10">
          "{t.text}"
        </p>
        <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-5">
          <div className="w-12 h-12 rounded-full bg-jk-royal-gold/20 border-2 border-jk-royal-gold/40 flex items-center justify-center text-jk-royal-gold font-bold text-lg shrink-0 overflow-hidden">
            {t.name[0]}
          </div>
          <div>
            <p className="font-semibold text-jk-text-dark dark:text-jk-cream">{t.name}</p>
            <p className="text-xs text-jk-text-muted dark:text-gray-400">{t.role}</p>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  )
}

/* ─────────────────────── PAGE PRINCIPALE ──────────────────── */

export default function FormationsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState('')

  function openForm(title: string) {
    setSelectedFormation(title)
    setModalOpen(true)
  }

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-b from-jk-imperial-green via-[#0d2420] to-[#0A1A18] py-32">
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-jk-royal-gold/10 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-jk-royal-gold/15" />
        </div>
        {/* Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('/pattern-baroque.svg')] bg-repeat bg-[length:200px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-jk-royal-gold uppercase tracking-[0.4em] text-sm font-semibold mb-8"
          >
            Académie Justine Kem's
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-script text-jk-royal-gold mb-6 text-shadow-gold leading-tight"
          >
            Devenez Créatrice<br />de Mode Professionnelle
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl font-display mb-10 text-gray-200 max-w-2xl mx-auto"
          >
            Formations certifiantes avec Justine Kem, forte de plus de <strong className="text-jk-royal-gold">10 ans d'expertise</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button onClick={() => openForm('Information Formation')} className="btn-primary px-10 py-4 text-lg">
              Découvrir les programmes
            </button>
            <a
              href="https://wa.me/237677463484?text=Bonjour%20Justine%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20formations."
              target="_blank" rel="noreferrer"
              className="px-10 py-4 rounded-full border-2 border-jk-royal-gold/50 text-jk-cream font-semibold hover:border-jk-royal-gold hover:bg-jk-royal-gold/10 transition-all text-lg"
            >
              Questions ? WhatsApp →
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col md:flex-row gap-6 justify-center text-jk-royal-gold font-bold uppercase tracking-wider text-sm border-t border-b border-jk-royal-gold/30 py-6 max-w-2xl mx-auto"
          >
            <span className="flex-1 border-b md:border-b-0 md:border-r border-jk-royal-gold/20 pb-4 md:pb-0">120+ Étudiantes formées</span>
            <span className="flex-1 border-b md:border-b-0 md:border-r border-jk-royal-gold/20 pb-4 md:pb-0">95% Satisfaction</span>
            <span className="flex-1">Certification reconnue</span>
          </motion.div>
        </div>
      </section>

      {/* ── PROFIL FORMATRICE ── */}
      <section className="py-24 container mx-auto px-4">
        <RevealOnScroll>
          <div className="bg-white dark:bg-jk-dark-surface rounded-3xl p-8 md:p-16 shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 relative overflow-hidden border border-jk-royal-gold/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-jk-royal-gold/5 rounded-full blur-3xl -z-[1]" />

            {/* Avatar */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-4 border-jk-royal-gold shadow-neon-gold">
              <Image src="/images/justine-profil.jpg" alt="Justine Kem" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-jk-imperial-green/40" />
            </div>

            <div className="text-center md:text-left">
              <p className="text-jk-royal-gold font-bold uppercase tracking-widest text-sm mb-2">Votre Formatrice</p>
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-cream mb-4">Justine Kem</h2>
              <blockquote className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed mb-6 italic border-l-4 border-jk-royal-gold/40 pl-4">
                "J'ai à cœur de transmettre les secrets de l'élégance africaine et européenne. Chaque étudiante repartira avec les outils pour exceller — techniquement et professionnellement."
              </blockquote>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-jk-cream dark:bg-gray-800 rounded-full text-sm font-medium text-jk-imperial-green dark:text-jk-royal-gold border border-jk-royal-gold/20">10+ Ans d'expertise</span>
                <span className="px-4 py-2 bg-jk-cream dark:bg-gray-800 rounded-full text-sm font-medium text-jk-imperial-green dark:text-jk-royal-gold border border-jk-royal-gold/20">Créatrice Senior</span>
                <span className="px-4 py-2 bg-jk-cream dark:bg-gray-800 rounded-full text-sm font-medium text-jk-imperial-green dark:text-jk-royal-gold border border-jk-royal-gold/20">Mentor & Coach</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ── PROGRAMMES ── */}
      <section className="py-24 bg-white dark:bg-jk-dark-bg border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-3">Nos Programmes</p>
              <h2 className="text-5xl font-script text-jk-imperial-green dark:text-jk-royal-gold">Choisissez votre parcours</h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8">
            {formations.map((form, i) => (
              <RevealOnScroll key={i} delay={i * 0.12}>
                <div className={`relative rounded-2xl border-2 ${form.borderColor} bg-gradient-to-br ${form.color} dark:bg-jk-dark-surface shadow-xl hover:shadow-neon-gold hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden group`}>
                  {form.isBest && (
                    <div className="absolute -top-0 -right-0 bg-jk-royal-gold text-black text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider">
                      ⭐ Plus populaire
                    </div>
                  )}
                  <div className="h-1.5 w-full bg-gradient-gold" />
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-4xl mb-4">{form.badge}</div>
                    <span className="inline-block px-3 py-1 bg-white/60 dark:bg-gray-800 text-xs font-bold rounded-full w-max mb-4 uppercase tracking-wider text-jk-imperial-green dark:text-jk-royal-gold">
                      {form.level}
                    </span>
                    <h3 className="text-2xl font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-3">{form.title}</h3>
                    <p className="text-jk-text-muted dark:text-gray-400 mb-6 flex-1 leading-relaxed text-sm">{form.desc}</p>

                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-2">
                      {form.modules.map(mod => (
                        <div key={mod} className="flex gap-2 items-start text-sm text-jk-text-dark dark:text-gray-300">
                          <span className="text-jk-royal-gold mt-0.5 shrink-0">✓</span>
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700 mt-auto">
                      <p className="text-xs text-jk-text-muted dark:text-gray-400 uppercase tracking-widest font-semibold mb-1">{form.duration}</p>
                      <p className="text-3xl font-bold text-jk-royal-gold mb-5">{form.price}</p>
                      <button
                        onClick={() => openForm(form.title)}
                        className="w-full btn-primary py-4 group-hover:bg-jk-imperial-green group-hover:text-jk-cream transition-colors"
                      >
                        S'inscrire à ce programme
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESUS INSCRIPTION ── */}
      <section className="py-24 container mx-auto px-4 max-w-5xl">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-3">Comment s'inscrire</p>
            <h2 className="text-4xl font-script text-jk-imperial-green dark:text-jk-cream">Un processus simple en 4 étapes</h2>
          </div>
        </RevealOnScroll>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="relative text-center group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+3rem)] right-[-50%] h-px bg-gradient-to-r from-jk-royal-gold/40 to-transparent" />
                )}
                <div className="w-24 h-24 mx-auto rounded-full bg-jk-royal-gold/10 border-2 border-jk-royal-gold/30 flex items-center justify-center mb-5 group-hover:border-jk-royal-gold group-hover:bg-jk-royal-gold/20 transition-all duration-300">
                  <span className="text-2xl font-bold text-jk-royal-gold font-script">{step.num}</span>
                </div>
                <h3 className="font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-2">{step.title}</h3>
                <p className="text-sm text-jk-text-muted dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-24 bg-jk-imperial-green/5 dark:bg-jk-dark-surface/50 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-3">Témoignages</p>
              <h2 className="text-4xl font-script text-jk-imperial-green dark:text-jk-cream">Ce que disent nos étudiantes</h2>
            </div>
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => <TestimonialCard key={i} t={t} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="py-24 container mx-auto px-4 max-w-3xl">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-3">Questions fréquentes</p>
            <h2 className="text-4xl font-script text-jk-imperial-green dark:text-jk-cream">Vos Questions, nos Réponses</h2>
          </div>
        </RevealOnScroll>
        <div className="space-y-4">
          {faqItems.map((item, i) => <FaqItem key={i} item={item} index={i} />)}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-jk-imperial-green py-24 text-center text-jk-cream">
        <RevealOnScroll>
          <p className="text-jk-royal-gold uppercase tracking-widest text-sm font-semibold mb-4">Prochaine session — Septembre 2025</p>
          <h2 className="text-4xl md:text-5xl font-script text-jk-royal-gold mb-6 text-shadow-gold">
            Prête à lancer votre carrière ?
          </h2>
          <p className="text-gray-200 mb-10 max-w-xl mx-auto text-lg">
            Places limitées à 8 étudiantes par groupe. Ne ratez pas votre chance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openForm('Inscription Session Septembre 2025')}
              className="bg-jk-royal-gold text-black font-bold text-lg px-10 py-4 rounded-full hover:bg-amber-400 transition-all hover:scale-105 shadow-neon-gold"
            >
              Réserver ma place maintenant
            </button>
            <button
              onClick={() => openForm('Question Générale Formation')}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-lg px-10 py-4 rounded-full shadow-neon-green transition-transform hover:scale-105 inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Discuter sur WhatsApp
            </button>
          </div>
        </RevealOnScroll>
      </section>

      {/* ── MODAL ── */}
      <WhatsAppFormHandler
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType="training"
        formationTitle={selectedFormation}
        submitButtonText="S'inscrire via WhatsApp"
      />
    </div>
  )
}
