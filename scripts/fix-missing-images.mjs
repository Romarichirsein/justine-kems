/**
 * Corrige les produits Sanity sans images
 * Re-upload les assets manquants et patch les documents
 */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

// Charger .env.local
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

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Mapping des catégories vers dossiers
const CATEGORIES = [
  { folder: 'etat-civil', slug: 'etat-civil', prefix: 'product-etat-civil' },
  { folder: 'robes-mariage', slug: 'robes-mariage', prefix: 'product-robes-mariage' },
  { folder: 'robes-soirees', slug: 'robes-soirees', prefix: 'product-robes-soirees' },
  { folder: 'tenues-deuil', slug: 'tenues-deuil', prefix: 'product-tenues-deuil' },
  { folder: 'tenues-couple', slug: 'tenues-couple', prefix: 'product-tenues-couple' },
  { folder: 'tenues-traditionnelles', slug: 'tenues-traditionnelles', prefix: 'product-tenues-traditionnelles' },
]

// Pause utilitaire
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function uploadWithRetry(buffer, filename, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const asset = await client.assets.upload('image', buffer, {
        filename,
        contentType: filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
      })
      return asset
    } catch (err) {
      if (attempt < retries) {
        const wait = attempt * 2000
        console.log(`  ⚠️  Tentative ${attempt}/${retries} échouée (${err.message}), attend ${wait}ms...`)
        await sleep(wait)
      } else {
        throw err
      }
    }
  }
}

async function fixMissingImages() {
  console.log('🔧 Correction des images manquantes dans Sanity\n')

  // Récupérer tous les produits sans mainImage
  const productsWithoutImage = await client.fetch(
    `*[_type == "product" && !defined(mainImage)]{_id, slug, name}`
  )
  console.log(`📊 Produits sans image: ${productsWithoutImage.length}`)

  if (productsWithoutImage.length === 0) {
    console.log('✅ Tous les produits ont déjà une image !')
    return
  }

  // Indexer les fichiers par catégorie
  const fileIndex = {}
  for (const cat of CATEGORIES) {
    const folder = path.join(ROOT, 'public/catalogue', cat.folder)
    if (!fs.existsSync(folder)) continue
    const files = fs.readdirSync(folder).filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    fileIndex[cat.prefix] = { folder, files, cat }
  }

  let fixed = 0
  let failed = 0

  for (const product of productsWithoutImage) {
    const slug = product.slug?.current || product._id

    // Trouver la catégorie correspondante
    let entry = null
    for (const [prefix, data] of Object.entries(fileIndex)) {
      if (product._id.startsWith(prefix) || slug.startsWith(prefix)) {
        entry = data
        break
      }
    }

    // Essayer de deviner depuis _id
    if (!entry) {
      for (const [prefix, data] of Object.entries(fileIndex)) {
        if (product._id.includes(data.cat.slug)) {
          entry = data
          break
        }
      }
    }

    if (!entry) {
      console.log(`  ⚠️  Catégorie inconnue pour: ${product._id}`)
      failed++
      continue
    }

    // Prendre la prochaine image disponible dans le dossier
    if (entry.filePointer === undefined) entry.filePointer = 0
    if (entry.filePointer >= entry.files.length) {
      console.log(`  ⚠️  Plus d'images pour: ${product._id}`)
      failed++
      continue
    }

    const filename = entry.files[entry.filePointer++]
    const filepath = path.join(entry.folder, filename)

    try {
      const buffer = fs.readFileSync(filepath)
      const asset = await uploadWithRetry(buffer, filename)
      await client.patch(product._id).set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id }
        }
      }).commit()
      console.log(`  ✅ Corrigé: ${product._id} → ${filename}`)
      fixed++
    } catch (err) {
      console.error(`  ❌ Échec: ${product._id} — ${err.message}`)
      failed++
    }

    await sleep(300)
  }

  console.log(`\n🎉 Correction terminée: ${fixed} corrigés, ${failed} échecs`)
}

fixMissingImages().catch(console.error)
