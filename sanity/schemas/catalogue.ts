export default {
  name: 'catalogue',
  title: 'Catalogue',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nom du produit',
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
      name: 'images',
      title: 'Images',
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
      name: 'shortDescription',
      title: 'Description courte',
      type: 'text',
      rows: 3
    },
    {
      name: 'longDescription',
      title: 'Description longue',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'price',
      title: 'Prix (FCFA)',
      type: 'number',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'promoPrice',
      title: 'Prix promotionnel (FCFA)',
      type: 'number'
    },
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Prêt-à-porter', value: 'pret-a-porter' },
          { title: 'Accessoires', value: 'accessoires' },
          { title: 'Sur mesure', value: 'sur-mesure' },
          { title: 'Collection Homme', value: 'homme' },
          { title: 'Collection Femme', value: 'femme' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'stock',
      title: 'Stock disponible',
      type: 'number',
      initialValue: 0
    }
  ]
}
