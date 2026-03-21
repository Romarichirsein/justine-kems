'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { WhatsAppFormHandler } from '@/components/WhatsAppFormHandler'

export default function FormationsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState('')

  const openForm = (title: string) => {
    setSelectedFormation(title)
    setModalOpen(true)
  }

  const formations = [
    {
      title: "Couture Initiation",
      duration: "3 mois",
      price: "150 000 FCFA",
      level: "Débutant",
      desc: "Découverte des machines, points de base, et création de vos premiers vêtements simples.",
      modules: ["Module 1: Les bases (Machines, Tissus)", "Module 2: Patronage jupe et haut basique", "Module 3: Le projet de fin de session"]
    },
    {
      title: "Stylisme Avancé",
      duration: "6 mois",
      price: "280 000 FCFA",
      level: "Évolué",
      desc: "Patronage complexe, création de collections cohérentes et techniques de haute couture artisanale.",
      modules: ["Module 1: Techniques tailleur et robes du soir", "Module 2: Morphologie et adaptations", "Module 3: Collection signature complète"]
    },
    {
      title: "Création d'Entreprise Mode",
      duration: "2 mois",
      price: "200 000 FCFA",
      level: "Expert",
      desc: "Le business exclusif: création de marque, tarification, marketing et lancement d'un atelier rentable.",
      modules: ["Module 1: Business Plan et Pricing", "Module 2: Communication et Image de Marque", "Module 3: Lancement et partenariats"]
    }
  ]

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen">
      
      {/* Hero Formations */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-0 bg-jk-imperial-green">
           <Image
            src="/images/formation-hero.jpg" // placeholder
            alt="Atelier couture formation"
            fill
            className="object-cover opacity-25 dark:opacity-15 mix-blend-luminosity"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-jk-cream max-w-4xl px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-script text-jk-royal-gold mb-6 text-shadow-gold">
            Devenez Créatrice<br/>de Mode Professionnelle
          </h1>
          <p className="text-xl md:text-2xl font-display mb-10 text-gray-200">
            Formations certifiantes avec Justine Kem, forte de plus de 10 ans d'expertise
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center text-jk-royal-gold font-bold uppercase tracking-wider text-sm border-t border-b border-jk-royal-gold/30 py-6">
            <span className="flex-1 border-b md:border-b-0 md:border-r border-jk-royal-gold/20 pb-4 md:pb-0">120+ Étudiantes formées</span>
            <span className="flex-1 border-b md:border-b-0 md:border-r border-jk-royal-gold/20 pb-4 md:pb-0">95% Satisfaction</span>
            <span className="flex-1">Certification reconnue</span>
          </div>
        </div>
      </section>

      {/* Profil Formatrice */}
      <section className="py-24 container mx-auto px-4">
         <div className="bg-white dark:bg-jk-dark-surface rounded-3xl p-8 md:p-16 shadow-2xl max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-jk-royal-gold/10 rounded-full blur-3xl -z-10" />
            
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 relative rounded-full overflow-hidden border-4 border-jk-royal-gold shadow-neon-gold">
               {/* Replace with Justine photo */}
               <Image src="/images/justine-profil.jpg" alt="Justine Kem Profile" fill className="object-cover" />
               <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-xs text-center p-4">Sans image ça affiche ça :/ placeholder!</div>
            </div>

            <div className="text-center md:text-left">
               <h3 className="text-jk-royal-gold font-bold uppercase tracking-widest text-sm mb-2">Votre Formatrice</h3>
               <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-cream mb-6">Justine Kem</h2>
               <p className="text-lg text-jk-text-muted dark:text-gray-300 leading-relaxed mb-6">
                 "J'ai à cœur de transmettre les secrets de l'élégance africaine et européenne. Que vous soyez débutante passionnée ou couturière souhaitant perfectionner votre art, mes programmes vous accompagnent vers l'excellence artisanale."
               </p>
               <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">10+ Années d'expertise</span>
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">Créatrice Senior</span>
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">Mentor D'entreprises</span>
               </div>
            </div>
         </div>
      </section>

      {/* Programmes */}
      <section className="py-24 bg-jk-cream dark:bg-jk-dark-bg border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-5xl font-script text-jk-imperial-green dark:text-jk-royal-gold text-center mb-16">Nos Programmes</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {formations.map((form, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div className="bg-white dark:bg-jk-dark-surface rounded-2xl shadow-xl hover:shadow-neon-gold transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col group relative overflow-hidden">
                  
                  {/* Accent Top border */}
                  <div className="h-2 w-full bg-gradient-gold" />
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="w-16 h-16 rounded-full bg-jk-royal-gold/10 text-jk-royal-gold flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                    </div>

                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm font-bold rounded-full w-max mb-4">{form.level}</span>
                    <h3 className="text-3xl font-display font-medium text-jk-imperial-green dark:text-jk-cream mb-4">{form.title}</h3>
                    <p className="text-jk-text-muted dark:text-gray-400 mb-6 flex-1">{form.desc}</p>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8">
                       <ul className="space-y-2 text-sm text-jk-text-dark dark:text-gray-300">
                         {form.modules.map(mod => (
                            <li key={mod} className="flex gap-2">
                               <span className="text-jk-royal-gold mt-1">✓</span>
                               <span>{mod}</span>
                            </li>
                         ))}
                       </ul>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-sm text-jk-text-muted dark:text-gray-400 uppercase tracking-widest font-semibold">{form.duration}</p>
                          <p className="text-3xl font-bold text-jk-royal-gold mt-1">{form.price}</p>
                        </div>
                      </div>
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

      {/* CTA Whatsapp Global Formations */}
      <section className="bg-jk-imperial-green text-center py-24 text-jk-cream">
        <h2 className="text-4xl md:text-5xl font-script text-jk-royal-gold mb-8 text-shadow-gold">Prête à lancer votre carrière ?</h2>
        <button onClick={() => openForm('Question Générale Formation')} className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-lg px-10 py-5 rounded-full shadow-neon-green transition-transform hover:scale-105 inline-flex items-center gap-3">
           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
           Discuter de votre projet formation
        </button>
      </section>

      {/* Modal form training */}
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
