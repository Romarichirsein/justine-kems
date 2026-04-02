const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: true,
});

async function runStats() {
  try {
    const products = await client.fetch(`*[_type == "product"]{category}`);
    const count = products.length;
    
    const categories = products.reduce((acc, p) => {
      const cat = p.category || 'Sans catégorie';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    
    console.log('--- STATISTIQUES CATALOGUE ---');
    console.log(`Total Produits: ${count}`);
    console.log('Répartition par catégorie:');
    Object.entries(categories).forEach(([cat, n]) => {
      console.log(`- ${cat}: ${n}`);
    });
    console.log('------------------------------');
  } catch (err) {
    console.error('Erreur:', err.message);
  }
}

runStats();
