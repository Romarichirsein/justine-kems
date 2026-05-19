// scripts/dump-testimonials.js
const fs = require('fs');
const path = require('path');

let projectId = 'd8v5zxvs';
let dataset = 'production';
let token = '';

// Read .env.local manually
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key === 'NEXT_PUBLIC_SANITY_PROJECT_ID') projectId = value;
        if (key === 'NEXT_PUBLIC_SANITY_DATASET') dataset = value;
        if (key === 'SANITY_API_TOKEN') token = value;
      }
    });
  }
} catch (e) {
  console.error('Error loading .env.local', e);
}

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-18',
  useCdn: false,
  token,
});

// Test query with locale = 'fr'
const query = `*[_type == "temoignage" && isVisible == true] | order(date desc) {
    _id,
    name,
    "avatar": photo.asset->url,
    "content": coalesce(
      content["fr"],
      select("fr" == "en" => content_en, content_fr),
      content.fr,
      content_fr,
      content.en,
      content_en,
      content
    ),
    rating,
    date
  }`;

client.fetch(query)
  .then(res => {
    console.log(`Fetched ${res.length} testimonials.`);
    console.log(JSON.stringify(res, null, 2));
  })
  .catch(err => {
    console.error('Fetch error:', err);
  });
