/**
 * Clean up old products with legacy categories before bulk upload.
 * Also checks the current state of Sanity.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: 'skfTxtnsw5Ti44XAc7i7zIvwHeZ0lPGmCsk0XkII6Wk5njRAusPSUtRtGCDnXAbim8o0t0Gti2Y8wm4kqiN0kPKCuz3pHKzEqjbLwrB4ro3ShELeboLP7uTLqv0bFjsR2BK2a4JL4JaDzkJWmykJAUQSJXVr1FhreKI82KWCZqDcykjjKIHZ',
})

async function cleanOldProducts() {
  console.log('🔍 Checking current products in Sanity...\n')

  const products = await client.fetch('*[_type == "product"]{_id, name, category, price}')
  console.log(`Found ${products.length} total products\n`)

  if (products.length === 0) {
    console.log('✅ No existing products — ready for fresh upload!')
    return
  }

  // Group by category
  const byCategory = {}
  for (const p of products) {
    const cat = p.category || 'uncategorized'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(p)
  }

  console.log('📊 Products by category:')
  for (const [cat, items] of Object.entries(byCategory)) {
    console.log(`   ${cat}: ${items.length} products`)
  }

  // Identify old-category products
  const oldCategories = ['haute-couture', 'pret-a-porter', 'location', 'accessoires']
  const oldProducts = products.filter(p => oldCategories.includes(p.category))

  if (oldProducts.length > 0) {
    console.log(`\n⚠️  Found ${oldProducts.length} products with OLD categories:`)
    for (const p of oldProducts) {
      console.log(`   - [${p.category}] ${p.name} (${p.price || 0} FCFA)`)
    }

    console.log(`\n🗑️  Deleting ${oldProducts.length} old products...`)
    for (const p of oldProducts) {
      await client.delete(p._id)
      console.log(`   Deleted: ${p.name}`)
    }
    console.log('✅ Old products cleaned!\n')
  } else {
    console.log('\n✅ No old-category products found.\n')
  }

  // Check remaining
  const remaining = await client.fetch('count(*[_type == "product"])')
  console.log(`📋 Products remaining after cleanup: ${remaining}`)
}

cleanOldProducts().catch(err => {
  console.error('💥 Error:', err)
  process.exit(1)
})
