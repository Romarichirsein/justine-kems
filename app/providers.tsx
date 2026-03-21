'use client'

import { ThemeProvider } from 'next-themes'
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'

export function Providers({
  children,
  locale,
  messages
}: {
  children: React.ReactNode
  locale: string
  messages: AbstractIntlMessages
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}
