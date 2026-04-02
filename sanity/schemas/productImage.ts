export default {
  name: 'productImage',
  title: 'Image de Produit / Modèle',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français' },
        { name: 'en', type: 'string', title: 'Anglais' }
      ]
    },
    {
      name: 'image',
      title: 'Fichier Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'alt',
      title: 'Texte alternatif',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français' },
        { name: 'en', type: 'string', title: 'Anglais' }
      ]
    },
    {
      name: 'caption',
      title: 'Légende',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français' },
        { name: 'en', type: 'string', title: 'Anglais' }
      ]
    }
  ]
}
