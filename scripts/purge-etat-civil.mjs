import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: 'skfTxtnsw5Ti44XAc7i7zIvwHeZ0lPGmCsk0XkII6Wk5njRAusPSUtRtGCDnXAbim8o0t0Gti2Y8wm4kqiN0kPKCuz3pHKzEqjbLwrB4ro3ShELeboLP7uTLqv0bFjsR2BK2a4JL4JaDzkJWmykJAUQSJXVr1FhreKI82KWCZqDcykjjKIHZ',
})

async function purgeEtatCivil() {
  console.log('🔍 Fetching etat-civil products...')
  const products = await client.fetch('*[_type == "product" && category == "etat-civil"]{_id, name, _createdAt} | order(_createdAt desc)')
  
  console.log(`Found ${products.length} items. We only want the newest 30.`)
  if (products.length <= 30) {
    console.log('✅ Nothing to delete.')
    return
  }

  const toDelete = products.slice(30)
  console.log(`🗑️ Deleting ${toDelete.length} older etat-civil items...`)
  
  for (const p of toDelete) {
    try {
      await client.delete(p._id)
      console.log(`   Deleted: ${p.name} (Created: ${p._createdAt})`)
    } catch (e) {
      console.error(`   Failed to delete ${p.name}:`, e.message)
    }
  }

  const finalCount = await client.fetch('count(*[_type == "product" && category == "etat-civil"])')
  console.log(`🎉 Final etat-civil count: ${finalCount} (Expected: 30)`)
}

purgeEtatCivil().catch(console.error)
