import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-18',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

// Safe fetch that returns null when Sanity isn't configured yet
export async function safeFetch<T = any>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return client.fetch<T>(query, params as any).catch(() => null)
}

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source)
}

// Requêtes GROQ réutilisables
export const queries = {
  allProducts: `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    category,
    occasion,
    mainImage,
    price,
    priceType,
    isFeatured,
    isNew
  }`,
  
  featuredProducts: `*[_type == "product" && isFeatured == true][0...4] {
    _id,
    name,
    slug,
    mainImage,
    price,
    priceType
  }`,
  
  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    description,
    fabric,
    mainImage,
    gallery,
    price,
    priceType,
    category,
    occasion
  }`,
  
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    category,
    mainImage,
    excerpt,
    publishedAt,
    readingTime
  }`,
  
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    body,
    publishedAt,
    category,
    readingTime
  }`,
  
  allFormations: `*[_type == "formation"] {
    _id,
    title,
    slug,
    duration,
    level,
    price,
    description,
    objectives
  }`,
  
  testimonials: `*[_type == "testimonial"] {
    _id,
    name,
    city,
    content,
    rating,
    avatar,
    type
  }`
}
