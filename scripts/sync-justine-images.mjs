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
  const name = path.parse(filename).name.toLowerCase().trim();
  
  const findPrice = (str) => {
    const match = str.match(/[\d.]+/);
    return match ? parseInt(match[0].replace(/\./g, ''), 10) : 0;
  };

  // 1. Couple Regex
  const coupleMatch = name.match(/([hf])?\s*([\d.]+)\s*[;!',\s]+\s*([hf])\s*([\d.]+)/);
  if (coupleMatch) {
    const t1 = coupleMatch[1] || 'h';
    const p1 = findPrice(coupleMatch[2]);
    const t2 = coupleMatch[3];
    const p2 = findPrice(coupleMatch[4]);

    const priceH = t1 === 'h' ? p1 : p2;
    const priceF = t1 === 'f' ? p1 : p2;
    
    return { 
      price: priceH + priceF, 
      priceF, 
      priceH, 
      gender: 'couple' 
    };
  }

  // 2. Single Regex
  const price = findPrice(name);
  let gender = defaultGender;
  if (name.includes('h')) gender = 'homme';
  else if (name.includes('f')) gender = 'femme';

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
