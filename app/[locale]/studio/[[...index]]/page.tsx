import Studio from './Studio'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }]
}

export default function StudioPage() {
  return <Studio />
}
