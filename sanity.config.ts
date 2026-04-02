import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'

// Schemas
import modele from './sanity/schemas/modele'
import product from './sanity/schemas/product'
import temoignage from './sanity/schemas/temoignage'
import article from './sanity/schemas/article'
import formation from './sanity/schemas/formation'
import parametres from './sanity/schemas/parametres'
import heroImage from './sanity/schemas/heroImage'
import productImage from './sanity/schemas/productImage'

export default defineConfig({
  name: 'justine-kems',
  title: 'Justine Kems Studio',

  projectId: 'd8v5zxvs',
  dataset: 'production',
  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu du site')
          .items([
            S.listItem()
              .title('Modèles')
              .icon(() => '📸')
              .child(S.documentTypeList('modele').title('Modèles')),
            S.listItem()
              .title('Produits')
              .icon(() => '🛍️')
              .child(S.documentTypeList('product').title('Produits')),
            S.listItem()
              .title('Témoignages')
              .icon(() => '💬')
              .child(S.documentTypeList('temoignage').title('Témoignages')),
            S.listItem()
              .title('Blog')
              .icon(() => '📝')
              .child(S.documentTypeList('article').title('Articles du Blog')),
            S.listItem()
              .title('Formations')
              .icon(() => '🎓')
              .child(S.documentTypeList('formation').title('Formations')),
            S.divider(),
            S.listItem()
              .title('Paramètres du site')
              .icon(() => '⚙️')
              .child(
                S.document()
                  .schemaType('parametres')
                  .documentId('parametres')
              ),
            ...S.documentTypeListItems().filter(
              (listItem) => !['modele', 'product', 'temoignage', 'article', 'formation', 'parametres'].includes(listItem.getId() as string)
            )
          ])
    }),
    visionTool(),
    media(),
  ],

  schema: {
    types: [modele, product, temoignage, article, formation, parametres, heroImage, productImage],
  },
})
