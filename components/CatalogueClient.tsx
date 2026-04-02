'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { client, urlForImage } from '@/sanity/client'

interface CatalogueProduct {
  _id: string
  name: string
  images?: any[]
  mainImage?: any
  category: string
  price: number
  promoPrice?: number
  priceF?: number
  priceH?: number
  description?: string
  shortDescription?: string
  longDescription?: any
  stock?: number
  gender?: string
}

const parsePrices = (product: CatalogueProduct) => {
  const prices = {
    f: product.priceF || 0,
    h: product.priceH || 0,
    total: product.price || 0,
    hasBreakdown: false
  }

  // Si déjà renseigné dans Sanity
  if (prices.f > 0 || prices.h > 0) {
    prices.hasBreakdown = true
    if (prices.total === 0) prices.total = prices.f + prices.h
    return prices
  }

  // Sinon tenter de parser le nom ou la description (ex: 120000f/60000h)
  const sourceStr = `${product.name} ${product.shortDescription || ''}`
  const fMatch = sourceStr.match(/(\d+)\s*[fF](?![a-zA-Z])/);
  const hMatch = sourceStr.match(/(\d+)\s*[hH](?![a-zA-Z])/);

  if (fMatch) prices.f = parseInt(fMatch[1])
  if (hMatch) prices.h = parseInt(hMatch[1])

  if (fMatch || hMatch) {
    prices.hasBreakdown = true
    // Si on a les deux et pas de total, on somme
    if (fMatch && hMatch && prices.total <= (prices.f + prices.h)) {
        prices.total = prices.f + prices.h
    }
  }

  return prices
}

interface CatalogueClientProps {
  products: CatalogueProduct[]
  locale: string
}

export function CatalogueClient({ products, locale }: CatalogueClientProps) {
  const t = useTranslations('catalogue')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<CatalogueProduct | null>(null)
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const CATEGORIES = [
    { id: 'all', label: t('filters.all') },
    { id: 'robes-mariage', label: t('categories.robes-mariage') },
    { id: 'robes-soirees', label: t('categories.robes-soirees') },
    { id: 'tenu-couple', label: t('categories.tenu-couple') },
    { id: 'tenue-traditionnels', label: t('categories.tenue-traditionnels') },
    { id: 'etat-civil', label: t('categories.etat-civil') },
    { id: 'tenue-ville', label: t('categories.tenue-ville') },
  ]

  const WHATSAPP_NUMBER = '237677463484'

  function getCategoryEmoji(cat: string) {
    const map: Record<string, string> = {
      'robes-mariage': '👰',
      'robes-soirees': '👗',
      'tenu-couple': '👩‍❤️‍👨',
      'tenue-traditionnels': '🌍',
      'etat-civil': '💍',
      'tenue-ville': '👠',
    }
    return map[cat] || '✨'
  }

  function getCategoryLabel(catId: string) {
    const found = CATEGORIES.find(c => c.id === catId)
    return found ? found.label : catId
  }

  const formatPrice = useCallback((n: number) => {
    return n.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US') + ' FCFA'
  }, [locale])

  const handleOrder = useCallback((product: CatalogueProduct) => {
    const prices = parsePrices(product)
    let priceStr = formatPrice(prices.total)
    
    if (prices.hasBreakdown && (prices.f > 0 || prices.h > 0)) {
        let breakdown = ""
        if (prices.f > 0) breakdown += `\n- Femme: ${formatPrice(prices.f)}`
        if (prices.h > 0) breakdown += `\n- Homme: ${formatPrice(prices.h)}`
        priceStr += breakdown
    }

    const message = `${t('whatsapp.greeting')}\n\n${t('whatsapp.interest')} *${product.name}*\n${t('whatsapp.category', { cat: getCategoryLabel(product.category) })}\n${t('whatsapp.price', { price: priceStr })}\n\n${t('whatsapp.thanks')}`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }, [locale, formatPrice, t, getCategoryLabel])

  const filtered = products.filter((p) => {
    return activeCategory === 'all' || p.category === activeCategory
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
  }, [selectedProduct])

  const handleImgError = (id: string) => {
    setImgErrors(prev => new Set(prev).add(id))
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
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
          <div className="flex items-center justify-between">
            <span className="text-sm text-jk-text-muted dark:text-gray-400">
              {t('filters.results', { count: filtered.length, s: filtered.length > 1 ? 's' : '' })}
            </span>
          </div>
        </div>

        {/* Grid */}
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
                  {imgErrors.has(product._id) || (!product.images?.[0] && !product.mainImage) ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-2">{getCategoryEmoji(product.category)}</span>
                      <span className="text-xs text-center px-2">{getCategoryLabel(product.category)}</span>
                    </div>
                  ) : (
                    <Image
                      src={urlForImage(product.mainImage || product.images![0]).width(400).height(533).url()}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      onError={() => handleImgError(product._id)}
                    />
                  )}

                  {product.promoPrice && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      PROMO
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
                  <h3 className="text-sm font-bold text-jk-imperial-green dark:text-white truncate mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-jk-royal-gold leading-tight">
                    {product.promoPrice ? (
                      <span className="flex flex-col">
                        <span className="text-xs line-through text-gray-500 opacity-70">{formatPrice(product.price)}</span>
                        <span>{formatPrice(product.promoPrice)}</span>
                      </span>
                    ) : (
                      formatPrice(product.price)
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
              {t('noResults')}
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Left Column: Image */}
              <div className="relative md:w-1/2 h-72 md:h-auto bg-gray-100 dark:bg-gray-800 shrink-0">
                {selectedProduct.mainImage || (selectedProduct.images && selectedProduct.images.length > 0) ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={urlForImage(selectedProduct.mainImage || selectedProduct.images![0]).url()} 
                      alt={selectedProduct.name} 
                      fill 
                      className="object-contain md:object-cover" 
                      sizes="(max-width: 768px) 100vw, 50vw" 
                      priority 
                    />
                    {(selectedProduct.images?.length || 0) > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {selectedProduct.images!.map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-jk-royal-gold' : 'bg-white/50'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                     <span className="text-6xl mb-3">{getCategoryEmoji(selectedProduct.category)}</span>
                     <span className="text-sm">{getCategoryLabel(selectedProduct.category)}</span>
                   </div>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="flex flex-col justify-between p-8 md:w-1/2 overflow-y-auto">
                <div>
                  <p className="text-sm text-jk-text-muted dark:text-gray-400 mb-2 flex items-center gap-2">
                    <span className="text-xl">{getCategoryEmoji(selectedProduct.category)}</span>
                    {getCategoryLabel(selectedProduct.category)}
                  </p>
                  <h2 className="text-3xl font-display text-jk-imperial-green dark:text-jk-royal-gold mb-4 leading-tight">
                    {selectedProduct.category === 'tenu-couple' ? t('modal.tenueCouple') : selectedProduct.name}
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-jk-text-muted dark:text-gray-400 uppercase tracking-widest mb-2">
                      {t('modal.description')}
                    </h3>
                    <div className="text-jk-text-dark dark:text-gray-200 leading-relaxed text-sm">
                      {selectedProduct.description || selectedProduct.shortDescription || selectedProduct.longDescription ? (
                        <p>{selectedProduct.description || selectedProduct.shortDescription || selectedProduct.longDescription}</p>
                      ) : (
                        <p>{selectedProduct.category === 'tenu-couple' ? t('modal.descCouple') : t('modal.descGeneric', { cat: getCategoryLabel(selectedProduct.category) })}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-jk-cream/50 dark:bg-jk-dark-bg/50 rounded-2xl p-5 mb-6 border border-jk-royal-gold/10">
                    <p className="text-xs font-semibold text-jk-text-muted dark:text-gray-400 uppercase tracking-widest mb-3">
                      {t('modal.price')}
                    </p>
                    {(() => {
                      const prices = parsePrices(selectedProduct)
                      if (prices.hasBreakdown && (prices.f > 0 || prices.h > 0)) {
                        return (
                          <div className="space-y-2">
                            {prices.f > 0 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2">👗 {t('card.femme')}</span>
                                <span className="font-semibold text-jk-imperial-green/80 dark:text-jk-royal-gold/80">{formatPrice(prices.f)}</span>
                              </div>
                            )}
                            {prices.h > 0 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2">👔 {t('card.homme')}</span>
                                <span className="font-semibold text-jk-imperial-green/80 dark:text-jk-royal-gold/80">{formatPrice(prices.h)}</span>
                              </div>
                            )}
                            <div className="pt-2 border-t border-jk-royal-gold/20 flex justify-between items-center">
                              <span className="font-bold text-jk-imperial-green dark:text-jk-royal-gold">{t('modal.total')}</span>
                              <span className="text-xl font-bold text-jk-imperial-green dark:text-jk-royal-gold">{formatPrice(prices.total)}</span>
                            </div>
                          </div>
                        )
                      }
                      return (
                        <div className="flex items-baseline gap-3">
                          {selectedProduct.promoPrice ? (
                            <>
                              <span className="text-3xl font-bold text-jk-imperial-green dark:text-jk-royal-gold">{formatPrice(selectedProduct.promoPrice)}</span>
                              <span className="text-lg line-through text-gray-500 opacity-70">{formatPrice(prices.total)}</span>
                            </>
                          ) : (
                            <p className="text-3xl font-bold text-jk-imperial-green dark:text-jk-royal-gold">
                              {formatPrice(prices.total)}
                            </p>
                          )}
                        </div>
                      )
                    })()}
                    <p className="text-[10px] text-jk-text-muted mt-3 italic">
                      {t('modal.indicative')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                     {t.raw('modal.features') && Array.isArray(t.raw('modal.features')) && t.raw('modal.features').map((f: string, i: number) => (
                       <div key={i} className="flex items-center gap-2 text-[11px] text-jk-text-dark/70 dark:text-gray-300">
                         <span>{f}</span>
                       </div>
                     ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOrder(selectedProduct)}
                  className="w-full bg-[#075e54] hover:bg-[#128c7e] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all text-lg"
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
