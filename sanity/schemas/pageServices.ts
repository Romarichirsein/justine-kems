const localTextFields = [
  { name: 'fr', title: 'Français', type: 'text' as const },
  { name: 'en', title: 'Anglais', type: 'text' as const }
]

const localStringFields = [
  { name: 'fr', title: 'Français', type: 'string' as const },
  { name: 'en', title: 'Anglais', type: 'string' as const }
]

export default {
  name: 'pageServices',
  title: 'Page Services (Textes)',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Titre Hero',
      type: 'object',
      fields: localStringFields
    },
    {
      name: 'heroSubtitle',
      title: 'Sous-titre Hero',
      type: 'object',
      fields: localTextFields
    },
    {
      name: 'hauteCouture',
      title: 'Section : Haute Couture',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre', type: 'object', fields: localStringFields },
        { name: 'description', title: 'Description', type: 'object', fields: localTextFields },
        { name: 'pricing', title: 'Prix de départ', type: 'object', fields: localStringFields }
      ]
    },
    {
      name: 'location',
      title: 'Section : Location de Prestige',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre', type: 'object', fields: localStringFields },
        { name: 'description', title: 'Description', type: 'object', fields: localTextFields },
        { name: 'pricing', title: 'Prix', type: 'object', fields: localStringFields }
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Services' }
    }
  }
}
