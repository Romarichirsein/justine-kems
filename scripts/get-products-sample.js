const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: true,
});

async function getSample() {
  try {
    const products = await client.fetch(`*[_type == "product" && category == "tenu-couple"][0..5]{_id, name, price, priceH, priceF, category, shortDescription, description}`);
    console.log('--- COUPLE PRODUCTS ---');
    console.log(JSON.stringify(products, null, 2));

    const all = await client.fetch(`*[_type == "product"][0..10]{_id, name, price, priceH, priceF, category, shortDescription, description}`);
    console.log('--- ALL PRODUCTS SAMPLE ---');
    console.log(JSON.stringify(all, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

getSample();
