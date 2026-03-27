'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { client, urlForImage } from '@/sanity/client'

interface CatalogueProduct {
  _id: string
  name: string
  mainImage?: any
  category: string
  price?: number
  priceType?: 'fixed' | 'quote'
  priceH?: number
  priceF?: number
  gender?: 'femme' | 'homme' | 'couple' | null
}

interface CatalogueClientProps {
  products: CatalogueProduct[]
  locale: string
}

export function CatalogueClient({ products, locale }: CatalogueClientProps) {
  const t = useTranslations('catalogue')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeGender, setActiveGender] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<CatalogueProduct | null>(null)
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const CATEGORIES = [
    { id: 'all', label: t('filters.all') },
    { id: 'robes-mariage', label: t('modeles.filters.mariages' as any) || 'Robes de Mariages' },
    { id: 'robes-soirees', label: t('modeles.filters.soirees' as any) || 'Robes de Soirées' },
    { id: 'tenu-couple', label: t('modeles.filters.couple' as any) || 'Tenues de Couple' },
    { id: 'tenue-traditionnels', label: t('modeles.filters.traditionnels' as any) || 'Tenues Traditionnelles' },
    { id: 'etat-civil', label: t('modeles.filters.etat-civil' as any) || 'État Civil' },
    { id: 'tenue-ville', label: t('modeles.filters.ville' as any) || 'Tenues de Ville' },
  ]

  // Note: Since I don't have direct access to 'modeles' namespace easily here without nested hooks, 
  // I'll just use the labels from 'catalogue' if they exist or fallback.
  // Actually, I can use t('filters.all') etc.
  
  const GENDER_FILTERS = [
    { id: 'all', label: t('filters.genders.all') },
    { id: 'femme', label: t('filters.genders.femme') },
    { id: 'homme', label: t('filters.genders.homme') },
    { id: 'couple', label: t('filters.genders.couple') },
  ]

  const WHATSAPP_NUMBER = '237677463484'

  function getCategoryLabel(catId: string) {
    const map: Record<string, string> = {
      'robes-mariage': 'mariages',
      'robes-soirees': 'soirees',
      'tenu-couple': 'couple',
      'tenue-traditionnels': 'traditionnels',
      'etat-civil': 'etat-civil',
      'tenue-ville': 'ville',
    }
    const key = map[catId]
    if (!key) return catId
    // We can try to use a fallback or another t call if we have multiple namespaces
    return key
  }

  const filtered = products.filter((p) => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory
    const genMatch =
      activeGender === 'all' ||
      (activeGender === 'femme' && (p.gender === 'femme' || p.gender === 'couple')) ||
      (activeGender === 'homme' && (p.gender === 'homme' || p.gender === 'couple')) ||
      (activeGender === 'couple' && p.gender === 'couple')
    return catMatch && genMatch
  })

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct])

  const formatPrice = useCallback((n: number) => {
    return n.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US') + ' FCFA'
  }, [locale])

  const handleOrder = useCallback((product: CatalogueProduct) => {
    const genderText = product.gender === 'femme' ? t('card.femme') :
      product.gender === 'homme' ? t('card.homme') :
      product.gender === 'couple' ? t('card.couple') : ''
    
    // Use price label if available or format it
    const priceLabel = product.gender === 'couple' 
      ? `${t('card.femme')}: ${formatPrice(product.priceF || 0)} | ${t('card.homme')}: ${formatPrice(product.priceH || 0)}`
      : formatPrice(product.price || 0)

    const msg = encodeURIComponent(
      `${t('whatsapp.greeting')}\n\n${t('whatsapp.interest')}\n` +
      `${t('whatsapp.category', { cat: getCategoryLabel(product.category) })}\n` +
      `${genderText ? `${t('whatsapp.for', { gender: genderText })}\n` : ''}` +
      `${t('whatsapp.price', { price: priceLabel })}\n\n` +
      `${t('whatsapp.thanks')}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }, [t, locale, formatPrice])

  const handleImgError = useCallback((id: string) => {
    setImgErrors(prev => new Set(prev).add(id))
  }, [])

  function getCategoryEmoji(cat: string) {
    const map: Record<string, string> = {
      'robes-mariage': '💍',
      'robes-soirees': '✨',
      'tenu-couple': '💑',
      'tenue-traditionnels': '🌍',
      'etat-civil': '🎀',
      'tenue-ville': '🌆',
    }
    return map[cat] || '👗'
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10">
        <div className="bg-white dark:bg-jk-dark-surface rounded-2xl shadow-lg p-6 mb-10">
          <div className="mb-5">
            <p className="text-xs font-semibold text-jk-text-muted dark:text-gray-400 uppercase tracking-widest mb-3">
              {t('filters.category')}
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-jk-imperial-green text-jk-royal-gold shadow-md scale-105'
                      : 'bg-gray-100 dark:bg-jk-dark-bg text-jk-text-dark dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {cat.id !== 'all' ? `${getCategoryEmoji(cat.id)} ` : ''}{cat.label}
                  {cat.id !== 'all' && (
                    <span className="ml-1 text-xs opacity-60">
                      ({products.filter(p => p.category === cat.id).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-jk-text-muted dark:text-gray-400 uppercase tracking-widest mr-2">
              {t('filters.gender')}
            </p>
            {GENDER_FILTERS.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveGender(g.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeGender === g.id
                    ? 'bg-jk-royal-gold text-white shadow-md'
                    : 'bg-gray-100 dark:bg-jk-dark-bg text-jk-text-dark dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {g.label}
              </button>
            ))}
            <span className="ml-auto text-sm text-jk-text-muted dark:text-gray-400">
              {t('filters.results', { count: filtered.length, s: filtered.length > 1 ? 's' : '' })}
            </span>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-white dark:bg-jk-dark-surface rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-jk-royal-gold/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {imgErrors.has(product._id) || !product.mainImage ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-2">{getCategoryEmoji(product.category)}</span>
                      <span className="text-xs text-center px-2">{getCategoryLabel(product.category)}</span>
                    </div>
                  ) : (
                    <Image
                      src={urlForImage(product.mainImage).width(400).height(533).url()}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      onError={() => handleImgError(product._id)}
                    />
                  )}

                  {product.gender && (
                    <span className={`absolute top-2 left-2 ${
                      product.gender === 'femme' ? 'bg-pink-500' : 
                      product.gender === 'homme' ? 'bg-blue-600' : 'bg-purple-600'
                    } text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow`}>
                      {t(`card.${product.gender}` as any)}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-jk-imperial-green/0 group-hover:bg-jk-imperial-green/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-jk-royal-gold text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {t('card.viewDetail')}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-[11px] text-jk-text-muted dark:text-gray-400 truncate">
                    {getCategoryEmoji(product.category)} {getCategoryLabel(product.category)}
                  </p>
                  <p className="text-sm font-bold text-jk-royal-gold mt-0.5 leading-tight">
                    {product.gender === 'couple' ? (
                        <span className="text-[11px]">{formatPrice(product.priceF || 0)} / {formatPrice(product.priceH || 0)}</span>
                    ) : (
                      product.priceType === 'quote' ? t('modal.onQuote' as any) || 'Sur devis' : formatPrice(product.price || 0)
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-6xl mb-4">👗</p>
            <p className="text-2xl text-jk-text-muted dark:text-gray-400">
              {t('empty.catTitle')}
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-jk-dark-surface rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col md:flex-row"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative md:w-1/2 h-72 md:h-auto md:min-h-[400px] bg-gray-100 dark:bg-gray-800 shrink-0">
                {imgErrors.has(selectedProduct._id) || !selectedProduct.mainImage ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                     <span className="text-6xl mb-3">{getCategoryEmoji(selectedProduct.category)}</span>
                     <span className="text-sm">{getCategoryLabel(selectedProduct.category)}</span>
                   </div>
                ) : (
                  <Image src={urlForImage(selectedProduct.mainImage).url()} alt={selectedProduct.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
                )}
                {selectedProduct.gender && (
                   <span className={`absolute top-4 left-4 ${
                     selectedProduct.gender === 'femme' ? 'bg-pink-500' : 
                     selectedProduct.gender === 'homme' ? 'bg-blue-600' : 'bg-purple-600'
                   } text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg`}>
                     {t(`card.${selectedProduct.gender}` as any)}
                   </span>
                )}
              </div>

              <div className="flex flex-col justify-between p-8 md:w-1/2 overflow-y-auto">
                <div>
                  <p className="text-sm text-jk-text-muted dark:text-gray-400 mb-2 flex items-center gap-2">
                    <span className="text-xl">{getCategoryEmoji(selectedProduct.category)}</span>
                    {getCategoryLabel(selectedProduct.category)}
                  </p>
                  <h2 className="text-3xl font-display text-jk-imperial-green dark:text-jk-royal-gold mb-6">
                    {selectedProduct.gender === 'femme' ? t('modal.modelFemme') :
                     selectedProduct.gender === 'homme' ? t('modal.modelHomme') :
                     selectedProduct.gender === 'couple' ? t('modal.tenueCouple') :
                     t('modal.generic')}
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-jk-text-muted dark:text-gray-400 uppercase tracking-widest mb-2">
                      {t('modal.description')}
                    </h3>
                    <p className="text-jk-text-dark dark:text-gray-200 leading-relaxed">
                      {selectedProduct.gender === 'couple'
                        ? t('modal.descCouple')
                        : t('modal.descGeneric', { cat: selectedProduct.categoryLabel.toLowerCase() })
                      }
                    </p>
                  </div>

                  <div className="bg-jk-cream dark:bg-jk-dark-bg rounded-2xl p-5 mb-6">
                    <p className="text-xs font-semibold text-jk-text-muted dark:text-gray-400 uppercase tracking-widest mb-2">
                      {t('modal.price')}
                    </p>
                    {selectedProduct.gender === 'couple' ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-jk-text-dark dark:text-gray-300">👗 {t('card.femme')}</span>
                          <span className="text-xl font-bold text-jk-royal-gold">{formatPrice(selectedProduct.priceF || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-jk-text-dark dark:text-gray-300">👔 {t('card.homme')}</span>
                          <span className="text-xl font-bold text-jk-royal-gold">{formatPrice(selectedProduct.priceH || 0)}</span>
                        </div>
                        <div className="border-t border-jk-royal-gold/30 pt-1 flex items-center justify-between">
                          <span className="text-sm font-semibold text-jk-text-dark dark:text-gray-300">{t('modal.total')}</span>
                          <span className="text-2xl font-bold text-jk-imperial-green dark:text-jk-royal-gold">
                            {formatPrice((selectedProduct.priceF || 0) + (selectedProduct.priceH || 0))}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-4xl font-bold text-jk-imperial-green dark:text-jk-royal-gold">
                        {formatPrice(selectedProduct.price)}
                      </p>
                    )}
                    <p className="text-xs text-jk-text-muted dark:text-gray-500 mt-2">{t('modal.indicative')}</p>
                  </div>

                  <div className="space-y-2 mb-6 text-sm text-jk-text-dark dark:text-gray-300">
                    {(t.raw('modal.features') as string[]).map(item => <div key={item}>{item}</div>)}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOrder(selectedProduct)}
                  className="w-full bg-jk-imperial-green text-jk-royal-gold font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:bg-jk-imperial-green/90 transition-all text-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('modal.order')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
