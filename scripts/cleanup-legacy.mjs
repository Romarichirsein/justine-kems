import { createClient } from '@sanity/client'
import fs from 'fs'

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: 'skfTxtnsw5Ti44XAc7i7zIvwHeZ0lPGmCsk0XkII6Wk5njRAusPSUtRtGCDnXAbim8o0t0Gti2Y8wm4kqiN0kPKCuz3pHKzEqjbLwrB4ro3ShELeboLP7uTLqv0bFjsR2BK2a4JL4JaDzkJWmykJAUQSJXVr1FhreKI82KWCZqDcykjjKIHZ',
})

const LEGACY_CATEGORIES = ['mariage', 'mariages', 'soiree', 'traditionnel', 'ville']

async function cleanupLegacy() {
  console.log('🔍 Fetching all products from Sanity...')
  const products = await client.fetch('*[_type == "product"]{_id, name, category, _createdAt}')
  
  // 1. Save backup
  fs.writeFileSync('scripts/sanity-backup-before-cleanup.json', JSON.stringify(products, null, 2))
  console.log(`💾 Backup saved: ${products.length} products to sanity-backup-before-cleanup.json`)

  // 2. Identify products with old categories
  const legacyProducts = products.filter(p => LEGACY_CATEGORIES.includes(p.category))
  console.log(`\n🗑️ Found ${legacyProducts.length} products in legacy categories. Deleting...`)
  
  for (const p of legacyProducts) {
    try {
      await client.delete(p._id)
      console.log(`   Deleted [${p.category}]: ${p.name}`)
    } catch (e) {
      console.error(`   Failed to delete ${p.name}:`, e.message)
    }
  }

  // 3. Remove duplicates in the valid categories (keep newest)
  const validProducts = products.filter(p => !LEGACY_CATEGORIES.includes(p.category))
  const byName = {}
  for (const p of validProducts) {
    if (!byName[p.name]) byName[p.name] = []
    byName[p.name].push(p)
  }

  const duplicatesToDelete = []
  for (const [name, items] of Object.entries(byName)) {
    if (items.length > 1) {
      // Sort by _createdAt descending (newest first)
      items.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt))
      
      // The first item is the newest, keep it. Add the rest to delete list.
      const toDelete = items.slice(1)
      duplicatesToDelete.push(...toDelete)
    }
  }

  if (duplicatesToDelete.length > 0) {
    console.log(`\n🗑️ Found ${duplicatesToDelete.length} duplicates in valid categories. Deleting older ones...`)
    for (const p of duplicatesToDelete) {
      try {
        await client.delete(p._id)
        console.log(`   Deleted duplicate [${p.category}]: ${p.name}`)
      } catch (e) {
        console.error(`   Failed to delete duplicate ${p.name}:`, e.message)
      }
    }
  } else {
    console.log('\n✅ No duplicates found in valid categories.')
  }

  // 4. Final Verification
  const finalCount = await client.fetch('count(*[_type == "product"])')
  console.log(`\n🎉 Cleanup complete! Final total products in Sanity: ${finalCount} (Expected: ~230-231)`)
}

cleanupLegacy().catch(console.error)
