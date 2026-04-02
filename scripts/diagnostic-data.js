const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: true,
});

async function findPatterns() {
  try {
    const products = await client.fetch(`*[_type == "product"]{_id, name, price, priceH, priceF, category, description, shortDescription}`);
    
    console.log('--- PRODUCTS SEARCH ---');
    const matches = products.filter(p => {
        const str = (p.name || '') + ' ' + (p.description || '') + ' ' + (p.shortDescription || '');
        return /[0-9]+[fFhH]/.test(str) || (p.category === 'tenu-couple');
    });

    console.log(`Found ${matches.length} potential matches.`);
    matches.slice(0, 10).forEach(m => {
        console.log(`- ID: ${m._id}\n  Name: ${m.name}\n  Category: ${m.category}\n  Price: ${m.price}\n  PriceF: ${m.priceF}\n  PriceH: ${m.priceH}`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

findPatterns();
