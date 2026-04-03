const localTextFields = [
  { name: 'fr', title: 'Français', type: 'text' as const },
  { name: 'en', title: 'Anglais', type: 'text' as const }
]

const localStringFields = [
  { name: 'fr', title: 'Français', type: 'string' as const },
  { name: 'en', title: 'Anglais', type: 'string' as const }
]

export default {
  name: 'pageTemoignages',
  title: 'Page Témoignages (Textes)',
  type: 'document',
  fields: [
    {
      name: 'hero',
      title: 'Section : Hero',
      type: 'object',
      fields: [
        { name: 'tagline', title: 'Surtitre', type: 'object', fields: localStringFields },
        { name: 'title', title: 'Titre', type: 'object', fields: localStringFields },
        { name: 'desc', title: 'Description', type: 'object', fields: localTextFields }
      ]
    },
    {
      name: 'written',
      title: 'Section : Témoignages écrits',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre de la section', type: 'object', fields: localStringFields }
      ]
    },
    {
      name: 'screenshots',
      title: 'Section : Captures d\'écran',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre de la section', type: 'object', fields: localStringFields },
        { name: 'desc', title: 'Description', type: 'object', fields: localTextFields }
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Témoignages' }
    }
  }
}
