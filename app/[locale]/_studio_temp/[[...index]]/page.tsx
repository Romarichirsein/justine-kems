import Studio from './Studio'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export function generateStaticParams() {
  return [
    { locale: 'fr', index: [] },
    { locale: 'en', index: [] }
  ]
}

export default function StudioPage() {
  return <Studio />
}
