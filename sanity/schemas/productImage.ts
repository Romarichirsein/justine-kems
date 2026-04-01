export default {
  name: 'productImage',
  title: 'Image de Produit / Modèle',
  type: 'document',
  fields: [
    {
      name: 'title_fr',
      title: 'Titre (Français)',
      type: 'string',
    },
    {
      name: 'title_en',
      title: 'Titre (Anglais)',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Fichier Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'alt_fr',
      title: 'Texte alternatif (Français)',
      type: 'string',
    },
    {
      name: 'alt_en',
      title: 'Texte alternatif (Anglais)',
      type: 'string',
    },
    {
      name: 'caption_fr',
      title: 'Légende (Français)',
      type: 'string',
    },
    {
      name: 'caption_en',
      title: 'Légende (Anglais)',
      type: 'string',
    },
  ],
}
