import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, queries, urlForImage } from '@/sanity/client'
import { PortableText } from '@portabletext/react'
import { ArticleSchema } from '@/components/StructuredData'

type Props = {
  params: { locale: string; slug: string }
}

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`).catch(() => []);
  const locales = ['fr', 'en'];
  
  const params = [];
  for (const locale of locales) {
    if (!posts || posts.length === 0) {
      params.push({ locale, slug: 'empty-fallback' });
    } else {
      posts.filter((p: any) => p?.slug).forEach((p: any) => {
        params.push({ locale, slug: p.slug });
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await client.fetch(queries.postBySlug, { slug: params.slug }).catch(() => null)
  
  if (!post) {
    return { title: 'Article introuvable' }
  }

  return {
    title: `${post.title} | Blog Justine Kem's`,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Justine Kem'],
      images: post.mainImage ? [urlForImage(post.mainImage).width(1200).height(630).url()] : []
    },
    alternates: {
      canonical: `/${params.locale}/blog/${post.slug?.current}`,
      languages: {
        fr: `/fr/blog/${post.slug?.current}`,
        en: `/en/blog/${post.slug?.current}`
      }
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      title,
      slug,
      mainImage,
      body,
      publishedAt,
      category,
      excerpt,
      readingTime,
      "relatedPosts": *[_type == "post" && category == ^.category && slug.current != $slug][0...3] {
        title, slug, mainImage, publishedAt
      }
    }
  `, { slug: params.slug }).catch(() => null)

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">Article introuvable</h1></div>
  }

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen pb-24">
      {/* Schema org */}
      <ArticleSchema post={{
        title: post.title,
        description: post.excerpt,
        image: post.mainImage,
        publishedAt: post.publishedAt,
        authorName: "Justine Kem"
      }} />

      {/* Hero Article */}
      <header className="relative w-full h-[60vh] md:h-[70vh] flex items-end pb-16 justify-center bg-jk-imperial-green">
        {post.mainImage ? (
          <Image
            src={urlForImage(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src="/modeles/robes-soirees/120.000d.jpg"
            alt={post.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300 font-medium tracking-wider uppercase mb-6">
            <Link href={`/${params.locale}/blog`} className="hover:text-jk-royal-gold transition-colors">Blog</Link>
            <span>•</span>
            <span className="bg-jk-royal-gold text-black px-3 py-1 rounded-full">{post.category}</span>
            <span>•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString(params.locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white mb-6 leading-tight text-shadow-gold">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 italic font-script">
            {post.readingTime} min lecture
          </p>
        </div>
      </header>

      {/* Contenu */}
      <div className="container mx-auto px-4 mt-16 pb-16 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row gap-16 items-start max-w-6xl mx-auto">
          
          {/* Main Body */}
          <article className="w-full lg:w-[70%] prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:text-jk-imperial-green dark:prose-headings:text-jk-royal-gold prose-p:font-sans prose-p:text-jk-text-dark dark:prose-p:text-gray-300 prose-a:text-jk-royal-gold prose-blockquote:border-jk-royal-gold prose-blockquote:text-jk-imperial-green dark:prose-blockquote:text-jk-cream prose-blockquote:italic max-w-none">
             <PortableText value={post.body} />
          </article>

          {/* Sidebar Partage */}
          <aside className="w-full lg:w-[30%] lg:sticky lg:top-32 space-y-12">
            
            {/* Share */}
            <div className="bg-white dark:bg-jk-dark-surface p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">
              <h4 className="text-sm font-bold uppercase tracking-widest text-jk-text-muted dark:text-gray-400 mb-6">Partager l&apos;article</h4>
              <div className="flex justify-center gap-4">
                 <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#3b5998] hover:text-white transition-colors flex items-center justify-center text-jk-text-dark dark:text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </button>
                 <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center text-jk-text-dark dark:text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.682 10.122L23 0h-2.2zM12.955 10.9L0 24h2.2z"/></svg>
                 </button>
                 <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center text-jk-text-dark dark:text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                 </button>
              </div>
            </div>

            {/* CTA Produit */}
            <div className="bg-jk-imperial-green text-jk-cream p-8 rounded-2xl shadow-xl text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('/pattern-baroque.svg')] opacity-10 bg-repeat" />
               <h3 className="text-2xl font-display mb-4 relative z-10 text-shadow-gold text-jk-royal-gold">Envie d&apos;une création personnalisée ?</h3>
               <p className="mb-8 text-sm text-gray-300 relative z-10">Laissez-vous inspirer par nos articles pour imaginer votre prochaine tenue sur mesure.</p>
               <a href={`/${params.locale}/contact`} className="inline-block bg-jk-royal-gold hover:bg-jk-royal-gold-dark text-black font-bold px-6 py-3 rounded-full shadow-neon-gold transition-all hover:scale-105 relative z-10">
                 Prendre rendez-vous
               </a>
            </div>

          </aside>
        </div>
      </div>

      {/* Articles Connexes */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 mt-24 max-w-6xl">
           <h2 className="text-4xl font-display text-jk-imperial-green dark:text-jk-cream mb-12 text-center md:text-left">
             Continuer la lecture
           </h2>
           <div className="grid md:grid-cols-3 gap-8">
             {post.relatedPosts.map((related: any) => (
               <Link href={`/${params.locale}/blog/${related.slug?.current}`} key={related.slug?.current} className="group flex flex-col items-start hover:-translate-y-1 transition-transform">
                 <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 shadow-lg">
                    {related.mainImage && (
                      <Image src={urlForImage(related.mainImage).width(600).height(338).url()} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    )}
                 </div>
                 <p className="text-sm font-bold text-jk-royal-gold uppercase tracking-wider mb-2">{new Date(related.publishedAt).toLocaleDateString(params.locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}</p>
                 <h3 className="text-xl font-display text-jk-imperial-green dark:text-gray-200 group-hover:text-jk-royal-gold transition-colors">{related.title}</h3>
               </Link>
             ))}
           </div>
        </section>
      )}

    </div>
  )
}
