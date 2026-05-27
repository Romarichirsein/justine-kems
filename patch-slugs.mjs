import { createClient } from '@sanity/client'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8')
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=')
  if (key && values.length > 0) {
    process.env[key.trim()] = values.join('=').trim()
  }
})

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd8v5zxvs',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

async function patchSlugs() {
  console.log('Fetching documents without slug...')
  const docs = await client.fetch(`*[_type in ["product", "modele"] && !defined(slug.current)] {
    _id,
    "name": coalesce(name.fr, name.en, name)
  }`)

  console.log(`Found ${docs.length} documents without slug.`)

  for (const doc of docs) {
    if (doc.name) {
      let baseSlug = slugify(doc.name)
      if (!baseSlug) baseSlug = 'article'
      
      // Ensure uniqueness by appending _id fragment
      const slug = `${baseSlug}-${doc._id.substring(0, 5)}`
      
      console.log(`Patching ${doc._id} with slug: ${slug}`)
      await client.patch(doc._id).set({ slug: { _type: 'slug', current: slug } }).commit()
    }
  }
  
  console.log('Done patching slugs!')
}

patchSlugs().catch(console.error)
