import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { client, queries } from '@/sanity/client'
import { BlogClient } from '@/components/BlogClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog.metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export const revalidate = 0

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [posts, pageData] = await Promise.all([
    client.fetch(queries.allPosts, { locale }, { next: { revalidate: 0 } }).catch(() => []),
    client.fetch(queries.pageBlog, { locale }, { next: { revalidate: 0 } }).catch(() => null)
  ])

  return (
    <div className="bg-jk-cream dark:bg-jk-dark-bg min-h-screen pb-24">
      <BlogClient initialPosts={posts} pageData={pageData} locale={locale} />
    </div>
  )
}
