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

const MAP_PATH = path.join(__dirname, "image-map.json");
const imageMap = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

const SPECIAL_IMAGES = [
  { fileName: "120.000 CV.jpg", title: "Justine Profil Portrait", type: "heroImage" },
  { fileName: "300.000 Q.jpg", title: "Bannière Mariage Prestige", type: "heroImage" },
  { fileName: "250.000 C.jpg", title: "Atelier Justine Boutique", type: "heroImage" },
  { fileName: "400.000 XXX.jpg", title: "Formation Couture Académie", type: "heroImage" },
  { fileName: "150.000.jpeg", title: "Soirée Elégance", type: "heroImage" }
];

async function main() {
  console.log("🏷️ Tagging special images for About and Formations pages...");
  
  for (const item of SPECIAL_IMAGES) {
    const assetId = imageMap[item.fileName];
    if (assetId) {
      console.log(`📡 Creating/Updating ${item.type}: ${item.title}...`);
      await client.createOrReplace({
        _type: item.type,
        _id: `special-${assetId}`,
        title: item.title,
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId }
        },
        caption: item.title,
        alt: item.title
      });
    } else {
      console.warn(`⚠️ Asset for ${item.fileName} not found in map.`);
    }
  }
  
  console.log("🎉 Special images tagged!");
}

main().catch(console.error);
