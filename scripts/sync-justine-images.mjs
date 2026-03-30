import { createClient } from '@sanity/client';
import fs from 'fs/promises';
import path from 'path';

const projectId = 'd8v5zxvs';
const dataset = 'production';
const token = 'skfTxtnsw5Ti44XAc7i7zIvwHeZ0lPGmCsk0XkII6Wk5njRAusPSUtRtGCDnXAbim8o0t0Gti2Y8wm4kqiN0kPKCuz3pHKzEqjbLwrB4ro3ShELeboLP7uTLqv0bFjsR2BK2a4JL4JaDzkJWmykJAUQSJXVr1FhreKI82KWCZqDcykjjKIHZ';
const apiVersion = '2024-03-18';

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

const IMAGES_ROOT = "c:\\Users\\COMPUTER STORES\\Downloads\\projets ia\\Projets des sites\\Site cameroun\\justine-kems\\Justine Kem's";

const FOLDER_MAP = {
  'Robes de mariages': { category: 'mariages', occasion: ['mariage'], defaultGender: 'femme' },
  'Robes de soirées': { category: 'soirees', occasion: ['gala'], defaultGender: 'femme' },
  'Tenu de couple': { category: 'couple', occasion: ['mariage'], defaultGender: 'couple' },
  'Tenue traditionnels': { category: 'traditionnels', occasion: ['mariage'], defaultGender: 'femme' },
  'etat civil': { category: 'etat-civil', occasion: ['mariage'], defaultGender: 'femme' },
  'tenue de ville': { category: 'ville', occasion: ['quotidien'], defaultGender: 'femme' }
};

async function parsePriceAndGender(filename, defaultGender) {
  // Remove extension
  const name = path.parse(filename).name;
  
  // Format Price: 150.000 -> 150000
  const findPrice = (str) => {
    const match = str.match(/\d+(\.\d+)*/);
    return match ? parseInt(match[0].replace(/\./g, ''), 10) : undefined;
  };

  // Rule: ignore a, c, v. Keep F or H.
  const hasF = /[F]/i.test(name);
  const hasH = /[H]/i.test(name);

  // If "Tenu de couple", might have two prices
  if (defaultGender === 'couple') {
    // Look for patterns like f150.000 and h100.000
    const parts = name.split(/[;!]/);
    let priceF, priceH;
    parts.forEach(p => {
      const clean = p.trim().toLowerCase();
      if (clean.includes('f')) priceF = findPrice(clean);
      else if (clean.includes('h')) priceH = findPrice(clean);
      else {
        // Fallback or second price
        const pr = findPrice(p);
        if (pr && !priceF) priceF = pr;
        else if (pr && !priceH) priceH = pr;
      }
    });
    return { 
      price: (priceF || 0) + (priceH || 0), 
      priceF, 
      priceH, 
      gender: 'couple' 
    };
  }

  const price = findPrice(name);
  let gender = defaultGender;
  if (hasH && !hasF) gender = 'homme';
  else if (hasF && !hasH) gender = 'femme';
  else if (hasF && hasH) gender = 'couple';

  return { price, gender };
}

async function sync() {
  console.log('🚀 Synchronisation des images Justine Kem\'s vers Sanity...\n');

  try {
    const folders = await fs.readdir(IMAGES_ROOT);

    for (const folderName of folders) {
      if (!FOLDER_MAP[folderName]) continue;
      
      const config = FOLDER_MAP[folderName];
      const folderPath = path.join(IMAGES_ROOT, folderName);
      const files = (await fs.readdir(folderPath)).filter(f => /\.(jpe?g|png)$/i.test(f));

      console.log(`📁 Dossier: ${folderName} (${files.length} images)`);

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const { price, gender, priceF, priceH } = await parsePriceAndGender(file, config.defaultGender);

        if (!price && !priceF && !priceH) {
          console.log(`  ⚠️  Ignoré: ${file} (aucun prix trouvé)`);
          continue;
        }

        const slug = `p-${folderName.toLowerCase().replace(/\s+/g, '-')}-${file.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        
        // Check if product already exists
        const existing = await client.fetch('*[_type == "product" && slug.current == $slug][0]', { slug });
        
        const doc = {
          _type: 'product',
          name: `${folderName} - ${price?.toLocaleString() || (priceF + '+' + priceH)}`,
          slug: { _type: 'slug', current: slug },
          category: config.category,
          occasion: config.occasion,
          price: price,
          priceF: priceF,
          priceH: priceH,
          gender: gender,
          priceType: 'fixed',
          isNew: true
        };

        if (existing) {
          console.log(`  🔄 Mise à jour: ${file} (Catégorie: ${config.category})`);
          await client.patch(existing._id).set(doc).commit();
          continue;
        }

        console.log(`  📤 Upload: ${file} | Prix: ${price || (priceH + '+' + priceF)} | Genre: ${gender}`);

        // 1. Upload Asset
        const fileContent = await fs.readFile(filePath);
        const asset = await client.assets.upload('image', fileContent, {
          filename: file,
          contentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg'
        });

        // 2. Create Product
        doc.mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id }
        };

        await client.create(doc);
        console.log(`  ✅ Créé: ${file}`);
      }
    }

    console.log('\n✨ Synchronisation terminée avec succès !');
  } catch (err) {
    console.error('\n💥 Erreur fatale:', err.message);
  }
}

sync();
