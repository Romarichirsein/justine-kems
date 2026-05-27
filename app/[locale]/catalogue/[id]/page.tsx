import { Metadata } from 'next'
import { client, urlForImage } from '@/sanity/client'
import { ProductSchema } from '@/components/StructuredData'
import Image from 'next/image'
import { productSlug } from '@/lib/slugify'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

// Query pour récupérer TOUS les produits avec leurs données complètes
const allProductsFullQuery = `*[_type in ["product", "modele"]] {
  _id,
  "nameFr": coalesce(name.fr, name),
  "nameEn": coalesce(name.en, name.fr, name),
  reference,
  "slug": slug.current,
  "mainImage": coalesce(mainImage, images[0], gallery[0]),
  gallery,
  "descriptionFr": coalesce(description.fr, description),
  "descriptionEn": coalesce(description.en, description.fr, description),
  price,
  promoPrice,
  priceType,
  category,
  stock,
  priceH,
  priceF,
  fabric,
  occasion,
  gender
}`

/**
 * Trouve un produit en comparant le slug généré à partir de son nom.
 * C'est la méthode la plus fiable : on ne dépend pas du champ slug de Sanity.
 */
async function findProductByNameSlug(urlSlug: string, locale: string) {
  const allProducts = await client.fetch(allProductsFullQuery).catch(() => []);
  if (!allProducts || allProducts.length === 0) return null;
  
  const matched = allProducts.find((p: any) => {
    const name = p.nameFr || '';
    const ref = p.reference || null;
    const genSlug = productSlug(name, ref);
    return genSlug === urlSlug;
  });
  
  if (!matched) return null;
  
  // Retourner le produit avec le nom localisé
  return {
    ...matched,
    name: locale === 'en' ? matched.nameEn : matched.nameFr,
    description: locale === 'en' ? matched.descriptionEn : matched.descriptionFr,
  };
}

export async function generateStaticParams() {
  const products = await client.fetch(
    `*[_type in ["product", "modele"]]{ "name": coalesce(name.fr, name), reference, _id }`
  ).catch(() => []);
  
  const locales = ['fr', 'en'];
  const params: { locale: string; id: string }[] = [];
  
  for (const locale of locales) {
    if (!products || products.length === 0) {
      params.push({ locale, id: 'empty-fallback' });
    } else {
      products.forEach((p: any) => {
        const name = p.name || '';
        const ref = p.reference || null;
        const slug = productSlug(name, ref);
        if (slug) {
          params.push({ locale, id: slug });
        }
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  const product = await findProductByNameSlug(id, locale)
  
  if (!product) {
    return { title: 'Produit introuvable' }
  }

  const nameWithRef = product.reference ? `${product.name} #${product.reference}` : product.name;

  const titles = {
    fr: `${nameWithRef} - Création Justine Kem's`,
    en: `${nameWithRef} - Justine Kem's Creation`
  }

  const descriptions = {
    fr: `${product.description || 'Découvrez cette création unique.'} - Haute couture sur mesure à Yaoundé. ${product.fabric ? `Tissu: ${product.fabric}` : ''} Prix: ${product.priceType === 'fixed' ? `${product.price} FCFA` : 'Sur devis'}.`,
    en: `${product.description || 'Discover this unique creation.'} - Bespoke haute couture in Yaoundé. ${product.fabric ? `Fabric: ${product.fabric}` : ''} Price: ${product.priceType === 'fixed' ? `${product.price} XAF` : 'On quote'}.`
  }

  // Le slug de cette page = slug généré à partir du nom
  const pageSlug = productSlug(product.nameFr, product.reference);

  return {
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    openGraph: {
      type: 'website',
      title: nameWithRef,
      description: descriptions[locale as keyof typeof descriptions],
      images: product.mainImage ? [
        {
          url: urlForImage(product.mainImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: nameWithRef
        }
      ] : [],
    },
    alternates: {
      canonical: `/${locale}/catalogue/${pageSlug}`,
      languages: {
        'fr': `/fr/catalogue/${pageSlug}`,
        'en': `/en/catalogue/${pageSlug}`,
      }
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { locale, id } = await params
  const product = await findProductByNameSlug(id, locale)

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl text-jk-royal-gold font-script">Création introuvable</h1></div>
  }

  const nameWithRef = product.reference ? `${product.name} #${product.reference}` : product.name;
  const pageSlug = productSlug(product.nameFr, product.reference);

  return (
    <div className="min-h-screen bg-jk-cream dark:bg-jk-dark-bg py-24">
      <ProductSchema product={product} />
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Images */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-2xl">
              {product.mainImage && (
                <Image
                  src={urlForImage(product.mainImage).url()}
                  alt={nameWithRef}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* Gallery (if any) */}
            {product.gallery && product.gallery.length > 0 && (
               <div className="grid grid-cols-4 gap-4">
                 {product.gallery.map((img: any, i: number) => (
                   <div key={i} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                     <Image
                        src={urlForImage(img).url()}
                        alt={`Gallery image ${i+1}`}
                        fill
                        className="object-cover"
                     />
                   </div>
                 ))}
               </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-8 bg-white dark:bg-jk-dark-surface p-8 rounded-2xl shadow-xl">
            <div>
              <h1 className="text-4xl md:text-5xl font-display text-jk-imperial-green dark:text-jk-cream mb-4">
                {nameWithRef}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm uppercase tracking-wider font-semibold">
                <span className="bg-jk-imperial-green text-jk-cream px-3 py-1 rounded-full">
                  {product.category?.replace('-', ' ')}
                </span>
                {product.occasion?.map((occ: string) => (
                  <span key={occ} className="bg-jk-royal-gold text-white px-3 py-1 rounded-full">
                    {occ}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-jk-text-muted dark:text-gray-300 text-lg">
              <p>{product.description}</p>
            </div>

            {product.fabric && (
              <div className="border-t border-b border-gray-200 dark:border-gray-800 py-4">
                <p className="flex items-center gap-3">
                  <span className="font-medium text-jk-text-dark dark:text-jk-cream">Tissu :</span>
                  <span className="text-jk-text-muted dark:text-gray-400">{product.fabric}</span>
                </p>
              </div>
            )}

            <div className="pt-4">
              <p className="text-jk-text-muted dark:text-gray-400 text-sm mb-2 uppercase tracking-wide">Prix de la création</p>
              <div className="text-4xl font-bold text-jk-royal-gold">
                {product.priceType === 'fixed' && product.price
                  ? `${product.price.toLocaleString()} FCFA`
                  : 'Sur Devis'}
              </div>
              <p className="text-sm font-semibold text-jk-imperial-green dark:text-jk-royal-gold mt-2 flex items-center gap-1.5">
                ✨ {locale === 'fr' ? 'Accessoires y compris' : 'Accessories included'}
              </p>
            </div>

            <a
              href={`https://wa.me/237677463484?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par la création: ${nameWithRef}\n\nLien : https://www.justinekems.com/${locale}/catalogue/${pageSlug}`)}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center bg-jk-imperial-green hover:bg-[#002a26] text-jk-cream font-medium py-4 rounded-xl shadow-lg hover:shadow-neon-gold transition-all tracking-wide"
            >
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
