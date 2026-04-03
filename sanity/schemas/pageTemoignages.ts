export default {
  name: 'pageTemoignages',
  title: 'Page Témoignages (Textes)',
  type: 'document',
  fields: [
    {
      name: 'hero', title: 'Section Hero', type: 'object',
      fields: [
        { name: 'tagline', title: 'Surtitre', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'title', title: 'Titre Principal', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'desc', title: 'Description', type: 'object', fields: [{ name: 'fr', type: 'text' }, { name: 'en', type: 'text' }]}
      ]
    },
    {
      name: 'written', title: 'Section Témoignages Écrits', type: 'object',
      fields: [
        { name: 'title', title: 'Titre de la section', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]}
      ]
    },
    {
      name: 'screenshots', title: 'Section Captures d\'écran', type: 'object',
      fields: [
        { name: 'title', title: 'Titre de la section', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'desc', title: 'Description', type: 'object', fields: [{ name: 'fr', type: 'text' }, { name: 'en', type: 'text' }]}
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Témoignages' }
    }
  }
}
