import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/fr" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `window.location.replace('/fr');` }} />
        {children}
      </body>
    </html>
  );
}
