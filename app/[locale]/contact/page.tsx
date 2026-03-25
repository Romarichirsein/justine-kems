'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useDropzone } from 'react-dropzone'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('contact')
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactSchema = z.object({
    name: z.string().min(2, "Nom requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().regex(/^\+?[1-9]\d{8,14}$/, "Téléphone invalide (+237...)"),
    subject: z.string().min(1, "Objet requis"),
    message: z.string().min(20, "Veuillez détailler (min 20 caractères)"),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Vous devez accepter d'être contacté via WhatsApp" }),
    }),
  })

  type ContactFormData = z.infer<typeof contactSchema>

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange'
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => setPhoto(acceptedFiles[0])
  })

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true)

    const message = `📩 NOUVEAU MESSAGE CONTACT\n\n👤 Nom: ${data.name}\n📧 Email: ${data.email}\n📱 Téléphone: ${data.phone}\n📋 Objet: ${data.subject}\n\n💬 Message:\n${data.message}\n\n${photo ? t('form.uploadSuccess') : ''}`.trim()

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=237677463484&text=${encodedMessage}`
    
    toast.success(t('form.loading'))
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
      setIsSubmitting(false)
    }, 1500)
  }

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
            <div className="bg-white dark:bg-jk-dark-surface p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-cream mb-8 border-b pb-4 dark:border-gray-700">{t('form.title')}</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t('form.nameLabel')}</label>
                    <input {...register('name')} className="input-luxury" placeholder={t('form.namePlaceholder')} />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t('form.emailLabel')}</label>
                    <input type="email" {...register('email')} className="input-luxury" placeholder={t('form.emailPlaceholder')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t('form.phoneLabel')}</label>
                    <input {...register('phone')} className="input-luxury" placeholder={t('form.phonePlaceholder')} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t('form.subjectLabel')}</label>
                    <select {...register('subject')} className="input-luxury">
                      <option value="">{t('form.subjectPlaceholder')}</option>
                      <option value="Commande sur mesure">{t('form.subjects.custom')}</option>
                      <option value="Location de tenue">{t('form.subjects.rental')}</option>
                      <option value="Inscription formation">{t('form.subjects.training')}</option>
                      <option value="Partenariat">{t('form.subjects.partnership')}</option>
                      <option value="Question générale">{t('form.subjects.general')}</option>
                      <option value="Autre">{t('form.subjects.other')}</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-xs mt-1 font-medium">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t('form.messageLabel')}</label>
                  <textarea 
                    {...register('message')} 
                    rows={6} 
                    className="input-luxury resize-y" 
                    placeholder={t('form.messagePlaceholder')}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message.message}</p>}
                </div>

                {/* Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">{t('form.uploadLabel')}</label>
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-jk-royal-gold bg-jk-royal-gold/10 scale-[1.02]' : 'border-gray-300 dark:border-gray-700 hover:border-jk-royal-gold'}`}
                  >
                    <input {...getInputProps()} />
                    {photo ? (
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         <p className="text-sm font-bold text-jk-text-dark dark:text-white">{photo.name}</p>
                         <p className="text-xs text-jk-text-muted mt-1">{(photo.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-jk-text-muted dark:text-gray-400">
                        <svg className="w-10 h-10 mx-auto mb-3 text-jk-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-sm font-medium">{t('form.uploadDrop')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Consent */}
                <div className="flex items-start gap-3 mt-6">
                  <input type="checkbox" {...register('consent')} id="consent" className="mt-1 w-5 h-5 text-jk-royal-gold rounded border-gray-300 focus:ring-jk-royal-gold" />
                  <label htmlFor="consent" className="text-sm text-jk-text-muted dark:text-gray-400">
                    {t('form.consent')}
                  </label>
                </div>
                {errors.consent && <p className="text-red-500 text-xs mt-1 font-medium">{errors.consent.message}</p>}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full mt-8 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-5 rounded-xl text-lg shadow-lg hover:shadow-neon-green transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                       {t('form.loading')}
                    </span>
                  ) : (
                    <>
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                      {t('form.submit')}
                    </>
                  )}
                </button>

              </form>
            </div>
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
            title="Localisation Justine Kem's — Essos, Yaoundé"
          />
        </div>
      </section>

      <Toaster position="bottom-center" />
    </div>
  )
}
