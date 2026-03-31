import { groq } from 'next-sanity'

export const allModelesQuery = groq`*[_type == "modele"] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  mainImage,
  gallery,
  description,
  price,
  category,
  isAvailable
}`

export const allCatalogueQuery = groq`*[_type == "catalogue"] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  images,
  shortDescription,
  longDescription,
  price,
  promoPrice,
  category,
  stock
}`

export const allTemoignagesQuery = groq`*[_type == "temoignage" && isVisible == true] | order(date desc) {
  _id,
  name,
  photo,
  content,
  rating,
  date
}`

export const allArticlesQuery = groq`*[_type == "article" && isPublished == true] | order(publishedAt desc) {
  _id,
  title_fr,
  title_en,
  "slug": slug.current,
  mainImage,
  content,
  author,
  publishedAt,
  category
}`

export const allFormationsQuery = groq`*[_type == "formation" && isAvailable == true] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  image,
  price,
  duration,
  level,
  registrationLink
}`

export const siteSettingsQuery = groq`*[_type == "parametres"][0] {
  logo,
  slogan_fr,
  slogan_en,
  contactEmail,
  whatsappNumber,
  socialLinks,
  footerText
}`
