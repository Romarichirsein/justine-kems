import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd8v5zxvs'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-18',
  // On désactive le CDN pour avoir les données fraîches instantanément après un "Publish"
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

// Requêtes GROQ réutilisables (Utilisant les nouveaux schémas)
export const queries = {
  // Catalogue
  allProducts: `*[_type == "catalogue"] | order(_createdAt desc) {
    _id,
    "name": coalesce(select($locale == "en" => name_en, name_fr), name_fr, name_en),
    "slug": slug.current,
    images,
    "shortDescription": coalesce(select($locale == "en" => shortDescription_en, shortDescription_fr), shortDescription_fr, shortDescription_en),
    "longDescription": coalesce(select($locale == "en" => longDescription_en, longDescription_fr), longDescription_fr, longDescription_en),
    price,
    promoPrice,
    category,
    stock
  }`,
  
  featuredProducts: `*[_type == "catalogue" && isFeatured == true][0...4] {
    _id,
    "name": coalesce(select($locale == "en" => name_en, name_fr), name_fr, name_en),
    "slug": slug.current,
    images,
    price,
    promoPrice
  }`,
  
  productBySlug: `*[_type == "catalogue" && slug.current == $slug][0] {
    _id,
    "name": coalesce(select($locale == "en" => name_en, name_fr), name_fr, name_en),
    "slug": slug.current,
    images,
    "shortDescription": coalesce(select($locale == "en" => shortDescription_en, shortDescription_fr), shortDescription_fr, shortDescription_en),
    "longDescription": coalesce(select($locale == "en" => longDescription_en, longDescription_fr), longDescription_fr, longDescription_en),
    price,
    promoPrice,
    category,
    stock
  }`,
  
  // Blog
  allPosts: `*[_type == "article" && isPublished == true] | order(publishedAt desc) {
    _id,
    "title": coalesce(select($locale == "en" => title_en, title_fr), title_fr, title_en),
    "slug": slug.current,
    mainImage,
    "content": coalesce(select($locale == "en" => content_en, content_fr), content_fr, content_en),
    author,
    publishedAt,
    category
  }`,
  
  postBySlug: `*[_type == "article" && slug.current == $slug][0] {
    "title": coalesce(select($locale == "en" => title_en, title_fr), title_fr, title_en),
    mainImage,
    "content": coalesce(select($locale == "en" => content_en, content_fr), content_fr, content_en),
    publishedAt,
    category,
    author
  }`,
  
  // Formations
  allFormations: `*[_type == "formation" && isAvailable == true] | order(_createdAt desc) {
    _id,
    "title": coalesce(select($locale == "en" => title_en, title_fr), title_fr, title_en),
    "slug": slug.current,
    "description": coalesce(select($locale == "en" => description_en, description_fr), description_fr, description_en),
    image,
    price,
    duration,
    level,
    registrationLink
  }`,
  
  // Témoignages
  allTestimonials: `*[_type == "temoignage" && isVisible == true] | order(date desc) {
    _id,
    name,
    photo,
    "content": coalesce(select($locale == "en" => content_en, content_fr), content_fr, content_en),
    rating,
    date
  }`,
  
  // Modèles
  allModeles: `*[_type == "modele"] | order(_createdAt desc) {
    _id,
    "name": coalesce(select($locale == "en" => name_en, name_fr), name_fr, name_en),
    "slug": slug.current,
    mainImage,
    gallery,
    "description": coalesce(select($locale == "en" => description_en, description_fr), description_fr, description_en),
    price,
    category,
    isAvailable
  }`,

  // Paramètres
  siteSettings: `*[_type == "parametres"][0] {
    logo,
    "slogan": coalesce(select($locale == "en" => slogan_en, slogan_fr), slogan_fr, slogan_en),
    contactEmail,
    whatsappNumber,
    socialLinks,
    "footerText": coalesce(select($locale == "en" => footerText_en, footerText_fr), footerText_fr, footerText_en)
  },
  
  // Hero Images
  heroImages: `*[_type == "heroImage"] {
    _id,
    "title": coalesce(select($locale == "en" => title_en, title_fr), title_fr, title_en),
    image,
    "alt": coalesce(select($locale == "en" => alt_en, alt_fr), alt_fr, alt_en),
    "caption": coalesce(select($locale == "en" => caption_en, caption_fr), caption_fr, caption_en)
  }`,


  productImages: `*[_type == "productImage"] {
    _id,
    "title": coalesce(select($locale == "en" => title_en, title_fr), title_fr, title_en),
    image,
    "alt": coalesce(select($locale == "en" => alt_en, alt_fr), alt_fr, alt_en),
    "caption": coalesce(select($locale == "en" => caption_en, caption_fr), caption_fr, caption_en)
  }`
}
