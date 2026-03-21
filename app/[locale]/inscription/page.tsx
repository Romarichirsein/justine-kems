'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast, { Toaster } from 'react-hot-toast'

export default function InscriptionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = z.object({
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().regex(/^\+?[1-9]\d{8,14}$/, "Téléphone invalide"),
    training: z.string().min(1, "Veuillez choisir une formation"),
    level: z.string().min(1, "Veuillez indiquer votre niveau"),
    motivations: z.string().min(20, "Veuillez nous en dire plus (min 20 caractères)"),
  })

  type FormData = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)

    const message = `🎓 NOUVELLE DEMANDE D'INSCRIPTION\n\n👤 Candidate: ${data.firstName} ${data.lastName}\n📧 Email: ${data.email}\n📱 Téléphone: ${data.phone}\n\n📚 Formation choisie: ${data.training}\n📊 Niveau actuel: ${data.level}\n\n💬 Motivations:\n${data.motivations}`

    const whatsappUrl = `https://api.whatsapp.com/send?phone=237677463484&text=${encodeURIComponent(message)}`
    
    toast.success("Redirection vers WhatsApp...")
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-script text-jk-imperial-green dark:text-jk-royal-gold mb-4">Rejoignez l'Académie</h1>
          <p className="text-lg text-jk-text-muted dark:text-gray-300">
            Remplissez ce formulaire pour soumettre votre candidature à l'une de nos formations professionnelles.
          </p>
        </div>

        <div className="bg-white dark:bg-jk-dark-surface p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-gold" />
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Prénom *</label>
                <input {...register('firstName')} className="input-luxury" placeholder="Sarah" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <input {...register('lastName')} className="input-luxury" placeholder="Mouelle" />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input type="email" {...register('email')} className="input-luxury" placeholder="sarah@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone (WhatsApp) *</label>
                <input {...register('phone')} className="input-luxury" placeholder="+237..." />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium mb-2 text-jk-imperial-green dark:text-jk-royal-gold">Formation souhaitée *</label>
                <select {...register('training')} className="input-luxury">
                  <option value="">Sélectionnez un programme</option>
                  <option value="Couture Initiation (3 mois)">Couture Initiation (3 mois)</option>
                  <option value="Stylisme Avancé (6 mois)">Stylisme Avancé (6 mois)</option>
                  <option value="Business Mode (2 mois)">Business Mode (2 mois)</option>
                </select>
                {errors.training && <p className="text-red-500 text-xs mt-1">{errors.training.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-jk-imperial-green dark:text-jk-royal-gold">Votre niveau *</label>
                <select {...register('level')} className="input-luxury">
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="Jamais touché une machine">Jamais touché une machine</option>
                  <option value="Notions de base">Notions de base (Je sais coudre droit)</option>
                  <option value="Intermédiaire">Intermédiaire (Je réalise des vêtements simples)</option>
                  <option value="Avancé">Avancé (Perfectionnement technique)</option>
                </select>
                {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-jk-imperial-green dark:text-jk-royal-gold">Pourquoi souhaitez-vous suivre cette formation ? *</label>
              <textarea 
                {...register('motivations')} 
                rows={5} 
                className="input-luxury resize-y" 
                placeholder="Parlez-nous de vos objectifs, de votre passion, de ce que vous attendez de la formation..."
              />
              {errors.motivations && <p className="text-red-500 text-xs mt-1">{errors.motivations.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-jk-imperial-green hover:bg-[#002a26] dark:bg-jk-royal-gold dark:hover:bg-jk-royal-gold-dark dark:text-black text-white font-bold py-5 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-70"
            >
              {isSubmitting ? "Envoi en cours..." : "Soumettre ma candidature via WhatsApp"}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Votre candidature sera envoyée directement sur notre WhatsApp officiel pour un traitement rapide.
            </p>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
