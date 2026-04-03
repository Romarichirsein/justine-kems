const localTextFields = [
  { name: 'fr', title: 'Français', type: 'text' as const },
  { name: 'en', title: 'Anglais', type: 'text' as const }
]

const localStringFields = [
  { name: 'fr', title: 'Français', type: 'string' as const },
  { name: 'en', title: 'Anglais', type: 'string' as const }
]

export default {
  name: 'pageCatalogue',
  title: 'Page Catalogue (Textes)',
  type: 'document',
  fields: [
    {
      name: 'hero',
      title: 'Section : Hero',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre', type: 'object', fields: localStringFields },
        { name: 'subtitle', title: 'Sous-titre', type: 'object', fields: localTextFields }
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Catalogue' }
    }
  }
}
