import { createClient } from '@sanity/client';
const client = createClient({ projectId: 'd8v5zxvs', dataset: 'production', apiVersion: '2024-03-18', useCdn: false });

async function run() {
  // Count all documents by type
  const types = await client.fetch('array::unique(*[]._type)');
  console.log('ALL TYPES IN SANITY:', types);
  
  const modele = await client.fetch('*[_type == "modele"] | order(_createdAt desc) { _id, title, _createdAt }');
  console.log('\n--- _type=modele count:', modele.length, '---');
  if (modele.length > 0) console.log(JSON.stringify(modele[0], null, 2));
  
  const product = await client.fetch('*[_type == "product"] | order(_createdAt desc) { _id, name, _createdAt }');
  console.log('\n--- _type=product count:', product.length, '---');
  if (product.length > 0) console.log(JSON.stringify(product[0], null, 2));
}
run().catch(console.error);
