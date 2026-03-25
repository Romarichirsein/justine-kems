// scripts/seed-sanity.mjs
// Script pour uploader toutes les images et données vers Sanity
// Usage: SANITY_API_TOKEN=votre_token node scripts/seed-sanity.mjs
//   ou : node -e "require('dotenv').config({path:'.env.local'})" scripts/seed-sanity.mjs

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

// Charger .env.local manuellement (sans dotenv)
const envFile = path.join(ROOT, '.env.local')
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=')
      process.env[key.trim()] = vals.join('=').trim()
    }
  }
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd8v5zxvs'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-18'

// ─── Client Sanity ────────────────────────────────────────────────────────────
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extrait le prix depuis le nom du fichier
 *  ex: "250.000 C.jpg" → 250000
 *  ex: "h140.000 ; f250.000.jpg" → { homme: 140000, femme: 250000 }
 */
function extractPrice(filename) {
  const base = path.basename(filename, path.extname(filename))
  // Cas tenue couple: h... ; f...
  const coupleMatch = base.match(/h(\d+[\.,]\d+).*f(\d+[\.,]\d+)/i)
  if (coupleMatch) {
    return {
      homme: parseInt(coupleMatch[1].replace('.', '').replace(',', '')),
      femme: parseInt(coupleMatch[2].replace('.', '').replace(',', '')),
    }
  }
  // Cas normal: commence par un nombre
  const simpleMatch = base.match(/^(\d+[\.,]\d+)/)
  if (simpleMatch) {
    return parseInt(simpleMatch[1].replace('.', '').replace(',', ''))
  }
  return 0
}

/** Génère un slug propre depuis un string */
function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Upload une image vers Sanity et retourne l'asset ref */
async function uploadImage(imagePath) {
  const buffer = fs.readFileSync(imagePath)
  const filename = path.basename(imagePath)
  const ext = path.extname(imagePath).slice(1).toLowerCase()
  const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 
                      ext === 'png' ? 'image/png' : 
                      ext === 'webp' ? 'image/webp' : 'image/jpeg'
  
  console.log(`  📤 Upload: ${filename}`)
  
  try {
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType,
    })
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  } catch (err) {
    console.error(`  ❌ Erreur upload ${filename}:`, err.message)
    return null
  }
}

/** Récupère tous les fichiers images d'un dossier */
function getImages(folderPath) {
  if (!fs.existsSync(folderPath)) return []
  return fs.readdirSync(folderPath)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => path.join(folderPath, f))
}

/** Crée un document dans Sanity */
async function createDoc(doc) {
  try {
    const result = await client.createOrReplace(doc)
    console.log(`  ✅ Créé: ${doc._type} — ${result._id}`)
    return result
  } catch (err) {
    console.error(`  ❌ Erreur document:`, err.message)
  }
}

// ─── Mapping catégories ───────────────────────────────────────────────────────
const CATALOGUE_CONFIG = {
  'etat-civil': {
    folder: 'public/catalogue/etat-civil',
    category: 'haute-couture',
    occasions: ['quotidien'],
    label: 'Tenue État Civil',
    descriptions: [
      'Tenue élégante pour vos journées importantes',
      'Robe raffinée pour cérémonies officielles',
      'Tenue sobre et chic pour l\'état civil',
    ],
  },
  'robes-mariage': {
    folder: 'public/catalogue/robes-mariage',
    category: 'haute-couture',
    occasions: ['mariage'],
    label: 'Robe de Mariage',
    descriptions: [
      'Robe de mariée sur mesure, création exclusive Justine Kems',
      'Robe nuptiale élaborée avec des tissus de haute qualité',
      'Tenue de mariage raffinée pour le plus beau jour de votre vie',
      'Création couture pour une mariée resplendissante',
    ],
  },
  'robes-soirees': {
    folder: 'public/catalogue/robes-soirees',
    category: 'haute-couture',
    occasions: ['gala'],
    label: 'Robe de Soirée',
    descriptions: [
      'Robe de soirée glamour pour toutes vos sorties',
      'Tenue élégante pour gala et événements chics',
      'Robe sophistiquée, création Justine Kems',
      'Tenue de soirée sur mesure pour briller sous les projecteurs',
    ],
  },
  'tenue-ville': {
    folder: 'public/catalogue/tenue-ville',
    category: 'pret-a-porter',
    occasions: ['quotidien', 'professionnel'],
    label: 'Tenue de Ville',
    descriptions: [
      'Tenue stylée pour votre quotidien urbain',
      'Look moderne et élégant pour la ville',
      'Tenue professionnelle et raffinée',
      'Style contemporain alliant confort et élégance',
    ],
  },
  'tenu-couple': {
    folder: 'public/catalogue/tenu-couple',
    category: 'haute-couture',
    occasions: ['mariage', 'gala'],
    label: 'Tenue de Couple',
    descriptions: [
      'Tenues coordonnées pour couples — prix homme/femme disponibles',
      'Ensemble couple assorti pour cérémonies et mariages',
      'Tenues harmonisées pour sublimer votre duo',
    ],
  },
  'tenue-traditionnels': {
    folder: 'public/catalogue/tenue-traditionnels',
    category: 'haute-couture',
    occasions: ['mariage', 'quotidien'],
    label: 'Tenue Traditionnelle',
    descriptions: [
      'Tenue traditionnelle camerounaise, confection artisanale de qualité',
      'Vêtement traditionnel africain sublimant la culture camerounaise',
      'Tenue ethnique élaborée avec des tissus authentiques',
    ],
  },
}

// ─── SEED PRODUITS ────────────────────────────────────────────────────────────
async function seedProducts() {
  console.log('\n───────────────────────────────────')
  console.log('👗 UPLOAD DES PRODUITS')
  console.log('───────────────────────────────────')
  
  let counter = 0
  
  for (const [key, config] of Object.entries(CATALOGUE_CONFIG)) {
    const folderPath = path.join(ROOT, config.folder)
    const images = getImages(folderPath)
    
    console.log(`\n📁 ${config.label} (${images.length} images)`)
    
    for (const imagePath of images) {
      const filename = path.basename(imagePath)
      const priceData = extractPrice(filename)
      
      let price = typeof priceData === 'object' ? 
        Math.round((priceData.homme + priceData.femme) / 2) : 
        priceData
      
      // Nom du produit
      const productName = `${config.label} — N°${counter + 1}`
      const slug = toSlug(`${key}-${counter + 1}`)
      
      // Description aléatoire depuis la liste
      const desc = config.descriptions[counter % config.descriptions.length]
      
      // Upload image
      const mainImage = await uploadImage(imagePath)
      if (!mainImage) continue
      
      // Informations tissu selon catégorie
      const fabrics = ['Kente', 'Bazin', 'Wax', 'Bogolan', 'Dentelle', 'Satin', 'Mousseline', 'Organza']
      const fabric = fabrics[counter % fabrics.length]
      
      // Créer le document produit
      const doc = {
        _type: 'product',
        _id: `product-${key}-${counter + 1}`,
        name: productName,
        slug: { _type: 'slug', current: slug },
        category: config.category,
        occasion: config.occasions,
        mainImage,
        description: desc,
        fabric,
        price,
        priceType: price > 0 ? 'fixed' : 'quote',
        isFeatured: counter < 4, // Les 4 premiers de chaque catégorie sont featured
        isNew: counter < 2,
      }
      
      await createDoc(doc)
      counter++
      
      // Pause pour éviter rate limit
      await new Promise(r => setTimeout(r, 200))
    }
  }
  
  console.log(`\n✅ ${counter} produits uploadés !`)
}

// ─── SEED FORMATIONS ──────────────────────────────────────────────────────────
async function seedFormations() {
  console.log('\n───────────────────────────────────')
  console.log('🎓 SEED DES FORMATIONS')
  console.log('───────────────────────────────────')
  
  const formations = [
    {
      _id: 'formation-couture-debutant',
      _type: 'formation',
      title: 'Couture Créative — Niveau Débutant',
      slug: { _type: 'slug', current: 'couture-creative-debutant' },
      duration: '3 mois',
      level: 'Débutant',
      price: 50000,
      description: 'Apprenez les bases de la couture avec Justine Kems. Formation pratique pour débutants : prise de mesures, patrons de base, confection de tenues simples. Matériel fourni.',
      objectives: [
        'Maîtriser les outils de couture',
        'Prendre des mesures précises',
        'Réaliser des patrons de base',
        'Confectionner une première tenue',
        'Comprendre les différents types de tissus',
      ],
    },
    {
      _id: 'formation-couture-intermediaire',
      _type: 'formation',
      title: 'Haute Couture — Niveau Intermédiaire',
      slug: { _type: 'slug', current: 'haute-couture-intermediaire' },
      duration: '4 mois',
      level: 'Intermédiaire',
      price: 80000,
      description: 'Perfectionnez votre technique de couture. Travaillez sur des modèles plus complexes : robes de soirée, tenues traditionnelles africaines, applications de broderies et finitions professionnelles.',
      objectives: [
        'Maîtriser les techniques de coupe avancées',
        'Réaliser des robes de soirée complètes',
        'Travailler les tissus nobles (satin, organza)',
        'Intégrer des broderies et ornements',
        'Créer ses propres patrons personnalisés',
      ],
    },
    {
      _id: 'formation-creation-mode',
      _type: 'formation',
      title: 'Création & Design de Mode',
      slug: { _type: 'slug', current: 'creation-design-mode' },
      duration: '6 mois',
      level: 'Avancé',
      price: 150000,
      description: 'Formation complète pour créer votre propre marque de mode. De la conception graphique à la confection finale, développez votre univers créatif et apprenez à gérer une petite entreprise de couture.',
      objectives: [
        'Développer un univers créatif personnel',
        'Maîtriser le design et le croquis de mode',
        'Créer une collection complète',
        'Organiser un défilé de mode',
        'Commercialiser ses créations',
        'Gérer un atelier de couture',
      ],
    },
    {
      _id: 'formation-retouche',
      _type: 'formation',
      title: 'Retouche & Transformation',
      slug: { _type: 'slug', current: 'retouche-transformation' },
      duration: '1 mois',
      level: 'Débutant',
      price: 25000,
      description: 'Formation courte et pratique pour apprendre les retouches de vêtements : ourlets, cintrage, élargissement, réparations. Idéal pour les particuliers souhaitant entretenir leur garde-robe.',
      objectives: [
        'Réaliser des ourlets proprement',
        'Cintrer et ajuster des vêtements',
        'Réparer des fermetures éclair',
        'Poser des boutons et broderies simples',
        'Transformer des vêtements existants',
      ],
    },
  ]
  
  for (const formation of formations) {
    await createDoc(formation)
    console.log(`  ✅ Formation: ${formation.title}`)
  }
}

// ─── SEED TÉMOIGNAGES ─────────────────────────────────────────────────────────
async function seedTestimonials() {
  console.log('\n───────────────────────────────────')
  console.log('⭐ SEED DES TÉMOIGNAGES')
  console.log('───────────────────────────────────')
  
  const testimonials = [
    {
      _id: 'testimonial-1',
      _type: 'testimonial',
      name: 'Aminata N.',
      city: 'Yaoundé',
      content: 'Justine a réalisé ma robe de mariage en seulement 2 semaines. Un travail extraordinaire, des finitions impeccables. Toutes mes invitées ont adoré ! Je recommande vraiment.',
      rating: 5,
      type: 'mariage',
    },
    {
      _id: 'testimonial-2',
      _type: 'testimonial',
      name: 'Chantal M.',
      city: 'Douala',
      content: 'Ma robe de soirée pour le gala de fin d\'année était magnifique. Justine a su capturer exactement ce que je voulais. Le tissu était de qualité exceptionnelle.',
      rating: 5,
      type: 'soiree',
    },
    {
      _id: 'testimonial-3',
      _type: 'testimonial',
      name: 'Sandra B.',
      city: 'Yaoundé',
      content: 'J\'ai suivi la formation couture débutant et c\'est une expérience incroyable. Justine est une enseignante patiente et très compétente. Je confectionne maintenant mes propres tenues !',
      rating: 5,
      type: 'formation',
    },
    {
      _id: 'testimonial-4',
      _type: 'testimonial',
      name: 'Marie-Claire T.',
      city: 'Bafoussam',
      content: 'Les tenues de couple pour notre mariage étaient parfaites. Mon mari et moi avons reçu énormément de compliments. Merci Justine pour votre professionnalisme !',
      rating: 5,
      type: 'mariage',
    },
    {
      _id: 'testimonial-5',
      _type: 'testimonial',
      name: 'Laure F.',
      city: 'Douala',
      content: 'J\'ai commandé plusieurs tenues de ville pour mon travail. La qualité est là, les délais respectés et le rapport qualité-prix est excellent. Ma couturière de confiance !',
      rating: 5,
      type: 'quotidien',
    },
    {
      _id: 'testimonial-6',
      _type: 'testimonial',
      name: 'Berthe K.',
      city: 'Yaoundé',
      content: 'La tenue traditionnelle réalisée pour la fête de ma famille était splendide. Justine maîtrise parfaitement les tissus africains et les broderies traditionnelles.',
      rating: 5,
      type: 'traditionnel',
    },
  ]
  
  for (const t of testimonials) {
    await createDoc(t)
    console.log(`  ✅ Témoignage: ${t.name} - ${t.city}`)
  }
}

// ─── SEED ARTICLES BLOG ───────────────────────────────────────────────────────
async function seedBlogPosts() {
  console.log('\n───────────────────────────────────')
  console.log('📝 SEED DES ARTICLES DE BLOG')
  console.log('───────────────────────────────────')
  
  const posts = [
    {
      _id: 'post-choisir-robe-mariage',
      _type: 'post',
      title: 'Comment choisir sa robe de mariage parfaite au Cameroun',
      slug: { _type: 'slug', current: 'choisir-robe-mariage-cameroun' },
      category: 'mariage',
      excerpt: 'Choisir sa robe de mariage est une étape importante. Découvrez nos conseils pour trouver la robe idéale qui correspondra à votre personnalité et à votre budget.',
      publishedAt: '2024-06-01',
      readingTime: 5,
      body: [
        {
          _type: 'block',
          _key: 'block1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span1',
              text: 'Le choix de la robe de mariage est l\'une des décisions les plus importantes pour toute future mariée. Que vous rêviez d\'une robe fluide et légère, d\'une créations en dentelle ou d\'une tenue traditionnelle africaine, notre atelier est là pour concrétiser votre vision.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'block2',
          style: 'h2',
          markDefs: [],
          children: [
            { _type: 'span', _key: 'span2', text: '1. Définissez votre style', marks: [] }
          ]
        },
        {
          _type: 'block',
          _key: 'block3',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span3',
              text: 'Avant de commencer vos recherches, prenez le temps de définir votre style. Êtes-vous plutôt romantique, moderne, classique ou bohème ? Regardez des photos, créez un tableau d\'inspiration et notez les éléments que vous aimez.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'block4',
          style: 'h2',
          markDefs: [],
          children: [
            { _type: 'span', _key: 'span4', text: '2. Considérez la saison et le lieu', marks: [] }
          ]
        },
        {
          _type: 'block',
          _key: 'block5',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span5',
              text: 'Au Cameroun, le climat est chaud et humide. Privilege des tissus légers comme la mousseline, l\'organza ou le satin léger. Pour un mariage en plein air, évitez les longues traînes qui pourraient se salir.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'block6',
          style: 'h2',
          markDefs: [],
          children: [
            { _type: 'span', _key: 'span6', text: '3. Prévoyez votre budget', marks: [] }
          ]
        },
        {
          _type: 'block',
          _key: 'block7',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'span7',
              text: 'Chez Justine Kems, nos robes de mariage sont accessibles à partir de 150.000 FCFA. Le prix varie selon le modèle, les matières et les ornements choisis. Contactez-nous pour un devis personnalisé.',
              marks: [],
            }
          ]
        },
      ],
    },
    {
      _id: 'post-tissu-africain-couture',
      _type: 'post',
      title: 'Les meilleurs tissus africains pour votre prochaine tenue',
      slug: { _type: 'slug', current: 'meilleurs-tissus-africains-couture' },
      category: 'couture',
      excerpt: 'Kente, Wax, Bazin, Bogolan... les tissus africains sont riches et variés. Découvrez leurs caractéristiques et comment les intégrer dans vos tenues modernes.',
      publishedAt: '2024-07-15',
      readingTime: 7,
      body: [
        {
          _type: 'block',
          _key: 'b1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 's1',
              text: 'L\'Afrique est un continent riche en traditions textiles. Chaque tissu raconte une histoire, porte une signification culturelle et offre des possibilités créatives infinies pour la mode contemporaine.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'b2',
          style: 'h2',
          markDefs: [],
          children: [{ _type: 'span', _key: 's2', text: 'Le Wax ou Batik', marks: [] }]
        },
        {
          _type: 'block',
          _key: 'b3',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 's3',
              text: 'Le tissu Wax est le plus populaire en Afrique de l\'Ouest et Centrale. Ses motifs colorés et graphiques en font un classique indémodable. Idéal pour les tenues de ville, les robes de soirée et les tenues traditionnelles.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'b4',
          style: 'h2',
          markDefs: [],
          children: [{ _type: 'span', _key: 's4', text: 'Le Bazin Riche', marks: [] }]
        },
        {
          _type: 'block',
          _key: 'b5',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 's5',
              text: 'Tissu noble par excellence, le Bazin Riche est synonyme d\'élégance et de prestige. Sa brillance naturelle et sa texture lourde en font le choix idéal pour les mariages et les grandes occasions.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'b6',
          style: 'h2',
          markDefs: [],
          children: [{ _type: 'span', _key: 's6', text: 'Le Kente', marks: [] }]
        },
        {
          _type: 'block',
          _key: 'b7',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 's7',
              text: 'Originaire du Ghana, le Kente est un tissu artistanal tissé à la main avec des fils d\'or, de soie et de coton. Chaque motif a une signification symbolique forte. Parfait pour les tenues de prestige.',
              marks: [],
            }
          ]
        },
      ],
    },
    {
      _id: 'post-tendances-mode-cameroun-2024',
      _type: 'post',
      title: 'Tendances mode au Cameroun : ce qui est en vogue en 2024',
      slug: { _type: 'slug', current: 'tendances-mode-cameroun-2024' },
      category: 'tendances',
      excerpt: 'La mode camerounaise évolue rapidement, mêlant tradition et modernité. Découvrez les tendances qui dominent cette année et comment les adopter avec style.',
      publishedAt: '2024-08-20',
      readingTime: 6,
      body: [
        {
          _type: 'block',
          _key: 'bb1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'ss1',
              text: 'La scène mode camerounaise est en constante évolution. Entre influence internationale et valorisation des traditions africaines, les créateurs locaux développent une identité stylistique forte et unique.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'bb2',
          style: 'h2',
          markDefs: [],
          children: [{ _type: 'span', _key: 'ss2', text: 'L\'Afrofuturisme en tête', marks: [] }]
        },
        {
          _type: 'block',
          _key: 'bb3',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'ss3',
              text: 'L\'afrofuturisme, qui mêle traditions africaines et esthétiques futuristes, est en plein boom. Des motifs en Wax combinés à des coupes modernes et des matières innovantes créent des silhouettes saisissantes.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'bb4',
          style: 'h2',
          markDefs: [],
          children: [{ _type: 'span', _key: 'ss4', text: 'Le retour des tenues coordonnées', marks: [] }]
        },
        {
          _type: 'block',
          _key: 'bb5',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'ss5',
              text: 'Les tenues de couple coordonnées sont très tendance pour les mariages et cérémonies. Chez Justine Kems, nous créons des ensembles harmonisés pour que vous brilliez ensemble lors de vos grandes occasions.',
              marks: [],
            }
          ]
        },
      ],
    },
    {
      _id: 'post-formation-couture-avantages',
      _type: 'post',
      title: 'Pourquoi apprendre la couture peut changer votre vie',
      slug: { _type: 'slug', current: 'apprendre-couture-changer-vie' },
      category: 'formation',
      excerpt: 'La couture est bien plus qu\'un simple passe-temps. C\'est une compétence professionnelle qui ouvre des portes et permet de s\'épanouir. Découvrez tous les avantages.',
      publishedAt: '2024-09-05',
      readingTime: 5,
      body: [
        {
          _type: 'block',
          _key: 'bbb1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'sss1',
              text: 'Dans un contexte où l\'entrepreneuriat féminin prend de l\'essor au Cameroun, la couture représente une opportunité extraordinaire de créer sa propre source de revenus tout en exprimant sa créativité.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'bbb2',
          style: 'h2',
          markDefs: [],
          children: [{ _type: 'span', _key: 'sss2', text: 'Une compétence qui dure', marks: [] }]
        },
        {
          _type: 'block',
          _key: 'bbb3',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'sss3',
              text: 'Contrairement à de nombreux métiers, la couture est une compétence qui ne se démode pas. La demande en couture de qualité est constante et même grandissante avec l\'essor de la mode africaine sur la scène internationale.',
              marks: [],
            }
          ]
        },
        {
          _type: 'block',
          _key: 'bbb4',
          style: 'h2',
          markDefs: [],
          children: [{ _type: 'span', _key: 'sss4', text: 'Nos formations chez Justine Kems', marks: [] }]
        },
        {
          _type: 'block',
          _key: 'bbb5',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'sss5',
              text: 'Nous proposons des formations adaptées à tous les niveaux, du débutant au professionnel. Notre approche pratique et personnalisée garantit une montée en compétences rapide et durable. Rejoignez l\'atelier Justine Kems !',
              marks: [],
            }
          ]
        },
      ],
    },
  ]
  
  for (const post of posts) {
    await createDoc(post)
    console.log(`  ✅ Article: ${post.title}`)
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Démarrage du seeding Sanity pour Justine Kems')
  console.log(`📡 Projet: d8v5zxvs | Dataset: production`)
  
  if (!process.env.SANITY_API_TOKEN) {
    console.error('\n❌ SANITY_API_TOKEN manquant !')
    console.error('👉 Ajoutez votre token dans .env.local : SANITY_API_TOKEN=votre_token')
    console.error('👉 Créez un token sur: https://www.sanity.io/manage/project/d8v5zxvs/api')
    process.exit(1)
  }
  
  try {
    // Upload des produits (avec images)
    await seedProducts()
    
    // Seed des formations
    await seedFormations()
    
    // Seed des témoignages
    await seedTestimonials()
    
    // Seed des articles de blog
    await seedBlogPosts()
    
    console.log('\n🎉 Seeding terminé avec succès !')
    console.log('👉 Vérifiez votre Studio Sanity: http://localhost:3333')
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
    process.exit(1)
  }
}

main()
