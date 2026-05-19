// scripts/update-testimonials.js
const fs = require('fs');
const path = require('path');

let projectId = 'd8v5zxvs';
let dataset = 'production';
let token = '';

// Read .env.local manually
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key === 'NEXT_PUBLIC_SANITY_PROJECT_ID') projectId = value;
        if (key === 'NEXT_PUBLIC_SANITY_DATASET') dataset = value;
        if (key === 'SANITY_API_TOKEN') token = value;
      }
    });
  }
} catch (e) {
  console.error('Error loading .env.local', e);
}

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-18',
  useCdn: false,
  token,
});

async function run() {
  console.log('🚀 Starting testimonials database update...');

  // 1. Fetch current testimonials
  const existing = await client.fetch('*[_type == "temoignage"]');
  console.log(`Found ${existing.length} existing testimonials.`);

  // Define detailed updates for the existing ones
  const updates = [
    {
      id: "ReG8cor2CRZQPja7miOBua", // Cliente 1
      name: "Sandrine Ndongo",
      content_fr: "J'ai bien reçu ma commande aujourd'hui et franchement je suis trop contente. C'est vraiment parfait, comme d'habitude. Ma robe de cérémonie est d'un raffinement incroyable et les mesures sont exactes. Merci beaucoup pour ton talent exceptionnel ainsi que ton travail soigné !",
      content_en: "I received my order today and honestly I am so happy. It is truly perfect, as always. My ceremonial dress is incredibly refined and the measurements are exact. Thank you so much for your exceptional talent and neat work!",
    },
    {
      id: "HDlNiVeMvqybGjkmB7Mas5", // Marie-Claire K.
      name: "Marie-Claire K.",
      content_fr: "Un professionnalisme exemplaire. Les finitions de mon ensemble en bazin brodé sont dignes des plus grandes maisons de couture européennes. J'ai fait sensation à la cérémonie de mariage et tout le monde m'a demandé d'où venait ma création !",
      content_en: "Exemplary professionalism. The finishes on my embroidered bazin outfit are worthy of the greatest European fashion houses. I made a splash at the wedding ceremony and everyone asked me where my creation came from!",
    },
    {
      id: "ReG8cor2CRZQPja7miOC96", // Inès T.
      name: "Inès T.",
      content_fr: "Même à distance depuis Paris, la communication et la prise de mesures guidée ont été parfaites. Ma robe de mariée civile est arrivée dans un coffret impeccable, sans aucun pli. Elle tombe à la perfection ! Merci Justine pour ton écoute attentionnée.",
      content_en: "Even from afar in Paris, communication and guided measurement taking were perfect. My civil wedding dress arrived in an impeccable box, without any creases. It fits perfectly! Thank you Justine for your attentive listening.",
    },
    {
      id: "wYVuc5B3ng1LhvUVcMaUcB", // Amina D.
      name: "Amina D.",
      content_fr: "Je cherchais une créatrice talentueuse capable de marier les textiles africains avec des coupes modernes de haute couture. Justine a dépassé toutes mes attentes ! Le mix de wax hollandais et de dentelle fine est une véritable œuvre d'art.",
      content_en: "I was looking for a talented designer capable of combining African textiles with modern haute couture cuts. Justine exceeded all my expectations! The mix of Dutch wax and fine lace is a true work of art.",
    }
  ];

  // Perform updates
  for (const item of updates) {
    const doc = existing.find(d => d._id === item.id);
    if (doc) {
      console.log(`Updating testimonial for: ${doc.name} -> ${item.name}`);
      await client
        .patch(item.id)
        .set({
          name: item.name,
          content_fr: item.content_fr,
          content_en: item.content_en,
          content: {
            fr: item.content_fr,
            en: item.content_en
          }
        })
        .commit();
      console.log(`  ✅ Successfully updated ${item.name}`);
    } else {
      console.log(`  ⚠️ Testimonial with ID ${item.id} not found.`);
    }
  }

  // 2. Add two more beautiful testimonials to have 6 items (perfect layout grid)
  const additional = [
    {
      _type: "temoignage",
      name: "Serena B.",
      content_fr: "Justine a su créer la robe de mes rêves pour mon mariage traditionnel à Yaoundé. Le souci du détail, la qualité des broderies fil d'or et la justesse de la coupe sont exceptionnels. Une expérience mémorable de bout en bout !",
      content_en: "Justine was able to create the dress of my dreams for my traditional wedding in Yaoundé. The attention to detail, the quality of the gold thread embroideries and the accuracy of the cut are exceptional. A memorable experience!",
      content: {
        fr: "Justine a su créer la robe de mes rêves pour mon mariage traditionnel à Yaoundé. Le souci du détail, la qualité des broderies fil d'or et la justesse de la coupe sont exceptionnels. Une expérience mémorable de bout en bout !",
        en: "Justine was able to create the dress of my dreams for my traditional wedding in Yaoundé. The attention to detail, the quality of the gold thread embroideries and the accuracy of the cut are exceptional. A memorable experience!"
      },
      rating: 5,
      date: "2026-04-10",
      isVisible: true
    },
    {
      _type: "temoignage",
      name: "Fatou N.",
      content_fr: "Rapide, à l'écoute et extrêmement douée. J'ai commandé deux boubous d'apparat depuis Dakar et la livraison a été rapide et impeccable. La qualité du bazin damassé brodé a ébloui tous mes proches. Je recommande !",
      content_en: "Fast, attentive and extremely talented. I ordered two ceremonial boubous from Dakar and the delivery was fast and impeccable. The quality of the embroidered damask bazin dazzled all my relatives. I highly recommend!",
      content: {
        fr: "Rapide, à l'écoute et extrêmement douée. J'ai commandé deux boubous d'apparat depuis Dakar et la livraison a été rapide et impeccable. La qualité du bazin damassé brodé a ébloui tous mes proches. Je recommande !",
        en: "Fast, attentive and extremely talented. I ordered two ceremonial boubous from Dakar and the delivery was fast and impeccable. The quality of the embroidered damask bazin dazzled all my relatives. I highly recommend!"
      },
      rating: 5,
      date: "2026-04-15",
      isVisible: true
    }
  ];

  for (const item of additional) {
    const exists = existing.some(d => d.name === item.name);
    if (!exists) {
      console.log(`Creating new testimonial for ${item.name}...`);
      await client.create(item);
      console.log(`  ✅ Successfully created testimonial for ${item.name}`);
    } else {
      console.log(`  ℹ️ Testimonial for ${item.name} already exists. Skipping.`);
    }
  }

  console.log('🎉 Testimonials database update complete!');
}

run().catch(console.error);
