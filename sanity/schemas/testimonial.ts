export default {
  name: 'testimonial',
  title: 'Témoignage',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Prénom',
      type: 'string'
    },
    {
      name: 'city',
      title: 'Ville',
      type: 'string'
    },
    {
      name: 'content',
      title: 'Témoignage',
      type: 'text'
    },
    {
      name: 'rating',
      title: 'Note (sur 5)',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(5)
    },
    {
      name: 'avatar',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Client Haute Couture', value: 'client' },
          { title: 'Étudiante Formation', value: 'student' },
          { title: 'Mariage', value: 'mariage' },
          { title: 'Soirée', value: 'soiree' },
          { title: 'Formation', value: 'formation' },
          { title: 'Quotidien', value: 'quotidien' },
          { title: 'Traditionnel', value: 'traditionnel' }
        ]
      }
    }
  ]
}
