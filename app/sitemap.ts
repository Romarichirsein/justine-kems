import { MetadataRoute } from 'next'
import { client, queries } from '@/sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://justinekems.com'
  const locales = ['fr', 'en']

  // Récupérer les données dynamiques de Sanity
  const products = await client.fetch(queries.allProducts).catch(() => [])
  const posts = await client.fetch(queries.allPosts).catch(() => [])
  const formations = await client.fetch(queries.allFormations).catch(() => [])

  // Pages statiques multilingues
  const staticPages = [
    '',
    '/a-propos',
    '/services',
    '/catalogue',
    '/blog',
    '/formations',
    '/modeles',
    '/contact',
    '/inscription'
  ]

  const staticUrls = staticPages.flatMap(page =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === '' ? 1 : 0.8,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr${page}`,
          en: `${baseUrl}/en${page}`
        }
      }
    }))
  )

  // URLs produits dynamiques
  const productUrls = products.flatMap((product: any) =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/catalogue/${product.slug?.current || product._id}`,
      lastModified: new Date(product._updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr/catalogue/${product.slug?.current || product._id}`,
          en: `${baseUrl}/en/catalogue/${product.slug?.current || product._id}`
        }
      }
    }))
  )

  // URLs blog dynamiques
  const postUrls = posts.flatMap((post: any) =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/blog/${post.slug?.current || post._id}`,
      lastModified: new Date(post.publishedAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr/blog/${post.slug?.current || post._id}`,
          en: `${baseUrl}/en/blog/${post.slug?.current || post._id}`
        }
      }
    }))
  )

  return [...staticUrls, ...productUrls, ...postUrls]
}

// Régénération toutes les 24h
export const revalidate = 86400
