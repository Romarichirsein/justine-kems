export default {
  name: 'heroImage',
  title: 'Image Hero / Bannière',
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
