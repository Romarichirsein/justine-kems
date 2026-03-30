import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal env parser
const envPath = path.join(__dirname, '../.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd8v5zxvs',
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-18',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
});

// Old wrong categories to delete
const OLD_CATEGORIES = ['mariage', 'soiree', 'traditionnel'];

async function main() {
  console.log('🧹 Starting cleanup of old wrong-category products...');
  
  if (!env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN is missing.');
    process.exit(1);
  }

  // Find all products with old wrong categories
  for (const cat of OLD_CATEGORIES) {
    const docs = await client.fetch(
      `*[_type == "product" && category == $cat]{_id, category}`,
      { cat }
    );
    console.log(`Found ${docs.length} products with category="${cat}" to delete...`);
    
    for (const doc of docs) {
      await client.delete(doc._id);
      // Also delete matching productImage
      const imgId = doc._id.replace('product-', 'prodimg-');
      await client.delete(imgId).catch(() => {}); // ignore if not found
    }
    console.log(`✅ Deleted all products with category="${cat}"`);
  }

  // Also count what remains
  const remaining = await client.fetch('*[_type == "product"] | order(category asc) {category}');
  const counts = {};
  remaining.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  
  console.log('\n📊 Remaining products per category after cleanup:');
  Object.entries(counts).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} products`);
  });

  console.log('\n🎉 Cleanup done! Now run populate-sanity.mjs');
}

main().catch(console.error);
