export default {
  name: 'gallery',
  title: 'Galerie Générale',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nom de la galerie',
      type: 'string',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'title',
              title: 'Titre',
              type: 'string',
            },
            {
              name: 'alt',
              title: 'Texte alternatif',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Légende',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
}
