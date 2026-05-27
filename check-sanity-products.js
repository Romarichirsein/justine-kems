import { createClient } from '@sanity/client'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=')
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim()
  }
})

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[#]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function productSlug(name, reference) {
  const fullName = reference ? `${name} ${reference}` : name;
  return slugify(fullName);
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd8v5zxvs',
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
})

async function run() {
  const products = await client.fetch(`*[_type in ["product", "modele"]]{ _id, name, reference }`)
  console.log(`Found ${products.length} products:`)
  products.forEach(p => {
    const nameFr = p.name?.fr || p.name;
    const slug = productSlug(nameFr || '', p.reference);
    console.log(`- ID: ${p._id} | Name (FR): ${nameFr} | Ref: ${p.reference} | Computed Slug: ${slug}`)
  })
}

run()
