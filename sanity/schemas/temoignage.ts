export default {
  name: 'temoignage',
  title: 'Témoignages',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nom du client',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'photo',
      title: 'Photo du client',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'content_fr',
      title: 'Texte du témoignage (Français)',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'content_en',
      title: 'Texte du témoignage (Anglais)',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'rating',
      title: 'Note (1 à 5 étoiles)',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(5).precision(0)
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      }
    },
    {
      name: 'isVisible',
      title: 'Affiché sur le site',
      type: 'boolean',
      initialValue: true
    }
  ]
}
