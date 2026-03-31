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
        list: ['Débutant', 'Intermédiaire', 'Avancé']
      }
    },
    {
      name: 'price',
      title: 'Prix (FCFA)',
      type: 'number'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'registrationLink',
      title: "Lien d'inscription",
      type: 'url'
    },
    {
      name: 'isAvailable',
      title: 'Disponible',
      type: 'boolean',
      initialValue: true
    }
  ]
}
