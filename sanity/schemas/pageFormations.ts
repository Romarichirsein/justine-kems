const localTextFields = [
  { name: 'fr', title: 'Français', type: 'text' as const },
  { name: 'en', title: 'Anglais', type: 'text' as const }
]

const localStringFields = [
  { name: 'fr', title: 'Français', type: 'string' as const },
  { name: 'en', title: 'Anglais', type: 'string' as const }
]

export default {
  name: 'pageFormations',
  title: 'Page Formations (Textes)',
  type: 'document',
  fields: [
    {
      name: 'hero',
      title: 'Section : Hero',
      type: 'object',
      fields: [
        { name: 'tagline', title: 'Surtitre', type: 'object', fields: localStringFields },
        { name: 'title', title: 'Titre Principal', type: 'object', fields: localTextFields },
        { name: 'subtitle', title: 'Sous-titre', type: 'object', fields: localTextFields }
      ]
    },
    {
      name: 'profil',
      title: 'Section : Profil de la Formatrice',
      type: 'object',
      fields: [
        { name: 'tagline', title: 'Surtitre', type: 'object', fields: localStringFields },
        { name: 'name', title: 'Nom complet', type: 'string' },
        { name: 'quote', title: 'Citation', type: 'object', fields: localTextFields },
        { name: 'labels', title: 'Badges (séparés par virgule)', type: 'object', fields: localStringFields }
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Formations' }
    }
  }
}
