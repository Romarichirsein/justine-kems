'use client'

import { useState, useMemo, useEffect, Suspense, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { client, urlForImage } from '@/sanity/client'
import { productSlug } from '@/lib/slugify'
import { SanityImage } from '@/components/SanityImage'
import { PortableText } from '@portabletext/react'

// ── Types ──────────────────────────────────────────────────────────────────
interface Model {
  _id: string
  name: string
  reference?: string
  slug?: string
  mainImage?: any
  gallery?: any[]
  description?: any // Portable Text
  category: string
  price?: number
  priceH?: number   // prix homme (tenues couple)
  priceF?: number   // prix femme (tenues couple)
  gender?: 'h' | 'f'
  isAvailable?: boolean
}

interface CartItem extends Model {
  quantity: number
}

interface CatalogClientProps {
  initialModels: Model[]
  locale: string
}

export function CatalogClient(props: CatalogClientProps) {
  return (
    <Suspense fallback={<div className="container mx-auto py-20 text-center opacity-50 text-white">Chargement...</div>}>
      <CatalogContent {...props} />
    </Suspense>
  )
}

function CatalogContent({ initialModels, locale }: CatalogClientProps) {
  const t = useTranslations('modeles')
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all')
  
  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam)
  }, [categoryParam])

  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [genderChoice, setGenderChoice] = useState<'h' | 'f'>('f')
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('default')

  const handleOpenModel = (model: Model) => {
    setSelectedModel(model)
    const slug = productSlug(model.name, model.reference)
    window.history.pushState(null, '', `/${locale}/catalogue/${slug}`)
  }

  const handleCloseModel = () => {
    setSelectedModel(null)
    window.history.pushState(null, '', `/${locale}/modeles`)
  }

  const CATEGORIES = [
    { key: 'all', label: t('filters.all') },
    { key: 'robes-mariage', label: t('filters.robes-mariage') },
    { key: 'robes-soirees', label: t('filters.robes-soirees') },
    { key: 'tenu-couple', label: t('filters.tenu-couple') },
    { key: 'tenue-traditionnels', label: t('filters.tenue-traditionnels') },
    { key: 'etat-civil', label: t('filters.etat-civil') },
    { key: 'tenue-ville', label: t('filters.tenue-ville') },
  ]

  const filtered = useMemo(() => {
    let result = initialModels.filter((m) => {
      const matchesCategory = activeCategory === 'all' || m.category === activeCategory
      
      const displayName = m.name ? m.name.toLowerCase() : ''
      const displayRef = m.reference ? m.reference.toLowerCase() : ''
      const catLabel = CATEGORIES.find(c => c.key === m.category)?.label ?? m.category
      const displayCategory = catLabel.toLowerCase()
      const search = searchTerm.toLowerCase().trim()
      
      const matchesSearch = !search ||
        displayName.includes(search) ||
        displayRef.includes(search) ||
        displayCategory.includes(search)
        
      return matchesCategory && matchesSearch
    })

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => {
        const priceA = a.price ?? 0
        const priceB = b.price ?? 0
        return priceA - priceB
      })
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => {
        const priceA = a.price ?? 0
        const priceB = b.price ?? 0
        return priceB - priceA
      })
    }

    return result
  }, [initialModels, activeCategory, searchTerm, sortBy, CATEGORIES])

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0)

  function formatPrice(price: number): string {
    return price.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US') + ' FCFA'
  }

  function addToCart(model: Model) {
    setCart(prev => {
      const exist = prev.find(c => c._id === model._id)
      if (exist) return prev.map(c => c._id === model._id ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { ...model, quantity: 1 }]
    })
    handleCloseModel()
    setShowCart(true)
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(c => c._id !== id))
  }

  function getWhatsAppOrderMessage() {
    if (cart.length === 0) return ''
    let msg = t('whatsapp.orderTitle') + '\n\n'
    cart.forEach(item => {
      const catLabel = CATEGORIES.find(c => c.key === item.category)?.label ?? item.category
      let priceInfo = ''
      if (item.priceH != null && item.priceF != null && item.category === 'couple') {
        priceInfo = item.gender === 'h' ? `${t('modal.man')}: ${formatPrice(item.priceH ?? 0)}` : `${t('modal.woman')}: ${formatPrice(item.priceF ?? 0)}`
      } else {
        priceInfo = formatPrice(item.price ?? 0)
      }
      const itemNameWithRef = item.reference ? `${item.name} #${item.reference}` : (item.name || item._id)
      const slug = productSlug(item.name, item.reference)
      const itemUrl = `https://www.justinekems.com/${locale}/catalogue/${slug}`
      msg += `• *${catLabel}* - ${itemNameWithRef} (${priceInfo}) x${item.quantity}\n  Lien: ${itemUrl}\n`
    })
    msg += `\n` + t('whatsapp.orderTotal', { total: formatPrice(cartTotal) }) + `\n\n` + t('whatsapp.orderThanks')
    return encodeURIComponent(msg)
  }

  function getWhatsAppModelMessage(model: Model) {
    const catLabel = CATEGORIES.find(c => c.key === model.category)?.label ?? model.category
    const priceInfo = formatPrice(model.price ?? 0)
    const modelNameWithRef = model.reference ? `${model.name} #${model.reference}` : model.name
    const msg = `Bonjour ! Je suis intéressé(e) par le modèle *${modelNameWithRef}* de votre collection *${catLabel}* (${priceInfo}). Pouvez-vous me donner plus d'informations ?`
    return encodeURIComponent(msg)
  }

  const WA_NUMBER = '237677463484'

  return (
    <>
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 py-3">
        <div className="container mx-auto px-4 space-y-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                  activeCategory === cat.key
                    ? 'bg-[#c9a96e] text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-white/5">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={locale === 'fr' ? 'Rechercher un modèle par nom ou numéro (ex: 001)...' : 'Search model by name or number (ex: 001)...'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/50 focus:border-[#c9a96e] transition-all text-sm"
                />
                <svg className="absolute left-3.5 top-3 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-2.5 text-white/40 hover:text-white text-xl"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/50 focus:border-[#c9a96e] transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="default" className="bg-[#111]">{locale === 'fr' ? 'Trier par défaut' : 'Sort by default'}</option>
                <option value="price-asc" className="bg-[#111]">{locale === 'fr' ? 'Prix : du - cher au + cher' : 'Price: Low to High'}</option>
                <option value="price-desc" className="bg-[#111]">{locale === 'fr' ? 'Prix : du + cher au - cher' : 'Price: High to Low'}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <p className="text-white/40 text-sm mb-6">{t('controls.results', { count: filtered.length })}</p>
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {filtered.map(model => (
            <ModelCard
              key={model._id}
              model={model}
              onSelect={() => handleOpenModel(model)}
              hasError={imgErrors.has(model._id)}
              onError={() => setImgErrors(prev => {
                const next = new Set(prev)
                next.add(model._id)
                return next
              })}
              formatPrice={formatPrice}
              viewDetailLabel={t('controls.viewDetail')}
              notAvailableLabel={t('controls.notAvailable')}
              manLabel={t('modal.man')}
              womanLabel={t('modal.woman')}
            />
          ))}
        </div>
      </div>

      {cartCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#c9a96e] text-black rounded-full px-5 py-3 font-semibold shadow-2xl flex items-center gap-2 hover:bg-[#b8944f] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{cartCount}</span>
          <span className="hidden sm:inline">— {formatPrice(cartTotal)}</span>
        </button>
      )}

      {selectedModel && (
        <ModelModal
          model={selectedModel}
          onClose={() => handleCloseModel()}
          onAddToCart={addToCart}
          genderChoice={genderChoice}
          setGenderChoice={setGenderChoice}
          waNumber={WA_NUMBER}
          getWhatsAppMessage={getWhatsAppModelMessage}
          formatPrice={formatPrice}
          categories={CATEGORIES}
          t={t}
          locale={locale}
        />
      )}

      {showCart && (
        <CartPanel
          items={cart}
          total={cartTotal}
          waNumber={WA_NUMBER}
          whatsAppMsg={getWhatsAppOrderMessage()}
          onRemove={removeFromCart}
          onClose={() => setShowCart(false)}
          formatPrice={formatPrice}
          categories={CATEGORIES}
          t={t}
        />
      )}
    </>
  )
}

function ModelCard({ model, onSelect, hasError, onError, formatPrice, viewDetailLabel, notAvailableLabel, manLabel, womanLabel }: any) {
  const label = (() => {
    if (model.priceH != null && model.priceF != null && model.category === 'tenu-couple') {
      return `H: ${formatPrice(model.priceH)} / F: ${formatPrice(model.priceF)}`
    }
    if (model.price) return formatPrice(model.price)
    return ''
  })()

  return (
    <div
      className="break-inside-avoid mb-3 group relative cursor-pointer rounded-lg overflow-hidden bg-[#111]"
      onClick={onSelect}
    >
      {hasError || !model.mainImage ? (
        <div className="aspect-[3/4] flex items-center justify-center text-white/20 text-xs p-4 text-center bg-[#111]">
          {notAvailableLabel}
        </div>
      ) : (
        <div className="relative">
          <SanityImage
            asset={model.mainImage}
            alt={model.reference ? `${model.name} #${model.reference}` : (model.name || label)}
            width={400}
            height={600}
            className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-3">
            <span className="text-white text-xs font-medium text-center">{viewDetailLabel}</span>
          </div>
        </div>
      )}
      {label && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-[#c9a96e] text-xs font-semibold text-center leading-tight">{label}</p>
        </div>
      )}
    </div>
  )
}

function ModelModal({ model, onClose, onAddToCart, waNumber, getWhatsAppMessage, formatPrice, categories, t, locale }: any) {
  const displayPrice = model.price ? formatPrice(model.price) : (t('modal.onQuote' as any) || 'Sur devis')
  const catLabel = categories.find((c: any) => c.key === model.category)?.label ?? model.category

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const features = t.raw('modal.features') as string[]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-[#c9a96e] text-sm uppercase tracking-widest">{catLabel}</span>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none">{t('modal.close')}</button>
        </div>

        <div className="relative aspect-[3/4] bg-[#0a0a0a]">
          {model.mainImage && (
            <SanityImage asset={model.mainImage} alt={model.name || catLabel} fill className="object-contain" />
          )}
        </div>

        <div className="p-5 space-y-4">
          <h2 className="text-2xl font-serif text-white">
            {model.name}{model.reference ? ` #${model.reference}` : ''}
          </h2>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#c9a96e]">{displayPrice}</span>
            <span className="text-white/30 text-sm">{t('modal.bespoke')}</span>
          </div>
          <p className="text-xs font-semibold text-[#c9a96e] mt-1 flex items-center gap-1.5">
            ✨ {locale === 'fr' ? 'Accessoires y compris' : 'Accessories included'}
          </p>

          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            {model.description && (
              <div className="text-white/70 text-sm leading-relaxed mb-4">
                <PortableText value={model.description} />
              </div>
            )}
            <ul className="text-white/50 text-xs space-y-1">
              {features.map((f: string, i: number) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onAddToCart(model)}
              className="w-full bg-[#c9a96e] text-black font-semibold py-3 rounded-xl hover:bg-[#b8944f] transition-all"
            >
              {t('modal.addToCart')}
            </button>
            <a
              href={`https://wa.me/${waNumber}?text=${getWhatsAppMessage(model)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl hover:bg-[#1ebe5d] transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('modal.orderWhatsapp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartPanel({ items, total, waNumber, whatsAppMsg, onRemove, onClose, formatPrice, categories, t }: any) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-black/60 absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#111] border-l border-white/10 h-full flex flex-col shadow-2xl z-10">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold">{t('cart.title')}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-white/40 text-center py-10">{t('cart.empty')}</p>
          ) : items.map((item: any) => {
            const catLabel = categories.find((c: any) => c.key === item.category)?.label ?? item.category
            const itemPrice = item.price ?? 0
            return (
              <div key={`${item._id}-${item.gender}`} className="flex gap-3 bg-white/5 rounded-xl p-3">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#0a0a0a]">
                  {item.mainImage && (
                    <SanityImage asset={item.mainImage} alt={item.name || catLabel} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-medium truncate">{catLabel}</p>
                  {item.gender && (
                    <p className="text-white/40 text-xs">{item.gender === 'h' ? t('modal.man') : t('modal.woman')}</p>
                  )}
                  <p className="text-[#c9a96e] text-sm font-bold mt-1">{formatPrice(itemPrice)}</p>
                  <p className="text-white/30 text-xs">{t('cart.items', { count: item.quantity })}</p>
                </div>
                <button
                  onClick={() => onRemove(item._id, item.gender)}
                  className="text-white/30 hover:text-red-400 transition-colors self-start"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60">{t('cart.total')}</span>
              <span className="text-[#c9a96e] text-xl font-bold">{formatPrice(total)}</span>
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=${whatsAppMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1ebe5d] transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('cart.sendOrder')}
            </a>
            <p className="text-white/30 text-xs text-center">{t('cart.footerNote')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
