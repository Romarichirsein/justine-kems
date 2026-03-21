'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { client, queries, urlForImage } from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function BlogPage() {
  const locale = useLocale()
  const [posts, setPosts] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    client.fetch(queries.allPosts).then(setPosts).catch(() => setPosts([]))
  }, [])

  const categories = ['all', 'Mode & Tendances', 'Conseils couture', 'Behind the scenes', 'Événements Yaoundé', 'Portraits clientes']

  const filtered = posts.filter((p: any) => 
    categoryFilter === 'all' || p.category === categoryFilter
  )

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen pb-24">
      {/* Hero Blog */}
      <section className="relative px-4 py-32 bg-gradient-to-b from-jk-imperial-green to-[#0A1A18] text-center overflow-hidden">
        {/* Pattern subtil */}
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern-baroque.svg')] bg-repeat" />
        <h1 className="relative z-10 text-6xl md:text-7xl font-script text-jk-royal-gold mb-4 text-shadow-gold">Inspirations & Coulisses</h1>
        <p className="relative z-10 text-xl md:text-2xl font-display text-jk-cream">Plongez dans l'univers Justine Kem's</p>
      </section>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        
        {/* Filtres Catégories */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-12 scrollbar-hide justify-start md:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all shadow-md ${
                categoryFilter === cat
                  ? 'bg-jk-royal-gold text-black border-2 border-jk-royal-gold'
                  : 'bg-white dark:bg-jk-dark-surface dark:text-gray-300 border-2 border-transparent hover:border-jk-royal-gold text-jk-text-dark'
              }`}
            >
              {cat === 'all' ? 'Toutes les actualités' : cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Grille Articles (col 3/4) */}
          <div className="lg:col-span-3">
             <motion.div layout className="grid sm:grid-cols-2 gap-8">
               <AnimatePresence mode="popLayout">
                 {filtered.map((post: any) => (
                   <motion.div
                     key={post._id}
                     layout
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-white dark:bg-jk-dark-surface rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-neon-gold transition-all duration-300 group"
                   >
                     <Link href={`/${locale}/blog/${post.slug?.current}`}>
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                          {post.mainImage && (
                            <Image
                              src={urlForImage(post.mainImage).width(800).height(450).url()}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:brightness-110 transition-all duration-500"
                            />
                          )}
                          <span className="absolute top-4 left-4 bg-jk-imperial-green/90 backdrop-blur text-jk-cream text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {post.category || 'Actualités'}
                          </span>
                        </div>
                        <div className="p-6">
                           <p className="text-sm text-jk-text-muted dark:text-gray-400 mb-3 flex items-center gap-2">
                             <span>{new Date(post.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                             <span>·</span>
                             <span>{post.readingTime} min lecture</span>
                           </p>
                           <h3 className="text-2xl font-display font-semibold text-jk-imperial-green dark:text-jk-cream mb-3 group-hover:text-jk-royal-gold transition-colors line-clamp-2">
                             {post.title}
                           </h3>
                           <p className="text-jk-text-muted dark:text-gray-300 line-clamp-3 mb-6">
                             {post.excerpt}
                           </p>
                           <span className="inline-flex items-center gap-2 font-medium text-jk-royal-gold group-hover:underline">
                             Lire l'article <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                           </span>
                        </div>
                     </Link>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </motion.div>

             {filtered.length === 0 && (
               <div className="text-center py-24 bg-white dark:bg-jk-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                 <p className="text-xl text-jk-text-muted">Aucun article dans cette catégorie pour le moment.</p>
               </div>
             )}
          </div>

          {/* Sidebar (col 1/4) */}
          <div className="hidden lg:block space-y-8">
             <div className="sticky top-32">
               
               {/* CTA WhatsApp Box */}
               <div className="bg-jk-royal-gold/10 border border-jk-royal-gold/30 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-jk-royal-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <h4 className="font-display text-xl text-jk-imperial-green dark:text-jk-cream mb-3 relative z-10">Envie d'une création personnalisée ?</h4>
                 <p className="text-sm text-jk-text-muted dark:text-gray-400 mb-6 relative z-10">Transformons votre inspiration en réalité haute couture.</p>
                 <a href="https://wa.me/237677463484" target="_blank" rel="noreferrer" className="inline-block bg-[#25D366] text-white font-medium px-6 py-3 rounded-full hover:shadow-neon-green transition-all hover:scale-105 relative z-10">
                   Discuter avec Justine
                 </a>
               </div>

               {/* Catégories Liste */}
               <div className="mt-12 bg-white dark:bg-jk-dark-surface rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                 <h4 className="font-bold text-jk-imperial-green dark:text-jk-royal-gold mb-4 uppercase tracking-wider text-sm">Thématiques</h4>
                 <ul className="space-y-3">
                   {categories.filter(c => c !== 'all').map(cat => (
                     <li key={cat}>
                       <button onClick={() => setCategoryFilter(cat)} className="text-jk-text-muted dark:text-gray-300 hover:text-jk-royal-gold transition-colors flex justify-between w-full items-center text-left">
                         <span>{cat}</span>
                         <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                           {posts.filter((p:any) => p.category === cat).length}
                         </span>
                       </button>
                     </li>
                   ))}
                 </ul>
               </div>

             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
