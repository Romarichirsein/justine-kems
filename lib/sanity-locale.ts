export function getLocalizedField(doc: any, fieldName: string, locale: string = 'fr') {
  if (!doc) return ''
  const field = doc[fieldName]
  if (!field) return ''
  
  if (typeof field === 'string') return field
  
  // Retourne la traduction demandée, ou fallback sur le français
  return field[locale] || field['fr'] || ''
}

export function groqLocale(locale: string = 'fr') {
  return `"${locale}"`
}
