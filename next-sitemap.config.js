/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://justinekems.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*', '/_next/*'],
  alternateRefs: [
    {
      href: 'https://justinekems.com/fr',
      hreflang: 'fr',
    },
    {
      href: 'https://justinekems.com/en',
      hreflang: 'en',
    },
    {
      href: 'https://justinekems.com/fr',
      hreflang: 'x-default',
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://justinekems.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
