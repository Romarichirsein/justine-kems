export default {
  name: 'pageCatalogue',
  title: 'Page Catalogue (Textes)',
  type: 'document',
  fields: [
    {
      name: 'hero', title: 'Section Hero', type: 'object',
      fields: [
        { name: 'title', title: 'Titre Principal', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'subtitle', title: 'Sous-titre', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]}
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Catalogue' }
    }
  }
}
