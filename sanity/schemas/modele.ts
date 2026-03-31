export default {
  name: 'modele',
  title: 'Modèle',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nom du modèle',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'mainImage',
      title: 'Photo principale',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif'
        }
      ]
    },
    {
      name: 'gallery',
      title: 'Galerie de photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Texte alternatif' }]
        }
      ]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'price',
      title: 'Prix (FCFA)',
      type: 'number'
    },
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Robes de Mariages', value: 'robes-mariage' },
          { title: 'Robes de Soirées', value: 'robes-soirees' },
          { title: 'Tenues de Couple', value: 'tenu-couple' },
          { title: 'Tenues Traditionnelles', value: 'tenue-traditionnels' },
          { title: 'État Civil', value: 'etat-civil' },
          { title: 'Tenues de Ville', value: 'tenue-ville' }
        ]
      }
    },
    {
      name: 'isAvailable',
      title: 'Disponible',
      type: 'boolean',
      initialValue: true
    }
  ]
}
