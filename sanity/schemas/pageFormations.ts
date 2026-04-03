export default {
  name: 'pageFormations',
  title: 'Page Formations (Textes)',
  type: 'document',
  fields: [
    {
      name: 'hero', title: 'Section Hero', type: 'object',
      fields: [
        { name: 'tagline', title: 'Surtitre', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'title', title: 'Titre Principal', type: 'object', fields: [{ name: 'fr', type: 'text' }, { name: 'en', type: 'text' }]},
        { name: 'subtitle', title: 'Sous-titre', type: 'object', fields: [{ name: 'fr', type: 'text' }, { name: 'en', type: 'text' }]}
      ]
    },
    {
      name: 'profil', title: 'Profil de la formatrice', type: 'object',
      fields: [
        { name: 'tagline', title: 'Surtitre', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'name', title: 'Nom complet', type: 'string' },
        { name: 'quote', title: 'Citation (Quote)', type: 'object', fields: [{ name: 'fr', type: 'text' }, { name: 'en', type: 'text' }]},
        { name: 'labels', title: 'Étiquettes / Badges (séparés par virgule)', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]}
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Formations' }
    }
  }
}
