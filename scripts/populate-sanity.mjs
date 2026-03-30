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

if (!fs.existsSync(MAP_PATH)) {
  console.error("❌ image-map.json not found. Run upload-images.mjs first.");
  process.exit(1);
}

const imageMap = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

// ✅ CORRECTED CATEGORY_MAP - must match EXACTLY the UI filter keys in CatalogClient.tsx
// UI expects: 'mariages', 'soirees', 'couple', 'traditionnels', 'etat-civil', 'ville'
const CATEGORY_MAP = {
  "Robes de mariages":   "mariages",
  "Robes de soirées":   "soirees",
  "Tenu de couple":     "couple",
  "Tenue traditionnels": "traditionnels",
  "etat civil":         "etat-civil",
  "tenue de ville":     "ville"
};

function parsePriceAndGender(fileName) {
  const name = fileName.toLowerCase();
  let price = 0;
  let priceH = 0;
  let priceF = 0;
  let gender = 'both';

  // Extract numbers (e.g. 150.000 -> 150000)
  const numbers = name.match(/\d+(\.\d+)?/g);
  if (numbers) {
    if (name.includes(';') || (name.includes('h') && name.includes('f'))) {
      // Couple price logic
      const hMatch = name.match(/h\s*(\d+(?:\.\d+)?)/);
      const fMatch = name.match(/f\s*(\d+(?:\.\d+)?)/);
      if (hMatch) priceH = parseInt(hMatch[1].replace(/\./g, ''));
      if (fMatch) priceF = parseInt(fMatch[1].replace(/\./g, ''));
      gender = 'both';
    } else {
      price = parseInt(numbers[0].replace(/\./g, ''));
      if (name.includes('f')) gender = 'female';
      if (name.includes('h')) gender = 'male';
    }
  }

  return { price, priceH, priceF, gender };
}

async function createDoc(fileName, category, assetId) {
  const { price, priceH, priceF, gender } = parsePriceAndGender(fileName);
  const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");

  // 1. Create product document
  const productDoc = {
    _type: 'product',
    _id: `product-${assetId}`,
    name: cleanName,
    slug: {
      _type: 'slug',
      current: cleanName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + assetId.slice(-6)
    },
    category: category,
    occasion: (category === 'mariage' || category === 'etat-civil') ? 'mariage' : (category === 'soiree' ? 'soiree' : 'autre'),
    price: price,
    priceH: priceH,
    priceF: priceF,
    gender: gender,
    mainImage: {
      _type: 'image',
      asset: {
        _type: "reference",
        _ref: assetId
      }
    },
    isFeatured: price > 300000 || category === 'mariage',
    isNew: true
  };

  // 2. Create productImage document (for sliders)
  const productImageDoc = {
    _type: 'productImage',
    _id: `prodimg-${assetId}`,
    title: `${category} ${cleanName}`,
    image: {
      _type: 'image',
      asset: {
        _type: "reference",
        _ref: assetId
      }
    },
    alt: `${category} - ${cleanName}`
  };

  // 3. Optional Hero (if high price or wedding)
  if (price > 400000 || (category === 'mariage' && Math.random() > 0.8)) {
     await client.createOrReplace({
        _type: 'heroImage',
        _id: `hero-${assetId}`,
        title: `Hero ${category} ${price}`,
        image: productDoc.mainImage,
        caption: `Collection Prestige - ${category}`
     });
  }

  try {
    console.log(`📡 Creating docs for ${fileName}...`);
    await client.createOrReplace(productDoc);
    await client.createOrReplace(productImageDoc);
    return true;
  } catch (err) {
    console.error(`❌ Error creating docs for ${fileName}:`, err.message);
    return false;
  }
}

async function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
       await walkDir(fullPath);
    } else {
      const fileName = path.basename(file);
      const assetId = imageMap[fileName];
      if (assetId) {
        const relativeFolder = path.basename(path.dirname(fullPath));
        const category = CATEGORY_MAP[relativeFolder] || 'autre';
        await createDoc(fileName, category, assetId);
      }
    }
  }
}

async function main() {
  console.log("🏙️ Starting Sanity Data Population...");
  if (!env.SANITY_API_TOKEN) {
    console.error("❌ SANITY_API_TOKEN is missing.");
    process.exit(1);
  }

  await walkDir(IMAGES_ROOT);
  
  // Add some specific Hero images if none were created
  console.log("\n🎉 Population finished!");
}

main().catch(err => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
