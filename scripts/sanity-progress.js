const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: 'skfTxtnsw5Ti44XAc7i7zIvwHeZ0lPGmCsk0XkII6Wk5njRAusPSUtRtGCDnXAbim8o0t0Gti2Y8wm4kqiN0kPKCuz3pHKzEqjbLwrB4ro3ShELeboLP7uTLqv0bFjsR2BK2a4JL4JaDzkJWmykJAUQSJXVr1FhreKI82KWCZqDcykjjKIHZ',
});

async function checkProgress() {
  try {
    const total = await client.fetch('count(*[_type == "product"])');
    const categories = await client.fetch(`*[_type == "product"]{category} | order(category asc)`);
    
    const stats = categories.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\n--- PROGRESS IN SANITY ---');
    console.log(`TOTAL PRODUCTS: ${total}`);
    console.log('\n--- BY CATEGORY ---');
    for (const [cat, count] of Object.entries(stats)) {
      console.log(`${cat}: ${count}`);
    }
  } catch (err) {
    console.error('Error querying Sanity:', err.message);
  }
}

checkProgress();
