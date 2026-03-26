'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useDropzone } from 'react-dropzone'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

export interface WhatsAppFormProps {
  isOpen: boolean
  onClose: () => void
  formType: 'contact' | 'order' | 'rental' | 'training' | 'custom'
  productName?: string
  formationTitle?: string
  submitButtonText?: string
}

export function WhatsAppFormHandler({
  isOpen,
  onClose,
  formType,
  productName,
  formationTitle,
  submitButtonText = "Envoyer sur WhatsApp"
}: WhatsAppFormProps) {
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Schémas de validation basiques Zod
  const formSchema = z.object({
    name: z.string().min(2, "Nom requis"),
    phone: z.string().regex(/^\+?[1-9]\d{8,14}$/, "Téléphone invalide"),
    email: z.string().email("Email invalide"),
    subject: z.string().optional(),
    message: z.string().min(10, "Message trop court").optional(),
    measurements: z.string().optional(),
    date: z.string().optional(),
    level: z.string().optional(),
    availability: z.string().optional()
  })

  type FormData = z.infer<typeof formSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => setPhoto(acceptedFiles[0])
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      let photoUrl = ''
      
      // Si une photo est présente, on l'uploade sur un service de partage temporaire (file.io)
      if (photo) {
        toast.loading("Transfert de la photo...", { id: 'upload' })
        const formData = new FormData()
        formData.append('file', photo)
        
        try {
          const response = await fetch('https://file.io', {
            method: 'POST',
            body: formData
          })
          const result = await response.json()
          if (result.success) {
            photoUrl = result.link
            toast.success("Photo prête !", { id: 'upload' })
          } else {
             throw new Error("Upload failed")
          }
        } catch (err) {
          console.error("Upload error:", err)
          toast.error("Impossible d'uploader la photo, envoi du texte seul...", { id: 'upload' })
        }
      }

      let messageContent = ''
      const safeProduct = productName || "Produit non spécifié"
      const safeFormation = formationTitle || "Formation non spécifiée"
      
      if (formType === 'contact') {
        messageContent = `📩 NOUVEAU MESSAGE CONTACT\n\n👤 Nom: ${data.name}\n📧 Email: ${data.email}\n📱 Téléphone: ${data.phone}\n📋 Objet: ${data.subject || 'Général'}\n\n💬 Message:\n${data.message}`
      } else if (formType === 'order') {
        messageContent = `🛍️ NOUVELLE COMMANDE\n\n📦 Produit: ${safeProduct}\n\n👤 Client: ${data.name}\n📱 Téléphone: ${data.phone}\n📧 Email: ${data.email}\n📏 Mesures: ${data.measurements || 'À prendre'}\n📅 Livraison souhaitée: ${data.date || 'À définir'}\n\n💬 Spécifications:\n${data.message || 'Aucune'}`
      } else if (formType === 'training') {
        messageContent = `📚 INSCRIPTION FORMATION\n\n🎓 Formation: ${safeFormation}\n\n👤 Étudiante: ${data.name}\n📱 Téléphone: ${data.phone}\n📧 Email: ${data.email}\n📊 Niveau: ${data.level || 'Non spécifié'}\n⏰ Disponibilités: ${data.availability || 'Non spécifiées'}\n\n💬 Motivations:\n${data.message || 'Aucune'}`
      } else if (formType === 'rental') {
        messageContent = `💃 LOCATION DE TENUE\n\n👗 Modèle: ${safeProduct}\n\n👤 Client: ${data.name}\n📱 Téléphone: ${data.phone}\n📅 Date demandée: ${data.date || 'À définir'}\n\n💬 Message:\n${data.message || 'Aucun'}`
      }

      if (photoUrl) {
        messageContent += `\n\n🖼️ IMAGE D'INSPIRATION :\n${photoUrl}\n(Note: Le lien expire après consultation)`
      } else if (photo) {
        messageContent += `\n\n📸 [Une photo a été sélectionnée mais n'a pas pu être uploadée]`
      }

      const encodedMessage = encodeURIComponent(messageContent)
      const whatsappUrl = `https://api.whatsapp.com/send?phone=237677463484&text=${encodedMessage}`

      toast.success("Redirection vers WhatsApp...")
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
        setIsSubmitting(false)
        onClose()
      }, 1000)
    } catch (error) {
      toast.error("Erreur lors de la préparation du message")
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-jk-dark-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-jk-imperial-green text-jk-cream">
            <h2 className="text-xl font-display font-semibold">
              {formType === 'contact' && 'Contactez-nous'}
              {(formType === 'order' || formType === 'rental' || formType === 'custom') && `Commander: ${productName || formationTitle || 'Modèle choisi'}`}
              {formType === 'training' && `Inscription: ${formationTitle || productName || 'Formation choisie'}`}
            </h2>
            <button onClick={onClose} className="text-jk-cream/80 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom complet *</label>
                  <input {...register('name')} className="input-luxury" placeholder="Votre nom" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone *</label>
                  <input {...register('phone')} className="input-luxury" placeholder="+237..." />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input {...register('email')} type="email" className="input-luxury" placeholder="votre@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {formType === 'contact' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Objet</label>
                  <select {...register('subject')} className="input-luxury hidden sm:block">
                    <option value="">Sélectionnez un objet</option>
                    <option value="Commande">Commande sur mesure</option>
                    <option value="Location">Location de tenue</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Autre">Question générale</option>
                  </select>
                </div>
              )}

              {formType === 'order' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium mb-1">Mensurations (Optionnel)</label>
                    <input {...register('measurements')} className="input-luxury" placeholder="Taille / Poitrine..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date souhaitée (Optionnel)</label>
                    <input type="date" {...register('date')} className="input-luxury" />
                  </div>
                </div>
              )}

              {formType === 'training' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium mb-1">Niveau actuel</label>
                    <select {...register('level')} className="input-luxury">
                      <option value="Débutante">Débutante</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Confirmée">Confirmée</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Disponibilités</label>
                    <select {...register('availability')} className="input-luxury">
                      <option value="Matin">Matin</option>
                      <option value="Après-midi">Après-midi</option>
                      <option value="Soir">Soir</option>
                      <option value="Weekend">Weekend</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  {formType === 'training' ? 'Vos motivations' : 'Message / Détails *'}
                </label>
                <textarea {...register('message')} rows={4} className="input-luxury resize-y" placeholder="Dites-nous en plus..."></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {/* Upload Zone */}
              <div>
                <label className="block text-sm font-medium mb-1">Photo d&apos;inspiration (Optionnel)</label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-jk-royal-gold bg-jk-royal-gold/5' : 'border-gray-300 dark:border-gray-700 hover:border-jk-royal-gold'}`}
                >
                  <input {...getInputProps()} />
                  {photo ? (
                    <p className="text-sm font-medium text-jk-imperial-green dark:text-jk-royal-gold">{photo.name}</p>
                  ) : (
                    <div className="text-jk-text-muted dark:text-gray-400">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-sm">Glissez une photo ou cliquez pour parcourir</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-4 rounded-xl shadow-lg transition-all disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Préparation...
                  </span>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                    {submitButtonText}
                  </>
                )}
              </button>

            </form>
          </div>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </AnimatePresence>
  )
}
