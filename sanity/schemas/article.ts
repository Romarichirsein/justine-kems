export default {
  name: 'article',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français', validation: (Rule: any) => Rule.required() },
        { name: 'en', type: 'string', title: 'Anglais', validation: (Rule: any) => Rule.required() }
      ]
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.fr', maxLength: 96 },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'mainImage',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Texte alternatif' }]
    },
    {
      name: 'content',
      title: 'Contenu complet',
      type: 'object',
      fields: [
        { name: 'fr', type: 'array', of: [{ type: 'block' }], title: 'Français' },
        { name: 'en', type: 'array', of: [{ type: 'block' }], title: 'Anglais' }
      ]
    },
    {
      name: 'author',
      title: 'Auteur',
      type: 'string'
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Mode', value: 'mode' },
          { title: 'Conseils', value: 'conseils' },
          { title: 'Événements', value: 'evenements' },
          { title: 'Nouveautés', value: 'nouveautes' }
        ]
      }
    },
    {
      name: 'isPublished',
      title: 'Publié',
      type: 'boolean',
      initialValue: true
    }
  ]
}
