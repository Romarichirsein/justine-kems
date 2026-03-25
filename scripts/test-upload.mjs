// Test rapide pour déboguer les erreurs d'upload Sanity
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

console.log('Token présent:', !!process.env.SANITY_API_TOKEN)
console.log('Token début:', process.env.SANITY_API_TOKEN?.slice(0, 10) + '...')

// Trouver une image test
const testFolder = path.join(ROOT, 'public/catalogue/etat-civil')
const files = fs.readdirSync(testFolder).filter(f => /\.(jpg|jpeg|png)$/i.test(f))
const testFile = path.join(testFolder, files[0])
console.log('Image test:', testFile)
console.log('Fichier existe:', fs.existsSync(testFile))
console.log('Taille:', fs.statSync(testFile).size, 'bytes')

try {
  const buffer = fs.readFileSync(testFile)
  console.log('\n📤 Tentative d\'upload...')
  const asset = await client.assets.upload('image', buffer, {
    filename: files[0],
    contentType: 'image/jpeg',
  })
  console.log('✅ Upload réussi! Asset ID:', asset._id)
} catch (err) {
  console.error('❌ Erreur complète:', err)
  console.error('Status:', err.statusCode)
  console.error('Message:', err.message)
  console.error('Response:', err.response?.body)
}
