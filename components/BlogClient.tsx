'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlForImage } from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface BlogClientProps {
  initialPosts: any[]
  locale: string
}

export function BlogClient({ initialPosts, locale }: BlogClientProps) {
  const t = useTranslations('blog')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')

  const categories = ['all', 'Mode & Tendances', 'Conseils couture', 'Behind the scenes', 'Événements Yaoundé', 'Portraits clientes']

  const filtered = useMemo(() =>
    initialPosts.filter((p: any) => {
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter
      const matchSearch = !search.trim() ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    }),
    [initialPosts, categoryFilter, search]
  )

  const featuredPost = initialPosts[0]
  const gridPosts = search || categoryFilter !== 'all' ? filtered : filtered.slice(1)

  return (
    <>
      {/* ── HERO BLOG ── */}
      <section className="relative px-4 py-36 bg-gradient-to-b from-jk-imperial-green to-[#0A1A18] text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/modeles/Robes%20de%20soirees/250.000a.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A18] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern-baroque.svg')] bg-repeat" />
        
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-jk-royal-gold uppercase tracking-[0.4em] text-xs font-bold mb-5"
          >
            {t('hero.tagline')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-script text-jk-royal-gold mb-4 text-shadow-gold"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-xl font-display text-gray-200 mb-10"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="max-width-md mx-auto relative max-w-md"
          >
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('hero.search')}
              className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-full py-4 pl-6 pr-14 text-white placeholder-white/50 focus:outline-none focus:border-jk-royal-gold/60 transition-colors"
            />
            <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-jk-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-6 relative z-20 max-w-7xl">
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
              {cat === 'all' ? t('filters.all') : cat}
              {cat !== 'all' && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${categoryFilter === cat ? 'bg-black/20' : 'bg-gray-100 dark:bg-gray-700 text-jk-text-muted dark:text-gray-400'}`}>
                  {initialPosts.filter((p: any) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            {!search && categoryFilter === 'all' && featuredPost && (
              <FeaturedBlogCard post={featuredPost} locale={locale} t={t} />
            )}

            {search && (
              <p className="text-sm text-jk-text-muted dark:text-gray-400 mb-6">
                {t('search.results', { count: filtered.length, s: filtered.length !== 1 ? 's' : '', query: search })}
              </p>
            )}

            <motion.div layout className="grid sm:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {gridPosts.map((post: any) => (
                  <BlogCard key={post._id} post={post} locale={locale} t={t} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 bg-white dark:bg-jk-dark-surface rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <div className="text-6xl mb-6">✍️</div>
                <h3 className="text-2xl font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-3">
                  {search ? t('empty.searchTitle') : t('empty.catTitle')}
                </h3>
                <p className="text-jk-text-muted dark:text-gray-400 mb-8">
                  {search ? t('empty.searchDesc') : t('empty.catDesc')}
                </p>
                <button
                  onClick={() => { setCategoryFilter('all'); setSearch('') }}
                  className="bg-jk-imperial-green text-jk-royal-gold px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  {t('empty.back')}
                </button>
              </motion.div>
            )}
          </div>

          <aside className="hidden lg:block space-y-8">
            <div className="sticky top-32 space-y-8">
              <div className="bg-jk-imperial-green rounded-2xl p-6 text-center text-jk-cream shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-jk-royal-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-3xl mb-3">✨</div>
                  <h4 className="font-display text-lg mb-2">{t('sidebar.cta.title')}</h4>
                  <p className="text-xs text-gray-300 mb-5 leading-relaxed">{t('sidebar.cta.desc')}</p>
                  <a
                    href="https://wa.me/237677463484?text=Bonjour%20Justine%2C%20j%27aimerais%20une%20création%20sur%20mesure."
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-neon-green transition-all hover:scale-105 text-sm"
                  >
                    {t('sidebar.cta.btn')}
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-jk-dark-surface rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                <h4 className="font-bold text-jk-imperial-green dark:text-jk-royal-gold mb-5 uppercase tracking-wider text-xs">{t('filters.title')}</h4>
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
                          {initialPosts.filter((p: any) => p.category === cat).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-jk-royal-gold/10 border border-jk-royal-gold/30 rounded-2xl p-6">
                <h4 className="font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-2">{t('sidebar.newsletter.title')}</h4>
                <p className="text-xs text-jk-text-muted dark:text-gray-400 mb-4">{t('sidebar.newsletter.desc')}</p>
                <a
                  href="https://wa.me/237677463484?text=Je%20souhaite%20m%27abonner%20aux%20actualités%20Justine%20Kem's"
                  target="_blank" rel="noreferrer"
                  className="block text-center bg-jk-royal-gold text-black text-sm font-bold py-2.5 rounded-full hover:bg-amber-400 transition-colors"
                >
                  {t('sidebar.newsletter.btn')}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

function BlogCard({ post, locale, t }: any) {
  return (
    <motion.div
      layout
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
          <span className="absolute top-4 left-4 bg-jk-imperial-green/90 backdrop-blur text-jk-cream text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {post.category || 'Actualités'}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <p className="text-xs text-jk-text-muted dark:text-gray-400 mb-3 flex items-center gap-2">
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span>
            {post.readingTime && <><span>·</span><span>{t('card.readingTime', { time: post.readingTime })}</span></>}
          </p>
          <h3 className="text-xl font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-3 group-hover:text-jk-royal-gold transition-colors line-clamp-2 leading-snug flex-1">
            {post.title}
          </h3>
          <p className="text-sm text-jk-text-muted dark:text-gray-300 line-clamp-3 mb-5">
            {post.excerpt}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-jk-royal-gold group-hover:gap-3 transition-all">
            {t('card.read')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

function FeaturedBlogCard({ post, locale, t }: any) {
  return (
    <Link href={`/${locale}/blog/${post.slug?.current}`} className="block">
      <div className="group relative rounded-3xl overflow-hidden shadow-2xl mb-12 aspect-[21/9] cursor-pointer">
        {post.mainImage && (
          <Image
            src={urlForImage(post.mainImage).width(1400).height(600).url()}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-10 max-w-2xl">
          <span className="inline-block bg-jk-royal-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-max mb-4">
            {t('card.featured')}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 group-hover:text-jk-royal-gold transition-colors leading-snug">
            {post.title}
          </h2>
          <p className="text-gray-200 line-clamp-2 text-sm mb-5">{post.excerpt}</p>
          <span className="inline-flex items-center gap-2 text-jk-royal-gold font-semibold group-hover:gap-4 transition-all">
            {t('card.readFull')}
          </span>
        </div>
      </div>
    </Link>
  )
}
