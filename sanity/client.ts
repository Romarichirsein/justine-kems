import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd8v5zxvs'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-18',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Safe fetch that returns null when Sanity isn't configured yet
export async function safeFetch<T = any>(
  query: string, 
  params?: Record<string, unknown>,
  options: any = { next: { revalidate: 0 } }
): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return client.fetch<T>(query, params as any, options).catch(() => null)
}

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source)
}

// Requêtes GROQ réutilisables
export const queries = {
  allProducts: `*[_type == "catalogue"] | order(_createdAt desc) {
    _id,
    "name": coalesce(name[$locale], name.fr),
    "slug": slug.current,
    images,
    "shortDescription": coalesce(shortDescription[$locale], shortDescription.fr),
    "longDescription": coalesce(longDescription[$locale], longDescription.fr),
    price,
    promoPrice,
    category,
    stock
  }`,
  
  featuredProducts: `*[_type == "catalogue" && isFeatured == true][0...4] {
    _id,
    "name": coalesce(name[$locale], name.fr),
    "slug": slug.current,
    images,
    price,
    promoPrice
  }`,
  
  productBySlug: `*[_type == "catalogue" && slug.current == $slug][0] {
    _id,
    "name": coalesce(name[$locale], name.fr),
    "slug": slug.current,
    images,
    "shortDescription": coalesce(shortDescription[$locale], shortDescription.fr),
    "longDescription": coalesce(longDescription[$locale], longDescription.fr),
    price,
    promoPrice,
    category,
    stock
  }`,
  
  allPosts: `*[_type == "article" && isPublished == true] | order(publishedAt desc) {
    _id,
    "title": coalesce(title[$locale], title.fr),
    "slug": slug.current,
    mainImage,
    "content": coalesce(content[$locale], content.fr),
    author,
    publishedAt,
    category
  }`,
  
  postBySlug: `*[_type == "article" && slug.current == $slug][0] {
    "title": coalesce(title[$locale], title.fr),
    mainImage,
    "content": coalesce(content[$locale], content.fr),
    publishedAt,
    category,
    author
  }`,
  
  allFormations: `*[_type == "formation" && isAvailable == true] | order(_createdAt desc) {
    _id,
    "title": coalesce(title[$locale], title.fr),
    "slug": slug.current,
    "description": coalesce(description[$locale], description.fr),
    image,
    price,
    duration,
    level,
    registrationLink
  }`,
  
  allTestimonials: `*[_type == "temoignage" && isVisible == true] | order(date desc) {
    _id,
    name,
    photo,
    "content": coalesce(content[$locale], content.fr),
    rating,
    date
  }`,
  
  allModeles: `*[_type == "modele"] | order(_createdAt desc) {
    _id,
    "name": coalesce(name[$locale], name.fr),
    "slug": slug.current,
    mainImage,
    gallery,
    "description": coalesce(description[$locale], description.fr),
    price,
    category,
    isAvailable
  }`,

  siteSettings: `*[_type == "parametres"][0] {
    logo,
    "slogan": coalesce(slogan[$locale], slogan.fr),
    contactEmail,
    whatsappNumber,
    socialLinks,
    "footerText": coalesce(footerText[$locale], footerText.fr)
  }`,
  
  heroImages: `*[_type == "heroImage"] {
    _id,
    "title": coalesce(title[$locale], title.fr),
    image,
    "alt": coalesce(alt[$locale], alt.fr),
    "caption": coalesce(caption[$locale], caption.fr)
  }`,

  productImages: `*[_type == "productImage"] {
    _id,
    "title": coalesce(title[$locale], title.fr),
    image,
    "alt": coalesce(alt[$locale], alt.fr),
    "caption": coalesce(caption[$locale], caption.fr)
  }`
}
