'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

// ── Types ──────────────────────────────────────────────────────────────────
interface Model {
  id: string
  filename: string
  src: string
  category: string
  priceH: number | null
  priceF: number | null
  price: number | null
}

interface CartItem extends Model {
  quantity: number
  gender?: 'h' | 'f'
}

interface CatalogClientProps {
  initialModels: Model[]
  locale: string
}

export function CatalogClient({ initialModels, locale }: CatalogClientProps) {
  const t = useTranslations('modeles')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [genderChoice, setGenderChoice] = useState<'h' | 'f'>('f')
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const CATEGORIES = [
    { key: 'all', label: t('filters.all') },
    { key: 'mariages', label: t('filters.mariages') },
    { key: 'soirees', label: t('filters.soirees') },
    { key: 'couple', label: t('filters.couple') },
    { key: 'traditionnels', label: t('filters.traditionnels') },
    { key: 'etat-civil', label: t('filters.etat-civil') },
    { key: 'ville', label: t('filters.ville') },
  ]

  const filtered = useMemo(() =>
    activeCategory === 'all' ? initialModels : initialModels.filter(m => m.category === activeCategory),
    [activeCategory, initialModels]
  )

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => {
    if (i.priceH !== null && i.priceF !== null) {
      return s + (i.gender === 'h' ? i.priceH : i.priceF) * i.quantity
    }
    return s + (i.price ?? 0) * i.quantity
  }, 0)

  function formatPrice(price: number): string {
    return price.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US') + ' FCFA'
  }

  function addToCart(model: Model, gender?: 'h' | 'f') {
    setCart(prev => {
      const key = `${model.id}-${gender ?? ''}`
      const exist = prev.find(c => c.id === model.id && c.gender === gender)
      if (exist) return prev.map(c => c.id === model.id && c.gender === gender ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { ...model, quantity: 1, gender }]
    })
    setSelectedModel(null)
    setShowCart(true)
  }

  function removeFromCart(id: string, gender?: 'h' | 'f') {
    setCart(prev => prev.filter(c => !(c.id === id && c.gender === gender)))
  }

  function getWhatsAppOrderMessage() {
    if (cart.length === 0) return ''
    let msg = t('whatsapp.orderTitle') + '\n\n'
    cart.forEach(item => {
      const catLabel = CATEGORIES.find(c => c.key === item.category)?.label ?? item.category
      let priceInfo = ''
      if (item.priceH !== null && item.priceF !== null) {
        priceInfo = item.gender === 'h' ? `${t('modal.man')}: ${formatPrice(item.priceH)}` : `${t('modal.woman')}: ${formatPrice(item.priceF)}`
      } else {
        priceInfo = formatPrice(item.price ?? 0)
      }
      msg += `• *${catLabel}* - ${item.filename.replace(/\.[^.]+$/, '')} (${priceInfo}) x${item.quantity}\n`
    })
    msg += `\n` + t('whatsapp.orderTotal', { total: formatPrice(cartTotal) }) + `\n\n` + t('whatsapp.orderThanks')
    return encodeURIComponent(msg)
  }

  function getWhatsAppModelMessage(model: Model) {
    const catLabel = CATEGORIES.find(c => c.key === model.category)?.label ?? model.category
    let priceInfo = ''
    if (model.priceH !== null && model.priceF !== null) {
      priceInfo = `${t('modal.man')}: ${formatPrice(model.priceH)} / ${t('modal.woman')}: ${formatPrice(model.priceF)}`
    } else {
      priceInfo = formatPrice(model.price ?? 0)
    }
    const msg = t('whatsapp.singleInterest', { cat: catLabel, price: priceInfo })
    return encodeURIComponent(msg)
  }

  const WA_NUMBER = '237677463484'

  return (
    <>
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <p className="text-white/40 text-sm mb-6">{t('controls.results', { count: filtered.length })}</p>
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {filtered.map(model => (
            <ModelCard
              key={model.id}
              model={model}
              onSelect={() => setSelectedModel(model)}
              hasError={imgErrors.has(model.id)}
              onError={() => setImgErrors(prev => new Set([...prev, model.id]))}
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
          onClose={() => setSelectedModel(null)}
          onAddToCart={addToCart}
          genderChoice={genderChoice}
          setGenderChoice={setGenderChoice}
          waNumber={WA_NUMBER}
          getWhatsAppMessage={getWhatsAppModelMessage}
          formatPrice={formatPrice}
          categories={CATEGORIES}
          t={t}
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
    if (model.priceH !== null && model.priceF !== null) {
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
      {hasError ? (
        <div className="aspect-[3/4] flex items-center justify-center text-white/20 text-xs p-4 text-center bg-[#111]">
          {notAvailableLabel}
        </div>
      ) : (
        <div className="relative">
          <Image
            src={model.src}
            alt={label}
            width={400}
            height={600}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={onError}
            unoptimized
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

function ModelModal({ model, onClose, onAddToCart, genderChoice, setGenderChoice, waNumber, getWhatsAppMessage, formatPrice, categories, t }: any) {
  const isCouple = model.priceH !== null && model.priceF !== null
  const displayPrice = isCouple
    ? (genderChoice === 'h' ? formatPrice(model.priceH!) : formatPrice(model.priceF!))
    : formatPrice(model.price ?? 0)
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
          <Image src={model.src} alt={catLabel} fill className="object-contain" unoptimized />
        </div>

        <div className="p-5 space-y-4">
          {isCouple && (
            <div>
              <p className="text-white/50 text-xs mb-2">{t('modal.selectOutfit')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setGenderChoice('h')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${genderChoice === 'h' ? 'bg-[#c9a96e] text-black' : 'bg-white/10 text-white'}`}
                >
                  {t('modal.man')} — {formatPrice(model.priceH!)}
                </button>
                <button
                  onClick={() => setGenderChoice('f')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${genderChoice === 'f' ? 'bg-[#c9a96e] text-black' : 'bg-white/10 text-white'}`}
                >
                  {t('modal.woman')} — {formatPrice(model.priceF!)}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#c9a96e]">{displayPrice}</span>
            <span className="text-white/30 text-sm">{t('modal.bespoke')}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <p className="text-white/70 text-sm leading-relaxed">
              {t('modal.desc')}
            </p>
            <ul className="text-white/50 text-xs space-y-1">
              {features.map((f: string, i: number) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onAddToCart(model, isCouple ? genderChoice : undefined)}
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
            const itemPrice = item.priceH !== null && item.priceF !== null
              ? (item.gender === 'h' ? item.priceH : item.priceF)
              : (item.price ?? 0)
            return (
              <div key={`${item.id}-${item.gender}`} className="flex gap-3 bg-white/5 rounded-xl p-3">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#0a0a0a]">
                  <Image src={item.src} alt={catLabel} fill className="object-cover" unoptimized />
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
                  onClick={() => onRemove(item.id, item.gender)}
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
