import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CatalogClient } from '@/components/CatalogClient'

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

// ── Logic ────────────────────────────────────────────────────────
function parsePrice(filename: string): { price: number | null; priceH: number | null; priceF: number | null } {
  const name = filename.replace(/\.[^.]+$/, '')
  const coupleMatch = name.match(/h([\d]+[\.,]?[\d]*)[^hf]*f\s*([\d]+[\.,]?[\d]*)/i)
  if (coupleMatch) {
    const priceH = parseInt(coupleMatch[1].replace(/[.,]/g, ''))
    const priceF = parseInt(coupleMatch[2].replace(/[.,]/g, ''))
    return { price: null, priceH, priceF }
  }
  const altCouple = name.match(/^([\d]+[\.,]?[\d]*)\s*[;:]\s*f\s*([\d]+[\.,]?[\d]*)/i)
  if (altCouple) {
    return { price: null, priceH: parseInt(altCouple[1].replace(/[.,]/g, '')), priceF: parseInt(altCouple[2].replace(/[.,]/g, '')) }
  }
  const simpleMatch = name.match(/^([\d]+[\.,]?[\d]*)/)
  if (simpleMatch) {
    return { price: parseInt(simpleMatch[1].replace(/[.,]/g, '')), priceH: null, priceF: null }
  }
  return { price: null, priceH: null, priceF: null }
}

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'modeles.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ModelesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'modeles' })
  const allModels = buildModels()

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Hero ── */}
      <section className="relative py-20 bg-gradient-to-b from-black to-[#0a0a0a] border-b border-[#c9a96e]/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase mb-3">{t('hero.tagline')}</p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">{t('hero.title')}</h1>
          <p className="text-white/50 max-w-lg mx-auto">{t('hero.desc')}</p>
        </div>
      </section>

      {/* ── Logic & Filtered Content (Client Side) ── */}
      <CatalogClient initialModels={allModels} locale={locale} />
    </main>
  )
}
