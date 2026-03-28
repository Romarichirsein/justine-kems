import Studio from './Studio'

// Desactiver l'optimisation statique pour le Studio
export const dynamic = 'force-static'

// Importer les métadonnées de l'interface Studio (nécessaire pour NextStudio)
export { metadata, viewport } from 'next-sanity/studio'

export function generateStaticParams() {
  return [
    { index: [''] }
  ]
}

export default function StudioPage() {
  return <Studio />
}
