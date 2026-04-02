import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

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

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function createDoc(doc) {
  try {
    const result = await client.createOrReplace(doc)
    console.log(`  ✅ Créé: ${doc._type} — ${result._id}`)
    return result
  } catch (err) {
    console.error(`  ❌ Erreur document:`, err.message)
  }
}

async function seedFormations() {
  const formations = [
    {
      _id: 'formation-couture-debutant',
      _type: 'formation',
      title: { fr: 'Couture Créative — Niveau Débutant', en: 'Creative Sewing — Beginner Level' },
      slug: { _type: 'slug', current: 'couture-creative-debutant' },
      duration: '3 mois',
      level: 'debutant',
      price: 50000,
      description: { 
        fr: 'Apprenez les bases de la couture avec Justine Kems. Formation pratique pour débutants.',
        en: 'Learn the basics of sewing with Justine Kems. Practical training for beginners.'
      },
    },
  ]
  for (const formation of formations) { await createDoc(formation) }
}

async function seedTestimonials() {
  const testimonials = [
    {
      _id: 'testimonial-1',
      _type: 'temoignage',
      name: 'Aminata N.',
      content: {
        fr: 'Un travail extraordinaire, des finitions impeccables.',
        en: 'Extraordinary work, impeccable finishes.'
      },
      rating: 5,
    },
  ]
  for (const t of testimonials) { await createDoc(t) }
}

async function seedBlogPosts() {
  const posts = [
    {
      _id: 'post-choisir-robe-mariage',
      _type: 'article',
      title: { fr: 'Comment choisir sa robe de mariage', en: 'How to choose your wedding dress' },
      slug: { _type: 'slug', current: 'choisir-robe-mariage' },
      category: 'mode',
      publishedAt: '2024-06-01T12:00:00Z',
      content: {
        fr: [
          { _type: 'block', _key: 'b1', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's1', text: 'Le choix de la robe de mariage de mariage...', marks: [] }] }
        ],
        en: [
          { _type: 'block', _key: 'b1', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's1', text: 'Choosing a wedding dress...', marks: [] }] }
        ]
      }
    }
  ]
  for (const p of posts) { await createDoc(p) }
}

async function main() {
  console.log('🚀 Démarrage du seeding Bilingue Sanity pour Justine Kems')
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN manquant!')
    process.exit(1)
  }
  await seedFormations()
  await seedTestimonials()
  await seedBlogPosts()
  console.log('🎉 Seeding bilingue terminé avec succès !')
}

main()
