/**
 * Transforme un texte en slug URL-friendly.
 * Ex: "Robe de Mariage" → "robe-de-mariage"
 * Ex: "Tenue Événementielle #074" → "tenue-evenementielle-074"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Sépare les accents (é → e + accent)
    .replace(/[\u0300-\u036f]/g, '')    // Supprime les accents
    .toLowerCase()
    .trim()
    .replace(/[#]/g, '')               // Supprime les #
    .replace(/[^a-z0-9\s-]/g, '')      // Garde uniquement lettres, chiffres, espaces, tirets
    .replace(/[\s]+/g, '-')            // Espaces → tirets
    .replace(/-+/g, '-')               // Tirets multiples → un seul
    .replace(/^-|-$/g, '');            // Pas de tiret au début/fin
}

/**
 * Génère le slug URL d'un produit à partir de son nom + sa référence.
 * Ex: name="Robe de Mariage", reference="074" → "robe-de-mariage-074"
 * Ex: name="Ensemble Couple Luxe", reference=null → "ensemble-couple-luxe"
 */
export function productSlug(name: string, reference?: string | null): string {
  const fullName = reference ? `${name} ${reference}` : name;
  return slugify(fullName);
}
