export default {
  name: 'article',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'title_fr',
      title: 'Titre (Français)',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'title_en',
      title: 'Titre (Anglais)',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title_fr', maxLength: 96 },
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
      title: 'Contenu (Portable Text)',
      type: 'array',
      of: [{ type: 'block' }]
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
