import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd8v5zxvs'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-18',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
})

export async function safeFetch<T = any>(
  query: string, 
  params?: Record<string, unknown>,
  options: any = { next: { revalidate: 0 } }
): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null
  return client.fetch<T>(query, params as any, options).catch(() => null)
}

const builder = imageUrlBuilder(client)
export function urlForImage(source: any) { return builder.image(source) }

export const queries = {
  // Catalogue
  allProducts: `*[_type == "product"] | order(_createdAt desc) {
    _id,
    "name": coalesce(name[$locale], name.fr, name),
    "slug": slug.current,
    "mainImage": coalesce(mainImage, images[0]),
    gallery,
    "description": coalesce(description[$locale], description.fr, description),
    price,
    promoPrice,
    category,
    stock,
    priceH,
    priceF
  }`,
  
  featuredProducts: `*[_type == "product" && isFeatured == true][0...4] {
    _id,
    "name": coalesce(name[$locale], name.fr, name),
    "slug": slug.current,
    "mainImage": coalesce(mainImage, images[0]),
    price,
    promoPrice,
    priceH,
    priceF
  }`,
  
  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    "name": coalesce(name[$locale], name.fr, name),
    "slug": slug.current,
    "mainImage": coalesce(mainImage, images[0]),
    gallery,
    "description": coalesce(description[$locale], description.fr, description),
    price,
    promoPrice,
    category,
    stock,
    priceH,
    priceF
  }`,
  
  allPosts: `*[_type == "article" && isPublished == true] | order(publishedAt desc) {
    _id,
    "title": coalesce(title[$locale], title.fr, title),
    "slug": slug.current,
    mainImage,
    "content": coalesce(content[$locale], content.fr, content),
    author,
    publishedAt,
    category
  }`,
  
  postBySlug: `*[_type == "article" && slug.current == $slug][0] {
    "title": coalesce(title[$locale], title.fr, title),
    mainImage,
    "content": coalesce(content[$locale], content.fr, content),
    publishedAt,
    category,
    author
  }`,
  
  allFormations: `*[_type == "formation" && isAvailable == true] | order(_createdAt desc) {
    _id,
    "title": coalesce(title[$locale], title.fr, title),
    "slug": slug.current,
    "description": coalesce(description[$locale], description.fr, description),
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
    "content": coalesce(content[$locale], content.fr, content),
    rating,
    date
  }`,
  
  allModeles: `*[_type == "product"] | order(_createdAt desc) {
    _id,
    "name": coalesce(name[$locale], name.fr, name),
    "slug": slug.current,
    "mainImage": coalesce(mainImage, images[0], gallery[0]),
    gallery,
    "description": coalesce(description[$locale], description.fr, description),
    price,
    category,
    isAvailable,
    priceH,
    priceF,
    gender
  }`,

  siteSettings: `*[_type == "parametres"][0] {
    logo,
    "slogan": coalesce(slogan[$locale], slogan.fr, slogan),
    contactEmail,
    whatsappNumber,
    socialLinks,
    "footerText": coalesce(footerText[$locale], footerText.fr, footerText)
  }`,
  
  heroImages: `*[_type == "heroImage"] {
    _id,
    "title": coalesce(title[$locale], title.fr, title),
    image,
    "alt": coalesce(alt[$locale], alt.fr, alt),
    "caption": coalesce(caption[$locale], caption.fr, caption)
  }`,

  productImages: `*[_type == "productImage"] {
    _id,
    "title": coalesce(title[$locale], title.fr, title),
    image,
    "alt": coalesce(alt[$locale], alt.fr, alt),
    "caption": coalesce(caption[$locale], caption.fr, caption)
  }`,

  pageServices: `*[_type == "pageServices"][0]`,
  pageFormations: `*[_type == "pageFormations"][0]`
}
