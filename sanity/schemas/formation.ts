export default {
  name: 'formation',
  title: 'Formation',
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
      options: { source: 'title_fr' },
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
      name: 'description_fr',
      title: 'Description (Français)',
      type: 'text'
    },
    {
      name: 'description_en',
      title: 'Description (Anglais)',
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
