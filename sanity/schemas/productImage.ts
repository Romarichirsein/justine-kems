export default {
  name: 'productImage',
  title: 'Image de Produit / Modèle',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Fichier Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'alt',
      title: 'Texte alternatif (SEO)',
      type: 'string',
    },
    {
      name: 'caption',
      title: 'Légende',
      type: 'string',
    },
  ],
}
