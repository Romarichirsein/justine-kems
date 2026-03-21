'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────────
interface Model {
  id: string
  filename: string
  src: string
  category: string
  priceH: number | null
  priceF: number | null
  price: number | null // pour les non-couple
}

interface CartItem extends Model {
  quantity: number
  gender?: 'h' | 'f'
}

// ── Données catalogue ────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'all', label: 'Tout voir' },
  { key: 'mariages', label: 'Robes de Mariages' },
  { key: 'soirees', label: 'Robes de Soirées' },
  { key: 'couple', label: 'Tenues de Couple' },
  { key: 'traditionnels', label: 'Tenues Traditionnelles' },
  { key: 'etat-civil', label: 'État Civil' },
  { key: 'ville', label: 'Tenues de Ville' },
]

// Extraire prix depuis nom de fichier
function parsePrice(filename: string): { price: number | null; priceH: number | null; priceF: number | null } {
  const name = filename.replace(/\.[^.]+$/, '') // enlever extension
  
  // Format couple : h120.000 ; f250.000 (ou variantes)
  const coupleMatch = name.match(/h([\d]+[\.,]?[\d]*)[^hf]*f\s*([\d]+[\.,]?[\d]*)/i)
  if (coupleMatch) {
    const priceH = parseInt(coupleMatch[1].replace(/[.,]/g, ''))
    const priceF = parseInt(coupleMatch[2].replace(/[.,]/g, ''))
    return { price: null, priceH, priceF }
  }
  // Format couple alternatif : 75000; f160.000
  const altCouple = name.match(/^([\d]+[\.,]?[\d]*)\s*[;:]\s*f\s*([\d]+[\.,]?[\d]*)/i)
  if (altCouple) {
    return { price: null, priceH: parseInt(altCouple[1].replace(/[.,]/g, '')), priceF: parseInt(altCouple[2].replace(/[.,]/g, '')) }
  }

  // Format simple : 120.000 ou 120000
  const simpleMatch = name.match(/^([\d]+[\.,]?[\d]*)/)
  if (simpleMatch) {
    return { price: parseInt(simpleMatch[1].replace(/[.,]/g, '')), priceH: null, priceF: null }
  }
  
  return { price: null, priceH: null, priceF: null }
}

function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR') + ' FCFA'
}

// Générer lista models par catégorie
function buildModels(): Model[] {
  const catalog: { folder: string; category: string; files: string[] }[] = [
    {
      folder: 'Robes de mariages',
      category: 'mariages',
      files: [
        '150.000.jpeg','150.000cc.jpg','200.000dd.jpg','200.000e.jpg','220.000 VC.jpg',
        '250.000 C.jpg','250.000 X.jpg','250.000 p.jpg','250.000S.jpg','250.000c.jpg',
        '250.000e.jpg','250.000f.jpg','250.000jk.jpg','250.000xv.jpg','300.000 Q.jpg',
        '300.000 v.jpg','300.000L.jpg','300.000a.jpeg','300.000b.jpeg','300.000c.jpeg',
        '300.000d.jpg','300.000e.jpg','300.000g.jpg','350.000 FG.jpg','350.000 Q.jpg',
        '350.000 SA.jpg','350.000 XX.jpg','350.000 k.jpg','350.000VVC.jpg','350.000Z.jpg',
        '350.000a.jpeg','350.000b.jpg','350.000fg.jpg','350.000xxx.jpg','400.000 XXX.jpg',
        '400.000.jpg','400.000aa.jpg','400.000c.jpg','400.000j.jpg','400.000x.jpg',
        '400.000xx.jpg','450.000 x.jpg','450.000.jpg','450.000xy.jpg','500.000 o.jpg',
        '500.000.jpg','500.000c.jpg','500.000y.jpg','600.000.jpg','700.000.jpg',
        '700.000a.jpg','750.000.jpg','800.000.jpg',
      ],
    },
    {
      folder: 'Robes de soirées',
      category: 'soirees',
      files: [
        '100.000.jpg','1000162800.jpg','120.000.jpg','120.000XXC.jpg','120.000a.jpg',
        '120.000ac.jpg','120.000ad.jpg','120.000as.jpg','120.000d.jpg','120.000e.jpg',
        '120.000ea.jpg','120.000ee.jpg','120.000g.jpg','150.000 c.jpg','150.000.jpeg',
        '150.000.jpg','150.000c.jpg','150.000d.jpg','150.000e.jpeg','170.000 T.jpg',
        '170.000 c.jpg','180.000 Q.jpg','180.000.jpg','200.000 C.jpg','200.000 SA.jpg',
        '200.000 U.jpg','200.000A.jpg','200.000f.jpg','200.000h.jpg','200.000j.jpg',
        '225.000.jpg','250.000 M.jpg','250.000 SE.jpg','250.000a.jpg','250.000b.jpg',
        '250.000bb.jpg','250.000c.jpeg','250.000d.jpg','250.000e.jpg','250.000f.jpg',
        '250.000g.jpg','250.000j.jpg','250.000yy.jpg','300.000 a.jpg','300.000 x.jpg',
        '300.000a.jpeg','300.000cc.jpg','300.000f.jpg','300.000m.jpg','300.000xx.jpg',
        '300.000xxy.jpg','300.000xy.jpg','350.000e.jpg','350.000g.jpg','450.000wq.jpg',
        '50.000 zs.jpg','50.000ww.jpg','550.000.jpeg','550.000L.jpg','60.000 LO.jpg',
        '75.000 P.jpg','75.000 R.jpg','75.000 T.jpg','75.000.jpg','80.000.jpeg',
      ],
    },
    {
      folder: 'Tenu de couple',
      category: 'couple',
      files: [
        '2025083116271664.png','75000; f160.000.jpg','f300.000; h160.000.jpg',
        'h120.000 ; f250.000.jpg','h120.000 ; f60.000.jpg','h120.000;; f140.000.jpg',
        'h120.000;;; f 160.000.jpg','h120.000;;; f180.000.jpg','h130.000 \'\' f275.000.jpg',
        'h130.000 ; f150.000.jpg','h130.000 ; f200.000.jpeg','h130.000 ; f330.000.jpg',
        'h140.000 ! f210.000.jpg','h140.000 ! f250.000.jpg','h140.000 ; f180.000.jpeg',
        'h140.000 ; f250.000.jpg','h140.000 ; f300.000.jpeg','h140.000; f230.000.jpg',
        'h150.000 ; f350.000.jpg','h150.000;; f350.000.jpg','h160.000 ; f 380.000.jpg',
        'h160.000 ; f330.000.jpg','h160.000; f380.000.jpg','h170.000; f300.000.jpg',
        'h60.000 ; f120.000.jpg','h60.000;f 120.000.jpg','h80.000 ; f 200.000.jpg',
      ],
    },
    {
      folder: 'Tenue traditionnels',
      category: 'traditionnels',
      files: [
        '120.000aw.jpg','150.000 X.jpg','150.000.jpeg','150.000b.jpg','150.000c.jpg',
        '150.000e.jpg','180.000.jpg','200.000A.jpg','200.000K.jpg','250.000a.jpeg',
        '250.000c.jpg','350.000a.jpeg','350.000b.jpeg','350.000c.jpg','700.000.jpg','80.000.jpeg',
      ],
    },
    {
      folder: 'etat civil',
      category: 'etat-civil',
      files: [
        '100.000.jpg','100.000XXX.jpg','100.000a.jpg','100.000aa.jpg','100.000ff.jpg',
        '120.000 CV.jpg','120.000 U.jpg','120.000 XY.jpg','120.000.jpg','120.000l.jpg',
        '120.000x.jpg','120.000xxx.jpg','120.000xy.jpg','130.000 g.jpg','130.000.jpg',
        '140.000 k.jpg','140.000a.jpg','140.000c.jpg','140.000d.jpg','140.000e.jpg',
        '140.000v.jpg','150.000b.jpg','150.000d.jpg','150.000x.jpg','170.000 Z.jpg',
        '200.000x.jpg','240.000jko.jpg','75.000 JK.jpg','80.000.jpg','90.000.jpg',
      ],
    },
    {
      folder: 'tenue de ville',
      category: 'ville',
      files: [
        '120.000 i.jpg','120.000.jpg','120.000b.jpg','120.000c.jpg','120.000f.jpg',
        '120.000g.jpg','120.000x.jpg','140.000 CX.jpg','140.000c.jpg','150.000 a.jpg',
        '40.000.jpg','45.000 J.jpg','45.000 JK.jpg','45.000.jpg','45000.jpg',
        '50.000 C.jpg','50.000 W.jpg','55.000 P.jpg','55000.jpg','60.000 HG.jpg',
        '60.000 SD.jpg','60.000 YU.jpg','60.000X.jpg','60.000a.jpeg','60.000d.jpg',
        '70.000 F.jpg','70.000 FX.jpg','70.000 G.jpg','70.000 L.jpg','70.000 j.jpg',
        '70.000F.jpg','75.000 H.jpg','75.000 HG.jpg','75.000.jpg','80.000 z.jpg',
        '80.000.jpeg','80.000D.jpg','80.000a.jpeg','80.000b.jpeg','90.000a.jpg',
      ],
    },
  ]

  const models: Model[] = []
  catalog.forEach(({ folder, category, files }) => {
    files.forEach((filename, idx) => {
      const { price, priceH, priceF } = parsePrice(filename)
      models.push({
        id: `${category}-${idx}`,
        filename,
        src: `/modeles/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`,
        category,
        price,
        priceH,
        priceF,
      })
    })
  })
  return models
}

const ALL_MODELS = buildModels()

// ── Composant principal ───────────────────────────────────────────────────────
export default function ModelesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [genderChoice, setGenderChoice] = useState<'h' | 'f'>('f')
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const filtered = useMemo(() =>
    activeCategory === 'all' ? ALL_MODELS : ALL_MODELS.filter(m => m.category === activeCategory),
    [activeCategory]
  )

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => {
    if (i.priceH !== null && i.priceF !== null) {
      return s + (i.gender === 'h' ? i.priceH : i.priceF) * i.quantity
    }
    return s + (i.price ?? 0) * i.quantity
  }, 0)

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
    let msg = '🛍️ *Commande Justine Kem\'s*\n\n'
    cart.forEach(item => {
      const catLabel = CATEGORIES.find(c => c.key === item.category)?.label ?? item.category
      let priceInfo = ''
      if (item.priceH !== null && item.priceF !== null) {
        priceInfo = item.gender === 'h' ? `Homme: ${formatPrice(item.priceH)}` : `Femme: ${formatPrice(item.priceF)}`
      } else {
        priceInfo = formatPrice(item.price ?? 0)
      }
      msg += `• *${catLabel}* - ${item.filename.replace(/\.[^.]+$/, '')} (${priceInfo}) x${item.quantity}\n`
    })
    msg += `\n💰 *Total: ${formatPrice(cartTotal)}*\n\nMerci de confirmer ma commande !`
    return encodeURIComponent(msg)
  }

  function getWhatsAppModelMessage(model: Model) {
    const catLabel = CATEGORIES.find(c => c.key === model.category)?.label ?? model.category
    let priceInfo = ''
    if (model.priceH !== null && model.priceF !== null) {
      priceInfo = `Homme: ${formatPrice(model.priceH)} / Femme: ${formatPrice(model.priceF)}`
    } else {
      priceInfo = formatPrice(model.price ?? 0)
    }
    const msg = `Bonjour ! Je suis intéressé(e) par ce modèle de votre collection *${catLabel}* (${priceInfo}). Pouvez-vous me donner plus d'informations ?`
    return encodeURIComponent(msg)
  }

  const WA_NUMBER = '237677463484'

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero ── */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#0a0a0a] border-b border-[#c9a96e]/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase mb-3">Collection exclusive</p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">Nos Modèles</h1>
          <p className="text-white/50 max-w-lg mx-auto">Chaque création est unique, taillée sur mesure avec passion et précision à Yaoundé, Cameroun.</p>
        </div>
      </section>

      {/* ── Filtres ── */}
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

      {/* ── Grille ── */}
      <div className="container mx-auto px-4 py-10">
        <p className="text-white/40 text-sm mb-6">{filtered.length} modèles</p>
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
          {filtered.map(model => (
            <ModelCard
              key={model.id}
              model={model}
              onSelect={() => setSelectedModel(model)}
              hasError={imgErrors.has(model.id)}
              onError={() => setImgErrors(prev => new Set([...prev, model.id]))}
            />
          ))}
        </div>
      </div>

      {/* ── Panier bouton flottant ── */}
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

      {/* ── Modal Détail Modèle ── */}
      {selectedModel && (
        <ModelModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
          onAddToCart={addToCart}
          genderChoice={genderChoice}
          setGenderChoice={setGenderChoice}
          waNumber={WA_NUMBER}
          getWhatsAppMessage={getWhatsAppModelMessage}
        />
      )}

      {/* ── Panneau Panier ── */}
      {showCart && (
        <CartPanel
          items={cart}
          total={cartTotal}
          waNumber={WA_NUMBER}
          whatsAppMsg={getWhatsAppOrderMessage()}
          onRemove={removeFromCart}
          onClose={() => setShowCart(false)}
        />
      )}
    </main>
  )
}

// ── Carte produit ────────────────────────────────────────────────────────────
function ModelCard({ model, onSelect, hasError, onError }: { model: Model; onSelect: () => void; hasError: boolean; onError: () => void }) {
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
          Image non disponible
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
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-3">
            <span className="text-white text-xs font-medium text-center">Voir le détail</span>
          </div>
        </div>
      )}
      {/* Prix badge */}
      {label && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-[#c9a96e] text-xs font-semibold text-center leading-tight">{label}</p>
        </div>
      )}
    </div>
  )
}

// ── Modal Détail ─────────────────────────────────────────────────────────────
function ModelModal({ model, onClose, onAddToCart, genderChoice, setGenderChoice, waNumber, getWhatsAppMessage }:{
  model: Model; onClose: () => void; onAddToCart: (m: Model, g?: 'h' | 'f') => void;
  genderChoice: 'h' | 'f'; setGenderChoice: (g: 'h' | 'f') => void;
  waNumber: string; getWhatsAppMessage: (m: Model) => string
}) {
  const isCouple = model.priceH !== null && model.priceF !== null
  const displayPrice = isCouple
    ? (genderChoice === 'h' ? formatPrice(model.priceH!) : formatPrice(model.priceF!))
    : formatPrice(model.price ?? 0)
  const catLabel = CATEGORIES.find(c => c.key === model.category)?.label ?? model.category

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
        {/* Header modal */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-[#c9a96e] text-sm uppercase tracking-widest">{catLabel}</span>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#0a0a0a]">
          <Image src={model.src} alt={catLabel} fill className="object-contain" unoptimized />
        </div>

        {/* Info */}
        <div className="p-5 space-y-4">
          {/* Gender selector pour couple */}
          {isCouple && (
            <div>
              <p className="text-white/50 text-xs mb-2">Sélectionnez la tenue :</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setGenderChoice('h')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${genderChoice === 'h' ? 'bg-[#c9a96e] text-black' : 'bg-white/10 text-white'}`}
                >
                  🤵 Homme — {formatPrice(model.priceH!)}
                </button>
                <button
                  onClick={() => setGenderChoice('f')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${genderChoice === 'f' ? 'bg-[#c9a96e] text-black' : 'bg-white/10 text-white'}`}
                >
                  👗 Femme — {formatPrice(model.priceF!)}
                </button>
              </div>
            </div>
          )}

          {/* Prix */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#c9a96e]">{displayPrice}</span>
            <span className="text-white/30 text-sm">Création sur mesure</span>
          </div>

          {/* Description */}
          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <p className="text-white/70 text-sm leading-relaxed">
              Création exclusive de la maison <span className="text-[#c9a96e] font-semibold">Justine Kem&apos;s</span>. 
              Chaque pièce est confectionnée sur mesure à Yaoundé avec des tissus de qualité premium.
            </p>
            <ul className="text-white/50 text-xs space-y-1">
              <li>✓ Mesures et ajustements personnalisés</li>
              <li>✓ Tissus de qualité sélectionnés avec soin</li>
              <li>✓ Finitions artisanales soignées</li>
              <li>✓ Délai de confection : 2 à 4 semaines</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onAddToCart(model, isCouple ? genderChoice : undefined)}
              className="w-full bg-[#c9a96e] text-black font-semibold py-3 rounded-xl hover:bg-[#b8944f] transition-all"
            >
              Ajouter au panier
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
              Commander via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Panneau Panier ────────────────────────────────────────────────────────────
function CartPanel({ items, total, waNumber, whatsAppMsg, onRemove, onClose }: {
  items: CartItem[]; total: number; waNumber: string; whatsAppMsg: string;
  onRemove: (id: string, gender?: 'h' | 'f') => void; onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-black/60 absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#111] border-l border-white/10 h-full flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold">Mon Panier</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-white/40 text-center py-10">Panier vide</p>
          ) : items.map(item => {
            const catLabel = CATEGORIES.find(c => c.key === item.category)?.label ?? item.category
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
                    <p className="text-white/40 text-xs">{item.gender === 'h' ? '🤵 Homme' : '👗 Femme'}</p>
                  )}
                  <p className="text-[#c9a96e] text-sm font-bold mt-1">{formatPrice(itemPrice)}</p>
                  <p className="text-white/30 text-xs">Qté: {item.quantity}</p>
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Total</span>
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
              Envoyer la commande
            </a>
            <p className="text-white/30 text-xs text-center">Vos choix seront envoyés directement sur WhatsApp</p>
          </div>
        )}
      </div>
    </div>
  )
}
