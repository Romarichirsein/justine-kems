'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Veuillez entrer une adresse email valide.')
      return
    }
    
    setStatus('loading')
    setErrorMsg('')
    
    // Simulate API call (replace with your actual newsletter API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMsg('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-jk-imperial-green via-[#0C2016] to-jk-black">
      {/* Decorative radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-jk-royal-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-5 bg-[url('/pattern-baroque.svg')] bg-repeat pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full border border-jk-royal-gold/30 flex items-center justify-center bg-jk-royal-gold/10">
            <svg className="w-7 h-7 text-jk-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <p className="text-jk-royal-gold uppercase text-xs tracking-[4px] font-bold mb-3">Exclusivités & Coulisses</p>
        <h2 className="text-3xl md:text-4xl font-script text-jk-cream mb-4">
          Restez dans l&apos;univers Justine Kem&apos;s
        </h2>
        <p className="text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto">
          Recevez en avant-première nos nouvelles collections, conseils mode et offres exclusives — aucun spam, promis ✦
        </p>

        {/* Form */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-jk-royal-gold/10 border border-jk-royal-gold/30 rounded-2xl p-8"
            >
              <div className="text-4xl mb-3">✦</div>
              <h3 className="text-jk-royal-gold font-display text-xl mb-2">Bienvenue dans notre cercle !</h3>
              <p className="text-gray-400 text-sm">Vous recevrez bientôt nos exclusivités dans votre boîte mail.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg('') }}
                  placeholder="votre@email.com"
                  className={`w-full px-5 py-4 rounded-full bg-white/8 border ${errorMsg ? 'border-red-500/50' : 'border-white/10 focus:border-jk-royal-gold/50'} text-white placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-jk-royal-gold/20 text-sm text-center sm:text-left`}
                  disabled={status === 'loading'}
                />
                <AnimatePresence>
                  {errorMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-2 ml-4 text-left"
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 rounded-full bg-jk-royal-gold text-jk-black font-bold text-sm hover:bg-jk-royal-gold-dark transition-all hover:scale-105 shadow-lg shadow-jk-royal-gold/20 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Envoi…
                  </span>
                ) : (
                  'Je m\'abonne'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Trust */}
        <p className="text-gray-600 text-xs mt-6">
          🔒 Vos données sont protégées • Désabonnement en 1 clic
        </p>
      </div>
    </section>
  )
}
