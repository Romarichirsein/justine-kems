export default {
  name: 'gallery',
  title: 'Galerie Générale',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nom de la galerie',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français' },
        { name: 'en', type: 'string', title: 'Anglais' }
      ]
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
              type: 'object',
              fields: [
                { name: 'fr', type: 'string', title: 'Français' },
                { name: 'en', type: 'string', title: 'Anglais' }
              ]
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
      ]
    }
  ]
}
