export const metadata = {
  title: 'Justine Kem\'s Studio',
  description: 'Interface d\'administration pour Justine Kem\'s',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
