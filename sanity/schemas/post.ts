export default {
  name: 'post',
  title: 'Article de blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 }
    },
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Mode', value: 'mode' },
          { title: 'Tendances', value: 'tendances' },
          { title: 'Conseil couture', value: 'conseil' },
          { title: 'Behind the scenes', value: 'backstage' },
          { title: 'Événements', value: 'evenements' }
        ]
      }
    },
    {
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      rows: 3
    },
    {
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime'
    },
    {
      name: 'readingTime',
      title: 'Temps de lecture (min)',
      type: 'number'
    }
  ]
}
