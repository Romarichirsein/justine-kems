export default {
  name: 'formation',
  title: 'Formation',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre de la formation',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'duration',
      title: 'Durée',
      type: 'string',
      description: 'Ex: 3 mois'
    },
    {
      name: 'level',
      title: 'Niveau',
      type: 'string',
      options: {
        list: ['Initiation', 'Intermédiaire', 'Avancé', 'Expert']
      }
    },
    {
      name: 'price',
      title: 'Tarif (FCFA)',
      type: 'number'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Titre du module' },
            { name: 'content', type: 'text', title: 'Contenu' }
          ]
        }
      ]
    },
    {
      name: 'objectives',
      title: 'Objectifs',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ]
}
