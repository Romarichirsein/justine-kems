import { Metadata } from 'next'
import { client, queries, urlForImage } from '@/sanity/client'
import { ProductSchema } from '@/components/StructuredData'
import Image from 'next/image'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateStaticParams() {
  const products = await client.fetch(`*[_type == "product"]{ "slug": slug.current }`).catch(() => []);
  const locales = ['fr', 'en'];
  
  const params = [];
  for (const locale of locales) {
    if (!products || products.length === 0) {
      params.push({ locale, id: 'empty-fallback' });
    } else {
      products.filter((p: any) => p?.slug).forEach((p: any) => {
        params.push({ locale, id: p.slug });
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  const product = await client.fetch(queries.productBySlug, { slug: id }).catch(() => null)
  
  if (!product) {
    return {
      title: 'Produit introuvable'
    }
  }

  const titles = {
    fr: `${product.name} - Création Justine Kem's`,
    en: `${product.name} - Justine Kem's Creation`
  }

  const descriptions = {
    fr: `${product.description || 'Découvrez cette création unique.'} - Haute couture sur mesure à Yaoundé. ${product.fabric ? `Tissu: ${product.fabric}` : ''} Prix: ${product.priceType === 'fixed' ? `${product.price} FCFA` : 'Sur devis'}.`,
    en: `${product.description || 'Discover this unique creation.'} - Bespoke haute couture in Yaoundé. ${product.fabric ? `Fabric: ${product.fabric}` : ''} Price: ${product.priceType === 'fixed' ? `${product.price} XAF` : 'On quote'}.`
  }

  return {
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    openGraph: {
      type: 'website',
      title: product.name,
      description: descriptions[locale as keyof typeof descriptions],
      images: product.mainImage ? [
        {
          url: urlForImage(product.mainImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: product.name
        }
      ] : [],
    },
    alternates: {
      canonical: `/${locale}/catalogue/${product.slug?.current || id}`,
      languages: {
        'fr': `/fr/catalogue/${product.slug?.current || id}`,
        'en': `/en/catalogue/${product.slug?.current || id}`,
      }
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { locale, id } = await params
  const product = await client.fetch(queries.productBySlug, { slug: id }).catch(() => null)

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl text-jk-royal-gold font-script">Création introuvable</h1></div>
  }

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
                  alt={product.name}
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
                {product.name}
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
            </div>

            <a
              href={`https://wa.me/237677463484?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par la création: ${product.name}`)}`}
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
