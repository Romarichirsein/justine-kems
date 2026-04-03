import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'd8v5zxvs',
  dataset: 'production',
  apiVersion: '2024-03-18',
  useCdn: false,
  token: 'skfTxtnsw5Ti44XAc7i7zIvwHeZ0lPGmCsk0XkII6Wk5njRAusPSUtRtGCDnXAbim8o0t0Gti2Y8wm4kqiN0kPKCuz3pHKzEqjbLwrB4ro3ShELeboLP7uTLqv0bFjsR2BK2a4JL4JaDzkJWmykJAUQSJXVr1FhreKI82KWCZqDcykjjKIHZ'
});

async function run() {
  const pageServicesDoc = {
    _id: 'pageServices',
    _type: 'pageServices',
    heroTitle: {
      fr: 'Un service pensé pour votre élégance',
      en: 'A service designed for your elegance'
    },
    heroSubtitle: {
      fr: 'Haute couture sur mesure, location de prestige, formations — l\'excellence à chaque étape.',
      en: 'Bespoke haute couture, prestige rental, training — excellence at every step.'
    },
    hauteCouture: {
      title: { fr: 'Haute Couture sur Mesure', en: 'Bespoke Haute Couture' },
      description: { 
        fr: 'De la prise de mesures à la livraison, vivez l\'expérience d\'une création entièrement pensée pour vous. Chaque pièce est unique, ajustée à votre morphologie et conçue selon vos envies.',
        en: 'From measurements to delivery, experience a creation entirely designed for you. Each piece is unique, adjusted to your morphology and designed according to your desires.'
      },
      pricing: { fr: 'À partir de 85 000 FCFA', en: 'From 85,000 FCFA' }
    },
    location: {
      title: { fr: 'Location de Tenues de Prestige', en: 'Prestige Outfit Rental' },
      description: {
        fr: 'Pour vos événements spéciaux, accédez à notre garde-robe exclusive. Robes de soirée, costumes sur-mesure, tenues de cérémonie prêtes à sublimer votre instant.',
        en: 'For your special events, access our exclusive wardrobe. Evening dresses, bespoke suits, ceremonial outfits ready to sublimate your moment.'
      },
      pricing: { fr: 'Dès 25 000 FCFA / jour', en: 'From 25,000 FCFA / day' }
    }
  };

  const pageFormationsDoc = {
    _id: 'pageFormations',
    _type: 'pageFormations',
    hero: {
      tagline: { fr: 'Académie Justine Kem\'s', en: 'Justine Kem\'s Academy' },
      title: { fr: 'Devenez Créatrice\nde Mode Professionnelle', en: 'Become a Professional\nFashion Designer' },
      subtitle: { fr: 'Formations certifiantes avec Justine Kem, forte de plus de 10 ans d\'expertise', en: 'Certified training with Justine Kem, with over 10 years of expertise' }
    },
    profil: {
      tagline: { fr: 'Votre Formatrice', en: 'Your Trainer' },
      name: 'Justine Kem',
      quote: { fr: '"J\'ai à cœur de transmettre les secrets de l\'élégance africaine et européenne. Chaque étudiante repartira avec les outils pour exceller — techniquement et professionnellement."', en: '"I am committed to transmitting the secrets of African and European elegance. Each student will leave with the tools to excel — technically and professionally."' },
      labels: { fr: '10+ Ans d\'expertise, Créatrice Senior, Mentor & Coach', en: '10+ Years of expertise, Senior Designer, Mentor & Coach' }
    }
  };

  const pageModelesDoc = {
    _id: 'pageModeles',
    _type: 'pageModeles',
    hero: {
      tagline: { fr: 'Collection exclusive', en: 'Exclusive collection' },
      title: { fr: 'Nos Modèles', en: 'Our Models' },
      desc: { fr: 'Chaque création est unique, taillée sur mesure avec passion et précision à Yaoundé, Cameroun.', en: 'Each creation is unique, tailor-made with passion and precision in Yaoundé, Cameroon.' }
    }
  };

  const pageCatalogueDoc = {
    _id: 'pageCatalogue',
    _type: 'pageCatalogue',
    hero: {
      title: { fr: 'Notre Catalogue', en: 'Our Catalogue' },
      subtitle: { fr: '{count} créations artisanales — Mode camerounaise d\'exception', en: '{count} artisanal creations — Exceptional Cameroonian fashion' }
    }
  };

  const pageTemoignagesDoc = {
    _id: 'pageTemoignages',
    _type: 'pageTemoignages',
    hero: {
      tagline: { fr: 'Elles témoignent', en: 'They testify' },
      title: { fr: 'Paroles de nos clientes', en: 'Words from our clients' },
      desc: { fr: 'Des centaines de femmes à travers le monde ont confié leur rêve à Justine Kem\'s. Voici ce qu\'elles en disent.', en: 'Hundreds of women around the world have entrusted their dream to Justine Kem\'s. Here is what they say.' }
    },
    written: {
      title: { fr: 'Témoignages écrits', en: 'Written testimonials' }
    },
    screenshots: {
      title: { fr: 'Captures d\'écran de clientes', en: 'Screenshots from clients' },
      desc: { fr: 'Messages WhatsApp, avis Facebook et Instagram — l\'authenticité de nos clientes.', en: 'WhatsApp messages, Facebook and Instagram reviews — the authenticity of our clients.' }
    }
  };

  const pageBlogDoc = {
    _id: 'pageBlog',
    _type: 'pageBlog',
    hero: {
      tagline: { fr: 'Journal de Mode', en: 'Fashion Diary' },
      title: { fr: 'Inspirations & Coulisses', en: 'Inspirations & Behind the Scenes' },
      subtitle: { fr: 'Plongez dans l\'univers Justine Kem\'s', en: 'Dive into the Justine Kem\'s universe' }
    }
  };

  console.log('Seeding pageServices...');
  await client.createOrReplace(pageServicesDoc);
  console.log('Seeding pageFormations...');
  await client.createOrReplace(pageFormationsDoc);
  console.log('Seeding pageModeles...');
  await client.createOrReplace(pageModelesDoc);
  console.log('Seeding pageCatalogue...');
  await client.createOrReplace(pageCatalogueDoc);
  console.log('Seeding pageTemoignages...');
  await client.createOrReplace(pageTemoignagesDoc);
  console.log('Seeding pageBlog...');
  await client.createOrReplace(pageBlogDoc);
  console.log('Done!');
}

run().catch(console.error);
