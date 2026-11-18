/** Each admin leaf owns metadata instead of inheriting the dashboard title. */
export function adminHead(section: string) {
  const title = `${section} — New Prestige Corporation LLP`;
  const description = `Manage ${section.toLowerCase()} for the New Prestige Corporation LLP demo website.`;
  return { meta: [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex' },
  ] };
}
