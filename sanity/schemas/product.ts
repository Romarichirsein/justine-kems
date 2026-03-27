export default {
  name: 'product',
  title: 'Produit',
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
      options: { source: 'name', maxLength: 96 }
    },
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Haute Couture', value: 'haute-couture' },
          { title: 'Prêt-à-porter', value: 'pret-a-porter' },
          { title: 'Location', value: 'location' },
          { title: 'Accessoires', value: 'accessoires' }
        ]
      }
    },
    {
      name: 'occasion',
      title: 'Occasion',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Mariage', value: 'mariage' },
          { title: 'Gala', value: 'gala' },
          { title: 'Quotidien', value: 'quotidien' },
          { title: 'Professionnel', value: 'professionnel' }
        ]
      }
    },
    {
      name: 'mainImage',
      title: 'Image principale',
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
      title: 'Galerie photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt' }]
        }
      ]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'fabric',
      title: 'Tissu utilisé',
      type: 'string'
    },
    {
      name: 'price',
      title: 'Prix (FCFA)',
      type: 'number'
    },
    {
      name: 'priceType',
      title: 'Type de prix',
      type: 'string',
      options: {
        list: [
          { title: 'Prix fixe', value: 'fixed' },
          { title: 'Sur devis', value: 'quote' }
        ]
      }
    },
    {
      name: 'isFeatured',
      title: 'Coup de cœur',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'isNew',
      title: 'Nouveau',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'gender',
      title: 'Genre / Type',
      type: 'string',
      options: {
        list: [
          { title: 'Femme', value: 'femme' },
          { title: 'Homme', value: 'homme' },
          { title: 'Couple', value: 'couple' }
        ]
      }
    },
    {
      name: 'priceH',
      title: 'Prix Homme (pour Couple)',
      type: 'number',
      hidden: ({ document }: any) => document?.gender !== 'couple'
    },
    {
      name: 'priceF',
      title: 'Prix Femme (pour Couple)',
      type: 'number',
      hidden: ({ document }: any) => document?.gender !== 'couple'
    },
    {
      name: 'guideImages',
      title: 'Images Guides',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt' }]
        }
      ]
    }
  ]
}
