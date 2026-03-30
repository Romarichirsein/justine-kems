import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Schemas
import product from './sanity/schemas/product'
import post from './sanity/schemas/post'
import formation from './sanity/schemas/formation'
import testimonial from './sanity/schemas/testimonial'
import heroImage from './sanity/schemas/heroImage'
import productImage from './sanity/schemas/productImage'
import gallery from './sanity/schemas/gallery'

export default defineConfig({
  name: 'justine-kems',
  title: 'Justine Kems Studio',

  projectId: 'd8v5zxvs',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: [product, post, formation, testimonial, heroImage, productImage, gallery],
  },
})
