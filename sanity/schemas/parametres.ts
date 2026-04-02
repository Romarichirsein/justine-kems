export default {
  name: 'parametres',
  title: 'Paramètres du site',
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo du site',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'slogan',
      title: 'Slogan',
      type: 'object',
      fields: [
        { name: 'fr', type: 'string', title: 'Français' },
        { name: 'en', type: 'string', title: 'Anglais' }
      ]
    },
    {
      name: 'contactEmail',
      title: 'Email de contact',
      type: 'string'
    },
    {
      name: 'whatsappNumber',
      title: 'Numéro WhatsApp',
      type: 'string'
    },
    {
      name: 'socialLinks',
      title: 'Liens réseaux sociaux',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Plateforme',
              type: 'string',
              options: {
                list: ['Instagram', 'Facebook', 'TikTok', 'Twitter', 'LinkedIn']
              }
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url'
            }
          ]
        }
      ]
    },
    {
      name: 'footerText',
      title: 'Texte du footer',
      type: 'object',
      fields: [
        { name: 'fr', type: 'text', rows: 3, title: 'Français' },
        { name: 'en', type: 'text', rows: 3, title: 'Anglais' }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Paramètres Généraux'
      }
    }
  }
}
