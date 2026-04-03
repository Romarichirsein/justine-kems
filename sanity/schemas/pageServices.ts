export default {
  name: 'pageServices',
  title: 'Page Services (Textes)',
  type: 'document',
  fields: [
    {
      name: 'heroTitle', title: 'Titre Hero', type: 'object',
      fields: [{ name: 'fr', type: 'string', title: 'Fr' }, { name: 'en', type: 'string', title: 'En' }]
    },
    {
      name: 'heroSubtitle', title: 'Sous-titre Hero', type: 'object',
      fields: [{ name: 'fr', type: 'text', title: 'Fr' }, { name: 'en', type: 'text', title: 'En' }]
    },
    {
      name: 'hauteCouture', title: 'Haute Couture', type: 'object',
      fields: [
        { name: 'title', title: 'Titre', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'description', title: 'Description', type: 'object', fields: [{ name: 'fr', type: 'text' }, { name: 'en', type: 'text' }]},
        { name: 'pricing', title: 'Prix de départ', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]}
      ]
    },
    {
      name: 'location', title: 'Location de Prestige', type: 'object',
      fields: [
        { name: 'title', title: 'Titre', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]},
        { name: 'description', title: 'Description', type: 'object', fields: [{ name: 'fr', type: 'text' }, { name: 'en', type: 'text' }]},
        { name: 'pricing', title: 'Prix', type: 'object', fields: [{ name: 'fr', type: 'string' }, { name: 'en', type: 'string' }]}
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Textes de la page Services' }
    }
  }
}
