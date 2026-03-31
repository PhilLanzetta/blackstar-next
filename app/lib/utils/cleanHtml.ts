export const cleanHtml = (html: string) =>
  html
    .replace(/\u0003/g, '')
    .replace(/\[dot\]/g, '•')
    .replace(/\[at\]/g, '@')
