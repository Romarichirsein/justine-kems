import React from 'react'

export default function RootPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/fr" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace('/fr');`,
          }}
        />
      </head>
      <body>
        <p>Redirecting to /fr...</p>
      </body>
    </html>
  )
}
