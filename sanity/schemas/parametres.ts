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
      name: 'slogan_fr',
      title: 'Slogan (Français)',
      type: 'string'
    },
    {
      name: 'slogan_en',
      title: 'Slogan (Anglais)',
      type: 'string'
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
      type: 'text',
      rows: 3
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
