export default {
  name: 'pageBlog',
  title: 'Page Blog (Textes)',
  type: 'document',
  fields: [
    {
      name: 'hero', title: 'Section Hero', type: 'object',
      fields: [
        { name: 'tagline', title: 'Surtitre', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'title', title: 'Titre Principal', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'subtitle', title: 'Sous-titre', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]}
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Blog' }
    }
  }
}
