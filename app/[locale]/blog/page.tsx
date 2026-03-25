'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { client, queries, urlForImage } from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'

/* ── Skeleton Card ──────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-jk-dark-surface rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6" />
      </div>
    </div>
  )
}

/* ── Article Card ───────────────────────────────────────────── */
function BlogCard({ post, locale }: { post: any; locale: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-jk-dark-surface rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-neon-gold transition-all duration-300 group flex flex-col"
    >
      <Link href={`/${locale}/blog/${post.slug?.current}`} className="flex flex-col h-full">
        <div className="relative aspect-[16/9] w-full overflow-hidden shrink-0">
          {post.mainImage ? (
            <Image
              src={urlForImage(post.mainImage).width(800).height(450).url()}
              alt={post.title || "Blog Image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <Image
              src="/modeles/Robes%20de%20soirees/120.000d.jpg"
              alt="Default Blog Image"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute top-4 left-4 bg-jk-imperial-green/90 backdrop-blur text-jk-cream text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {post.category || 'Actualités'}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <p className="text-xs text-jk-text-muted dark:text-gray-400 mb-3 flex items-center gap-2">
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span>
            {post.readingTime && <><span>·</span><span>{post.readingTime} min</span></>}
          </p>
          <h3 className="text-xl font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-3 group-hover:text-jk-royal-gold transition-colors line-clamp-2 leading-snug flex-1">
            {post.title}
          </h3>
          <p className="text-sm text-jk-text-muted dark:text-gray-300 line-clamp-3 mb-5">
            {post.excerpt}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-jk-royal-gold group-hover:gap-3 transition-all">
            Lire l'article
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Featured Post (Premier article affiché en grand) ─────── */
function FeaturedBlogCard({ post, locale }: { post: any; locale: string }) {
  return (
    <Link href={`/${locale}/blog/${post.slug?.current}`} className="block">
      <div className="group relative rounded-3xl overflow-hidden shadow-2xl mb-12 aspect-[21/9] cursor-pointer">
        {post.mainImage && (
          <Image
            src={urlForImage(post.mainImage).width(1400).height(600).url()}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-10 max-w-2xl">
          <span className="inline-block bg-jk-royal-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-max mb-4">
            À la Une
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 group-hover:text-jk-royal-gold transition-colors leading-snug">
            {post.title}
          </h2>
          <p className="text-gray-200 line-clamp-2 text-sm mb-5">{post.excerpt}</p>
          <span className="inline-flex items-center gap-2 text-jk-royal-gold font-semibold group-hover:gap-4 transition-all">
            Lire l'article complet →
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ── Page Principale Blog ─────────────────────────────────── */
export default function BlogPage() {
  const locale = useLocale()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    client.fetch(queries.allPosts)
      .then(data => { setPosts(data || []); setLoading(false) })
      .catch(() => { setPosts([]); setLoading(false) })
  }, [])

  const categories = ['all', 'Mode & Tendances', 'Conseils couture', 'Behind the scenes', 'Événements Yaoundé', 'Portraits clientes']

  const filtered = useMemo(() =>
    posts.filter((p: any) => {
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter
      const matchSearch = !search.trim() ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    }),
    [posts, categoryFilter, search]
  )

  const featuredPost = posts[0]
  const gridPosts = search || categoryFilter !== 'all' ? filtered : filtered.slice(1)

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen pb-24">

      {/* ── HERO BLOG ── */}
      <section className="relative px-4 py-36 bg-gradient-to-b from-jk-imperial-green to-[#0A1A18] text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/modeles/Robes%20de%20soirees/250.000a.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A18] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern-baroque.svg')] bg-repeat" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full border border-jk-royal-gold/10 animate-pulse" />
        </div>

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-jk-royal-gold uppercase tracking-[0.4em] text-xs font-bold mb-5"
          >
            Journal de Mode
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-script text-jk-royal-gold mb-4 text-shadow-gold"
          >
            Inspirations & Coulisses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-xl font-display text-gray-200 mb-10"
          >
            Plongez dans l'univers Justine Kem's
          </motion.p>

          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="max-w-md mx-auto relative"
          >
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-full py-4 pl-6 pr-14 text-white placeholder-white/50 focus:outline-none focus:border-jk-royal-gold/60 transition-colors"
            />
            <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-jk-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-20 max-w-7xl">

        {/* ── Filtres ── */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-12 scrollbar-hide justify-start md:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all shadow-md text-sm ${
                categoryFilter === cat
                  ? 'bg-jk-royal-gold text-black border-2 border-jk-royal-gold shadow-neon-gold'
                  : 'bg-white dark:bg-jk-dark-surface dark:text-gray-300 border-2 border-transparent hover:border-jk-royal-gold text-jk-text-dark'
              }`}
            >
              {cat === 'all' ? 'Toutes les actualités' : cat}
              {cat !== 'all' && !loading && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${categoryFilter === cat ? 'bg-black/20' : 'bg-gray-100 dark:bg-gray-700 text-jk-text-muted dark:text-gray-400'}`}>
                  {posts.filter((p: any) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-12">

          {/* ── Grille Articles ── */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <>
                {/* Featured Post (visible uniquement sans filtre/search) */}
                {!search && categoryFilter === 'all' && featuredPost && (
                  <FeaturedBlogCard post={featuredPost} locale={locale} />
                )}

                {/* Résultats de recherche info */}
                {search && (
                  <p className="text-sm text-jk-text-muted dark:text-gray-400 mb-6">
                    {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour "<strong>{search}</strong>"
                  </p>
                )}

                <motion.div layout className="grid sm:grid-cols-2 gap-8">
                  <AnimatePresence mode="popLayout">
                    {gridPosts.map((post: any) => (
                      <BlogCard key={post._id} post={post} locale={locale} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* État vide */}
                {filtered.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24 bg-white dark:bg-jk-dark-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
                  >
                    <div className="text-6xl mb-6">✍️</div>
                    <h3 className="text-2xl font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-3">
                      {search ? 'Aucun résultat trouvé' : 'Aucun article dans cette catégorie'}
                    </h3>
                    <p className="text-jk-text-muted dark:text-gray-400 mb-8">
                      {search ? `Essayez avec d'autres mots-clés.` : 'Les premiers articles arrivent bientôt !'}
                    </p>
                    <button
                      onClick={() => { setCategoryFilter('all'); setSearch('') }}
                      className="btn-primary px-8 py-3"
                    >
                      Voir tous les articles
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="hidden lg:block space-y-8">
            <div className="sticky top-32 space-y-8">

              {/* CTA Box */}
              <div className="bg-jk-imperial-green rounded-2xl p-6 text-center text-jk-cream shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-jk-royal-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-3xl mb-3">✨</div>
                  <h4 className="font-display text-lg mb-2">Envie d'une création ?</h4>
                  <p className="text-xs text-gray-300 mb-5 leading-relaxed">Transformons votre inspiration en réalité haute couture.</p>
                  <a
                    href="https://wa.me/237677463484?text=Bonjour%20Justine%2C%20j%27aimerais%20une%20création%20sur%20mesure."
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-neon-green transition-all hover:scale-105 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                    Discuter avec Justine
                  </a>
                </div>
              </div>

              {/* Catégories liste */}
              <div className="bg-white dark:bg-jk-dark-surface rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-jk-imperial-green dark:text-jk-royal-gold mb-5 uppercase tracking-wider text-xs">Thématiques</h4>
                <ul className="space-y-2">
                  {categories.filter(c => c !== 'all').map(cat => (
                    <li key={cat}>
                      <button
                        onClick={() => { setCategoryFilter(cat); setSearch('') }}
                        className={`w-full flex justify-between items-center py-2 px-3 rounded-lg text-sm transition-all ${
                          categoryFilter === cat
                            ? 'bg-jk-royal-gold/10 text-jk-royal-gold font-semibold'
                            : 'text-jk-text-muted dark:text-gray-300 hover:text-jk-royal-gold hover:bg-jk-royal-gold/5'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {posts.filter((p: any) => p.category === cat).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter signup box */}
              <div className="bg-jk-royal-gold/10 border border-jk-royal-gold/30 rounded-2xl p-6">
                <h4 className="font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-2">Ne ratez rien 💌</h4>
                <p className="text-xs text-jk-text-muted dark:text-gray-400 mb-4">Nouvelles collections, conseils mode et offres exclusives.</p>
                <a
                  href="https://wa.me/237677463484?text=Je%20souhaite%20m%27abonner%20aux%20actualités%20Justine%20Kem's"
                  target="_blank" rel="noreferrer"
                  className="block text-center bg-jk-royal-gold text-black text-sm font-bold py-2.5 rounded-full hover:bg-amber-400 transition-colors"
                >
                  Suivre via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
