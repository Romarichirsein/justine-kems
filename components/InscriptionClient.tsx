'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslations } from 'next-intl'

interface InscriptionClientProps {
  locale: string
}

export function InscriptionClient({ locale }: InscriptionClientProps) {
  const t = useTranslations('inscription')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = z.object({
    firstName: z.string().min(2, t('validation.firstName')),
    lastName: z.string().min(2, t('validation.lastName')),
    email: z.string().email(t('validation.email')),
    phone: z.string().regex(/^\+?[1-9]\d{8,14}$/, t('validation.phone')),
    training: z.string().min(1, t('validation.training')),
    level: z.string().min(1, t('validation.level')),
    motivations: z.string().min(20, t('validation.motivations')),
  })

  type FormData = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)

    const message = `${t('form.whatsappHeader')}\n\n` +
      `${t('form.whatsappCandidate', { name: `${data.firstName} ${data.lastName}` })}\n` +
      `${t('form.whatsappEmail', { email: data.email })}\n` +
      `${t('form.whatsappPhone', { phone: data.phone })}\n\n` +
      `${t('form.whatsappTraining', { training: data.training })}\n` +
      `${t('form.whatsappLevel', { level: data.level })}\n\n` +
      `${t('form.whatsappMotivations')}\n${data.motivations}`

    const whatsappUrl = `https://api.whatsapp.com/send?phone=237677463484&text=${encodeURIComponent(message)}`
    
    toast.success(t('form.redirection'))
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
      setIsSubmitting(false)
    }, 1500)
  }

  const trainings = t.raw('options.trainings') as string[]
  const levels = t.raw('options.levels') as string[]

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-script text-jk-imperial-green dark:text-jk-royal-gold mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-lg text-jk-text-muted dark:text-gray-300">
          {t('hero.subtitle')}
        </p>
      </div>

      <div className="bg-white dark:bg-jk-dark-surface p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-gold" />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          
          <div className="grid md:grid-cols-2 gap-6 text-jk-text-dark dark:text-jk-cream">
            <div>
              <label className="block text-sm font-medium mb-2">{t('form.firstName')}</label>
              <input {...register('firstName')} className="input-luxury" placeholder={t('form.firstNamePlaceholder')} />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('form.lastName')}</label>
              <input {...register('lastName')} className="input-luxury" placeholder={t('form.lastNamePlaceholder')} />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-jk-text-dark dark:text-jk-cream">
            <div>
              <label className="block text-sm font-medium mb-2">{t('form.email')}</label>
              <input type="email" {...register('email')} className="input-luxury" placeholder={t('form.emailPlaceholder')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('form.phone')}</label>
              <input {...register('phone')} className="input-luxury" placeholder={t('form.phonePlaceholder')} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-jk-text-dark dark:text-jk-cream">
            <div>
              <label className="block text-sm font-medium mb-2 text-jk-imperial-green dark:text-jk-royal-gold">
                {t('form.trainingLabel')}
              </label>
              <select {...register('training')} className="input-luxury">
                <option value="">{t('form.trainingPlaceholder')}</option>
                {trainings.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              {errors.training && <p className="text-red-500 text-xs mt-1">{errors.training.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-jk-imperial-green dark:text-jk-royal-gold">
                {t('form.levelLabel')}
              </label>
              <select {...register('level')} className="input-luxury">
                <option value="">{t('form.levelPlaceholder')}</option>
                {levels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
            </div>
          </div>

          <div className="text-jk-text-dark dark:text-jk-cream">
            <label className="block text-sm font-medium mb-2 text-jk-imperial-green dark:text-jk-royal-gold">
              {t('form.motivationsLabel')}
            </label>
            <textarea 
              {...register('motivations')} 
              rows={5} 
              className="input-luxury resize-y" 
              placeholder={t('form.motivationsPlaceholder')}
            />
            {errors.motivations && <p className="text-red-500 text-xs mt-1">{errors.motivations.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 bg-jk-imperial-green hover:bg-[#002a26] dark:bg-jk-royal-gold dark:hover:bg-jk-royal-gold-dark dark:text-black text-white font-bold py-5 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-70"
          >
            {isSubmitting ? t('form.submitting') : t('form.submit')}
          </button>
          <p className="text-center text-xs text-gray-500 mt-4">
            {t('form.footer')}
          </p>
        </form>
      </div>
      <Toaster />
    </div>
  )
}
