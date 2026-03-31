export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Justine Kem\'s',
    url: 'https://justinekems.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://justinekems.com/fr/catalogue?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FashionStore',
    name: 'Justine Kem\'s',
    alternateName: 'Justine Kems Haute Couture',
    url: 'https://justinekems.com',
    logo: 'https://justinekems.com/logo.png',
    description: 'Maison de haute couture à Yaoundé spécialisée dans les créations sur mesure et la mode africaine de luxe',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yaoundé',
      addressRegion: 'Centre',
      addressCountry: 'CM'
    },
    telephone: '+237677463484',
    email: 'contact@justinekems.com',
    sameAs: [
      'https://facebook.com/justinekems',
      'https://instagram.com/justinekems',
      'https://tiktok.com/@justinekems'
    ],
    priceRange: '$$$$',
    paymentAccepted: 'WhatsApp, Cash, Bank Transfer',
    currenciesAccepted: 'XAF',
    areaServed: {
      '@type': 'Country',
      name: ['Cameroon', 'Africa', 'International']
    },
    serviceType: ['Haute Couture', 'Custom Tailoring', 'Fashion Training', 'Garment Rental'],
    foundingDate: '2015',
    founder: {
      '@type': 'Person',
      name: 'Justine Kem',
      jobTitle: 'Fashion Designer & Founder'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductSchema({ product }: { product: any }) {
  // Simplification for brevity, assume urlForImage is imported if needed, or pass url directly
  const imageUrl = product.mainImage?.asset?._ref ? `https://cdn.sanity.io/images/projectid/dataset/${product.mainImage.asset._ref}` : '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: 'Justine Kem\'s'
    },
    offers: {
      '@type': 'Offer',
      price: product.priceType === 'fixed' ? product.price : '0',
      priceCurrency: 'XAF',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    category: product.category,
    sku: product._id
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ArticleSchema({ post }: { post: any }) {
  const imageUrl = post.mainImage?.asset?._ref ? `https://cdn.sanity.io/images/projectid/dataset/${post.mainImage.asset._ref}` : '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: imageUrl,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Justine Kem',
      url: 'https://justinekems.com/fr/a-propos'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Justine Kem\'s',
      logo: {
        '@type': 'ImageObject',
        url: 'https://justinekems.com/logo.png'
      }
    },
    description: post.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://justinekems.com/fr/blog/${post.slug?.current || post._id}`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
