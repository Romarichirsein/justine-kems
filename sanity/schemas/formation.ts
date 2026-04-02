export default {
  name: 'formation',
  title: 'Formation',
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
      options: { source: 'title.fr' },
      validation: (Rule: any) => Rule.required()
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
        list: [
          { title: 'Débutant', value: 'debutant' },
          { title: 'Intermédiaire', value: 'intermediaire' },
          { title: 'Avancé', value: 'avance' }
        ]
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
      type: 'object',
      fields: [
        { name: 'fr', type: 'text', title: 'Français' },
        { name: 'en', type: 'text', title: 'Anglais' }
      ]
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
