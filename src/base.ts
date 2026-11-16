/** Site root: '/' locally, '/<repo>/' on GitHub Pages. */
export const B: string = import.meta.env.BASE_URL
/** A file under the site root, e.g. u('shots/portrait.webp'). */
export const u = (p: string): string => B + p.replace(/^\//, '')
