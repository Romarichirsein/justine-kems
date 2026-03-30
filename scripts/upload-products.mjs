/**
 * ═══════════════════════════════════════════════════════════════
 *  JUSTINE KEM'S — Bulk Product Upload Script (v2 - Robust)
 *  Uploads all product images to Sanity CMS with proper
 *  categories, prices, and metadata.
 *  Features: retry logic, stream upload, progress save/resume
 * ═══════════════════════════════════════════════════════════════
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// ── Sanity Config (with longer timeout) ────────────────────────
const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: 'skfTxtnsw5Ti44XAc7i7zIvwHeZ0lPGmCsk0XkII6Wk5njRAusPSUtRtGCDnXAbim8o0t0Gti2Y8wm4kqiN0kPKCuz3pHKzEqjbLwrB4ro3ShELeboLP7uTLqv0bFjsR2BK2a4JL4JaDzkJWmykJAUQSJXVr1FhreKI82KWCZqDcykjjKIHZ',
  requestTagPrefix: 'bulk-upload',
})

// ── Progress File (to resume interrupted uploads) ──────────────
const PROGRESS_FILE = path.resolve('scripts/.upload-progress.json')

function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'))
    }
  } catch (e) { /* ignore */ }
  return { completed: [] }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2))
}

// ── Category Mapping ───────────────────────────────────────────
const CATEGORY_MAP = {
  'Robes de mariages': {
    category: 'robes-mariage',
    occasion: ['mariage'],
    gender: 'femme',
    namePrefix: 'Robe de Mariage',
    descriptionFr: 'Robe de mariage haute couture, confectionnée sur mesure avec des tissus nobles et une finition artisanale. Création exclusive Justine Kem\'s.',
  },
  'Robes de soirées': {
    category: 'robes-soirees',
    occasion: ['gala'],
    gender: 'femme',
    namePrefix: 'Robe de Soirée',
    descriptionFr: 'Robe de soirée élégante, conçue pour briller lors de vos événements spéciaux. Création exclusive Justine Kem\'s.',
  },
  'Tenu de couple': {
    category: 'tenu-couple',
    occasion: ['mariage', 'gala'],
    gender: 'couple',
    namePrefix: 'Tenue de Couple',
    descriptionFr: 'Ensemble assorti pour couple, harmonisant style et élégance. Tenues coordonnées homme et femme. Création exclusive Justine Kem\'s.',
  },
  'Tenue traditionnels': {
    category: 'tenue-traditionnels',
    occasion: ['traditionnel', 'mariage'],
    gender: 'femme',
    namePrefix: 'Tenue Traditionnelle',
    descriptionFr: 'Tenue traditionnelle africaine sublimée par un savoir-faire haute couture. Mélange de tradition et de modernité. Création exclusive Justine Kem\'s.',
  },
  'etat civil': {
    category: 'etat-civil',
    occasion: ['civil'],
    gender: 'femme',
    namePrefix: 'Tenue d\'État Civil',
    descriptionFr: 'Tenue élégante et raffinée pour cérémonie civile. Sobriété et distinction garanties. Création exclusive Justine Kem\'s.',
  },
  'tenue de ville': {
    category: 'tenue-ville',
    occasion: ['quotidien'],
    gender: 'femme',
    namePrefix: 'Tenue de Ville',
    descriptionFr: 'Tenue de ville chic et moderne, parfaite pour le quotidien avec une touche d\'élégance. Création exclusive Justine Kem\'s.',
  },
}

// ── Price Parser ───────────────────────────────────────────────
function parsePrice(filename) {
  const name = path.parse(filename).name

  // Couple: h<price> ; f<price>
  const coupleRegex = /h\s*(\d+[\d.]*)\s*[;!',]+\s*f\s*(\d+[\d.]*)/i
  const coupleMatch = name.match(coupleRegex)
  if (coupleMatch) {
    return { isCouple: true, priceH: parsePriceValue(coupleMatch[1]), priceF: parsePriceValue(coupleMatch[2]) }
  }

  // Couple inverted: f<price> ; h<price>
  const coupleInvRegex = /f\s*(\d+[\d.]*)\s*[;!',]+\s*h\s*(\d+[\d.]*)/i
  const coupleInvMatch = name.match(coupleInvRegex)
  if (coupleInvMatch) {
    return { isCouple: true, priceF: parsePriceValue(coupleInvMatch[1]), priceH: parsePriceValue(coupleInvMatch[2]) }
  }

  // Couple alt: <price>; f<price>
  const coupleAltRegex = /^(\d+[\d.]*)\s*[;!',]+\s*f\s*(\d+[\d.]*)/i
  const coupleAltMatch = name.match(coupleAltRegex)
  if (coupleAltMatch) {
    return { isCouple: true, priceH: parsePriceValue(coupleAltMatch[1]), priceF: parsePriceValue(coupleAltMatch[2]) }
  }

  // Single price
  const singleRegex = /^(\d+[\d.]*)/
  const singleMatch = name.match(singleRegex)
  if (singleMatch) {
    return { isCouple: false, price: parsePriceValue(singleMatch[1]) }
  }

  return { isCouple: false, price: 0 }
}

function parsePriceValue(str) {
  const cleaned = str.replace(/\.$/g, '')
  if (/^\d+\.\d{3}$/.test(cleaned)) return parseInt(cleaned.replace('.', ''), 10)
  if (/^\d+(\.\d{3})+$/.test(cleaned)) return parseInt(cleaned.replace(/\./g, ''), 10)
  return parseInt(cleaned, 10) || 0
}

// ── Slug Generator ─────────────────────────────────────────────
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ── Retry Helper ───────────────────────────────────────────────
async function withRetry(fn, maxRetries = 3, label = '') {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const isLastAttempt = attempt === maxRetries
      const isTimeout = err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.message?.includes('timeout')

      if (isLastAttempt || !isTimeout) {
        throw err
      }

      const delay = attempt * 3000 // 3s, 6s, 9s
      console.log(`\n   ⏳ Retry ${attempt}/${maxRetries} for ${label} (waiting ${delay / 1000}s)...`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
}

// ── Upload Single Image with stream ────────────────────────────
async function uploadImage(filePath, filename) {
  const stream = fs.createReadStream(filePath)
  const contentType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg'

  return withRetry(async () => {
    // Create a fresh stream for each retry
    const readStream = fs.createReadStream(filePath)
    const asset = await client.assets.upload('image', readStream, {
      filename,
      contentType,
      timeout: 120000, // 2 minutes per file
    })
    return asset
  }, 3, filename)
}

// ── Main Upload Function ───────────────────────────────────────
async function uploadAllProducts() {
  const baseDir = path.resolve('Justine Kem\'s')

  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('  JUSTINE KEM\'S — Bulk Product Upload v2')
  console.log('═══════════════════════════════════════════════════════════\n')

  if (!fs.existsSync(baseDir)) {
    console.error(`❌ Directory not found: ${baseDir}`)
    process.exit(1)
  }

  // Load progress for resume capability
  const progress = loadProgress()
  const completedSet = new Set(progress.completed)
  if (completedSet.size > 0) {
    console.log(`📂 Resuming from previous run: ${completedSet.size} already done\n`)
  }

  // Check existing products in Sanity
  console.log('📋 Checking existing products in Sanity...')
  const existingProducts = await client.fetch('*[_type == "product"]{name, slug}')
  const existingSlugs = new Set(existingProducts.map(p => p.slug?.current).filter(Boolean))
  console.log(`   Found ${existingProducts.length} existing products\n`)

  // Scan all folders
  const folders = fs.readdirSync(baseDir).filter(f =>
    fs.statSync(path.join(baseDir, f)).isDirectory()
  )

  let totalImages = 0
  let uploaded = 0
  let skipped = 0
  let errors = 0
  const report = {}
  const startTime = Date.now()

  for (const folder of folders) {
    const config = CATEGORY_MAP[folder]
    if (!config) {
      console.log(`⚠️  Skipping unknown folder: "${folder}"`)
      continue
    }

    const folderPath = path.join(baseDir, folder)
    const files = fs.readdirSync(folderPath).filter(f =>
      /\.(jpg|jpeg|png|webp)$/i.test(f)
    )

    totalImages += files.length
    report[folder] = { total: files.length, uploaded: 0, skipped: 0, errors: 0 }

    console.log(`\n┌─────────────────────────────────────────────`)
    console.log(`│ 📂 ${folder}`)
    console.log(`│    ${files.length} images → category: "${config.category}"`)
    console.log(`└─────────────────────────────────────────────`)

    let counter = 1

    for (const file of files) {
      const fileKey = `${folder}/${file}`
      const filePath = path.join(folderPath, file)
      const priceInfo = parsePrice(file)
      const fileSize = fs.statSync(filePath).size
      const fileSizeMB = (fileSize / 1024 / 1024).toFixed(1)

      // Generate product name
      const productName = `${config.namePrefix} #${String(counter).padStart(3, '0')}`
      const slug = generateSlug(productName)

      // Skip if already completed in a previous run
      if (completedSet.has(fileKey)) {
        console.log(`   ⏭️  [${counter}/${files.length}] Resume-skip: ${productName}`)
        skipped++
        report[folder].skipped++
        counter++
        continue
      }

      // Skip if slug already exists in Sanity
      if (existingSlugs.has(slug)) {
        console.log(`   ⏭️  [${counter}/${files.length}] Exists: ${productName}`)
        skipped++
        report[folder].skipped++
        progress.completed.push(fileKey)
        saveProgress(progress)
        counter++
        continue
      }

      try {
        process.stdout.write(`   📤 [${counter}/${files.length}] ${productName} (${fileSizeMB}MB)...`)

        // Upload image with retry
        const asset = await uploadImage(filePath, file)

        // Build product document
        const doc = {
          _type: 'product',
          name: productName,
          slug: { _type: 'slug', current: slug },
          category: config.category,
          occasion: config.occasion,
          gender: config.gender,
          description: config.descriptionFr,
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt: `${productName} - ${config.namePrefix} par Justine Kem's`,
          },
          priceType: 'fixed',
          isFeatured: counter <= 2, // First 2 per category featured
          isNew: true,
        }

        // Set prices
        if (config.gender === 'couple' && priceInfo.isCouple) {
          doc.priceH = priceInfo.priceH
          doc.priceF = priceInfo.priceF
          doc.price = priceInfo.priceH + priceInfo.priceF
        } else if (config.gender === 'couple') {
          doc.priceF = Math.round((priceInfo.price || 0) * 0.6)
          doc.priceH = Math.round((priceInfo.price || 0) * 0.4)
          doc.price = priceInfo.price || 0
        } else {
          doc.price = priceInfo.price || 0
        }

        // Create in Sanity
        await withRetry(() => client.create(doc), 3, 'create-doc')
        existingSlugs.add(slug)

        // Save progress
        progress.completed.push(fileKey)
        saveProgress(progress)

        console.log(` ✅ ${formatPriceDisplay(doc)}`)
        uploaded++
        report[folder].uploaded++
      } catch (err) {
        console.log(` ❌ ${err.message?.substring(0, 80)}`)
        errors++
        report[folder].errors++
      }

      counter++

      // Delay between uploads (longer to avoid rate limiting on large files)
      await new Promise(r => setTimeout(r, 500))
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  // Final Report
  console.log('\n\n═══════════════════════════════════════════════════════════')
  console.log('  📊 UPLOAD REPORT')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`  Total images found:    ${totalImages}`)
  console.log(`  ✅ Uploaded:           ${uploaded}`)
  console.log(`  ⏭️  Skipped:           ${skipped}`)
  console.log(`  ❌ Errors:             ${errors}`)
  console.log(`  ⏱️  Time:              ${elapsed} minutes`)
  console.log('───────────────────────────────────────────────────────────')

  for (const [folder, stats] of Object.entries(report)) {
    console.log(`  📂 ${folder}`)
    console.log(`     → ${stats.uploaded}✅ ${stats.skipped}⏭️ ${stats.errors}❌`)
  }

  console.log('═══════════════════════════════════════════════════════════')

  if (errors === 0) {
    // Clean up progress file on full success
    if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE)
    console.log('  🎉 All done successfully!')
  } else {
    console.log(`  ⚠️  ${errors} errors. Run again to retry failed uploads.`)
  }

  console.log('═══════════════════════════════════════════════════════════\n')
}

function formatPriceDisplay(doc) {
  if (doc.gender === 'couple') {
    return `H: ${(doc.priceH || 0).toLocaleString()} / F: ${(doc.priceF || 0).toLocaleString()} FCFA`
  }
  return `${(doc.price || 0).toLocaleString()} FCFA`
}

// ── Execute ──
uploadAllProducts().catch(err => {
  console.error('\n💥 Fatal error:', err.message)
  console.log('💡 Run the script again to resume from where it stopped.')
  process.exit(1)
})
