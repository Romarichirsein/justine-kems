// Données du catalogue générées depuis les noms de fichiers
// Règle: suffix f/F = Femme, h/H = Homme, couple = les deux prix

export interface CatalogueProduct {
  id: string
  filename: string
  imagePath: string
  category: string
  categoryLabel: string
  price: number        // prix principal (ou prix femme pour les couples)
  priceH?: number      // prix homme (pour les tenues de couple)
  priceF?: number      // prix femme (pour les tenues de couple)
  gender?: 'femme' | 'homme' | 'couple' | null
  priceLabel: string   // texte affiché du prix
}

function parsePrice(raw: string): number {
  // "250.000" → 250000, "120.000" → 120000
  return parseInt(raw.replace(/\./g, '').replace(/\s/g, ''), 10)
}

function formatPrice(n: number): string {
  return n.toLocaleString('fr-FR') + ' FCFA'
}

// Analyse le nom de fichier (sans extension) pour extraire prix et genre
function parseFilename(
  name: string, // sans extension
  folder: string
): Partial<CatalogueProduct> | null {
  const lowercaseName = name.toLowerCase()

  // ====== TENUES DE COUPLE : format h120.000 ; f250.000 ======
  if (folder === 'tenu-couple') {
    // Ignorer le fichier sans info de prix (ex: timestamp)
    if (/^\d{13}/.test(name)) return null

    // Cas spécial: "75000; f160.000" ou "h120.000 ; f250.000"
    const coupleMatch = lowercaseName.match(/([hf])?\s*([\d.]+)\s*[;!'"]+\s*([hf])\s*([\d.]+)/)
    if (coupleMatch) {
      const t1 = coupleMatch[1] || 'h' // si le premier n'a pas de tag, on suppose 'h' par défaut ou selon le contexte
      const p1 = parsePrice(coupleMatch[2])
      const t2 = coupleMatch[3]
      const p2 = parsePrice(coupleMatch[4])

      const priceH = t1 === 'h' ? p1 : p2
      const priceF = t1 === 'f' ? p1 : p2
      
      return {
        gender: 'couple',
        priceH,
        priceF,
        price: Math.max(priceH, priceF),
        priceLabel: `Femme: ${formatPrice(priceF)} | Homme: ${formatPrice(priceH)}`,
      }
    }

    // fallback si un seul prix est trouvé mais dans le dossier couple
    const singleInCouple = lowercaseName.match(/([\d.]+)/)
    if (singleInCouple) {
      const p = parsePrice(singleInCouple[1])
      return { gender: 'couple', price: p, priceLabel: formatPrice(p) }
    }

    return null
  }

  // ====== AUTRES CATÉGORIES ======
  // Pattern: cherche le premier nombre
  const match = lowercaseName.match(/([\d.]+)/)
  if (!match) return null

  const priceRaw = match[1]
  const price = parsePrice(priceRaw)
  if (!price || price < 1000) return null

  // Détermination du genre: SEULEMENT si 'f' ou 'h' est présent dans le nom
  let gender: CatalogueProduct['gender'] = null
  if (lowercaseName.includes('f')) gender = 'femme'
  else if (lowercaseName.includes('h')) gender = 'homme'

  return {
    gender,
    price,
    priceLabel: formatPrice(price),
  }
}

// ====== DONNÉES DE TOUTES LES IMAGES ======
const rawCategories: Array<{
  folder: string
  label: string
  files: string[]
}> = [
  {
    folder: 'robes-mariage',
    label: 'Robes de Mariages',
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
    folder: 'robes-soirees',
    label: 'Robes de Soirées',
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
    folder: 'tenu-couple',
    label: 'Tenues de Couple',
    files: [
      '2025083116271664.png','75000; f160.000.jpg','f300.000; h160.000.jpg',
      'h120.000 ; f250.000.jpg','h120.000 ; f60.000.jpg','h120.000;; f140.000.jpg',
      'h120.000;;; f 160.000.jpg','h120.000;;; f180.000.jpg',"h130.000 '' f275.000.jpg",
      'h130.000 ; f150.000.jpg','h130.000 ; f200.000.jpeg','h130.000 ; f330.000.jpg',
      'h140.000 ! f210.000.jpg','h140.000 ! f250.000.jpg','h140.000 ; f180.000.jpeg',
      'h140.000 ; f250.000.jpg','h140.000 ; f300.000.jpeg','h140.000; f230.000.jpg',
      'h150.000 ; f350.000.jpg','h150.000;; f350.000.jpg','h160.000 ; f 380.000.jpg',
      'h160.000 ; f330.000.jpg','h160.000; f380.000.jpg','h170.000; f300.000.jpg',
      'h60.000 ; f120.000.jpg','h60.000;f 120.000.jpg','h80.000 ; f 200.000.jpg',
    ],
  },
  {
    folder: 'tenue-traditionnels',
    label: 'Tenues Traditionnelles',
    files: [
      '120.000aw.jpg','150.000 X.jpg','150.000.jpeg','150.000b.jpg','150.000c.jpg',
      '150.000e.jpg','180.000.jpg','200.000A.jpg','200.000K.jpg','250.000a.jpeg',
      '250.000c.jpg','350.000a.jpeg','350.000b.jpeg','350.000c.jpg','700.000.jpg',
      '80.000.jpeg',
    ],
  },
  {
    folder: 'etat-civil',
    label: 'État Civil',
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
    folder: 'tenue-ville',
    label: 'Tenues de Ville',
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

// Génération de la liste de produits
export const catalogueProducts: CatalogueProduct[] = []

let idCounter = 1

for (const cat of rawCategories) {
  for (const file of cat.files) {
    const nameWithoutExt = file.replace(/\.[^.]+$/, '')
    const parsed = parseFilename(nameWithoutExt, cat.folder)

    if (!parsed || !parsed.price) continue

    const ext = file.split('.').pop()
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext?.toLowerCase() || '')
    if (!isImage) continue

    catalogueProducts.push({
      id: `prod-${idCounter++}`,
      filename: file,
      imagePath: `/catalogue/${cat.folder}/${encodeURIComponent(file)}`,
      category: cat.folder,
      categoryLabel: cat.label,
      price: parsed.price,
      priceH: parsed.priceH,
      priceF: parsed.priceF,
      gender: parsed.gender ?? null,
      priceLabel: parsed.priceLabel || '',
    })
  }
}
