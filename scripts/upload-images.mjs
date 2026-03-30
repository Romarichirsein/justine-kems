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

const IMAGES_ROOT = path.join(__dirname, "../Justine Kem's");
const MAP_PATH = path.join(__dirname, "image-map.json");

// Load existing map
let imageMap = {};
if (fs.existsSync(MAP_PATH)) {
  try {
    imageMap = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
  } catch (e) {
    console.error("Failed to parse existing image-map.json, starting fresh.");
  }
}

async function uploadImage(filePath) {
  const fileName = path.basename(filePath);
  
  if (imageMap[fileName]) {
    console.log(`⏩ Skipping ${fileName} - Already in map.`);
    return imageMap[fileName];
  }

  try {
    console.log(`🚀 Uploading: ${fileName}...`);
    const buffer = fs.readFileSync(filePath);
    const asset = await client.assets.upload('image', buffer, {
      filename: fileName,
    });
    
    imageMap[fileName] = asset._id;
    // Save map incrementally
    fs.writeFileSync(MAP_PATH, JSON.stringify(imageMap, null, 2));
    console.log(`✅ Success: ${fileName} -> ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    return null;
  }
}

async function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await walkDir(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) {
        await uploadImage(fullPath);
      }
    }
  }
}

async function main() {
  console.log("🛠️ Starting Sanity Image Upload...");
  
  if (!env.SANITY_API_TOKEN) {
    console.error("❌ SANITY_API_TOKEN is missing in .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(IMAGES_ROOT)) {
    console.error(`❌ Source folder not found: ${IMAGES_ROOT}`);
    process.exit(1);
  }

  await walkDir(IMAGES_ROOT);
  console.log(`\n🎉 Finished! Processed images are mapped in: ${MAP_PATH}`);
}

main().catch(err => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
