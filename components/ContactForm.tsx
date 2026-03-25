'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

export function ContactForm() {
  const t = useTranslations('contact')
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactSchema = z.object({
    name: z.string().min(2, t('form.validation.nameRequired')),
    email: z.string().email(t('form.validation.emailInvalid')),
    phone: z.string().regex(/^\+?[1-9]\d{8,14}$/, t('form.validation.phoneInvalid')),
    subject: z.string().min(1, t('form.validation.subjectRequired')),
    message: z.string().min(20, t('form.validation.messageMin')),
    consent: z.literal(true, {
      errorMap: () => ({ message: t('form.validation.consentRequired') }),
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
  )
}
